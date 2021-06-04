import React, { useContext, useMemo, useState } from 'react';
import axios from 'axios';
import { endpoints } from './api.jsx';

const AuthContext = React.createContext({
  user: null,
  logIn: () => {},
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

const getSavedUser = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return savedUser;
};

export const Provider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  const value = useMemo(() => {
    const getAuthHeader = () => {
      const token = currentUser?.token;

      return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const request = (configOrUrl = {}) => {
      const config = typeof configOrUrl === 'string' ? { url: configOrUrl } : configOrUrl;

      return axios({
        ...config,
        headers: { ...config.headers, ...getAuthHeader() },
      });
    };

    const logIn = async ({ username, password }) => {
      const { data: user } = await axios.post(endpoints.login(), {
        username,
        password,
      });
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
    };
    const signUp = async ({ username, password }) => {
      const { data: user } = await axios.post(endpoints.signup(), {
        username,
        password,
      });
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
    };
    const logOut = () => {
      localStorage.removeItem('user');
      setCurrentUser(null);
    };

    return {
      user: currentUser,
      logIn,
      signUp,
      logOut,
      request,
    };
  }, [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
