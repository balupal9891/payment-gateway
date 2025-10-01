import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { AppDispatch, RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  [key: string]: any; 
}
const savedUserRaw = Cookies.get("user");
let savedUser: UserProfile | null = null;

if (savedUserRaw) {
  try {
    savedUser = JSON.parse(savedUserRaw);
  } catch (err) {
    console.warn("Failed to parse user cookie:", err);
    savedUser = null;
    Cookies.remove("user"); // remove corrupted cookie
  }
}
const initialState = {
  user: savedUser,
  loading: true,
  currency: "₹",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // In your slice
setUserInStore: (
  state,
  action: PayloadAction<{
    profile: UserProfile;
    accessToken?: string;
    refreshToken?: string;
  }>
) => {
  const { profile, accessToken, refreshToken } = action.payload;

  // Always update profile
  state.user = profile;
  Cookies.set("user", JSON.stringify(profile));

  // Update tokens only if provided
  if (accessToken) {
    Cookies.set("accessToken", accessToken);
    (window as any).authToken = accessToken;
  }

  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken);
    (window as any).refreshToken = refreshToken;
  }
}
,
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

      (window as any).authToken = null;
      (window as any).refreshToken = null;
      
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
  },
});

export const useUser = () => {
  const dispatch: AppDispatch = useDispatch();

  const { user, loading, currency } = useSelector(
    (state: RootState) => state.user
  );

  return {
    user,
    loading,
    currency,

    setUserInStore: (payload: {
      profile: UserProfile;
      accessToken?: string;
      refreshToken?: string;
    }) => dispatch(setUserInStore(payload)),

    setUserFromStorage: () => dispatch(setUserFromStorage()),

    updateUser: (data: Partial<UserProfile>) => dispatch(updateUser(data)),

    logout: () => dispatch(logout()),

    setCurrency: (c: string) => dispatch(setCurrency(c)),
  };
};

export const {
  setUserInStore,
  setUserFromStorage,
  updateUser,
  logout,
  setCurrency,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
