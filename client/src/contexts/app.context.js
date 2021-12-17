import React, { useState, useEffect, createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);

  const getAuth = async () => {
    // demo, get user information here
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setUser({ username: "Test", amount: 1000000 });
    // setUser(null);
    setInitialized(true);
  };

  const signOut = () => {
    setUser(null);
  };

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <AppContext.Provider value={{ initialized, user, signOut }}>
      {children}
    </AppContext.Provider>
  );
};
