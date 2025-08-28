import { Navigate } from "react-router-dom";
import {type JSX } from "react";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = !!localStorage.getItem("esim-user"); 

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}