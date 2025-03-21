import { RouterProvider } from "react-router-dom";
import router from "./router/AppRouter";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppTheme } from "./theme/AppTheme";
import { AuthProvider } from "./auth/AuthProvider";

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
    </>
  );
}

export default App;
