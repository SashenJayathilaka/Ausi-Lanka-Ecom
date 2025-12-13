/* eslint-disable @next/next/no-img-element */
"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaStar,
  FaShoppingCart,
  FaTag,
} from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

const supportedRetailers = [
  {
    name: "Chemist Warehouse",
    url: "https://www.chemistwarehouse.com.au/",
    logo: "/assets/partner_chemistwarehouse.webp",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    name: "Coles",
    url: "https://www.coles.com.au/",
    logo: "/assets/coles.png",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    name: "Woolworths",
    url: "https://www.woolworths.com.au/",
    logo: "/assets/woolworths.png",
    color: "from-green-600 to-green-700",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "JB Hi-Fi",
    url: "https://www.jbhifi.com.au/",
    logo: "/assets/jbhifi.png",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Officeworks",
    url: "https://www.officeworks.com.au/",
    logo: "/assets/officeworks.png",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
];

const categories = [
  "Pharmacy Item",
  "Supermarket Item",
  "Electronic Item",
  "Gift Item",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Toys & Games",
  "Sports & Outdoors",
];

const baseTrendingItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  image: z.string().min(1, "Image URL is required"),
  rating: z.number().min(0).max(5),
  url: z.string().url().optional().or(z.literal("")),
  retailer: z.string().min(1, "Retailer is required"),
  calculatedPrice: z.string().min(1, "Calculated price is required"),
  badge: z.enum(["BESTSELLER", "LIMITED", "POPULAR", "NEW"]).optional(),
  category: z.string().min(1, "Category is required"),
});

const createTrendingItemSchema = baseTrendingItemSchema;
const updateTrendingItemSchema = baseTrendingItemSchema.extend({
  id: z.string().uuid(),
});

type CreateTrendingItem = z.infer<typeof createTrendingItemSchema>;
type UpdateTrendingItem = z.infer<typeof updateTrendingItemSchema>;
type TrendingItem = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  price: string;
  image: string;
  rating: number;
  url: string | null;
  retailer: string;
  calculatedPrice: string;
  badge: "BESTSELLER" | "LIMITED" | "POPULAR" | "NEW" | null;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 text-red-800 p-4 rounded-lg">
      Failed to load trending items
    </div>
  </div>
);

const UpdateAllButton = () => {
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Initialize the tRPC mutation
  const updateAllMutation =
    trpc.updateAllAdminItem.updateAllTrendingItems.useMutation();

  const handleUpdateAll = async () => {
    if (
      user?.emailAddresses[0].emailAddress === "sashenjayathilaka2001@gmail.com"
    ) {
      setIsUpdating(true);
      setProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 500);

        // Execute the mutation
        const result = await updateAllMutation.mutateAsync();

        clearInterval(progressInterval);
        setProgress(100);

        if (result.success) {
          toast.success(
            `Successfully updated ${result.updatedCount} items. ${result.failedCount} failed.`,
            {
              description:
                result.failedCount > 0
                  ? "Some items failed to update. Check details for more information."
                  : undefined,
            }
          );
        } else {
          throw new Error(result.message || "Failed to update items");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Update Failed", {
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error("You do not have permission to perform this action.");
    }
  };

  const results = updateAllMutation.data;
  const isError = updateAllMutation.isError;

  return (
    <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleUpdateAll}
          disabled={isUpdating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {isUpdating ? <FaSpinner className="animate-spin" /> : <FaSync />}
          {isUpdating ? "Updating All Products..." : "Update All Products"}
        </button>

        {results && (
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 text-xs font-medium rounded-full">
              Updated: {results.updatedCount}
            </span>
            {results.failedCount > 0 && (
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-100 text-xs font-medium rounded-full">
                Failed: {results.failedCount}
              </span>
            )}
          </div>
        )}

        {results && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-auto flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Details
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {isUpdating && (
        <div className="space-y-2 mb-4">
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scanning retailers and updating prices... {progress}%
          </p>
        </div>
      )}

      {isError && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle />
            <span className="font-medium">Error</span>
          </div>
          <p>{updateAllMutation.error.message}</p>
        </div>
      )}

      {results && showDetails && (
        <div className="space-y-4 mb-4">
          <div
            className={`p-4 rounded-lg ${results.failedCount > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaCheckCircle />
              <span className="font-medium">
                {results.failedCount > 0
                  ? "Update completed with errors"
                  : "All items updated successfully"}
              </span>
            </div>
            <p>{results.message}</p>
          </div>

          {results.results && results.results.length > 0 && (
            <div className="border border-gray-200 dark:border-slate-700 rounded-md divide-y divide-gray-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
              <div className="p-4 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-medium flex items-center sticky top-0">
                <div className="flex-1">Item ID</div>
                <div className="w-24 text-center">Status</div>
                <div className="w-48 text-center">Error</div>
              </div>
              {/*   eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {results.results.map((result: any, index: number) => (
                <div
                  key={index}
                  className="p-4 flex items-center bg-white dark:bg-slate-800"
                >
                  <div className="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300">
                    {result.id}
                  </div>
                  <div className="w-24 flex justify-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.success
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {result.success ? "Success" : "Failed"}
                    </span>
                  </div>
                  <div className="w-48 text-center text-xs text-gray-600 dark:text-gray-400">
                    {result.error || "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TrendingItemsAdmin = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <TrendingItemsManagement />
      </ErrorBoundary>
    </Suspense>
  );
};

const TrendingItemsManagement = () => {
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");
  const [selectedItem, setSelectedItem] = useState<TrendingItem | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const { data, isLoading } = trpc.getAdminItems.getAllTrendingItems.useQuery(
    { limit: DEFAULT_LIMIT },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const scrapeMutation = trpc.productScrapeRouter.scrapeProduct.useMutation();
  const createMutation = trpc.getAdminItems.createTrendingItem.useMutation({
    onSuccess: () => {
      utils.getAdminItems.invalidate();
      toast.success("Item created successfully");
      setMode("view");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.getAdminItems.updateTrendingItem.useMutation({
    onSuccess: () => {
      utils.getAdminItems.invalidate();
      toast.success("Item updated successfully");
      setMode("view");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.getAdminItems.deleteTrendingItem.useMutation({
    onSuccess: () => {
      utils.getAdminItems.invalidate();
      toast.success("Item deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<CreateTrendingItem | UpdateTrendingItem>({
    resolver: zodResolver(
      mode === "edit" ? updateTrendingItemSchema : createTrendingItemSchema
    ),
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "url" && value.url) {
        handleUrlChange(value.url);
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  const handleUrlChange = async (url: string) => {
    if (!url.trim()) return;

    try {
      const urlObj = new URL(url);
      const isValid = supportedRetailers.some(
        (retailer) => urlObj.hostname === new URL(retailer.url).hostname
      );

      if (!isValid) {
        setUrlError("Unsupported retailer URL");
        return;
      }

      setUrlLoading(true);
      setUrlError(null);

      const result = await scrapeMutation.mutateAsync({ url });

      if (result.success && result.data) {
        form.setValue("name", result.data.title);
        form.setValue("image", result.data.image || "");
        form.setValue("calculatedPrice", result.data.calculatedPrice);

        const priceWithoutDollar = result.data.price.replace("$", "");

        form.setValue("price", priceWithoutDollar);

        const retailer = supportedRetailers.find(
          (r) => urlObj.hostname === new URL(r.url).hostname
        );
        if (retailer) {
          form.setValue("retailer", retailer.name);
        }

        toast.success("Product data fetched successfully!");
      } else {
        throw new Error(result.error || "Failed to scrape product");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while scraping";
      setUrlError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUrlLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setMode("create");
    form.reset();
  };

  const handleEdit = (item: TrendingItem) => {
    setSelectedItem(item);
    setMode("edit");
    form.reset({
      ...item,
      price: item.price.toString(),
      calculatedPrice: item.calculatedPrice.toString(),
      url: item.url || "",
      badge: item.badge || undefined,
      description: item.description || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleSubmit = async (
    data: CreateTrendingItem | UpdateTrendingItem
  ) => {
    try {
      if (mode === "edit" && selectedItem) {
        await updateMutation.mutateAsync({
          ...data,
          id: selectedItem.id,
        } as UpdateTrendingItem);
      } else {
        await createMutation.mutateAsync(data as CreateTrendingItem);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Catalog Items
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
        >
          <FaPlus />
          Create New Item
        </button>
      </div>

      {/* Update All Products Button */}
      <UpdateAllButton />

      {mode !== "view" && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {mode === "edit" ? "Edit Item" : "Create New Item"}
          </h2>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name*
                </label>
                <input
                  {...form.register("name")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  {...form.register("description")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    step="0.01"
                    {...form.register("price")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {form.formState.errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL*
                </label>
                <input
                  {...form.register("image")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
                {form.formState.errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating (0-5)*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaStar className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    {...form.register("rating", { valueAsNumber: true })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {form.formState.errors.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.rating.message}
                  </p>
                )}
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <div className="relative">
                  <input
                    {...form.register("url")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                    placeholder="Enter product URL to auto-fill details"
                  />
                  {urlLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaSpinner className="animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {urlError && (
                  <p className="mt-1 text-sm text-red-600">{urlError}</p>
                )}
              </div>

              {/* Retailer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Retailer*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShoppingCart className="text-gray-400" />
                  </div>
                  <input
                    {...form.register("retailer")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {form.formState.errors.retailer && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.retailer.message}
                  </p>
                )}
              </div>

              {/* Calculated Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Calculated Price*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    step="0.01"
                    {...form.register("calculatedPrice")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {form.formState.errors.calculatedPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.calculatedPrice.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400" />
                  </div>
                  <select
                    {...form.register("category")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md appearance-none bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {form.formState.errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Badge
                </label>
                <select
                  {...form.register("badge")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">None</option>
                  <option value="BESTSELLER">Bestseller</option>
                  <option value="LIMITED">Limited</option>
                  <option value="POPULAR">Popular</option>
                  <option value="NEW">New</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setMode("view")}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badge
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {data?.items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-product.jpg";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.retailer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      {item.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.badge || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrendingItemsAdmin;
