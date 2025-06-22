import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  name: string;
  price: string;
  image: string | null;
  url?: string;
  retailer: string;
}

interface BucketState {
  products: Product[];
}

// Load initial state from localStorage
const loadInitialState = (): BucketState => {
  if (typeof window === "undefined") {
    return { products: [] };
  }

  try {
    const savedState = localStorage.getItem("cartState");
    return savedState ? JSON.parse(savedState) : { products: [] };
  } catch (error) {
    console.error("Failed to parse cart state", error);
    return { products: [] };
  }
};

const bucketSlice = createSlice({
  name: "bucket",
  initialState: loadInitialState(),
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      saveToLocalStorage(state);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products.splice(action.payload, 1);
      saveToLocalStorage(state);
    },
    clearBucket: (state) => {
      state.products = [];
      saveToLocalStorage(state);
    },
    // Optional: For hydrating state from server
    hydrateBucket: (state, action: PayloadAction<BucketState>) => {
      return action.payload;
    },
  },
});

// Helper function to save state to localStorage
const saveToLocalStorage = (state: BucketState) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartState", JSON.stringify(state));
    }
  } catch (error) {
    console.error("Failed to save cart state", error);
  }
};

export const { addProduct, removeProduct, clearBucket, hydrateBucket } =
  bucketSlice.actions;
export default bucketSlice.reducer;
