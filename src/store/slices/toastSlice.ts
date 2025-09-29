// store/toastSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (
      state,
      action: PayloadAction<{ message: string; type: ToastType; duration?: number }>
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      state.toasts.push({ id, ...action.payload });

      // auto remove after duration (default 5s)
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent("REMOVE_TOAST", { detail: id }));
      }, action.payload.duration ?? 5000);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});


export const useToast = () => {
  const dispatch: AppDispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  return {
    toasts,

    addToast: (message: string, type: "success" | "error" | "warning" | "info" = "info", duration = 5000) =>
      dispatch(addToast({ message, type, duration })),

    removeToast: (id: string) => dispatch(removeToast(id)),

    clearToasts: () => dispatch(clearToasts()),
  };
};

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export const toastReducer =  toastSlice.reducer;
