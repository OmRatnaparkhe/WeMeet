import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./useAuth";

export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" />;
  }
  return children;
}
