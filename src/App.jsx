import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn, SignUp } from "@/pages/auth";
import ProtectedRoute from "./configs/protected";
import { useEffect, useRef, useState } from "react";
import { getToken2 } from './utils/token';
import { useOfflineNotifier, useOnlineNotifier } from '@/Api/Auth'; // ✅ rename here

function App() {
  const intervalRef = useRef(null);

  const refreshData = () => {
    console.log("Refreshing data at", new Date().toLocaleTimeString());
    // Example fetch:
    // fetch("/api/data")
    //   .then((res) => res.json())
    //   .then((data) => console.log(data));
  };

  const [role, setRole] = useState(null);

  useEffect(() => {
    // Run immediately on mount
    document.title = "E-commerce Application";
    refreshData();
   const tokenString = localStorage.getItem("token2");
      if (tokenString) {
        const tokenObj = JSON.parse(tokenString);
        setRole(tokenObj.value);
    // Run immediately on mount
      }
        // Refresh every 1 second
    intervalRef.current = setInterval(refreshData, 1000);

    // Visibility change listener
    const handleVisibilityChange = () => {
      
      if (document.visibilityState === "hidden") {
        useOfflineNotifier();
      } else {
        useOnlineNotifier();
        
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {role === "dev" && (
        <Route path="sign-up" element={<SignUp />} />
      )}

      <Route path="sign-in" element={<SignIn />} />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
