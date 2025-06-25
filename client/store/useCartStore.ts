// store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  name: string;
  price: string;
  image: string;
  url?: string;
  retailer: string;
  calculatedPrice?: number;
  quantity?: number;
}

interface CartState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          const existingIndex = state.products.findIndex(
            (p) => p.name === product.name && p.retailer === product.retailer
          );

          if (existingIndex >= 0) {
            const updatedProducts = [...state.products];
            updatedProducts[existingIndex] = {
              ...updatedProducts[existingIndex],
              quantity: (updatedProducts[existingIndex].quantity || 1) + 1,
            };
            return { products: updatedProducts };
          }

          return { products: [...state.products, { ...product, quantity: 1 }] };
        }),
      removeProduct: (index) =>
        set((state) => ({
          products: state.products.filter((_, i) => i !== index),
        })),
      updateQuantity: (index, quantity) =>
        set((state) => {
          const updatedProducts = [...state.products];
          updatedProducts[index] = {
            ...updatedProducts[index],
            quantity: Math.max(1, quantity),
          };
          return { products: updatedProducts };
        }),
      clearCart: () => set({ products: [] }),
    }),
    {
      name: "cart-storage", // unique name for localStorage key
    }
  )
);
