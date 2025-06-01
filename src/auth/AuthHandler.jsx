import React, { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import { useAuthStore } from "../hooks/useAuthStore";

// Se encarga de redirigir según el estado de autenticación (authenticated, not-authenticated).

// Redirige al usuario a /app o /auth, según su estado.

export const AuthHandler = () => {
  const { status, checkAuthToken, user } = useAuthStore();
  const navigate = useNavigate();
  console.log({ user });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (status === "checking") {
      checkAuthToken(token);
    }
    console.log({ status });
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      if (location.pathname === "/" || location.pathname.startsWith("/auth")) {
        if (user?.role.name === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/app", { replace: true });
        }
      }
    } else if (status === "not-authenticated") {
      navigate("/auth", { replace: true });
    }
  }, [status, navigate, location]);

  if (status === "checking") {
    return <div>Cargando sesión...</div>;
  }

  return <Outlet />;
};
