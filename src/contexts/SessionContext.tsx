import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { apiLogin, apiLogout, apiMyInfo, apiRefresh } from "../lib/api";
import axios, { CancelTokenSource } from "axios";
import { toast } from "react-toastify";
import { Canceled, LoginInfo, Owner } from "../lib/types";
import { axiosErrorStatus } from "../lib/error";
import { useEffectMountOrChange } from "../lib/hooks";

const SessionContext = createContext({
  me: null as Owner | null,
  loading: false,
  withToken<T>(req: (token: string) => Promise<T>): Promise<Canceled<T>> {
    void req;
    throw new Error("SessionContext not provided");
  },
  logout(): Promise<void> {
    throw new Error("SessionContext not provided");
  },
  login(username: string, password: string): Promise<Canceled<Owner>> {
    void username;
    void password;
    throw new Error("SessionContext not provided");
  },
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [{ loginInfo, loading }, setResult] = useState({
    loginInfo: null as LoginInfo | null,
    loading: false,
  });
  const refreshRef = useRef<Promise<string | null> | null>(null);
  const refresh = useCallback(() => {
    console.log(refreshRef.current);
    if (!refreshRef.current) {
      setResult((prev) => ({ ...prev, loading: true }));
      refreshRef.current = apiRefresh()
        .then(async (res) => {
          const token = res.data.access_token;
          const {
            data: { owner },
          } = await apiMyInfo(token);
          setResult({
            loginInfo: { owner, access_token: token },
            loading: false,
          });
          refreshRef.current = null;
          return token;
        })
        .catch((reason) => {
          setResult({ loginInfo: null, loading: false });
          refreshRef.current = null;
          if (axiosErrorStatus(reason) !== 401) throw reason;
          return null;
        });
    }
    return refreshRef.current;
  }, []);
  useEffectMountOrChange(() => refresh(), []);
  const withToken = useCallback(
    async function <T>(
      req: (token: string) => Promise<T>,
      alert?: boolean
    ): Promise<Canceled<T>> {
      const token = loginInfo?.access_token;
      if (!token) {
        alert && toast.warning("먼저 로그인하세요");
        return { canceled: true };
      }
      try {
        return { payload: await req(token) };
      } catch (e) {
        if (axiosErrorStatus(e) !== 401) throw e;
      }
      const newToken = await refresh();
      if (!newToken) {
        alert && toast.warning("먼저 로그인하세요");
        return { canceled: true };
      }
      return { payload: await req(newToken) };
    },
    [loginInfo?.access_token, refresh]
  );
  const logout = useCallback(async () => {
    withToken((token) => apiLogout(token), false);
    setResult({ loginInfo: null, loading: false });
  }, [withToken]);
  const loginCancelSource = useRef<CancelTokenSource | null>(null);
  const login = useCallback(async (username: string, password: string) => {
    loginCancelSource.current?.cancel();
    setResult((prev) => ({ ...prev, loading: true }));
    loginCancelSource.current = axios.CancelToken.source();
    return apiLogin(username, password, loginCancelSource.current.token)
      .then((res) => {
        setResult({ loginInfo: res.data, loading: false });
        return { payload: res.data.owner };
      })
      .catch((err) => {
        if (axios.isCancel(err)) return { canceled: true } as const;
        throw err;
      })
      .finally(() => {
        loginCancelSource.current = null;
      });
  }, []);
  return (
    <SessionContext.Provider
      value={{
        me: loginInfo?.owner ?? null,
        withToken,
        logout,
        login,
        loading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
