import MenuItem from "./MenuItem";
import "./MenuList.css";
import { Menu } from "../../lib/types";

interface MenuListProps {
  selectedId: number | null;
  select(menu: Menu | null): void;
  menus: Menu[] | null;
}

const MenuList = ({ menus, selectedId, select }: MenuListProps) => {
  return (
    <ul className="menu-list">
      <li className="list-header">
        <div>ID</div>
        <div>이름</div>
        <div>종류</div>
        <div>가격</div>
      </li>
      {menus?.map((menu) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          handleSelect={() => select(selectedId === menu.id ? null : menu)}
          selected={selectedId === menu.id}
        />
      ))}
    </ul>
  );
};
export default MenuList;
