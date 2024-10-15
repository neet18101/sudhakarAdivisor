import React, {createContext, useState} from 'react';
export const AuthContext = createContext();
export const AuthContextProvider = ({children}) => {
  const [isLoding, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = token => {
    setUserToken(token);
    setIsLoading(false);
  };

  const logout = () => {
    setUserToken(null);
    setIsLoading(false);
  };
  return (
    <AuthContext.Provider value={{isLoding, userToken, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
