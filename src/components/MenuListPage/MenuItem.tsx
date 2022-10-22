import { formatPrice } from "../../lib/formatting";
import "./MenuItem.css";
import { Menu } from "../../types/types";

const MenuItem = ({
  menu,
  selected,
  handleSelect,
}: {
  menu: Menu;
  selected: boolean;
  handleSelect(): void;
}) => {
  const formattedPrice = formatPrice(menu.price);
  return (
    <li
      className={`menu-item ${selected ? "selected" : ""}`}
      onClick={handleSelect}
    >
      <div>{menu.id}</div>
      <div>{menu.name}</div>
      <div>{formattedPrice}</div>
    </li>
  );
};
export default MenuItem;
