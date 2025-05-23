import { NoteLayout } from "../layout/NoteLayout";

import { NotePageWrapper } from "../pages/NotePageWrapper";

import { NotesPage } from "../pages/NotesPage";

const noteRoutes = {
  path: "/app",
  element: <NoteLayout />,
  children: [
    {
      index: true,
      element: <NotesPage />,
    },
    // {
    //   path: "note/new",

    //   element: <NotePageWrapper />,
    // },
    {
      path: "note/:noteId", // <-- FALTA ESTA
      element: <NotePageWrapper />,
    },
  ],
};

export default noteRoutes;
