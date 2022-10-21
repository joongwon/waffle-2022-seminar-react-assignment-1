import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import MenuListPage from "./pages/MenuListPage";
import { MenuDataProvider } from "./contexts/MenuDataContext";

export default function App() {
  return (
    <MenuDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/stores/:storeId" element={<MenuListPage />} />
          <Route path="*" element={<Link to="/stores/1">not found</Link>} />
        </Routes>
      </BrowserRouter>
    </MenuDataProvider>
  );
}
