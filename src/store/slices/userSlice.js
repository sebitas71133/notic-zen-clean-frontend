import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    userRole: "",
    isUpdatingRole: false,
    globalImages: [],
    imagesFromCloud: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload || [];
    },
    updateRoleUser: (state, action) => {
      const foundUser = state?.users.find(
        (user) => user.uid === action.payload
      );

      if (foundUser) {
        state.userRole = foundUser.role; // Solo guarda el rol en el estado
      } else {
        console.log(state.users);
        state.userRole = null;
      }
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },

    setIsUpdatingRole: (state, action) => {
      state.isUpdatingRole = action.payload;
    },
    setGlobalImages: (state, action) => {
      // state.globalImages = [];
      state.globalImages = [...state.globalImages, ...action.payload];
      // console.log("global agregado : ", state.globalImages);
    },
    setImagesFromCloud: (state, action) => {
      state.imagesFromCloud = action.payload;
    },
  },
});

export const {
  setUsers,
  updateRoleUser,
  setUserRole,
  setIsUpdatingRole,
  setGlobalImages,
  setImagesFromCloud,
} = userSlice.actions;
export const usersReducer = userSlice.reducer;
