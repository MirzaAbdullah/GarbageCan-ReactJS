import React from "react";
import { Fragment } from "react";

const SelectWithoutLabel = ({
  name,
  label,
  options,
  error,
  dataTextfield,
  dataValuefield,
  ...rest
}) => {
  return (
    <Fragment>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <select id={name} name={name} {...rest} className="form-control">
        {options.map((option) => (
          <option key={option[dataValuefield]} value={option[dataValuefield]}>
            {option[dataTextfield]}
          </option>
        ))}
      </select>
      {error && <label className="text-danger">{error}</label>}
    </Fragment>
  );
};

export default SelectWithoutLabel;
