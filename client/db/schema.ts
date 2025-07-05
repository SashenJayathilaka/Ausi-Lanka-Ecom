import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  numeric,
  jsonb,
  pgEnum,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type_enum", ["admin", "user"]);

export const deliveryMethodEnum = pgEnum("delivery_method_enum", [
  "sea",
  "air",
  "express",
]);

export const orderStatusEnum = pgEnum("order_status_enum", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    emailId: text("email_id").notNull(),
    imageUrl: text("image_url"),
    userType: userTypeEnum("user_type").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    mobile: varchar("mobile", { length: 20 }).notNull(),
    deliveryMethod: deliveryMethodEnum("delivery_method").notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    district: text("district").notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    comments: text("comments"),
    missingItems: jsonb("missing_items").$type<string[] | null>(),
    status: orderStatusEnum("order_status").default("pending").notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("user_id_idx").on(t.userId), index("status_idx").on(t.status)]
);

// Order items table
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    image: text("image").notNull(),
    url: text("url"),
    retailer: text("retailer").notNull(),
    calculatedPrice: numeric("calculated_price", {
      precision: 12,
      scale: 2,
    }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("order_id_idx").on(t.orderId),
    uniqueIndex("unique_order_item").on(t.orderId, t.name),
  ]
);
