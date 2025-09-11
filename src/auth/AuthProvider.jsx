import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkingReducer,
  loginReducer,
  logoutReducer,
} from "../store/slices/authSlice";
import { useAuthStore } from "../hooks/useAuthStore";
import { CheckingAuth } from "../components/CheckingAuth";
import socketService from "../../socket/SocketService.jsx";

// Se encarga de rehidratar y establecer el estado global de autenticación (Redux) al iniciar la app

//Corre una vez, al montar la aplicación.

//Sirve como "bootstrap" o "preparador del estado inicial".

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const { checkAuthToken, startLogout } = useAuthStore();

  useEffect(() => {
    const rehidrate = async () => {
      dispatch(checkingReducer());

      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        await checkAuthToken(token);

        // 👇 Una vez autenticado, conectamos el socket
        const parsedUser = JSON.parse(user);

        // socketService.auth = { token }; // opcional, si validas el token en el socket
        socketService.connect(parsedUser.id);
      } else {
        // dispatch(logoutReducer());
        startLogout();
      }
    };

    rehidrate();
  }, [dispatch]);

  if (status === "checking") {
    return <CheckingAuth></CheckingAuth>;
  }

  return <>{children}</>;
};
