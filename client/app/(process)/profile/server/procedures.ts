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
          addressLine1: z.string().nullable(),
          addressLine2: z.string().nullable(),
          city: z.string().nullable(),
          district: z.string().nullable(),
          postalCode: z.string().nullable(),
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
          addressLine1: users.addressLine1,
          addressLine2: users.addressLine2,
          city: users.city,
          district: users.district,
          postalCode: users.postalCode,
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
        addressLine1: z.string().min(1).optional().nullable(),
        addressLine2: z.string().min(1).optional().nullable(),
        city: z.string().min(1).optional().nullable(),
        district: z.string().min(1).optional().nullable(),
        postalCode: z.string().min(1).optional().nullable(),
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
          addressLine1: z.string().nullable(),
          addressLine2: z.string().nullable(),
          city: z.string().nullable(),
          district: z.string().nullable(),
          postalCode: z.string().nullable(),
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
        addressLine1?: string | null;
        addressLine2?: string | null;
        city?: string | null;
        district?: string | null;
        postalCode?: string | null;
      } = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.whatsAppNumber !== undefined)
        updateData.whatsAppNumber = input.whatsAppNumber;
      if (input.addressLine1 !== undefined)
        updateData.addressLine1 = input.addressLine1;
      if (input.addressLine2 !== undefined)
        updateData.addressLine2 = input.addressLine2;
      if (input.city !== undefined) updateData.city = input.city;
      if (input.district !== undefined) updateData.district = input.district;
      if (input.postalCode !== undefined)
        updateData.postalCode = input.postalCode;

      // If no fields to update, return current user
      if (Object.keys(updateData).length === 0) {
        const currentUser = await db
          .select({
            clerkId: users.clerkId,
            name: users.name,
            emailId: users.emailId,
            imageUrl: users.imageUrl,
            whatsAppNumber: users.whatsAppNumber,
            addressLine1: users.addressLine1,
            addressLine2: users.addressLine2,
            city: users.city,
            district: users.district,
            postalCode: users.postalCode,
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
      }

      // Update user in database
      const updatedUsers = await db
        .update(users)
        .set(updateData)
        .where(eq(users.clerkId, ctx.user.clerkId))
        .returning({
          clerkId: users.clerkId,
          name: users.name,
          emailId: users.emailId,
          imageUrl: users.imageUrl,
          whatsAppNumber: users.whatsAppNumber,
          addressLine1: users.addressLine1,
          addressLine2: users.addressLine2,
          city: users.city,
          district: users.district,
          postalCode: users.postalCode,
          userType: users.userType,
          createdAt: users.createdAt,
        });

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
