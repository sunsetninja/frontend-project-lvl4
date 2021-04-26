import React, { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";
import routes from "../routes.js";

const AuthContext = createContext({
  user: null,
  logIn: () => {},
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const Provider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser());

  const logIn = async ({ username, password }) => {
    const { data: user } = await axios.post(routes.login(), {
      username,
      password,
    });
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const logOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const getAuthHeader = () => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  const request = (configOrUrl = {}) => {
    let config;
    if (typeof configOrUrl === "string") {
      config = { url: configOrUrl };
    } else {
      config = configOrUrl;
    }
    return axios({
      ...config,
      headers: { ...config.headers, ...getAuthHeader() },
    });
  };

  const value = useMemo(() => ({ user, logIn, logOut, request }), [
    user,
    logIn,
    logOut,
    request,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
