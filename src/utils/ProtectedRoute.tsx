import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import { useUser } from "../store/slices/userSlice";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useUser(); 

  if (loading == true) {
    
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.formStatus || user.formStatus !== "COMPLETED") {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  return children;
}
