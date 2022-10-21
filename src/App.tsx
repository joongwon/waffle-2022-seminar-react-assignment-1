import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuListPage from "./pages/MenuListPage";

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<MenuListPage/>}/>
    </Routes>
  </BrowserRouter>
}