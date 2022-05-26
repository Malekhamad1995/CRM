import * as React from 'react';
import NumberFormat from 'react-number-format';

export const NumberFormatCustomComponent = React.forwardRef((
  props,
  ref
) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
     // allowNegative={false}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props && props.name,
            value: (props && props.type === 'isnumber' ? parseFloat(values.value) : values.value)
          }
        });
      }}
      thousandSeparator
      decimalScale={2}
      prefix=''
    />
  );
});


export const NumberFormatPersantageComponent = React.forwardRef((
  props,
  ref
) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      allowNegative={false}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props && props.name,
            value: (props && props.type === 'isnumber' ? parseFloat(values.value) : values.value)
          }
        });
      }}
      thousandSeparator
      decimalScale={8}
      prefix=''
    />
  );
});
