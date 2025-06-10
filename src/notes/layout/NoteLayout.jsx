import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";

import { Outlet } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";

import { useAuthStore } from "../../hooks/useAuthStore.js";
import { useGetCategoriesQuery } from "../../../services/categoryApi.js";
import { useGetTagsQuery } from "../../../services/tagApi.js";
import { useGetNotesQuery } from "../../../services/noteApi.js";
import { useDispatch } from "react-redux";
import { setNotes } from "../../store/slices/noteSlice.js";
import { useEffect } from "react";

const drawerWidth = 280;

export const NoteLayout = () => {
  const dispatch = useDispatch();
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoryError,
  } = useGetCategoriesQuery({ page: 1, limit: 500 });

  const {
    data: tagsData,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useGetTagsQuery({ page: 1, limit: 500 });

  const {
    data: notesData = [],
    isLoading: isNotesLoading,
    isError: isNotesError,
  } = useGetNotesQuery({ page: 1, limit: 500 });

  const { user } = useAuthStore();

  useEffect(() => {
    if (notesData?.data) {
      dispatch(setNotes(notesData.data));
    }
  }, [notesData, dispatch]);

  if (!categoriesData?.data || isCategoriesLoading) {
    return <div>Cargando categorias...</div>;
  }

  if (isTagsLoading || !tagsData?.data) {
    return <div>Cargando tags...</div>;
  }

  if (isNotesLoading || !notesData?.data) {
    return <div>Cargando notas...</div>;
  }

  const notesTotal = notesData.data?.length ?? 0;
  const categories = categoriesData.data;
  const totalCategories = categories.length ?? 0;
  const tags = tagsData.data; //Para NoteCard
  const totalTags = tags.length ?? 0;

  const imagesTotal = notesData.data.reduce((total, note) => {
    return total + (note.images?.length || 0);
  }, 0);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <NavBar drawerWidth={drawerWidth} />

      <SideBar
        drawerWidth={drawerWidth}
        displayName={user?.name || "Invitado"}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet
          context={{
            userId: user?.id ?? null,
            categories,
            totalTags,
            tags,
            totalCategories,
            notesTotal,
            imagesTotal,
          }}
        ></Outlet>
      </Box>
    </Box>
  );
};
