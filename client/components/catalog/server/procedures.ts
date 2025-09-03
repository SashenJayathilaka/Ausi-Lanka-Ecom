import { db } from "@/db";
import { latestDollarRate, trendingItems } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq, isNotNull } from "drizzle-orm";

export const updateAllAdminCatalogItems = createTRPCRouter({
  updateAllTrendingItems: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.userType !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized: Admin access required",
      });
    }

    // Get the latest dollar rate
    const [data] = await db
      .select()
      .from(latestDollarRate)
      .orderBy(desc(latestDollarRate.createdAt))
      .limit(1);

    if (!data?.rate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Dollar rate not available",
      });
    }

    const dollarRate = data.rate;

    // Get all trending items with URLs
    const allItems = await db
      .select()
      .from(trendingItems)
      .where(isNotNull(trendingItems.url))
      .orderBy(desc(trendingItems.createdAt));

    if (allItems.length === 0) {
      return {
        success: true,
        message: "No trending items with URLs to update",
        updatedCount: 0,
        failedCount: 0,
      };
    }

    // Group items by retailer
    const itemsByRetailer: Record<string, typeof allItems> = {};

    for (const item of allItems) {
      if (!item.url) continue;

      let retailer = "";
      if (item.url.includes("chemistwarehouse.com.au")) {
        retailer = "chemist";
      } else if (item.url.includes("coles.com.au")) {
        retailer = "coles";
      } else if (item.url.includes("woolworths.com.au")) {
        retailer = "woolworths";
      } else if (item.url.includes("jbhifi.com.au")) {
        retailer = "jbhifi";
      } else if (item.url.includes("officeworks.com.au")) {
        retailer = "officeworks";
      } else if (item.url.includes("aldi.com.au")) {
        retailer = "aldi";
      } else {
        continue; // Skip unsupported retailers
      }

      if (!itemsByRetailer[retailer]) {
        itemsByRetailer[retailer] = [];
      }
      itemsByRetailer[retailer].push(item);
    }

    let updatedCount = 0;
    let failedCount = 0;
    const results = [];

    // Process each retailer's items in batches
    for (const [retailer, items] of Object.entries(itemsByRetailer)) {
      try {
        // Validate API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured");
        }

        // Create URL with multiple URLs as parameters
        const urlParams = items
          .map((item) => `url=${encodeURIComponent(item.url!)}`)
          .join("&");
        const apiEndpoint = `${apiUrl}/api/${retailer}/scrape?${urlParams}&rate=${dollarRate}`;

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120000); // 120s timeout for batch requests

        const response = await fetch(apiEndpoint, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        if (result.results && result.results.length > 0) {
          // Process all results from the batch response
          for (const productData of result.results) {
            if (productData.success) {
              // Find the corresponding item by URL
              const itemToUpdate = items.find(
                (item) => item.url === productData.url
              );

              if (itemToUpdate) {
                await db
                  .update(trendingItems)
                  .set({
                    price: productData.price || itemToUpdate.price,
                    calculatedPrice:
                      productData.calculatedPrice ||
                      itemToUpdate.calculatedPrice,
                    updatedAt: new Date(),
                  })
                  .where(eq(trendingItems.id, itemToUpdate.id));

                updatedCount++;
                results.push({
                  id: itemToUpdate.id,
                  success: true,
                  message: "Successfully updated",
                });
              }
            } else {
              // Handle unsuccessful scraping for individual items
              const itemToUpdate = items.find(
                (item) => item.url === productData.url
              );
              if (itemToUpdate) {
                failedCount++;
                results.push({
                  id: itemToUpdate.id,
                  success: false,
                  error: productData.error || "Scraping failed for this item",
                });
              }
            }
          }
        } else {
          // Mark all items in this batch as failed
          for (const item of items) {
            failedCount++;
            results.push({
              id: item.id,
              success: false,
              error: "No product data found or scraping failed",
            });
          }
        }

        // Add a small delay between retailer batches to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        // Mark all items in this retailer batch as failed
        for (const item of items) {
          failedCount++;
          results.push({
            id: item.id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
        console.error(`Failed to update ${retailer} items:`, error);
      }
    }

    return {
      success: true,
      message: `Updated ${updatedCount} items, ${failedCount} failed`,
      updatedCount,
      failedCount,
      results,
    };
  }),
});
