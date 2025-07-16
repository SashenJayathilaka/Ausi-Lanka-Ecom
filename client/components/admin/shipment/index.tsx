"use client";

import { useUser } from "@clerk/nextjs";
import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";

const shipmentSchema = z.object({
  id: z.string().uuid().optional(),
  shipmentDate: z.date(),
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

  // Handle undefined case by providing default empty object
  const { data: nextShipment = null, isLoading } =
    trpc.getNextShipmentRouter.getNext.useQuery(undefined, {
      select: (data) => data || null,
    });

  const createMutation = trpc.getNextShipmentRouter.create.useMutation({
    onSuccess: () => {
      utils.getNextShipmentRouter.invalidate();
      toast.success("Shipment date created successfully");
      setIsEditing(false);
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      shipmentDate: nextShipment?.shipmentDate
        ? new Date(nextShipment.shipmentDate)
        : new Date(),
      notes: nextShipment?.notes || "",
    },
  });

  const onSubmit = (data: ShipmentFormData) => {
    if (!currentUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    if (nextShipment) {
      // Update existing shipment
      updateMutation.mutate({
        id: nextShipment.id,
        shipmentDate: data.shipmentDate,
        notes: data.notes,
        updatedBy: currentUser.id,
      });
    } else {
      // Create new shipment
      createMutation.mutate({
        shipmentDate: data.shipmentDate,
        notes: data.notes,
        updatedBy: currentUser.id,
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (nextShipment) {
      setValue("shipmentDate", new Date(nextShipment.shipmentDate));
      setValue("notes", nextShipment.notes || "");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Next Shipment Date
        </h1>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shipment Date
              </label>
              <input
                type="datetime-local"
                {...register("shipmentDate", {
                  valueAsDate: true,
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {errors.shipmentDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shipmentDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.notes.message}
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
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {nextShipment ? (
              <>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Current Next Shipment Date
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(new Date(nextShipment.shipmentDate))}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Last updated by: {nextShipment.updatedBy}
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
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No upcoming shipment date set
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Set Shipment Date
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShipment;
