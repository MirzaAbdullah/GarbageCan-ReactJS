import React from "react";

const CheckBoxList = ({ name, error, itemList }) => {
  return (
    <React.Fragment>
      {itemList.map((item) => (
        <div key={item.idItem} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={item.idItem}
            value={item.idItem}
            name={name}
          />
          <label className="form-check-label" htmlFor={item.idItem}>
            {item.itemName}
          </label>
        </div>
      ))}
      {error && <label className="text-danger">{error}</label>}
    </React.Fragment>
  );
};

export default CheckBoxList;
