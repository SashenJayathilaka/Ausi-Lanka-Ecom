"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { hydrateBucket } from "@/store/bucketSlice";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // Hydrate the store from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedState = localStorage.getItem("cartState");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          storeRef.current.dispatch(hydrateBucket(parsedState));
        }
      } catch (error) {
        console.error("Failed to hydrate store from localStorage", error);
      }
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
