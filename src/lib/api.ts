import axios from "axios";

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

const url = (path: string) =>
  process.env.NODE_ENV === "production"
    ? `https://ah9mefqs2f.execute-api.ap-northeast-2.amazonaws.com${path}`
    : path;

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
