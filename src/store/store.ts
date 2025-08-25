import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { modeReducer } from "./slices/modeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    mode: modeReducer,
    // add more slices here later
  },
});

// ✅ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
