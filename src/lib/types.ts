export enum MenuType {
  waffle = "waffle",
  beverage = "beverage",
  coffee = "coffee",
  dessert = "dessert",
}

export type Menu = {
  id: number;
  name: string;
  type: MenuType;
  price: number;
  image?: string;
  description?: string;
};
export type MenuUpdateInput = Pick<Menu, "price" | "image" | "description">;
export type MenuCreateInput = Pick<
  Menu,
  "name" | "type" | "price" | "image" | "description"
>;
