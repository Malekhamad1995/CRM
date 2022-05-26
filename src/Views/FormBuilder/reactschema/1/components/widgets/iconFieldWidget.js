/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import Icons from '../../../../../../assets/json/icons.json';
import { AutocompleteComponent } from '../../../../../../Components/Controls';

function iconFieldWidget(props) {
  const { name } = props.schema;

  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    placeholder,
  } = props;

  return (
    <AutocompleteComponent
      inputClasses='inputs theme-form-builder'
      displayLabel={(option) => option.name}
      renderOption={(option) => (
        <>
          <span className={`mdi mdi-${option.name}`}>{option.name}</span>
        </>
      )}
      data={Icons}
      withoutSearchButton
      onChange={(event, newValue) => {
        if (newValue) onChange(newValue.name);
        else onChange('');
      }}
      selectedValues={Icons.find((f) => f.name === value) || null}
      multiple={false}
    />
  );
}

export default iconFieldWidget;
