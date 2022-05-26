import React, { useEffect, useState } from 'react';
import { asNumber } from '../../utils';
import { lookupItemsGet } from '../../../../../../Services';

function processValue({ type, items }, value) {
  return asNumber(value);
}
function getValue(event) {
  return event.target.value;
}
function LookupItemWidget(props) {
  const { lookupTypeName } = props.schema;
  const { lookupParentId } = props.schema;

  const [enumOptions, setenumOptions] = useState([]);
  const getData = async () => {
    const res = await lookupItemsGet({ lookupTypeName, lookupParentId });
    if (!(res && res.status && res.status !== 200)) setenumOptions(res.result);
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
 schema, id, value, required, disabled, readonly, multiple, autofocus, onChange, onBlur
} =
    props;
  return (
    <select
      id={id}
      className='form-control'
      value={typeof value === 'undefined' ? '' : value}
      required={required}
      disabled={disabled || readonly}
      // eslint-disable-next-line jsx-a11y/no-autofocus
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
      {enumOptions &&
        enumOptions.map(({ lookupItemId, lookupItemName }, i) => (
          <option index={i} value={lookupItemId}>
            {lookupItemName}
          </option>
        ))}
    </select>
  );
}

export default LookupItemWidget;
