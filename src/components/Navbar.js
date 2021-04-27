import React from "react";
import { Button, Navbar as BsNavbar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth.js";

const Navbar = () => {
  const { logOut, user } = useAuth();
  const { t } = useTranslation();
  return (
    <BsNavbar bg="light" expand="lg" className="mb-3">
      <BsNavbar.Brand as={Link} to="/" className="mr-auto">
        {t("hexletChat")}
      </BsNavbar.Brand>
      {user && <Button onClick={logOut}>{t("logout")}</Button>}
    </BsNavbar>
  );
};

export default Navbar;
