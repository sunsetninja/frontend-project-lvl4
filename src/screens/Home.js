import React, { useEffect } from "react";
import { useAuth } from "../features/auth.js";
import { useHistory } from "react-router-dom";

export default () => {
  const auth = useAuth();
  const history = useHistory();

  useEffect(async () => {
    try {
      await auth.getUserData();
    } catch (error) {
      if (error?.response?.status === 401) {
        history.replace("/login");
        return;
      }
      throw error;
    }
  }, [auth, history]);

  return "home";
};
