import { createSlice } from "@reduxjs/toolkit";

import {
  createNewNote,
  deleteNoteFromFirestore,
  getNotesFromFirestore,
  saveNewNoteFirestore,
} from "../../firebase/firestoreNotes";

//PREPARA UNA NUEVA NOTA VACIA
export const newNoteThunk = () => {
  return async (dispatch, getState) => {
    console.log(getState());

    dispatch(setSaving(true));
    const { email } = getState().auth;

    try {
      const newNote = await createNewNote(email);
      dispatch(addNewEmptyNote(newNote));
      dispatch(setActiveNote(newNote));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setSaving(false));
    }
  };
};

export const saveNoteThunk = (data) => {
  return async (dispatch, getState) => {
    dispatch(setSaving(true));
    const { email } = getState().auth;

    const { id, ...noteToFireStore } = data;

    try {
      await saveNewNoteFirestore(email, id, noteToFireStore);
      console.log("Guardando...");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setSaving(false));
    }
  };
};

export const getNotesThunk = () => {
  return async (dispatch, getState) => {
    const { email } = getState().auth;

    try {
      const notes = await getNotesFromFirestore(email);
      console.log(notes);
      dispatch(setNotes(notes));
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteNoteThunk = () => {
  return async (dispatch, getState) => {
    const { email } = getState().auth;
    const { active: activeNote } = getState().journal;

    if (!activeNote) return;

    try {
      await deleteNoteFromFirestore(email, activeNote.id);
      dispatch(deleteNoteById(activeNote.id));
    } catch (error) {
      console.error("Error eliminando nota:", error);
    }
  };
};

const journalSlice = createSlice({
  name: "journal",
  initialState: {
    isSaving: false,
    isDeletingImage: false,
    isUploadingImages: false,
    messageSaved: "",
    notes: [],
    active: {
      body: "",
      date: "",
      id: "",
      imagesUrls: [],
      title: "",
    },
    imagesUrls: [],
    isActive: false,
  },
  reducers: {
    addNewEmptyNote: (state, action) => {
      state.notes.push(action.payload);
    },
    setActiveNote: (state, action) => {
      state.active = action.payload;
      state.isActive = true;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },

    updateNote: (state, action) => {
      state.notes = state.notes.map((note) => {
        if (note.id === action.payload.id) {
          return action.payload;
        }

        return note;
      });
      state.active = action.payload;
      state.imagesUrls = [];
    },
    deleteNoteById: (state, action) => {
      state.active = null;
      state.notes = state.notes.filter((e) => e.id !== action.payload);
      state.active = {
        body: "",
        date: "",
        id: "",
        imagesUrls: [],
        title: "",
      };
      state.isActive = false;
      // if (state.notes.length === 0) {
      //   state.isActive = false;
      // }
    },

    deletingImage: (state, action) => {
      console.log(action.payload);
      state.isDeletingImage = action.payload;
    },

    clearNotesLogout: (state, action) => {
      state.active = null;
      state.imagesUrls = [];
      state.isSaving = false;
      state.notes = [];
    },

    setIsUploadingImages: (state, action) => {
      state.isUploadingImages = action.payload;
    },
  },
});

export const {
  addNewEmptyNote,
  setActiveNote,
  setNotes,
  setSaving,
  updateNote,
  deleteNoteById,
  setIsUploadingImages,
  clearNotesLogout,
  deletingImage,
} = journalSlice.actions;

export const journalReducer = journalSlice.reducer;
