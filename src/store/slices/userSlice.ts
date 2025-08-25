import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  vendorId?: string;
  [key: string]: any; // if backend sends more
}

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  currency: string;
  mode?: 'test' | 'live';
}

const initialState: UserState = {
  user: null,
  loading: true,
  currency: "₹",
  
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInStore: (
      state,
      action: PayloadAction<{
        profile: UserProfile;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { profile, accessToken, refreshToken } = action.payload;

      state.user = profile;

      // ✅ Persist to localStorage
      Cookies.set("user", JSON.stringify(profile), { expires: 7 }); // 7 days
      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });
      if (profile.vendorId) {
        Cookies.set("vendorId", profile.vendorId, { expires: 7 });
      }

      // ✅ Sync global tokens
      (window as any).authToken = accessToken;
      (window as any).refreshToken = refreshToken;
    },
    setUserFromStorage: (state) => {
      const savedUser = Cookies.get("user");
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (savedUser) {
        state.user = JSON.parse(savedUser);
      }

      if (accessToken) (window as any).authToken = accessToken;
      if (refreshToken) (window as any).refreshToken = refreshToken;

      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        Cookies.set("user", JSON.stringify(state.user), { expires: 7 });
      }
    },
    logout: (state) => {
      state.user = null;

      Cookies.remove("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("vendorId");

      (window as any).authToken = null;
      (window as any).refreshToken = null;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
  },
});

export const {
  setUserInStore,
  setUserFromStorage,
  updateUser,
  logout,
  setCurrency,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
