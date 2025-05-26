import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { toggleDarkMode } from "../../store/slices/themeSlice";

export const AuthLayout = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const setDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return <Outlet context={{ darkMode, setDarkMode }} />;
};
