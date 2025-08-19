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
  boolean,
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

export const trendingItems = pgTable(
  "trending_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    image: text("image").notNull(),
    rating: integer("rating").notNull(),
    url: text("url"),
    retailer: text("retailer").notNull(),
    calculatedPrice: numeric("calculated_price", {
      precision: 12,
      scale: 2,
    }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    badge: text("badge", { enum: ["BESTSELLER", "LIMITED", "POPULAR", "NEW"] }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("trending_items_user_id_idx").on(t.userId),
    index("trending_items_rating_idx").on(t.rating),
    index("trending_items_badge_idx").on(t.badge),
  ]
);

export const inStock = pgTable(
  "in_stock",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    sku: text("sku").unique().notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
    image: text("image").notNull(),
    url: text("url"),
    retailer: text("retailer").notNull(),
    quantity: integer("quantity").default(0).notNull(),
    threshold: integer("threshold").default(5).notNull(),
    location: text("location"),
    category: text("category"),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("in_stock_user_id_idx").on(t.userId),
    index("in_stock_sku_idx").on(t.sku),
    index("in_stock_category_idx").on(t.category),
  ]
);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    userName: text("user_name").notNull(),
    rating: integer("rating").notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("feedback_user_idx").on(t.userId),
    index("feedback_rating_idx").on(t.rating),
  ]
);

export const nextShipment = pgTable("next_shipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  shipmentDate: timestamp("shipment_date").notNull(),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const latestDollarRate = pgTable("latest_dollar_rate", {
  id: uuid("id").primaryKey().defaultRandom(),
  rate: numeric("rate", { precision: 10, scale: 2 }).notNull(),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
