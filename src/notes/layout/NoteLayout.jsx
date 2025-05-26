import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";

import { Outlet } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";

import { useAuthStore } from "../../hooks/useAuthStore.js";
import { useGetCategoriesQuery } from "../../../services/categoryApi.js";
import { useGetTagsQuery } from "../../../services/tagApi.js";

const drawerWidth = 280;

export const NoteLayout = () => {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoryError,
  } = useGetCategoriesQuery({ page: 1, limit: 10 });

  const {
    data: tagsData,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useGetTagsQuery({ page: 1, limit: 10 });

  const { user } = useAuthStore();

  if (!categoriesData || isCategoriesLoading) {
    return <div>Cargando categorias...</div>;
  }

  if (isTagsLoading || !tagsData) {
    return <div>Cargando tags...</div>;
  }

  const categories = categoriesData.data;
  const tags = tagsData.data;

  console.log({ tags });
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <NavBar drawerWidth={drawerWidth} />

      <SideBar drawerWidth={drawerWidth} displayName={user.name} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet context={{ userId: user.id, categories, tags }}></Outlet>
      </Box>
    </Box>
  );
};
