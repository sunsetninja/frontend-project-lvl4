import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const getAuthHeader = () => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };
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
  const getUserData = async () => {
    try {
      const { data: userData } = await axios.get(routes.me(), {
        headers: getAuthHeader(),
      });
      return userData;
    } catch (error) {
      logOut();
      throw error;
    }
  };

  const value = useMemo(() => ({ user, getUserData, logIn, logOut }), [
    user,
    getUserData,
    logIn,
    logOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
