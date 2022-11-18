import axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

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
  rating: number;
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

const url = (path: string, param?: Record<string, string>) =>
  (process.env.NODE_ENV === "production"
    ? `https://ah9mefqs2f.execute-api.ap-northeast-2.amazonaws.com${path}`
    : path) + (param ? "?" + new URLSearchParams(param).toString() : "");

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

export const apiLogin = (username: string, password: string) =>
  axios.post<LoginInfo>(
    url("/auth/login"),
    { username, password },
    { withCredentials: true }
  );

export const apiLogout = (token: string) =>
  axios.post(url("/auth/logout"), null, {
    withCredentials: true,
    headers: auth(token),
  });

export const apiRefresh = () =>
  axios.post<{ access_token: string }>(url("/auth/refresh"), null, {
    withCredentials: true,
  });

export const apiMyInfo = (token: string) =>
  axios.get<{ owner: Owner }>(url("/owners/me"), { headers: auth(token) });

export const apiListMenus = (owner: number) =>
  axios.get<{ data: Menu[] }>(url("/menus/", { owner: owner.toString() }));

export function useApiData<T>(
  fetch: ((cancel: CancelToken) => Promise<AxiosResponse<T>>) | null
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const cancelRef = useRef<CancelTokenSource | null>(null);
  const cancel = useCallback(() => {
    cancelRef.current?.cancel();
  }, []);
  const refresh = useCallback(async () => {
    if (!fetch) return null;
    cancel();
    const source = axios.CancelToken.source();
    cancelRef.current = source;

    try {
      const res = await fetch(source.token);
      setData(res.data);
      return res;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      cancelRef.current = null;
    }
  }, [cancel, fetch]);
  useEffect(() => {
    refresh().catch((reason) => {
      if (!axios.isCancel(reason)) throw reason;
    });
    return () => cancel();
  }, [cancel, refresh]);
  return { data, refresh, cancel, error };
}

export const useApiMenuFetcher = (id: number | null) => {
  const f = useCallback(
    (cancelToken: CancelToken) =>
      axios.get<Menu>(url(`/menus/${id}`), { cancelToken }),
    [id]
  );
  return id === null ? null : f;
};

export const useApiMenuListFetcher = (
  owner: number | null,
  search: string | null
) => {
  const f = useCallback(
    (cancelToken: CancelToken) =>
      axios.get<{ data: Menu[] }>(
        url("/menus/", {
          owner: owner?.toString() ?? "",
          ...(search && { search }),
        }),
        { cancelToken }
      ),
    [owner, search]
  );
  return owner === null ? null : f;
};
