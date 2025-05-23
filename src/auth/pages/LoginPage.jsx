import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useAuthStore } from "../../hooks/useAuthStore";
import Swal from "sweetalert2";

import { useDispatch } from "react-redux";
// import { loginReducer } from "../../store/slices/authSlice";
import { useAuthStore } from "../../hooks/useAuthStore";

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { errorMessage, startLogin, startRegister, user, isLoading } =
    useAuthStore();
  const dispatch = useDispatch();
  //  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmitLogin = async (Info) => {
    const newInfo = {
      email: Info.emailLogin,
      password: Info.passwordLogin,
    };
    await startLogin(newInfo);
    console.log(user);
  };

  const onSubmitRegister = (data) => {
    const newData = {
      name: data.nameRegister,
      email: data.emailRegister,
      password1: data.passwordRegister1,
      password2: data.passwordRegister2,
    };
    console.log(data);
    startRegister(newData);
  };

  const handleTabChange = (isLoginSelected) => {
    setIsLogin(isLoginSelected);
    reset();
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* Tabs para alternar entre Login y Registro */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${isLogin ? "active" : ""}`}
              onClick={() => handleTabChange(true)}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${!isLogin ? "active" : ""}`}
              onClick={() => handleTabChange(false)}
            >
              Register
            </button>
          </li>
        </ul>

        {/* Contenido del formulario */}
        {isLogin && (
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${
                    errors.emailLogin ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="email@example.com"
                  name="emailLogin"
                  {...register("emailLogin", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // regex básico de email
                      message: "Ingresa un email válido",
                    },
                  })}
                />
                {errors.emailLogin && (
                  <div className="invalid-feedback">
                    {errors.emailLogin.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.passwordLogin ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="••••••••"
                  name="passwordLogin"
                  {...register("passwordLogin", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Debe tener al menos 4 caracteres",
                    },
                  })}
                />
                {errors.passwordLogin && (
                  <div className="invalid-feedback">
                    {errors.passwordLogin.message}
                  </div>
                )}
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary w-100"
              >
                {"Sign in"}
              </button>
            </>
          </form>
        )}

        {!isLogin && (
          <form onSubmit={handleSubmit(onSubmitRegister)}>
            <>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.nameRegister ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="Your name"
                  name="nameRegister"
                  {...register("nameRegister", {
                    required: "Name is required",
                  })}
                />
                {errors.nameRegister && (
                  <div className="invalid-feedback">
                    {errors.nameRegister.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${
                    errors.emailRegister ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="email@example.com"
                  name="emailRegister"
                  {...register("emailRegister", {
                    required: "email is required",
                  })}
                />
                {errors.emailRegister && (
                  <div className="invalid-feedback">
                    {errors.emailRegister.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.passwordRegister1 ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="••••••••"
                  name="passwordRegister1"
                  {...register("passwordRegister1", {
                    required: "password is required",
                  })}
                />
                {errors.passwordRegister1 && (
                  <div className="invalid-feedback">
                    {errors.passwordRegister1.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.passwordRegister2 ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="••••••••"
                  name="passwordRegister2"
                  {...register("passwordRegister2", {
                    required: "enter the password again",
                  })}
                />
                {errors.passwordRegister2 && (
                  <div className="invalid-feedback">
                    {errors.passwordRegister2.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {"Register"}
              </button>
            </>
          </form>
        )}

        {/* {!isLogin ? (
          <form key={"register-form"} onSubmit={handleSubmit(onSubmitRegister)}>
            <>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.nameRegister ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="Your name"
                  name="nameRegister"
                  {...register("nameRegister", {
                    required: "Name is required",
                  })}
                />
                {errors.nameRegister && (
                  <div className="invalid-feedback">
                    {errors.nameRegister.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${
                    errors.emailRegister ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="email@example.com"
                  name="emailRegister"
                  {...register("emailRegister", {
                    required: "email is required",
                  })}
                />
                {errors.emailRegister && (
                  <div className="invalid-feedback">
                    {errors.emailRegister.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.passwordRegister1 ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="••••••••"
                  name="passwordRegister1"
                  {...register("passwordRegister1", {
                    required: "password is required",
                  })}
                />
                {errors.passwordRegister1 && (
                  <div className="invalid-feedback">
                    {errors.passwordRegister1.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.passwordRegister2 ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="••••••••"
                  name="passwordRegister2"
                  {...register("passwordRegister2", {
                    required: "enter the password again",
                  })}
                />
                {errors.passwordRegister2 && (
                  <div className="invalid-feedback">
                    {errors.passwordRegister2.message}
                  </div> // Mensaje de error estilo Bootstrap
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {"Register"}
              </button>
            </>
          </form>
        ) : (
          <form key={"login-form"} onSubmit={handleSubmit(onSubmitLogin)}>
            <>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${
                    errors.emailLogin ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="email@example.com"
                  name="emailLogin"
                  {...register("emailLogin", { required: "Email is required" })}
                />
                {errors.emailLogin && (
                  <div className="invalid-feedback">
                    {errors.emailLogin.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.passwordLogin ? "is-invalid" : ""
                  }`} // Agrega la clase de Bootstrap si hay error
                  placeholder="••••••••"
                  name="passwordLogin"
                  {...register("passwordLogin", {
                    required: "Password is required",
                  })}
                />
                {errors.passwordLogin && (
                  <div className="invalid-feedback">
                    {errors.passwordLogin.message}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                {"Sign in"}
              </button>
            </>
          </form>
        )} */}
      </div>
    </div>
  );
};
