import MenuItem from "./MenuItem";

export default function MenuList({ menus, selectedId, setSelectedId }) {
  return (
    <table className="menu-list">
      <thead>
        <th>ID</th>
        <th>이름</th>
        <th>가격</th>
      </thead>
      <tbody>
        {menus.map((menu) => (
          <MenuItem
            key={menu.id}
            menu={menu}
            handleSelect={() => setSelectedId(menu.id)}
            selected={selectedId === menu.id}
          />
        ))}
      </tbody>
    </table>
  );
}
