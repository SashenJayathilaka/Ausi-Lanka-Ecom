/* eslint-disable @next/next/no-img-element */
"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { LkrFormat } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const baseInStockItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().min(1, "Image URL is required"),
  url: z.string().url().optional().or(z.literal("")),
  retailer: z.string().min(1, "Retailer is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  threshold: z.number().min(0, "Threshold must be at least 0"),
  location: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

const createInStockItemSchema = baseInStockItemSchema;
const updateInStockItemSchema = baseInStockItemSchema.extend({
  id: z.string().uuid(),
});

type CreateInStockItem = z.infer<typeof createInStockItemSchema>;
type UpdateInStockItem = z.infer<typeof updateInStockItemSchema>;
type InStockItem = {
  id: string;
  userId?: string;
  name: string;
  sku: string;
  price: string;
  originalPrice: string | null;
  image: string;
  url: string | null;
  retailer: string;
  quantity: number;
  threshold: number;
  location: string | null;
  category: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 text-red-800 p-4 rounded-lg">
      Failed to load in-stock items
    </div>
  </div>
);

const InStockItemsAdmin = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <InStockItemsManagement />
      </ErrorBoundary>
    </Suspense>
  );
};

const InStockItemsManagement = () => {
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");
  const [selectedItem, setSelectedItem] = useState<InStockItem | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const { data, isLoading } = trpc.getAdminItems.getAllInStockItems.useQuery(
    { limit: DEFAULT_LIMIT },
    { staleTime: 1000 * 60 * 5 }
  );

  const scrapeMutation = trpc.productScrapeRouter.scrapeProduct.useMutation();
  const createMutation = trpc.getAdminItems.createInStockItem.useMutation({
    onSuccess: () => {
      utils.getAdminItems.invalidate();
      toast.success("Item created successfully");
      setMode("view");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.getAdminItems.updateInStockItem.useMutation({
    onSuccess: () => {
      utils.getAdminItems.invalidate();
      toast.success("Item updated successfully");
      setMode("view");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.getAdminItems.deleteInStockItem.useMutation({
    onSuccess: () => {
      utils.getAdminItems.invalidate();
      toast.success("Item deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<CreateInStockItem | UpdateInStockItem>({
    resolver: zodResolver(
      mode === "edit" ? updateInStockItemSchema : createInStockItemSchema
    ),
    defaultValues: {
      quantity: 0,
      threshold: 5,
    },
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
        form.setValue("price", result.data.price);
        form.setValue("image", result.data.image || "");

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
    form.reset({
      quantity: 0,
      threshold: 5,
    });
  };

  const handleEdit = (item: InStockItem) => {
    setSelectedItem(item);
    setMode("edit");
    form.reset({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      image: item.image,
      url: item.url || "",
      retailer: item.retailer,
      sku: item.sku,
      quantity: item.quantity,
      threshold: item.threshold,
      location: item.location || "",
      category: item.category || "",
      description: item.description || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleSubmit = async (data: CreateInStockItem | UpdateInStockItem) => {
    try {
      if (mode === "edit" && selectedItem) {
        await updateMutation.mutateAsync({
          ...data,
          id: selectedItem.id,
        } as UpdateInStockItem);
      } else {
        await createMutation.mutateAsync(data as CreateInStockItem);
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
          In-Stock Items
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Create New Item
        </button>
      </div>

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

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SKU*
                </label>
                <input
                  {...form.register("sku")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
                {form.formState.errors.sku && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.sku.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price*
                </label>
                <input
                  type="text"
                  step="0.01"
                  {...form.register("price")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
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
                <input
                  {...form.register("retailer")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
                {form.formState.errors.retailer && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.retailer.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity*
                </label>
                <input
                  type="number"
                  min="0"
                  {...form.register("quantity", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
                {form.formState.errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Threshold*
                </label>
                <input
                  type="number"
                  min="0"
                  {...form.register("threshold", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
                {form.formState.errors.threshold && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.threshold.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <select
                  {...form.register("location")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  defaultValue="Sri Lanka" // or "Australia"
                >
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  {...form.register("category")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select a category</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Other">Other</option>{" "}
                  {/* Optional: for other categories */}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  {...form.register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                />
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
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threshold
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
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {LkrFormat(Number(item.price))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.retailer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.threshold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
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

export default InStockItemsAdmin;
