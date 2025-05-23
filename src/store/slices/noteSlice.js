import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeNote: null, // Para cuando el usuario está editando una nota
  isModalOpen: false, // Por ejemplo, si abres una modal para ver una nota
};

export const notesSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setActiveNote: (state, action) => {
      state.activeNote = action.payload;
      console.log(state.activeNote);
    },
    clearActiveNote: (state) => {
      state.activeNote = null;
    },
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload;
    },

    updatedImagesReducer: (state, action) => {
      state.activeNote.images = action.payload;
    },

    deleteImageFromActiveNote: (state, action) => {
      const indexToDelete = action.payload;
      if (state.activeNote?.images?.length > indexToDelete) {
        state.activeNote.images.splice(indexToDelete, 1);
      }
    },
  },
});

export const {
  setActiveNote,
  clearActiveNote,
  toggleModal,
  deleteImageFromActiveNote,
  updatedImagesReducer,
} = notesSlice.actions;
// export const notesReducer = notesSlice.reducer;
