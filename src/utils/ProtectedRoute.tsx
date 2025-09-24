import { Navigate } from "react-router-dom";
import {type JSX } from "react";
import { useUser } from "../store/slices/userSlice";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();
  console.log("userProtected", user);
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  console.log(user.formStatus !== "COMPLETED");

  if (user.formStatus == null || user.formStatus !== "COMPLETED") {
    console.log("formStatus is not COMPLETED, redirecting to /vendor/onboarding");
    return <Navigate to="/vendor/onboarding" replace />;
  }
  return children;
}