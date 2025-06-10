import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeNote: null, // Para cuando el usuario está editando una nota
  isModalOpen: false, // Por ejemplo, si abres una modal para ver una nota
};

export const notesSlice = createSlice({
  name: "note",
  initialState: {
    activeNote: JSON.parse(localStorage.getItem("activeNote")) || null,
    allNotes: [],
    filteredNotes: [],
    searchTerm: "",
    allSubnotes: [],
    filteredSubNotes: [],
    searchSubTerm: "",
    activeSubNote: JSON.parse(localStorage.getItem("activeSubNote")) || null,
  },
  reducers: {
    setActiveNote: (state, action) => {
      state.activeNote = action.payload;
      console.log(state.activeNote);
      localStorage.setItem("activeNote", JSON.stringify(action.payload));
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

    setNotes: (state, action) => {
      state.allNotes = action.payload;
      state.filteredNotes = [];
      // console.log(state.allNotes);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredNotes = state.allNotes.filter((note) =>
        note.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setFilteredNotes: (state, action) => {
      state.filteredNotes = action.payload;
    },

    // SUBNOTES

    setSubNotes: (state, action) => {
      state.allSubnotes = action.payload;
      state.filteredSubNotes = [];
      // console.log(state.allNotes);
    },
    setSearchSubTerm: (state, action) => {
      state.searchSubTerm = action.payload;
      state.filteredSubNotes = state.allSubnotes.filter((subNote) =>
        subNote.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setFilteredSubNotes: (state, action) => {
      state.filteredSubNotes = action.payload;
    },

    setActiveSubNote: (state, action) => {
      state.activeSubNote = action.payload;
      console.log(state.activeSubNote);
      localStorage.setItem("activeSubNote", JSON.stringify(action.payload));
    },
  },
});

export const {
  setActiveNote,
  clearActiveNote,
  toggleModal,
  deleteImageFromActiveNote,
  updatedImagesReducer,
  setNotes,
  setSearchTerm,
  setFilteredNotes,

  // Subnotes
  setFilteredSubNotes,
  setSearchSubTerm,
  setSubNotes,
  setActiveSubNote,
} = notesSlice.actions;
// export const notesReducer = notesSlice.reducer;
