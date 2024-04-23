import React, { createContext, useContext, useState } from 'react';
import AVRPGatewayHelper from './api_helpers/avrp_gateway_helper';

const AVRPAuthContext = createContext();

export default function AVRPAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // attempt login, set user and return a meesage
  const login = async (userData) => {
    AVRPGatewayHelper.getInstance().login(userData.username, userData.password)
    .then((res) => {
      console.log("[AuthProvider] login result: ", res);
      const ok = res.success;
      if (ok) {
        setUser({
          username: userData.username,
        })
      } else
        setUser(null);

      return res;
    })
  };

  const logout = () => {
    setUser(null);
    AVRPGatewayHelper.getInstance().logout();
  };

  return (
    <AVRPAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AVRPAuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AVRPAuthContext);
}
