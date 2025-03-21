import { createSlice } from "@reduxjs/toolkit";
import {
  logoutFirebase,
  registerWithEmailPassword,
  signInWithEmailPassword,
  signInWithGoogle,
} from "../../firebase/providers";
import { clearNotesLogout } from "./journalSlice";
import { Firestore } from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
import { setIsUpdatingRole, setUsers } from "./userSlice";

//REGISTRARSE O INICIAR SESION CON GOOGLE

export const checkingAuthenticaction = () => {
  return async (dispatch) => {
    dispatch(setIsloading(true));
    dispatch(checkingCredentials());

    const result = await signInWithGoogle();
    if (result.ok) {
      await saveUserToFirestore({ uid: result.uid, email: result.email });
      dispatch(login(result));
    } else {
      dispatch(logout({ errorMessage: result.errorMessage }));
    }
    dispatch(setIsloading(false));
  };
};

//REGISTRARSE CON UN EMAIL Y PASSWORD

export const createUserWithEmailPasswordThunk = ({
  email,
  password,
  name: displayName,
}) => {
  return async (dispatch) => {
    dispatch(setIsloading(true));
    dispatch(checkingCredentials());

    const result = await registerWithEmailPassword({
      email,
      password,
      displayName,
    });
    if (result.ok) {
      await saveUserToFirestore({ uid: result.uid, email: result.email });
      dispatch(login(result));
    } else {
      dispatch(logout({ errorMessage: result.errorMessage }));
    }
    dispatch(setIsloading(false));
  };
};

//INICIAR SESION CON UN EMAIL Y PASSWORD

export const signInWithEmailPassowrdThunk = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(setIsloading(true));
    dispatch(checkingCredentials());

    const result = await signInWithEmailPassword({ email, password });
    if (result.ok) {
      dispatch(login(result));
    } else {
      dispatch(logout({ errorMessage: result.errorMessage }));
    }
    dispatch(setIsloading(false));
  };
};

export const getRegisteredUsers = () => {
  return async (dispatch) => {
    const collectionRef = collection(Firestore, "users");
    const docs = await getDocs(collectionRef);
    const users = [];

    docs.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    dispatch(setUsers(users));
  };
};

export const logoutFirebaseThunk = () => {
  return async (dispatch) => {
    await logoutFirebase();
    dispatch(clearNotesLogout());
  };
};

export const saveUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(Firestore, "users", user.uid);
  const userSnap = await getDoc(userRef);

  let currentRole = "usuario"; // Rol por defecto

  if (userSnap.exists()) {
    const userData = userSnap.data();
    if (userData.role) {
      currentRole = userData.role; // Mantener el rol existente
    }
  }
  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      role: currentRole, // Asigna el rol por defecto
    },
    { merge: true }
  );
};

export const updateUserRole = (uid, newRole) => {
  return async (dispatch, getState) => {
    if (!uid || !newRole) return;

    dispatch(setIsUpdatingRole(true));
    const userRef = doc(Firestore, "users", uid);

    await setDoc(userRef, { role: newRole }, { merge: true });

    dispatch(setIsUpdatingRole(false));
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking",
    uid: null,
    email: null,
    displayName: null || "Anónimo",
    photoUrl: null,
    errorMessage: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.status = "authenticated";
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoUrl = action.payload.photoUrl;
      state.errorMessage = null;
    },
    logout: (state, action) => {
      state.status = "not-authenticated";
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoUrl = null;
      state.errorMessage = action.payload?.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
    setIsloading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { checkingCredentials, login, logout, setIsloading } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
