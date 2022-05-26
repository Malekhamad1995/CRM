const _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

const _Object$defineProperty = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports.default = void 0;

const _extends2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/extends'));

const _objectWithoutProperties2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/objectWithoutProperties'));

const _stringify = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/json/stringify'));

const _react = _interopRequireDefault(require('react'));

const _propTypes = _interopRequireDefault(require('prop-types'));

function BaseInput(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id)
    throw new Error('no id for props '.concat((0, _stringify.default)(props)));


  const { value } = props;
      const { readonly } = props;
      const { disabled } = props;
      const { autofocus } = props;
      const { onBlur } = props;
      const { onFocus } = props;
      const { options } = props;
      const { schema } = props;
      const inputProps = (0, _objectWithoutProperties2.default)(props, ['value', 'readonly', 'disabled', 'autofocus', 'onBlur', 'onFocus', 'options', 'schema', 'formContext', 'registry', 'rawErrors']); // If options.inputType is set use that as the input type

  if (options.inputType)
    inputProps.type = options.inputType;
   else if (!inputProps.type) {
    // If the schema is of type number or integer, set the input type to number
    if (schema.type === 'number') {
      inputProps.type = 'number'; // Setting step to 'any' fixes a bug in Safari where decimals are not
      // allowed in number inputs

      inputProps.step = 'any';
    } else if (schema.type === 'integer') {
      inputProps.type = 'number'; // Since this is integer, you always want to step up or down in multiples
      // of 1

      inputProps.step = '1';
    } else
      inputProps.type = 'text';
  } // If multipleOf is defined, use this as the step value. This mainly improves
  // the experience for keyboard users (who can use the up/down KB arrows).


  if (schema.multipleOf)
    inputProps.step = schema.multipleOf;


  if (typeof schema.minimum !== 'undefined')
    inputProps.min = schema.minimum;


  if (typeof schema.maximum !== 'undefined')
    inputProps.max = schema.maximum;


  const _onChange = function _onChange(_ref) {
    const { value } = _ref.target;
    return props.onChange(value === '' ? options.emptyValue : value);
  };

  return _react.default.createElement('input', (0, _extends2.default)({
    className: 'form-control',
    readOnly: readonly,
    disabled,
    autoFocus: autofocus,
    value: value == null ? '' : value
  }, inputProps, {
    onChange: _onChange,
    onBlur: onBlur && function (event) {
      return onBlur(inputProps.id, event.target.value);
    },
    onFocus: onFocus && function (event) {
      return onFocus(inputProps.id, event.target.value);
    }
  }));
}

BaseInput.defaultProps = {
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
};

if (process.env.NODE_ENV !== 'production') {
  BaseInput.propTypes = {
    id: _propTypes.default.string.isRequired,
    placeholder: _propTypes.default.string,
    value: _propTypes.default.any,
    required: _propTypes.default.bool,
    disabled: _propTypes.default.bool,
    readonly: _propTypes.default.bool,
    autofocus: _propTypes.default.bool,
    onChange: _propTypes.default.func,
    onBlur: _propTypes.default.func,
    onFocus: _propTypes.default.func
  };
}

const _default = BaseInput;
exports.default = _default;
