import { db } from "@/db";
import { latestDollarRate } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";

export const scrapeRouter = createTRPCRouter({
  scrapeProduct: baseProcedure
    .input(z.object({ url: z.string().url() }))
    .output(
      z.object({
        success: z.boolean(),
        data: z
          .object({
            title: z.string(),
            price: z.string(),
            image: z.string().nullable(),
            url: z.string(),
            retailer: z.string(),
            calculatedPrice: z.string(),
          })
          .nullable(),
        error: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { url } = input;

      if (!url) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "URL is required",
        });
      }

      const [data] = await db
        .select()
        .from(latestDollarRate)
        .orderBy(desc(latestDollarRate.createdAt))
        .limit(1);

      if (!data.rate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "URL is required",
        });
      }

      let retailer = "";
      let endpoint = "";
      const dollarRate = data?.rate || 1;

      // Retailer detection
      if (url.includes("chemistwarehouse.com.au")) {
        endpoint = "chemist";
        retailer = "Chemist Warehouse";
      } else if (url.includes("coles.com.au")) {
        endpoint = "coles";
        retailer = "Coles";
      } else if (url.includes("woolworths.com.au")) {
        endpoint = "woolworths";
        retailer = "Woolworths";
      } else if (url.includes("jbhifi.com.au")) {
        endpoint = "jbhifi";
        retailer = "JB Hi-Fi";
      } else if (url.includes("officeworks.com.au")) {
        endpoint = "officeworks";
        retailer = "Officeworks";
      } else {
        return {
          success: false,
          error:
            "Unsupported retailer. Supported: Chemist Warehouse, Coles, Woolworths, JB Hi-Fi, Officeworks",
          data: null,
        };
      }

      try {
        // Validate API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured");
        }

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s

        const response = await fetch(
          `${apiUrl}/api/${endpoint}/scrape?url=${encodeURIComponent(url)}&rate=${dollarRate}`,
          {
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        return {
          success: true,
          data: {
            title: result.title || "No title found",
            price: result.price || "No price found",
            image: result.image || null,
            url,
            retailer,
            calculatedPrice: result.calculatedPrice || result.price || "0",
          },
          error: null,
        };
      } catch (error) {
        console.error("Scraping failed:", error);
        return {
          success: false,
          error: getErrorMessage(error),
          data: null,
        };
      }
    }),
});

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "Request timed out (60s)";
    }
    if (error.message.includes("Failed to fetch")) {
      return "Could not connect to the scraping service";
    }
    return error.message;
  }
  return "An unknown error occurred during scraping";
}
