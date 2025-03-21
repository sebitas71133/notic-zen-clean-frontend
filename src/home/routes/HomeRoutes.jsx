import { HomeLayout } from "../layout/HomeLayout";
import { HomePage } from "../page/HomePage";

const homeRoutes = {
  path: "/",
  element: <HomeLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
  ],
};

export default homeRoutes;
