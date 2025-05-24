import { useSelector, useDispatch } from "react-redux";

import {
  loginReducer,
  logoutReducer,
  checkingReducer,
  setErrorReducer,
  clearErrorMessageReducer,
} from "../store/slices/authSlice";
import {
  useLazyRenewTokenQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../../services/authApi";
import { toast } from "react-toastify";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [loginRequest, { isLoading, error }] = useLoginMutation();
  const [registerRequest] = useRegisterMutation();
  const [triggerRenew] = useLazyRenewTokenQuery();

  /* ---------- login ---------- */
  const startLogin = async ({ email, password }) => {
    try {
      dispatch(checkingReducer());

      const { data, token } = await loginRequest({ email, password }).unwrap(); //lanza el error el unwrap
      console.log({ data });

      dispatch(loginReducer({ token: token, user: data }));
      toast.success(`¡Bienvenido, ${data.name}!`);
    } catch (err) {
      console.log(err);
      //dispatch(logoutReducer());
      startLogout();
      toast.error(err.data?.error || "Credenciales incorrectas");
      dispatch(setErrorReducer(err.data?.error || "Credenciales incorrectas"));
      setTimeout(() => dispatch(clearErrorMessageReducer()), 10);
    }
  };

  /* ---------- register ---------- */
  const startRegister = async ({ name, email, password1, password2 }) => {
    try {
      dispatch(checkingReducer());

      if (password1 !== password2) {
        toast.error("Las contraseñas deben ser iguales");
        return;
      }

      const { data, token } = await registerRequest({
        name,
        email,
        password: password1,
      }).unwrap();

      dispatch(loginReducer({ token: token, user: data }));
      toast.success(`Registro exitoso, ${data.name}!`);
    } catch (err) {
      startLogout();
      toast.error(err.data?.error || "Error al registrarse");
      dispatch(setErrorReducer(err.data?.error || "Error al registrarse"));
      setTimeout(() => dispatch(clearErrorMessageReducer()), 10);
    }
  };

  //   /* ---------- renew ---------- */
  const checkAuthToken = async (token) => {
    console.log("Checkeando el token");
    //const token = localStorage.getItem("token");

    if (!token) return dispatch(logoutReducer());

    try {
      const { data, token } = await triggerRenew().unwrap();

      dispatch(loginReducer({ token: token, user: data }));
    } catch (error) {
      console.log(error);
      dispatch(
        logoutReducer({
          errorMessage: "Tu sesión ha expirado. Inicia sesión de nuevo.",
        })
      );
    }
  };

  /* ---------- logout ---------- */
  const startLogout = () => {
    dispatch(logoutReducer());
  };

  return {
    // state
    status,
    user,
    errorMessage,

    isLoading,

    // actions
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
