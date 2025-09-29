import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { modeReducer } from "./slices/modeSlice";
import { toastReducer } from "./slices/toastSlice";
import { setupToastListeners } from "./listener";



export const store = configureStore({
  reducer: {
    user: userReducer,
    mode: modeReducer,
    toast: toastReducer,
    // add more slices here later
  },
});
setupToastListeners(store.dispatch);

// ✅ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
