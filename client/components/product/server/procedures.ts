import { db } from "@/db";
import { users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getUsers = createTRPCRouter({
  getAllUsers: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .output(
      z.object({
        users: z.array(
          z.object({
            clerkId: z.string(),
            name: z.string(),
            emailId: z.string(),
            imageUrl: z.string().nullable(),
            whatsAppNumber: z.string().nullable(),
            delivery_address: z.string().nullable(),
            userType: z.enum(["admin", "user"]),
            createdAt: z.date(),
          })
        ),
        nextCursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized: Admin access required",
        });
      }

      const userList = await db
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
        .orderBy(desc(users.createdAt))
        .limit(input.limit);

      return {
        users: userList,
        nextCursor:
          userList.length > 0 ? userList[userList.length - 1].clerkId : null,
      };
    }),
  getUserType: protectedProcedure
    .input(z.void())
    .output(
      z.object({
        userType: z.enum(["admin", "user", "guest"]).default("guest"),
      })
    )
    .query(async ({ ctx }) => {
      // If user is not authenticated, return guest type
      if (!ctx.user?.id) {
        return {
          userType: "guest" as const,
        };
      }

      const clerkUserId = ctx.user.id;

      try {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, clerkUserId))
          .limit(1)
          .then((rows) => rows[0]);

        if (!user) {
          console.error("No user found with clerkId:", clerkUserId);
          return {
            userType: "guest" as const,
          };
        }

        return {
          userType: user.userType || "user",
        };
      } catch (error) {
        console.error("Error fetching user type:", error);
        return {
          userType: "guest" as const,
        };
      }
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        name: z.string().min(1),
        emailId: z.string().email(),
        userType: z.enum(["admin", "user"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.userType !== "admin") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found in database",
        });
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          name: input.name,
          emailId: input.emailId,
          userType: input.userType,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, input.clerkId))
        .returning();

      return updatedUser;
    }),
});
