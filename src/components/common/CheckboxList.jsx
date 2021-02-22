import React from "react";

const CheckBoxList = ({ name, label, error, itemList, ...rest }) => {
  return (
    <React.Fragment>
      <label htmlFor={name}>{label}</label>
      <br />
      {itemList.length > 0 &&
        itemList.map((item) => (
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
      {itemList.length === 0 && (
        <span>No record available to make selection</span>
      )}
      <br />
      {error && <label className="text-danger">{error}</label>}
    </React.Fragment>
  );
};

export default CheckBoxList;
