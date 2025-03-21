import { collection, getDocs } from "firebase/firestore/lite";
import { setGlobalImages } from "../store/slices/userSlice";
import { Firestore } from "./config";

export const fetchAllFirestoreImages = () => {
  return async (dispatch, getState) => {
    const imagesRef = collection(Firestore, "images");
    const querySnapshot = await getDocs(imagesRef);
    const urls = querySnapshot.docs.map((doc) => doc.data().url);

    dispatch(setGlobalImages(urls));
  };
};
