import "./pages/MenuListPage.module.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import MenuListPage from "./pages/MenuListPage";
import { MenuDataProvider } from "./contexts/MenuDataContext";
import Layout from "./components/Layout";
import StoreListPage from "./pages/StoreListPage";
import DetailsPage from "./pages/DetailsPage";

export default function App() {
  return (
    <MenuDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StoreListPage />} />
            <Route path="stores/:storeId" element={<MenuListPage />} />
            <Route path="menus/:menuId" element={<DetailsPage />} />
            <Route path="*" element={<Link to="/stores/1">not found</Link>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MenuDataProvider>
  );
}
