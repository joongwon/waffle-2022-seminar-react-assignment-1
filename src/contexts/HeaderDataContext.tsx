import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Owner } from "../lib/types";

const HeaderDataContext = createContext({
  owner: null as Owner | null,
  setOwner(_owner: Owner): void {
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
