import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MenuCreatePage from "./components/MenuCreatePage";
import MenuEditPage from "./components/MenuEditPage";
import MenuListPage from "./components/MenuListPage";
import StoreListPage from "./components/StoreListPage";
import { MenuDataProvider } from "./contexts/MenuDataContext";
import Layout from "./components/Layout";
import MenuDetailsPage from "./components/MenuDetailsPage";
import { SessionProvider } from "./contexts/SessionContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<StoreListPage />} />
        <Route path="stores/:storeId" element={<MenuListPage />} />
        <Route path="menus/:menuId" element={<MenuDetailsPage />} />
        <Route path="menus/:menuId/edit" element={<MenuEditPage />} />
        <Route path="menus/new" element={<MenuCreatePage />} />
        <Route path="auth/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <MenuDataProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer />
        </BrowserRouter>
      </MenuDataProvider>
    </SessionProvider>
  );
}
