import React from "react";
import { Fragment } from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <Fragment>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <input id={name} name={name} {...rest} className="form-control" />
      {error && <label className="text-danger">{error}</label>}
    </Fragment>
  );
};

export default Input;
