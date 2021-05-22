import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../features/auth.jsx";
import FormField from "../components/FormField.jsx";
import routes from "../routes.js";

function Login() {
  const { t } = useTranslation();
  const usernameInputRef = useRef();
  const history = useHistory();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={async (values, { setSubmitting }) => {
        setAuthFailed(false);
        setSubmitting(true);

        try {
          await auth.logIn(values);
          setSubmitting(false);
          history.replace("/");
        } catch (error) {
          setSubmitting(false);
          if (error?.response?.status === 401) {
            setAuthFailed(true);
            return;
          }
          throw error;
        }
      }}
    >
      {(props) => (
        <div className="container-fluid">
          <div className="row justify-content-center pt-5">
            <div className="col-sm-4">
              <Form onSubmit={props.handleSubmit} className="p-3">
                <FormField
                  name="username"
                  label={t("login.username")}
                  ref={usernameInputRef}
                  isInvalid={authFailed}
                  autoComplete="username"
                  required
                />
                <FormField
                  name="password"
                  label={t("login.password")}
                  autoComplete="current-password"
                  type="password"
                  required
                  isInvalid={authFailed}
                  error={authFailed ? t("login.authFailed") : null}
                />
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={props.isSubmitting}
                >
                  {t("login.submit")}
                </Button>
                <div className="d-flex flex-column align-items-center">
                  <span className="small mb-2">{t("login.newToChat")}</span>{" "}
                  <Link to={routes.signup()}>{t("login.signup")}</Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default Login;
