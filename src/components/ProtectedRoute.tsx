import { Navigate } from "react-router-dom";
import {type JSX } from "react";
import { useUser } from "../store/slices/userSlice";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();
  const isAuthenticated = !!user;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}