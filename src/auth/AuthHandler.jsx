import React, { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import { useAuthStore } from "../hooks/useAuthStore";

// Se encarga de redirigir según el estado de autenticación (authenticated, not-authenticated).

// Redirige al usuario a /app o /auth, según su estado.

export const AuthHandler = () => {
  const { status, checkAuthToken } = useAuthStore();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (status === "checking") {
      checkAuthToken(token);
    }
    console.log({ status });
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/app", { replace: true });
    } else if (status === "not-authenticated") {
      navigate("/auth", { replace: true });
    }
  }, [status, navigate]);

  if (status === "checking") {
    return <div>Cargando sesión...</div>;
  }

  return <Outlet />;
};
