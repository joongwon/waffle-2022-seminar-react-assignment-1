import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiLogin, apiLogout, apiMyInfo, apiRefresh } from "../lib/api";
import axios from "axios";
import { toast } from "react-toastify";
import { LoginInfo, Owner } from "../lib/types";

const SessionContext = createContext({
  me: null as Owner | null,
  loading: false,
  withToken<T>(_req: (token: string) => Promise<T>): Promise<T | null> {
    throw new Error("SessionContext not provided");
  },
  logout(): Promise<void> {
    throw new Error("SessionContext not provided");
  },
  login(_username: string, _password: string): Promise<Owner> {
    throw new Error("SessionContext not provided");
  },
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const refreshRef = useRef<Promise<string | null> | null>(null);
  const refresh = useCallback(() => {
    if (!refreshRef.current) {
      setLoading(true);
      refreshRef.current = (async () => {
        try {
          const res = await apiRefresh();
          const token = res.data.access_token;
          const {
            data: { owner },
          } = await apiMyInfo(token);
          setLoginInfo({ owner, access_token: token });
          refreshRef.current = null;
          return token;
        } catch (reason) {
          if (!axios.isAxiosError(reason)) throw reason;
          setLoginInfo(null);
          refreshRef.current = null;
          return null;
        } finally {
          setLoading(false);
        }
      })();
    }
    return refreshRef.current;
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const withToken = useCallback(
    async function <T>(req: (token: string) => Promise<T>): Promise<T | null> {
      const token = loginInfo?.access_token;
      if (!token) {
        toast.warning("먼저 로그인하세요");
        return null;
      }
      try {
        return await req(token);
      } catch (e) {
        if (!(axios.isAxiosError(e) && e.status === 401)) throw e;
      }
      const newToken = await refresh();
      if (!newToken) {
        toast.warning("먼저 로그인하세요");
        return null;
      }
      return await req(newToken);
    },
    [loginInfo?.access_token, refresh]
  );
  const logout = useCallback(async () => {
    loginInfo && apiLogout(loginInfo.access_token).catch();
    setLoginInfo(null);
  }, [loginInfo]);
  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await apiLogin(username, password);
      setLoginInfo(data);
      return data.owner;
    } finally {
      setLoading(false);
    }
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
