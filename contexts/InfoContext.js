import useInfo from "@/hooks/useInfo";
import { createContext } from "react";

export const InfoContext = createContext({});

export const InfoProvider = ({ children }) => {
  const { info, infoLoading } = useInfo();

  return (
    <InfoContext.Provider value={{ info, infoLoading }}>
      {children}
    </InfoContext.Provider>
  );
};
