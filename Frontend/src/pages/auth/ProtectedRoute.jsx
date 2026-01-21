import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export function ProtectedRoute({ children }) {
  const {isSignedIn, isLoaded} = useAuth();
  if(!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/signin" />;
  }
  
  return children;
}
