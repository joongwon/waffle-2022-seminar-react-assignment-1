export default function MenuItem({ menu, selected, handleSelect }) {
  return (
    <tr
      className={`menu-item ${selected ? "selected" : ""}`}
      onClick={handleSelect}
    >
      <td>{menu.id}</td>
      <td>{menu.name}</td>
      <td>{menu.price}</td>
    </tr>
  );
}
