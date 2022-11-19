import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Owner } from "../lib/types";

const HeaderDataContext = createContext({
  owner: null as Owner | null,
  setOwner(owner: Owner): void {
    void owner;
    throw new Error("HeaderDataContext not provided");
  },
});

export function HeaderDataProvider({ children }: PropsWithChildren) {
  const [owner, setOwner] = useState<Owner | null>(null);
  return (
    <HeaderDataContext.Provider value={{ owner, setOwner }}>
      {children}
    </HeaderDataContext.Provider>
  );
}

export const useHeaderDataContext = () => useContext(HeaderDataContext);
export const useGetHeaderOwner = () => useHeaderDataContext().owner;
export const useSetHeaderOwner = (owner: Owner | null) => {
  const { setOwner } = useHeaderDataContext();
  useEffect(() => {
    owner && setOwner(owner);
  }, [owner, setOwner]);
};
