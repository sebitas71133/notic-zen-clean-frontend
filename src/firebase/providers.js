import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

//INICIAR SESION CON GOOGLE

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);

    const { displayName, email, photoURL, uid } = result.user;
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      ok: false,
      errorCode,
      errorMessage,
    };
  }
};

//REGISTRARSE CON EMAIL Y PASSWORD

export const registerWithEmailPassword = async ({
  email: emailToRegister,
  password,
  displayName,
}) => {
  try {
    const result = await createUserWithEmailAndPassword(
      FirebaseAuth,
      emailToRegister,
      password
    );

    console.log({ email: emailToRegister, password, displayName });

    const { email, photoURL, uid } = result.user;

    updateProfile(FirebaseAuth.currentUser, { displayName });

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      ok: false,
      errorCode,
      errorMessage,
    };
  }
};

//INICIAR SESION CON EMAIL Y PASSWORD

export const signInWithEmailPassword = async ({
  email: emailToLogin,
  password,
}) => {
  try {
    const result = await signInWithEmailAndPassword(
      FirebaseAuth,
      emailToLogin,
      password
    );
    const { displayName, email, photoURL, uid } = result.user;
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      ok: false,
      errorCode,
      errorMessage,
    };
  }
};

// CERRAR SESION CON FIREBASE
export const logoutFirebase = async () => {
  return await FirebaseAuth.signOut();
};
