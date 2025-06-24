// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  name: string;
  price: string;
  image: string | null;
  url?: string;
  retailer: string;
  calculatedPrice: number;
}

interface CartState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (index: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      removeProduct: (index) =>
        set((state) => ({
          products: state.products.filter((_, i) => i !== index),
        })),
      clearCart: () => set({ products: [] }),
    }),
    {
      name: "cartState", // localStorage key
    }
  )
);
