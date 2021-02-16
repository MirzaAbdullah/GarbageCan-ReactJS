import React from "react";

const CheckBoxList = ({ name, label, error, itemList, ...rest }) => {
  return (
    <React.Fragment>
      <label htmlFor={name}>{label}</label>
      <br />
      {itemList.map((item) => (
        <div key={item.idItem} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={item.idItem}
            value={item.idItem}
            name={name}
            checked={item.isChecked}
            {...rest}
          />
          <label className="form-check-label" htmlFor={item.idItem}>
            {item.itemName}
          </label>
        </div>
      ))}
      <br />
      {error && <label className="text-danger">{error}</label>}
    </React.Fragment>
  );
};

export default CheckBoxList;
