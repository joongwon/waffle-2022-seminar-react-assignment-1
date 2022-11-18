import axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiCreateMenuParams,
  ApiUpdateMenuParams,
  LoginInfo,
  Menu,
  Owner,
  Review,
} from "./types";

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

export const apiCreateMenu = (menu: ApiCreateMenuParams, token: string) =>
  axios.post<Menu>(url("/menus/"), menu, { headers: auth(token) });

export const apiUpdateMenu = (
  id: number,
  menu: ApiUpdateMenuParams,
  token: string
) => axios.patch<Menu>(url(`/menus/${id}`), menu, { headers: auth(token) });

export const apiDeleteMenu = (id: number, token: string) =>
  axios.delete(url(`/menus/${id}`), { headers: auth(token) });

export const apiCreateReview = (
  menu: number,
  rating: number,
  content: string,
  token: string
) =>
  axios.post<Review>(
    url("/reviews/"),
    { menu, rating, content },
    { headers: auth(token) }
  );

export const apiUpdateReview = (
  reviewId: number,
  rating: number,
  content: string,
  token: string
) =>
  axios.patch<Review>(
    url(`/reviews/${reviewId}`),
    { rating, content },
    { headers: auth(token) }
  );

export const apiDeleteReview = (id: number, token: string) =>
  axios.delete(url(`/reviews/${id}`), { headers: auth(token) });

export function useApiData<T>(
  fetch: ((cancel: CancelToken) => Promise<AxiosResponse<T>>) | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ payload: unknown } | null>(null);
  const cancelRef = useRef<CancelTokenSource | null>(null);
  const cancel = useCallback(() => {
    cancelRef.current?.cancel();
  }, []);
  useEffect(() => {
    (async () => {
      if (!fetch) return null;
      setLoading(true);
      cancel();
      const source = axios.CancelToken.source();
      cancelRef.current = source;

      try {
        const res = await fetch(source.token);
        setData(res.data);
        return res;
      } catch (reason) {
        if (axios.isCancel(reason)) return;
        setData(null);
        setError({ payload: reason });
        throw reason;
      } finally {
        cancelRef.current = null;
        setLoading(false);
      }
    })();
    return () => cancel();
  }, [cancel, fetch]);
  return { data, loading, error };
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
          ...(owner && { owner: owner.toString() }),
          ...(search && { search }),
        }),
        { cancelToken }
      ),
    [owner, search]
  );
  return owner === null ? null : f;
};

export const useApiOwnerInfo = (owner: number | null) => {
  const f = useCallback(
    (cancelToken: CancelToken) =>
      axios.get<{ owner: Owner }>(url(`/owners/${owner}`), { cancelToken }),
    [owner]
  );
  return owner === null ? null : f;
};

export const useApiOwnerList = (name: string | null) =>
  useCallback(
    (cancelToken: CancelToken) =>
      axios.get<Owner[]>(url("/owners/", name ? { name } : undefined), {
        cancelToken,
      }),
    [name]
  );

export function useApiReviewInfScroll(_menu: number, count: number) {
  const [data, setData] = useState<Review[]>([]);
  const [from, setFrom] = useState<string | undefined>();
  const [menu, setMenu] = useState(_menu);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef<CancelTokenSource | null>(null);
  const cancel = useCallback(() => {
    cancelRef.current?.cancel();
  }, []);
  const fetch = useCallback(
    async (menu: number, count: number, from?: string) => {
      setLoading(true);
      cancel();
      const source = axios.CancelToken.source();
      cancelRef.current = source;
      try {
        const res = await axios.get<{ data: Review[]; next: string }>(
          url("/reviews/", {
            menu: menu.toString(),
            count: count.toString(),
            ...(from && { from }),
          }),
          { cancelToken: source.token }
        );
        return res.data;
      } finally {
        cancelRef.current = null;
        setLoading(false);
      }
    },
    [cancel]
  );
  const refresh = useCallback(
    () =>
      fetch(menu, count)
        .then((resData) => {
          setData(resData.data);
          setFrom(resData.next);
          setEnd(resData.data.length === 0);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) throw err;
        }),
    [count, fetch, menu]
  );
  const next = useCallback(async () => {
    if (end || loading) return;
    const resData = await fetch(menu, count, from);
    if (resData.data.length === 0) {
      setEnd(true);
      return;
    }
    setData([...data, ...resData.data]);
    setFrom(resData.next);
  }, [count, data, end, fetch, from, loading, menu]);
  useEffect(() => {
    if (menu !== _menu) {
      setData([]);
      setMenu(_menu);
    }
  }, [_menu, menu]);
  return { refresh, next, data, cancel, loading };
}
