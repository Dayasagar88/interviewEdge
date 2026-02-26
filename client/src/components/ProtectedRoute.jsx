import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const { userData } = useSelector((state) => state.user);

  // agar login nahi hai → redirect
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;