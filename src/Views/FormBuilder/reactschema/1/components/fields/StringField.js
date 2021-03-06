import React from "react";
import PropTypes from "prop-types";

import {
  getWidget,
  getUiOptions,
  optionsList,
  getDefaultRegistry,
} from "../../utils";

function StringField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    registry = getDefaultRegistry(),
  } = props;
  const { title, format } = schema;
  const { widgets, formContext } = registry;
  const enumOptions = Array.isArray(schema.enum) && optionsList(schema);
  const defaultWidget = format || (enumOptions ? "select" : "text");
  const { widget = defaultWidget, placeholder = "", ...options } = getUiOptions(
    uiSchema
  );
  const Widget = getWidget(schema, widget, widgets);

  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      id={idSchema && idSchema.$id}
      label={title === undefined ? name : title}
      value={formData}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      disabled={disabled}
      readonly={readonly}
      formContext={formContext}
      autofocus={autofocus}
      registry={registry}
      placeholder={placeholder}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  StringField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    formData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
    formContext: PropTypes.object.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
  };
}

StringField.defaultProps = {
  uiSchema: {},
  registry: null,
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default StringField;
