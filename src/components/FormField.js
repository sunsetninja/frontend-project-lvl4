import React from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

const FormField = React.forwardRef((props, ref) => {
  const [field, { error, touched }] = useField(props.name);

  return (
    <Form.Group>
      <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
      <Form.Control
        {...field}
        id={props.name}
        isInvalid={(touched && error) || props.isInvalid}
        required={props.required}
        ref={ref}
        type={props.type}
      />
      <Form.Control.Feedback type="invalid">
        {error || props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
});

export default FormField;
