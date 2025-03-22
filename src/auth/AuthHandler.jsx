import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { Outlet, useNavigate } from "react-router-dom";
import { CheckingAuth } from "../components/CheckingAuth";

export const AuthHandler = () => {
  const { status } = useSelector((state) => state.auth);
  const { userRole } = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") {
      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    }
    // else if (status === "not-authenticated") {
    //   navigate("/", { replace: true });
    // }
  }, [navigate, status, userRole]);

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return <Outlet />;
};
