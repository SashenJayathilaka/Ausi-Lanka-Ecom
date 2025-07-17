"use client";

import { trpc } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const shipmentSchema = z.object({
  id: z.string().optional(),
  shipmentDate: z
    .string({ required_error: "Shipment date is required" })
    .min(1, "Shipment date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  notes: z.string().optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

const AdminShipment = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ShipmentManagementSection />
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
    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
      Failed to load shipment data
    </div>
  </div>
);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const ShipmentManagementSection = () => {
  const { user: currentUser } = useUser();
  const utils = trpc.useUtils();
  const [isEditing, setIsEditing] = useState(false);

  const { data: nextShipment, isLoading } =
    trpc.getNextShipmentRouter.getNext.useQuery(undefined, {
      staleTime: Infinity, // 👈 Never refetch automatically
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      shipmentDate: "",
      notes: "",
    },
  });

  const createMutation = trpc.getNextShipmentRouter.create.useMutation({
    onSuccess: () => {
      utils.getNextShipmentRouter.invalidate();
      toast.success("Shipment date created successfully");
      setIsEditing(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.getNextShipmentRouter.update.useMutation({
    onSuccess: () => {
      utils.getNextShipmentRouter.invalidate();
      toast.success("Shipment date updated successfully");
      setIsEditing(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formatInputDate = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const onSubmit = async (data: ShipmentFormData) => {
    console.log("Submitting form with:", data); // Add this line

    if (!currentUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const parsedDate = new Date(data.shipmentDate);

      if (parsedDate <= new Date()) {
        toast.error("Shipment date must be in the future");
        return;
      }

      if (nextShipment?.id) {
        await updateMutation.mutateAsync({
          id: nextShipment.id,
          shipmentDate: parsedDate,
          notes: data.notes,
        });
      } else {
        await createMutation.mutateAsync({
          shipmentDate: parsedDate,
          notes: data.notes,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to save shipment date");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (nextShipment) {
      form.reset({
        shipmentDate: formatInputDate(new Date(nextShipment.shipmentDate)),
        notes: nextShipment.notes || "",
      });
    } else {
      form.reset({
        shipmentDate: formatInputDate(new Date()),
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Next Shipment Date
        </h1>

        {isEditing ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("id")} />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shipment Date
              </label>
              <input
                type="datetime-local"
                id="shipmentDate"
                {...form.register("shipmentDate")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min={formatInputDate(new Date())}
              />
              {form.formState.errors.shipmentDate && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.shipmentDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...form.register("notes")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {form.formState.errors.notes && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.notes.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        ) : nextShipment ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Current Next Shipment Date
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {formatDate(new Date(nextShipment.shipmentDate))}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Last updated by: {formatDate(new Date(nextShipment.updatedAt))}
              </p>
            </div>

            {nextShipment.notes && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notes
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {nextShipment.notes}
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleEditClick}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Shipment Date
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No upcoming shipment date set
            </p>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set Shipment Date
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShipment;
