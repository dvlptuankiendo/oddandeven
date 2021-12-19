import React, { useState, useEffect, createContext } from "react";

import { ACCESS_TOKEN, getAccessToken } from "../services/api";
import { getInfo } from "../services/api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);

  const getAuth = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error();
      const res = await getInfo();
      setUser(res.data);
    } catch {
      localStorage.removeItem(ACCESS_TOKEN);
    }

    setInitialized(true);
  };

  const signOut = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setUser(null);
  };

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{ initialized, user, isLoading, setIsLoading, setUser, signOut }}
    >
      {children}
    </AppContext.Provider>
  );
};
