// types/db.ts
export type User = {
  id: string;
  clerkId: string;
  name: string;
  emailId: string;
  imageUrl: string | null;
  userType: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
};

export type DeliveryMethod = "sea" | "air" | "express";
export type OrderStatus =
  | "pending"
  | "cancelled"
  | "confirmed"
  | "shipped"
  | "delivered";

export type Order = {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  deliveryMethod: DeliveryMethod;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string;
  postalCode: string;
  comments: string | null;
  missingItems: string[] | null;
  status: OrderStatus;
  totalAmount: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  name: string;
  price: string;
  image: string;
  url: string | null;
  retailer: string;
  calculatedPrice: string;
  quantity: number;
  createdAt: Date;
};

export type OrderWithItemsAndUser = Order & {
  items: OrderItem[];
  user: Pick<User, "id" | "name" | "emailId" | "imageUrl"> | null;
};
