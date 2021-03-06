import React from "react";

const Select = ({
  name,
  label,
  options,
  error,
  dataTextfield,
  dataValuefield,
  optionsLabel,
  ...rest
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} {...rest} className="form-control">
        <option value="">{optionsLabel}</option>
        {options.map((option) => (
          <option key={option[dataValuefield]} value={option[dataValuefield]}>
            {option[dataTextfield]}
          </option>
        ))}
      </select>
      {error && <label className="text-danger">{error}</label>}
    </div>
  );
};

export default Select;
