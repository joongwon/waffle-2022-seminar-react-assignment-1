export enum MenuType {
  waffle = "waffle",
  beverage = "beverage",
  coffee = "coffee",
  dessert = "dessert",
}

function never(x: never): never {
  throw new Error("Missing case: " + x);
}

export function displayType(type: MenuType) {
  switch (type) {
    case MenuType.waffle:
      return "와플";
    case MenuType.beverage:
      return "음료";
    case MenuType.coffee:
      return "커피";
    case MenuType.dessert:
      return "디저트";
    default:
      return never(type);
  }
}

export type Menu = {
  id: number;
  name: string;
  type: MenuType;
  price: number;
  image?: string;
  description?: string;
};
export type MenuUpdateInput = {
  price: number;
  image?: string;
  description?: string;
};
export type MenuCreateInput = Pick<
  Menu,
  "name" | "type" | "price" | "image" | "description"
>;
