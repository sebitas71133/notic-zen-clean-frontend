import { LogoutSuccess } from "../../components/LogoutSuccess";
import { AuthLayout } from "../layout/AuthLayout";
import { LoginPage } from "../pages/LoginPage";

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
      path: "logout",
      element: <LogoutSuccess />,
    },
  ],
};

export default authRoutes;
