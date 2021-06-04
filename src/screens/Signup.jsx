import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../services/auth.jsx';
import FormField from '../components/FormField.jsx';

function Signup() {
  const { t } = useTranslation();
  const usernameInputRef = useRef();
  const history = useHistory();
  const [signupFailed, setSignupFailed] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  return (
    <Formik
      initialValues={{ username: '', password: '', password_confirm: '' }}
      validationSchema={yup.object().shape({
        username: yup
          .string()
          .trim()
          .required()
          .min(3, t('validation.username'))
          .max(20, t('validation.username')),
        password: yup.string().trim().required().min(6, t('validation.password.min')),
        password_confirm: yup
          .string()
          .test(
            'password_confirm',
            t('validation.password.match'),
            (value, context) => value === context.parent.password,
          ),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        setSignupFailed(false);
        setSubmitting(true);

        try {
          await auth.signUp({
            username: values.username,
            password: values.password,
          });
          setSubmitting(false);
          history.replace('/');
        } catch (error) {
          setSubmitting(false);

          if (error?.response?.status !== 409) {
            throw error;
          }
          setSignupFailed(true);
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
                  label={t('signup.username')}
                  ref={usernameInputRef}
                  isInvalid={signupFailed}
                  error={signupFailed ? t('signup.alreadyExists') : null}
                  required
                  autoComplete="username"
                  onChange={() => {
                    setSignupFailed(false);
                  }}
                />
                <FormField
                  name="password"
                  label={t('signup.password')}
                  isInvalid={signupFailed}
                  type="password"
                  required
                  autoComplete="new-password"
                />
                <FormField
                  name="password_confirm"
                  label={t('signup.passwordConfirm')}
                  isInvalid={signupFailed}
                  type="password"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={props.isSubmitting}
                >
                  {t('signup.submit')}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default Signup;
