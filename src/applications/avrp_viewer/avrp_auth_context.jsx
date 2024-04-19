import React, { createContext, useContext, useState } from 'react';
import AVRPGatewayHelper from './api_helpers/avrp_gateway_helper';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const gatewayURL = process.env.NEXT_PUBLIC_GATEWAY_URL;

  // attempt login, set user and return a meesage
  const login = async (userData) => {
    AVRPGatewayHelper.getInstance().login(userData.username, userData.password)
    .then((res) => {
      console.log("[AuthProvider] login response: ", res);
      const ok = res.success;
      if (ok) {
        setUser({
          token: res.token,
        })
      } else
        setUser(null);
    })
  };

  const logout = () => {
    setUser(null);
    AVRPGatewayHelper.getInstance().logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
