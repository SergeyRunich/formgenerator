import React, { useState, useEffect } from 'react';
import "./App.css";
import formConfig from "./formConfig.json";
import { v4 as uuid_v4 } from "uuid";

interface FormConfigItem {
  id: string;
  type: string;
  name: string;
  options?: string[];
  validation?: {
    required?: boolean;
    regexp?: string;
  };
}

// adding unique identifiers for each input to keep track in React
const _formConfig: FormConfigItem[] = formConfig.map((el) => ({
  ...el,
  id: uuid_v4(),
}));

function App() {
  const [values, setValues] = useState<any>({});
  const [validation, setValidation] = useState<any>({});

  useEffect(() => {
    let initialValidation: any = {}
    _formConfig.forEach(el => initialValidation[el.id] = true)
    setValidation(initialValidation)
  }, []);

  const validate = () => {
    let validation: any = {};

    _formConfig.forEach((el) => {
      const value: any = values[el.id];

      if (el.validation && el.validation.required && !value)
        validation[el.id] = false;
      else if (el.validation && el.validation.regexp) {
        const regexp = new RegExp(el.validation.regexp);
        const isValid = regexp.test(value);
        validation[el.id] = isValid;
      } else validation[el.id] = true;
    });

    return validation;
  };

  const formSubmit = () => {
    const validation = validate();
    setValidation(validation);
    console.log(validation);
    const hasErrors = Object.values(validation).includes(false);
    if (hasErrors) return;

    alert( "Form is valid" + "  " + Object.entries(validation));
  };

  const renderInput = (el: any) => {
    switch (el.type) {
      case "text":
        return (
          <input
            className={!validation[el.id] ? "invalid" : "" }
            key={el.id}
            type={el.type}
            placeholder={el.placeholder}
            value={values[el.name]}
            onChange={(e) => setValues({ ...values, [el.id]: e.target.value })}
          />
        );

      case "radio":
        return (
          <div key={el.id}>
            {el.options.map((option: any, i: number) => (
              <label className={!validation[el.id] ? "invalid" : "" } key={i}>
                <input
                  type="radio"
                  name={el.name}
                  checked={values[el.id] === option}
                  onChange={(e) => setValues({ ...values, [el.id]: option })}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "select":
        return (
          <select
            key={el.id}
            className={!validation[el.id] ? "invalid" : "" }
            onChange={(e) => setValues({ ...values, [el.id]: e.target.value })}
          >
            {el.options.map((option: any, i: any) => (
              <option key={i} value={values[el.id]}>
                {option}
              </option>
            ))}
          </select>
        );

        case "checkbox":
          return (
            <label className={!validation[el.id] ? "invalid" : "" } key={el.id}>
              <input
                key={el.id}
                type="checkbox"
                checked={values[el.id]}
                onChange={(e) =>
                  setValues({ ...values, [el.id]: e.target.checked })
                }
              />
              {el.text}
            </label>
          );
    }
  };

  return (
    <div className="App">
      <form>
        {_formConfig.map(renderInput)}
        <div className="submitBtn" onClick={() => formSubmit()}>Submit</div>
      </form>
    </div>
  );
}

export default App;
