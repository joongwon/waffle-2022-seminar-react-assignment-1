import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { LoginInfo, Owner } from "../lib/api";

const SessionContext = createContext({
  access_token: null as string | null,
  owner: null as Owner | null,
  setLoginInfo(_loginInfo: LoginInfo | null): void {
    throw new Error("SessionContext not provided");
  },
  updateToken(_token: string): void {
    throw new Error("SessionContext not provided");
  },
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);
  const updateToken = useCallback(
    (token: string) =>
      setLoginInfo((prev) => {
        if (!prev) throw new Error("cannot update non-existent token");
        return prev && { ...prev, access_token: token };
      }),
    []
  );
  return (
    <SessionContext.Provider
      value={{
        setLoginInfo,
        access_token: loginInfo?.access_token ?? null,
        updateToken,
        owner: loginInfo?.owner ?? null,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
