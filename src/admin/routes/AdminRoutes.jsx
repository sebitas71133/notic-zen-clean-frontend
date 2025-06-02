import { AdminLayout } from "../layout/AdminLayout";
import { AdminPage } from "../page/AdminPage";
import { AdminDashboard } from "../views/AdminDashboard";
import { CloudinaryView } from "../views/CloudinaryView";

import { UsersView } from "../views/UsersView";

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      path: "",
      element: <AdminPage />,
      children: [
        { index: true, element: <UsersView /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "cloudinary", element: <CloudinaryView /> },
      ],
    },
  ],
};

export default adminRoutes;
