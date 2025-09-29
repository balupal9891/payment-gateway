// store/listeners.ts
import { type AppDispatch } from "./store";
import { removeToast } from "./slices/toastSlice";

export const setupToastListeners = (dispatch: AppDispatch) => {
  document.addEventListener("REMOVE_TOAST", (e: any) => {
    dispatch(removeToast(e.detail));
  });
};
