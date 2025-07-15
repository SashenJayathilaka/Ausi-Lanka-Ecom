"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";

const AdminOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <ProductAdminPageSectionsSuspense />
        </ErrorBoundary>
      </Suspense>
    </div>
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
      Failed to load products
    </div>
  </div>
);

const ProductAdminPageSectionsSuspense: React.FC = () => {
  const [data] = trpc.getAdminItems.getAllProducts.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  // Group products by name to count duplicates
  const productCounts = data.pages[0].products.reduce(
    (acc, product) => {
      acc[product.name] = (acc[product.name] || 0) + product.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Product Management
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Calculated Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.pages[0].products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="rounded"
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Product
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {productCounts[product.name]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.retailer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ${product.calculatedPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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

export default AdminOrders;
