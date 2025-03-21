import { AdminLayout } from "../layout/AdminLayout";
import { AdminPage } from "../page/AdminPage";
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
        { path: "cloudinary", element: <CloudinaryView /> },
      ],
    },
  ],
};

export default adminRoutes;
