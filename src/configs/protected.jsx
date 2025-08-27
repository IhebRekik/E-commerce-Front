import { Navigate } from "react-router-dom";
import { isLoggedIn } from './../utils/token';


export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/sign-in" replace />; // redirect to login
  }
  return children;
}