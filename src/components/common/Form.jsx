import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import InputWithoutLabel from "./InputWithoutLabel";
import InputWithClasses from "./InputWithClasses";
import Select from "./Select";
import SelectWithoutLabel from "./SelectWithoutLabel";
import CheckBoxList from "./CheckboxList";
import { Fragment } from "react";

class Form extends Component {
  state = {
    data: {},
    error: {},
  };

  // to Update the state when their is change in input field
  handleChange = ({ currentTarget: input }) => {
    const { data, errors } = this.state;

    const errorsArr = { ...errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errorsArr[input.name] = errorMessage;
    else delete errorsArr[input.name];

    const dataArr = { ...data };
    dataArr[input.name] = input.value;

    this.setState({ data: dataArr, errors: errorsArr });
  };

  validateProperty = ({ name, value }) => {
    //To build dynamic property to validate per field
    const property = { [name]: value };

    //To define dynamic schema only for per field
    const schema = { [name]: this.schema[name] };

    //Pass params to JOI
    const { error } = Joi.validate(property, schema);

    return error ? error.details[0].message : null;
  };

  handleChangeCheckboxList = (event) => {
    const { checkboxList } = this.state;

    let processedItems = [...checkboxList];

    //Finding index of the selected checkbox from the list of Items
    let itemIndex = processedItems.findIndex(
      (item) => item.idItem === event.target.id
    );

    //Updating the isChecked flag of checkbox to true / false based on previous flag state
    processedItems[itemIndex].isChecked = !processedItems[itemIndex].isChecked;

    /*
     * Processing the cloned CheckboxList to get only those id's whose isChecked flag is true
     * and setting data.pickupItems in state object
     */
    let selectedItems = [];
    processedItems.forEach((item) => {
      if (item.isChecked) {
        selectedItems.push(item.idItem);
      }
    });

    this.setState({
      checkboxList: processedItems,
      checkboxListSelection: selectedItems,
    });
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  handleSubmit_LoginForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_LoginForm();
  };

  handleSubmit_RegisterForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_RegisterForm();
  };

  handleSubmit_ForgetPasswordForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_ForgetPasswordForm();
  };

  handleSubmit_ChangePasswordForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_ChangePasswordForm();
  };

  handleSubmit_VerifyAccountForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_VerifyAccountForm();
  };

  handleSubmit_AddressForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_AddressForm();
  };

  handleSubmit_PickupUpdateByDriverForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_PickupUpdateByDriverForm();
  };

  handleSubmit_AssignPickupForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    //If All Fields are Validated
    let errors = this.validate();

    //Case only for checkbox List
    if (this.state.checkboxListSelection.length === 0 && errors === null) {
      errors = {
        ...errors,
        ItemCheckboxList: "Please select atleast one pickup item.",
      };
    }

    //Update errors state
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_AssignPickupForm();
  };

  handleSubmit_PickupRequestForm = (e) => {
    //Prevent from default behaviour of form submission
    e.preventDefault();

    //If All Fields are Validated
    let errors = this.validate();

    //Case only for checkbox List
    if (this.state.checkboxListSelection.length === 0 && errors === null) {
      errors = {
        ...errors,
        ItemCheckboxList: "Please select atleast one pickup item.",
      };
    }

    //Update errors state
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit_PickupRequestForm();
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderCustomButton(label, customClass, loadingSpinner) {
    return (
      <Fragment>
        <button disabled={this.validate()} className={customClass}>
          {loadingSpinner && (
            <span
              className="spinner-border"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          &nbsp;&nbsp;
          {label}
        </button>
      </Fragment>
    );
  }

  renderInput(name, label, type, placeholder) {
    //object destructuring
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        value={data[name]}
        type={type}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        placeholder={placeholder}
      />
    );
  }

  renderInputDisable(name, label, type, placeholder, isDisabled) {
    //object destructuring
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        value={data[name]}
        type={type}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        placeholder={placeholder}
        disabled={isDisabled}
      />
    );
  }

  renderInputWithoutLabel(name, label, type, placeholder) {
    //object destructuring
    const { data, errors } = this.state;

    return (
      <InputWithoutLabel
        name={name}
        value={data[name]}
        type={type}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        placeholder={placeholder}
      />
    );
  }

  renderInputWithClasses(name, label, extraClasses, type, placeholder) {
    //object destructuring
    const { data, errors } = this.state;

    return (
      <InputWithClasses
        name={name}
        value={data[name]}
        extraClasses={extraClasses}
        type={type}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        placeholder={placeholder}
      />
    );
  }

  renderSelect(
    name,
    label,
    options,
    dataTextfield,
    dataValuefield,
    optionsLabel
  ) {
    //object destructuring
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        dataTextfield={dataTextfield}
        dataValuefield={dataValuefield}
        optionsLabel={optionsLabel}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderSelectWithoutLabel(
    name,
    label,
    options,
    dataTextfield,
    dataValuefield
  ) {
    //object destructuring
    const { data, errors } = this.state;

    return (
      <SelectWithoutLabel
        name={name}
        value={data[name]}
        label={label}
        options={options}
        dataTextfield={dataTextfield}
        dataValuefield={dataValuefield}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderCheckboxList(name, label, itemList) {
    //object destructuring
    const { errors } = this.state;

    return (
      <CheckBoxList
        name={name}
        label={label}
        itemList={itemList}
        onChange={this.handleChangeCheckboxList}
        error={errors[name]}
      />
    );
  }
}

export default Form;
