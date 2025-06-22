import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import languageReducer from "./languageSlice";
import bucketReducer from "./bucketSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      language: languageReducer,
      bucket: bucketReducer,
    },
    // Optional: Add middleware if needed
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
