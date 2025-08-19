"use client";

import { trpc } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const rateSchema = z.object({
  id: z.string().optional(),
  rate: z
    .number({ required_error: "Dollar rate is required" })
    .positive("Rate must be positive"),
  notes: z.string().optional(),
});

type RateFormData = z.infer<typeof rateSchema>;

const AdminDollarRate = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <DollarRateSection />
      </ErrorBoundary>
    </Suspense>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 text-red-800 p-4 rounded-lg">
      Failed to load dollar rate data
    </div>
  </div>
);

const DollarRateSection = () => {
  const { user: currentUser } = useUser();
  const utils = trpc.useUtils();
  const [isEditing, setIsEditing] = useState(false);

  const { data: latestRate, isLoading } =
    trpc.getDollarRateRouter.getLatest.useQuery(undefined, {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const form = useForm<RateFormData>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      rate: 0,
      notes: "",
    },
  });

  const createMutation = trpc.getDollarRateRouter.create.useMutation({
    onSuccess: () => {
      utils.getDollarRateRouter.invalidate();
      toast.success("Dollar rate created successfully");
      setIsEditing(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.getDollarRateRouter.update.useMutation({
    onSuccess: () => {
      utils.getDollarRateRouter.invalidate();
      toast.success("Dollar rate updated successfully");
      setIsEditing(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: RateFormData) => {
    if (!currentUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      if (latestRate?.id) {
        await updateMutation.mutateAsync({
          id: latestRate.id,
          rate: data.rate,
          notes: data.notes,
        });
      } else {
        await createMutation.mutateAsync({
          rate: data.rate,
          notes: data.notes,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to save dollar rate");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (latestRate) {
      form.reset({
        rate: Number(latestRate.rate),
        notes: latestRate.notes || "",
      });
    } else {
      form.reset({
        rate: 0,
        notes: "",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Latest Dollar Rate
        </h1>

        {isEditing ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("id")} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dollar Rate
              </label>
              <input
                type="number"
                step="0.01"
                {...form.register("rate", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {form.formState.errors.rate && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.rate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...form.register("notes")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {form.formState.isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </form>
        ) : latestRate ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Current Rate
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                ${Number(latestRate.rate).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Last updated:{" "}
                {new Date(latestRate.updatedAt).toLocaleString("en-US")}
              </p>
            </div>

            {latestRate.notes && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">Notes</h2>
                <p className="mt-1 text-sm text-gray-600">{latestRate.notes}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleEditClick}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Dollar Rate
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No dollar rate set yet</p>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set Dollar Rate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDollarRate;
