import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";
import { useLazyGetNotesQuery } from "../../../services/noteApi";
import { useEffect } from "react";

import { useAuthStore } from "../../hooks/useAuthStore.js";
import { useLazyGetCategoriesQuery } from "../../../services/categoryApi.js";
import { useLazyGetTagsQuery } from "../../../services/tagApi.js";

const drawerWidth = 280;

export const NoteLayout = () => {
  const [triggerGetNotes, { data: notesData, isLoading: isNotesLoading }] =
    useLazyGetNotesQuery();
  const [
    triggerGetCategories,
    { data: categoriesData, isLoading: isCategoriesLoading },
  ] = useLazyGetCategoriesQuery();

  const [triggerGetTags, { data: tagsData, isLoading: isTagsLoading }] =
    useLazyGetTagsQuery();

  const { user } = useAuthStore();

  useEffect(() => {
    triggerGetNotes({ page: 1, limit: 10 });
    triggerGetCategories({ page: 1, limit: 10 });
    triggerGetTags({ page: 1, limit: 10 });
  }, []);

  if (isNotesLoading || !notesData) {
    return <div>Cargando notas...</div>;
  }

  if (isCategoriesLoading || !categoriesData) {
    return <div>Cargando categorias...</div>;
  }

  if (isTagsLoading || !tagsData) {
    return <div>Cargando tags...</div>;
  }

  const notes = notesData.data;
  const categories = categoriesData.data;
  const tags = tagsData.data;
  console.log({ notesData });
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <NavBar drawerWidth={drawerWidth} />

      <SideBar drawerWidth={drawerWidth} list={notes} displayName={user.name} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet context={{ notes, userId: user.id, categories, tags }}></Outlet>
      </Box>
    </Box>
  );
};
