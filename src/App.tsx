import "./components/MenuListPage/index.module.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MenuCreatePage from "./components/MenuCreatePage";
import MenuEditPage from "./components/MenuEditPage";
import MenuListPage from "./components/MenuListPage";
import StoreListPage from "./components/StoreListPage";
import { MenuDataProvider } from "./contexts/MenuDataContext";
import Layout from "./components/Layout";
import MenuDetailsPage from "./components/MenuDetailsPage";

export default function App() {
  return (
    <MenuDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StoreListPage />} />
            <Route path="stores/:storeId" element={<MenuListPage />} />
            <Route path="menus/:menuId" element={<MenuDetailsPage />} />
            <Route path="menus/:menuId/edit" element={<MenuEditPage />} />
            <Route path="menus/new" element={<MenuCreatePage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="*" element={<Link to="/stores/1">not found</Link>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MenuDataProvider>
  );
}
