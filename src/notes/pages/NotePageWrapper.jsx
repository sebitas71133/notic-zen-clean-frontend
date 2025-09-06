import { useParams, useNavigate } from "react-router-dom";
import { NoteCard } from "./NoteCard.jsx";
import { useDispatch } from "react-redux";
import { setActiveNote } from "../../store/slices/noteSlice.js";
import { Box } from "@mui/material";

export const NotePageWrapper = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setActiveNote(null));
    navigate("/app"); // Volver a la lista de notas
  };

  return (
    <Box
      sx={{
        width: "100%",
        // minHeight: "100vh", // para ocupar toda la altura de la pantalla
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-center",
        p: 2,
      }}
    >
      <NoteCard noteId={noteId} onBack={handleBack} />
    </Box>
  );
};
