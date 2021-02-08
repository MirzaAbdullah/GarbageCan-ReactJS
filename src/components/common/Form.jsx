import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import InputWithoutLabel from "./InputWithoutLabel";
import Select from "./Select";
import SelectWithoutLabel from "./SelectWithoutLabel";
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
}

export default Form;
