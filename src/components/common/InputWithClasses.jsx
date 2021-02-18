import React from "react";

const InputWithClasses = ({ name, label, extraClasses, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        {...rest}
        className={`form-control ${extraClasses}`}
      />
      {error && <label className="text-danger">{error}</label>}
    </div>
  );
};

export default InputWithClasses;
