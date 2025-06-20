import { RouterProvider } from "react-router-dom";
import router from "./router/AppRouter";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppTheme } from "./theme/AppTheme";
import { AuthProvider } from "./auth/AuthProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <AppTheme>
            <RouterProvider router={router} />{" "}
          </AppTheme>
        </AuthProvider>
      </Provider>
      <ToastContainer
        position="top-right" // o "bottom-left", etc.
        autoClose={3000} // 3 s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
