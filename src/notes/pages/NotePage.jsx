import { IconButton } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { newNoteThunk } from "../../store/slices/journalSlice";
import { NoteView } from "../views/NoteView";
import { NothingSelectedView } from "../views/NothingSelectedView";

export const NotePage = () => {
  const { isSaving, isActive } = useSelector((state) => state.journal);

  const dispatch = useDispatch();
  return (
    <>
      {isActive ? <NoteView /> : <NothingSelectedView />}

      <IconButton
        size="large"
        sx={{
          color: "secondary.main",
          backgroundColor: "error.main",
          ":hover": {
            backgroundColor: "secondary.main",
            color: "primary.main",
            opacity: 0.9,
          },
          position: "fixed",
          right: 50,
          bottom: 50,
        }}
        onClick={() => dispatch(newNoteThunk())}
        disabled={isSaving}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>
    </>
  );
};
