import React from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

function FormField({ name, label, isInvalid, required, type, error: propsError }, ref) {
  const [field, { error, touched }] = useField(name);

  return (
    <Form.Group>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...field}
        id={name}
        isInvalid={(touched && error) || isInvalid}
        required={required}
        ref={ref}
        type={type}
      />
      <Form.Control.Feedback type="invalid">{error || propsError}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default React.forwardRef(FormField);
