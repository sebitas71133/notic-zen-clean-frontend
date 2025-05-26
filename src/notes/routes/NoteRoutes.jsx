import { NoteLayout } from "../layout/NoteLayout";
import { CategoriesPage } from "../pages/CategoriesPage";
import { DashboardPage } from "../pages/DashboardPage";

import { NotePageWrapper } from "../pages/NotePageWrapper";

import { NotesPage } from "../pages/NotesPage";
import { TagsPage } from "../pages/TagsPage";

const noteRoutes = {
  path: "/app",
  element: <NoteLayout />,
  children: [
    {
      index: true,
      element: <NotesPage />,
    },
    {
      path: "dashboard",
      element: <DashboardPage />,
    },
    {
      path: "category",
      element: <CategoriesPage />,
    },
    {
      path: "tags",
      element: <TagsPage />,
    },

    {
      path: "note/:noteId",
      element: <NotePageWrapper />,
    },
  ],
};

export default noteRoutes;
