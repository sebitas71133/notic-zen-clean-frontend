import { AuthLayout } from "../layout/AuthLayout";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

const authRoutes = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <LoginPage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
  ],
};

export default authRoutes;
