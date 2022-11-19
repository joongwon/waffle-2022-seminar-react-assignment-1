import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputWithLabelArgsBase<T, N extends keyof T> = {
  value: T;
  label: string;
  name: N;
  setValue: (value: T) => void;
} & (T[N] extends string
  ? {
      propToString?: (prop: T[N]) => string;
    }
  : {
      propToString: (prop: T[N]) => string;
    }) &
  (T[N] extends string
    ? {
        stringToProp?: (prop: string) => T[N];
      }
    : {
        stringToProp: (prop: string) => T[N];
      });
export type InputWithLabelProps<T, N extends keyof T> = (
  | (Omit<
      InputHTMLAttributes<HTMLInputElement>,
      keyof InputWithLabelArgsBase<T, N>
    > & { textarea?: false; suffix?: string })
  | (Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      keyof InputWithLabelArgsBase<T, N>
    > & { textarea: true; suffix?: never })
) &
  InputWithLabelArgsBase<T, N>;

export type Owner = {
  id: number;
  username: string;
  store_name?: string;
  store_description?: string;
  created_at: string;
  updated_at: string;
};

export type LoginInfo = {
  owner: Owner;
  access_token: string;
};

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
  rating?: number;
  owner: Owner;
};

export type DummyMenu = {
  id: number;
  name?: never;
  type?: never;
  price?: never;
  image?: never;
  description?: never;
  rating?: never;
  owner?: never;
};

export type ApiCreateMenuParams = {
  name: string;
  type: MenuType;
  price: number;
  image?: string;
  description?: string;
};

export type ApiUpdateMenuParams = {
  price?: number;
  image?: string | null;
  description?: string | null;
};

export type Review = {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
  menu: Menu;
  author: Owner;
};

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

export type Canceled<T> =
  | { payload: T; canceled?: undefined }
  | { canceled: true };
