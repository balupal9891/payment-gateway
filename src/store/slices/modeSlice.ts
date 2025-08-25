// src/store/modeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";

export type Mode = "production" | "test";

interface ModeState {
  mode: Mode;
}

const initialState: ModeState = {
  mode: "test",
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "production" ? "test" : "production";
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
  },
});

export const useMode = () => {
  const dispatch: AppDispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.mode.mode);

  return {
    mode,
    toggleMode: () => dispatch(toggleMode()),
    setMode: (newMode: Mode) => dispatch(setMode(newMode)),
  };
};

export const { toggleMode, setMode } = modeSlice.actions;
export const modeReducer = modeSlice.reducer;
