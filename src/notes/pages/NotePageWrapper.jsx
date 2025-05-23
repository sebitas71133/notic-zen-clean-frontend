import { useParams, useNavigate } from "react-router-dom";
import { NoteCard } from "./NoteCard.jsx";
import { useDispatch } from "react-redux";
import { setActiveNote } from "../../store/slices/noteSlice.js";

export const NotePageWrapper = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setActiveNote(null));
    navigate("/app"); // Volver a la lista de notas
  };

  return <NoteCard noteId={noteId} onBack={handleBack} />;
};
