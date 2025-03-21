import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkingCredentials,
  getRegisteredUsers,
  login,
  logout,
} from "../store/slices/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { getNotesThunk } from "../store/slices/journalSlice";
import { updateRoleUser } from "../store/slices/userSlice";
import { fetchAllFirestoreImages } from "../firebase/fetchAllFirestoreImages";
import { getCloudinaryImagesThunk } from "../cloudinary/cloudinaryProviders";
import { CheckingAuth } from "../components/CheckingAuth";
import { FirebaseAuth } from "../firebase/config";

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { status, uid } = useSelector((state) => state.auth);
  const { users, userRole } = useSelector((state) => state.users); // Obtiene los usuarios registrados

  useEffect(() => {
    dispatch(checkingCredentials());

    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(login({ uid, email, displayName, photoURL }));
        dispatch(getNotesThunk());
        // dispatch(updateRoleUser());
        dispatch(getRegisteredUsers()); // Cargar usuarios registrados
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (users.length > 0 && uid) {
      dispatch(updateRoleUser(uid));
    }
  }, [users, uid]);

  useEffect(() => {
    if (userRole === "admin") {
      dispatch(fetchAllFirestoreImages()); // Obtener referencias de imágenes
      dispatch(getCloudinaryImagesThunk()); // Obtener imágenes de Cloudinary
    }
  }, [userRole]);

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return <>{children}</>;
};
