import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Language = "en" | "si";

interface LanguageState {
  current: Language;
}

const initialState: LanguageState = {
  current: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    switchLanguage(state, action: PayloadAction<Language>) {
      state.current = action.payload;
    },
    toggleLanguage(state) {
      state.current = state.current === "en" ? "si" : "en";
    },
  },
});

export const { switchLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
