import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MenuCreatePage from "./components/MenuCreatePage";
import MenuEditPage from "./components/MenuEditPage";
import MenuListPage from "./components/MenuListPage";
import StoreListPage from "./components/StoreListPage";
import Layout from "./components/Layout";
import MenuDetailsPage from "./components/MenuDetailsPage";
import { SessionProvider } from "./contexts/SessionContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { HeaderDataProvider } from "./contexts/HeaderDataContext";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<StoreListPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/menus/:menuId/edit" element={<MenuEditPage />} />
        <Route path="/menus/new" element={<MenuCreatePage />} />
      </Route>
      <Route
        element={
          <HeaderDataProvider>
            <Layout />
          </HeaderDataProvider>
        }
      >
        <Route path="/stores/:ownerId" element={<MenuListPage />} />
        <Route path="/menus/:menuId" element={<MenuDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <HeaderDataProvider>
          <AppRoutes />
          <ToastContainer />
        </HeaderDataProvider>
      </BrowserRouter>
    </SessionProvider>
  );
}
