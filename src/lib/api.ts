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
  const [{ data, error, loading }, setResult] = useState<{
    data?: T;
    error?: { payload?: unknown };
    loading: boolean;
  }>({ loading: false });
  useEffect(() => {
    if (!fetch) return;
    const source = axios.CancelToken.source();
    setResult((prev) => ({ ...prev, loading: true }));
    fetch(source.token)
      .then((res) => {
        setResult({ data: res.data, loading: false });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setResult({ error: { payload: err }, loading: false });
      });
    return () => source.cancel();
  }, [fetch]);
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

const useApiReviewList = (menu: number, count: number) =>
  useCallback(
    (from: string | undefined, cancelToken: CancelToken) =>
      axios.get<{ data: Review[]; next: string }>(
        url("/reviews/", {
          menu: menu.toString(),
          count: count.toString(),
          ...(from && { from }),
        }),
        { cancelToken }
      ),
    [count, menu]
  );

export function useApiReviewInfScroll(menu: number, count: number) {
  const [{ data, from, isEnd, error, loading }, setResult] = useState<{
    data: Review[];
    from?: string;
    isEnd: boolean;
    error?: { payload: unknown };
    loading: boolean;
  }>({ data: [], loading: false, isEnd: false });
  const cancelRef = useRef<CancelTokenSource | null>(null);
  const fetch = useApiReviewList(menu, count);
  const next = useCallback(() => {
    if (loading || isEnd) return;
    const source = (cancelRef.current = axios.CancelToken.source());
    setResult((prev) => ({ ...prev, loading: true }));
    fetch(from, source.token)
      .then((res) => {
        setResult((prev) => ({
          data: [...prev.data, ...res.data.data],
          from: res.data.next,
          isEnd: res.data.data.length === 0,
          loading: false,
        }));
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setResult((prev) => ({
          ...prev,
          error: { payload: err },
          loading: false,
        }));
      })
      .catch(() => {
        cancelRef.current = null;
      });
  }, [loading, isEnd, fetch, from]);
  const cancel = useCallback(() => cancelRef.current?.cancel(), []);
  const refresh = useCallback(() => {
    cancelRef.current?.cancel();
    const source = (cancelRef.current = axios.CancelToken.source());
    setResult((prev) => ({ ...prev, loading: true }));
    fetch(undefined, source.token)
      .then((res) => {
        setResult({
          data: [...res.data.data],
          from: res.data.next,
          isEnd: res.data.data.length === 0,
          loading: false,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setResult((prev) => ({
          ...prev,
          error: { payload: err },
          loading: false,
        }));
      })
      .catch(() => {
        cancelRef.current = null;
      });
  }, [fetch]);
  return { refresh, next, data, cancel, loading, error };
}
