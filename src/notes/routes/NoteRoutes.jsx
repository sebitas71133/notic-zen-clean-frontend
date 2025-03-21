import { NoteLayout } from "../layout/NoteLayout";
import { NotePage } from "../pages/NotePage";

const noteRoutes = {
  path: "/app",
  element: <NoteLayout />,
  children: [
    {
      index: true,
      element: <NotePage />,
    },
  ],
};

export default noteRoutes;
