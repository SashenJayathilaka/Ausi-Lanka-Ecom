import { db } from "@/db";
import { users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getCurrentUserProfile = createTRPCRouter({
  getCurrentUser: protectedProcedure
    .output(
      z.object({
        user: z.object({
          clerkId: z.string(),
          name: z.string(),
          emailId: z.string(),
          imageUrl: z.string().nullable(),
          whatsAppNumber: z.string().nullable(),
          delivery_address: z.string().nullable(),
          userType: z.enum(["admin", "user"]),
          createdAt: z.date(),
        }),
      })
    )
    .query(async ({ ctx }) => {
      const currentUser = await db
        .select({
          clerkId: users.clerkId,
          name: users.name,
          emailId: users.emailId,
          imageUrl: users.imageUrl,
          whatsAppNumber: users.whatsAppNumber,
          delivery_address: users.delivery_address,
          userType: users.userType,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.clerkId, ctx.user.clerkId))
        .limit(1);

      if (!currentUser[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        user: currentUser[0],
      };
    }),
  updateCurrentUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        whatsAppNumber: z.string().min(1).optional().nullable(),
        delivery_address: z.string().min(1).optional().nullable(),
      })
    )
    .output(
      z.object({
        user: z.object({
          clerkId: z.string(),
          name: z.string(),
          emailId: z.string(),
          imageUrl: z.string().nullable(),
          whatsAppNumber: z.string().nullable(),
          delivery_address: z.string().nullable(),
          userType: z.enum(["admin", "user"]),
          createdAt: z.date(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Build update data object only with provided fields
      const updateData: {
        name?: string;
        whatsAppNumber?: string | null;
        delivery_address?: string | null;
      } = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.whatsAppNumber !== undefined)
        updateData.whatsAppNumber = input.whatsAppNumber;
      if (input.delivery_address !== undefined)
        updateData.delivery_address = input.delivery_address;

      // If no fields to update, return current user
      if (Object.keys(updateData).length === 0) {
        const currentUser = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, ctx.user.clerkId))
          .limit(1);

        if (!currentUser[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return {
          user: currentUser[0],
        };
      }

      // Update user in database
      const updatedUsers = await db
        .update(users)
        .set(updateData)
        .where(eq(users.clerkId, ctx.user.clerkId))
        .returning();

      if (!updatedUsers[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        user: updatedUsers[0],
      };
    }),
});
