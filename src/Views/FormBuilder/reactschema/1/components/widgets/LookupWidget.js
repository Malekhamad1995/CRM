import React, { useEffect, useState } from 'react';
import { asNumber } from '../../utils';
import { lookupTypesGet } from '../../../../../../Services';

function processValue({ type, items }, value) {
  // if (value === "") {
  //   return undefined;
  // } else if (
  //     type === "array" &&
  //     items &&
  //     ["number", "integer"].includes(items.type)
  // ) {
  //   return value.map(asNumber);
  // } else if (type === "boolean") {
  //   return value === "true";
  // } else if (type === "number") {
  //   return asNumber(value);
  // }
  return asNumber(value);
}

function getValue(event) {
  return event.target.value;
}

function LookupWidget(props) {
  const [enumOptions, setenumOptions] = useState([]);
  const getData = async () => {
    const res = await lookupTypesGet({ pageIndex: 1, pageSize: 1000, searchedItem: '' });
    setenumOptions(res.result);
  };
  useEffect(() => {
    getData();
  }, []);
  const {
    schema,
    id,
    // options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    //  placeholder,
  } = props;
  return (
    <select
      id={id}
      className='form-control'
      value={typeof value === 'undefined' ? '' : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={
        onBlur &&
        ((event) => {
          const newValue = getValue(event);
          onBlur(id, processValue(schema, newValue));
        })
      }
      onChange={(event) => {
        const newValue = getValue(event, multiple);
        onChange(processValue(schema, newValue));
      }}
    >
      <option value=''>--Select Type--</option>
      {enumOptions.map(({ lookupTypeId, lookupTypeName }, i) => (
        <option index={i} value={lookupTypeId}>
          {lookupTypeName}
        </option>
      ))}
    </select>
  );
}

export default LookupWidget;
