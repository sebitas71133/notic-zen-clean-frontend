import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
import { Firestore } from "./config";

export const createNewNote = async (email) => {
  const newNote = {
    title: "",
    body: "",
    imagesUrls: [],
    date: new Date().getTime(),
  };

  try {
    const newDoc = doc(collection(Firestore, `${email}/journal/notes`));
    await setDoc(newDoc, newNote);
    newNote.id = newDoc.id;
    return newNote; // Devuelve la nueva nota con su ID
  } catch (error) {
    console.error("Error al crear la nota:", error);
    throw new Error("No se pudo crear la nota");
  }
};

export const saveNewNoteFirestore = async (email, id, noteData) => {
  try {
    const docRef = doc(Firestore, `${email}/journal/notes/${id}`);
    await setDoc(docRef, noteData, { merge: true });
    console.log("Nota guardada correctamente");
  } catch (error) {
    console.error("Error al guardar la nota ", error);
    throw new Error("No se pudo guardar la nota");
  }
};

export const getNotesFromFirestore = async (email) => {
  try {
    const collectionRef = collection(Firestore, `${email}/journal/notes`);
    const docs = await getDocs(collectionRef);

    const notes = [];

    docs.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    return notes;
  } catch (error) {
    console.error("Error al  obtener las notas: ", error);
    throw new Error("No se pudo obtener las notas ");
  }
};

export const deleteNoteFromFirestore = async (email, noteId) => {
  try {
    const docRef = doc(Firestore, `${email}/journal/notes/${noteId}`);
    await deleteDoc(docRef);
    console.log("Nota eliminada con id:", noteId);
  } catch (error) {
    console.error("Error eliminando nota:", error);
    throw new Error("No se pudo eliminar la nota");
  }
};
