import { createBrowserRouter } from "react-router-dom";

import HomeRoutes from "../home/routes/HomeRoutes";
import AuthRoutes from "../auth/routes/AuthRoutes";
import NoteRoutes from "../notes/routes/NoteRoutes";
import AdminRoutes from "../admin/routes/AdminRoutes";
import { AuthHandler } from "../auth/AuthHandler";
import NotFoundPage from "../components/NotFoundPage";
import { ThemeProvider } from "@mui/material";

const routes = [
  {
    path: "/",
    element: <AuthHandler />,
    children: [
      HomeRoutes, //Rutas publicas
      AuthRoutes, //Rutas de autentificacion
      NoteRoutes, //rutas del usuario
      AdminRoutes, // rutas del admin
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true,
  },
});

export default router;
