const _interopRequireWildcard = require('@babel/runtime-corejs2/helpers/interopRequireWildcard');

const _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

const _Object$defineProperty = require('@babel/runtime-corejs2/core-js/object/define-property');

// _Object$defineProperty(exports, "__esModule", {
//   value: true
// });
//
// exports.getDefaultRegistry = getDefaultRegistry;
// exports.getSchemaType = getSchemaType;
// exports.getWidget = getWidget;
// exports.hasWidget = hasWidget;
// exports.getDefaultFormState = getDefaultFormState;
// exports.getUiOptions = getUiOptions;
// exports.isObject = isObject;
// exports.mergeObjects = mergeObjects;
// exports.asNumber = asNumber;
// exports.orderProperties = orderProperties;
// exports.isConstant = isConstant;
// exports.toConstant = toConstant;
// exports.isSelect = isSelect;
// exports.isMultiSelect = isMultiSelect;
// exports.isFilesArray = isFilesArray;
// exports.isFixedItems = isFixedItems;
// exports.allowAdditionalItems = allowAdditionalItems;
// exports.optionsList = optionsList;
// exports.stubExistingAdditionalProperties = stubExistingAdditionalProperties;
// exports.resolveSchema = resolveSchema;
// exports.retrieveSchema = retrieveSchema;
// exports.deepEquals = deepEquals;
// exports.shouldRender = shouldRender;
// exports.toIdSchema = toIdSchema;
// exports.toPathSchema = toPathSchema;
// exports.parseDateString = parseDateString;
// exports.toDateString = toDateString;
// exports.pad = pad;
// exports.setState = setState;
// exports.dataURItoBlob = dataURItoBlob;
// exports.rangeSpec = rangeSpec;
// exports.getMatchingOption = getMatchingOption;
// exports.guessType = exports.ADDITIONAL_PROPERTY_FLAG = void 0;

const _toPrimitive2 = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/symbol/to-primitive'));

const _setImmediate2 = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/set-immediate'));

const _set = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/set'));

const _from = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/array/from'));

const _getIterator2 = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/get-iterator'));

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/toConsumableArray'));

const _isNan = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/number/is-nan'));

const _assign = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/object/assign'));

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/defineProperty'));

const _isArray = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/array/is-array'));

const _keys = _interopRequireDefault(require('@babel/runtime-corejs2/core-js/object/keys'));

const _typeof2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/typeof'));

const _extends2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/extends'));

const _objectSpread3 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/objectSpread'));

const _objectWithoutProperties2 = _interopRequireDefault(require('@babel/runtime-corejs2/helpers/objectWithoutProperties'));

const _react = _interopRequireDefault(require('react'));

const ReactIs = _interopRequireWildcard(require('react-is'));

const _fill = _interopRequireDefault(require('core-js/library/fn/array/fill'));

const _validate = _interopRequireWildcard(require('./validate'));

function _toPropertyKey(arg) { const key = _toPrimitive(arg, 'string'); return (0, _typeof2.default)(key) === 'symbol' ? key : String(key); }

function _toPrimitive(input, hint) { if ((0, _typeof2.default)(input) !== 'object' || input === null) return input; const prim = input[_toPrimitive2.default]; if (prim !== undefined) { const res = prim.call(input, hint || 'default'); if ((0, _typeof2.default)(res) !== 'object') return res; throw new TypeError('@@toPrimitive must return a primitive value.'); } return (hint === 'string' ? String : Number)(input); }

export const ADDITIONAL_PROPERTY_FLAG = '__additional_property';
const widgetMap = {
  boolean: {
    checkbox: 'CheckboxWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    hidden: 'HiddenWidget'
  },
  string: {
    text: 'TextWidget',
    password: 'PasswordWidget',
    email: 'EmailWidget',
    hostname: 'TextWidget',
    ipv4: 'TextWidget',
    ipv6: 'TextWidget',
    uri: 'URLWidget',
    'data-url': 'FileWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    country: 'CountryWidget',
    phone: 'PhoneWidget',
    communication: 'CommunicationWidget',
    address: 'AddressWidget',
    searchField: 'SearchFieldWidget',
    rangeField: 'RangeFieldWidget',
    PriceAndPercentage: 'PriceAndPercentageWidget',
    UploadFiles: 'UploadFilesWidget',
    UnitsModels: 'UnitsModelsWidget',
    StepValidation: 'StepValidationWidget',
    MapField: 'MapField',
    textarea: 'TextareaWidget',
    hidden: 'HiddenWidget',
    date: 'DateWidget',
    datetime: 'DateTimeWidget',
    'date-time': 'DateTimeWidget',
    'alt-date': 'AltDateWidget',
    'alt-datetime': 'AltDateTimeWidget',
    color: 'ColorWidget',
    file: 'FileWidget'
  },
  number: {
    text: 'TextWidget',
    select: 'SelectWidget',
    country: 'CountryWidget',
    phone: 'PhoneWidget',
    address: 'AddressWidget',
    searchField: 'SearchFieldWidget',
    rangeField: 'RangeFieldWidget',
    PriceAndPercentage: 'PriceAndPercentageWidget',
    UploadFiles: 'UploadFilesWidget',
    UnitsModels: 'UnitsModelsWidget',
    StepValidation: 'StepValidationWidget',
    MapField: 'MapField',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget'
  },
  integer: {
    text: 'TextWidget',
    select: 'SelectWidget',
    country: 'CountryWidget',
    phone: 'PhoneWidget',
    communication: 'CommunicationWidget',
    communication: 'AddressWidget',
    searchField: 'SearchFieldWidget',
    rangeField: 'RangeFieldWidget',
    PriceAndPercentage: 'PriceAndPercentageWidget',
    UploadFiles: 'UploadFilesWidget',
    UnitsModels: 'UnitsModelsWidget',
    StepValidation: 'StepValidationWidget',
    MapField: 'MapField',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget'
  },
  array: {
    select: 'SelectWidget',
    country: 'CountryWidget',
    checkboxes: 'CheckboxesWidget',
    files: 'FileWidget',
    hidden: 'HiddenWidget'
  }
};

export function getDefaultRegistry() {
  return {
    fields: require('./components/fields').default,
    widgets: require('./components/widgets').default,
    definitions: {},
    formContext: {}
  };
}

export function getSchemaType(schema) {
  const { type } = schema;

  if (!type && schema.const)
    return guessType(schema.const);


  if (!type && schema.enum)
    return 'string';


  if (!type && (schema.properties || schema.additionalProperties))
    return 'object';


  if (type instanceof Array && type.length === 2 && type.includes('null'))
    return type.find((type) => type !== 'null');


  return type;
}

export function getWidget(schema, widget) {
  const registeredWidgets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const type = getSchemaType(schema);

  function mergeOptions(Widget) {
    // cache return value as property of widget for proper react reconciliation
    if (!Widget.MergedWidget) {
      // eslint-disable-next-line
      var defaultOptions = Widget.defaultProps && Widget.defaultProps.options || {};

      Widget.MergedWidget = function (_ref) {
        const _ref$options = _ref.options;
            const options = _ref$options === void 0 ? {} : _ref$options;
            const props = (0, _objectWithoutProperties2.default)(_ref, ['options']);
        return _react.default.createElement(Widget, (0, _extends2.default)({
          options: (0, _objectSpread3.default)({}, defaultOptions, options)
        }, props));
      };
    }

    return Widget.MergedWidget;
  }

  if (typeof widget === 'function' || ReactIs.isForwardRef(widget))
    return mergeOptions(widget);


  if (typeof widget !== 'string')
    throw new Error('Unsupported widget definition: '.concat((0, _typeof2.default)(widget)));


  if (registeredWidgets.hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widget];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  if (!widgetMap.hasOwnProperty(type))
    throw new Error('No widget for type "'.concat(type, '"'));


  if (widgetMap[type].hasOwnProperty(widget)) {
    const _registeredWidget = registeredWidgets[widgetMap[type][widget]];
    return getWidget(schema, _registeredWidget, registeredWidgets);
  }

  throw new Error('No widget "'.concat(widget, '" for type "').concat(type, '"'));
}

export function hasWidget(schema, widget) {
  const registeredWidgets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    getWidget(schema, widget, registeredWidgets);
    return true;
  } catch (e) {
    if (e.message && (e.message.startsWith('No widget') || e.message.startsWith('Unsupported widget')))
      return false;


    throw e;
  }
}

export function computeDefaults(schema, parentDefaults, definitions) {
  const rawFormData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const includeUndefinedValues = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  const formData = isObject(rawFormData) ? rawFormData : {}; // Compute the defaults recursively: give highest priority to deepest nodes.

  let defaults = parentDefaults;

  if (isObject(defaults) && isObject(schema.default)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeObjects(defaults, schema.default);
  } else if ('default' in schema) {
    // Use schema defaults for this node.
    defaults = schema.default;
  } else if ('$ref' in schema) {
    // Use referenced schema defaults for this node.
    const refSchema = findSchemaDefinition(schema.$ref, definitions);
    return computeDefaults(refSchema, defaults, definitions, formData, includeUndefinedValues);
  } else if ('dependencies' in schema) {
    const resolvedSchema = resolveDependencies(schema, definitions, formData);
    return computeDefaults(resolvedSchema, defaults, definitions, formData, includeUndefinedValues);
  } else if (isFixedItems(schema))
    defaults = schema.items.map((itemSchema) => computeDefaults(itemSchema, undefined, definitions, formData, includeUndefinedValues));
   else if ('oneOf' in schema)
    schema = schema.oneOf[getMatchingOption(undefined, schema.oneOf, definitions)];
   else if ('anyOf' in schema)
    schema = schema.anyOf[getMatchingOption(undefined, schema.anyOf, definitions)];
   // Not defaults defined for this node, fallback to generic typed ones.


  if (typeof defaults === 'undefined')
    defaults = schema.default;

// eslint-disable-next-line
  switch (getSchemaType(schema)) {
    // We need to recur for object schema inner default values.
    case 'object':
      return (0, _keys.default)(schema.properties || {}).reduce((acc, key) => {
        // Compute the defaults for this node, with the parent defaults we might
        // have from a previous run: defaults[key].
        const computedDefault = computeDefaults(schema.properties[key], (defaults || {})[key], definitions, (formData || {})[key], includeUndefinedValues);

        if (includeUndefinedValues || computedDefault !== undefined)
          acc[key] = computedDefault;


        return acc;
      }, {});

    case 'array':
      if (schema.minItems) {
        if (!isMultiSelect(schema, definitions)) {
          const defaultsLength = defaults ? defaults.length : 0;

          if (schema.minItems > defaultsLength) {
            const defaultEntries = defaults || []; // populate the array with the defaults

            const fillerSchema = (0, _isArray.default)(schema.items) ? schema.additionalItems : schema.items;
            const fillerEntries = (0, _fill.default)(new Array(schema.minItems - defaultsLength), computeDefaults(fillerSchema, fillerSchema.defaults, definitions)); // then fill up the rest with either the item default or empty, up to minItems

            return defaultEntries.concat(fillerEntries);
          }
        } else
          return defaults || [];
      }
  }

  return defaults;
}

export function getDefaultFormState(_schema, formData) {
  const definitions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const includeUndefinedValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!isObject(_schema))
    throw new Error(`Invalid schema: ${_schema}`);


  const schema = retrieveSchema(_schema, definitions, formData);
  const defaults = computeDefaults(schema, _schema.default, definitions, formData, includeUndefinedValues);

  if (typeof formData === 'undefined') {
    // No form data? Use schema defaults.
    return defaults;
  }

  if (isObject(formData)) {
    // Override schema defaults with form data.
    return mergeObjects(defaults, formData);
  }

  if (formData === 0)
    return formData;


  return formData || defaults;
}

export function getUiOptions(uiSchema) {
  // get all passed options from ui:widget, ui:options, and ui:<optionName>
  return (0, _keys.default)(uiSchema).filter((key) => key.indexOf('ui:') === 0).reduce((options, key) => {
    const value = uiSchema[key];

    if (key === 'ui:widget' && isObject(value)) {
      console.warn('Setting options via ui:widget object is deprecated, use ui:options instead');
      return (0, _objectSpread3.default)({}, options, value.options || {}, {
        widget: value.component
      });
    }

    if (key === 'ui:options' && isObject(value))
      return (0, _objectSpread3.default)({}, options, value);


    return (0, _objectSpread3.default)({}, options, (0, _defineProperty2.default)({}, key.substring(3), value));
  }, {});
}

export function isObject(thing) {
  if (typeof File !== 'undefined' && thing instanceof File)
    return false;


  return (0, _typeof2.default)(thing) === 'object' && thing !== null && !(0, _isArray.default)(thing);
}

export function mergeObjects(obj1, obj2) {
  const concatArrays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // Recursively merge deeply nested objects.
  const acc = (0, _assign.default)({}, obj1); // Prevent mutation of source object.

  return (0, _keys.default)(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {};
        const right = obj2[key];

    if (obj1 && obj1.hasOwnProperty(key) && isObject(right))
      acc[key] = mergeObjects(left, right, concatArrays);
     else if (concatArrays && (0, _isArray.default)(left) && (0, _isArray.default)(right))
      acc[key] = left.concat(right);
     else
      acc[key] = right;


    return acc;
  }, acc);
}

export function asNumber(value) {
  if (value === '')
    return undefined;


  if (value === null)
    return null;


  if (/\.$/.test(value)) {
    // "3." can't really be considered a number even if it parses in js. The
    // user is most likely entering a float.
    return value;
  }

  if (/\.0$/.test(value)) {
    // we need to return this as a string here, to allow for input like 3.07
    return value;
  }

  const n = Number(value);
  const valid = typeof n === 'number' && !(0, _isNan.default)(n);

  if (/\.\d*0$/.test(value)) {
    // It's a number, that's cool - but we need it as a string so it doesn't screw
    // with the user when entering dollar amounts or other values (such as those with
    // specific precision or number of significant digits)
    return value;
  }

  return valid ? n : value;
}

export function orderProperties(properties, order) {
  if (!(0, _isArray.default)(order))
    return properties;


  const arrayToHash = function arrayToHash(arr) {
    return arr.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
  };

  const errorPropList = function errorPropList(arr) {
    return arr.length > 1 ? "properties '".concat(arr.join("', '"), "'") : "property '".concat(arr[0], "'");
  };

  const propertyHash = arrayToHash(properties);
  const extraneous = order.filter((prop) => prop !== '*' && !propertyHash[prop]);

  if (extraneous.length)
    console.warn('uiSchema order list contains extraneous '.concat(errorPropList(extraneous)));


  const orderFiltered = order.filter((prop) => prop === '*' || propertyHash[prop]);
  const orderHash = arrayToHash(orderFiltered);
  const rest = properties.filter((prop) => !orderHash[prop]);
  const restIndex = orderFiltered.indexOf('*');

  if (restIndex === -1) {
    if (rest.length)
      throw new Error('uiSchema order list does not contain '.concat(errorPropList(rest)));


    return orderFiltered;
  }

  if (restIndex !== orderFiltered.lastIndexOf('*'))
    throw new Error('uiSchema order list contains more than one wildcard item');


  const complete = (0, _toConsumableArray2.default)(orderFiltered);
  complete.splice.apply(complete, [restIndex, 1].concat((0, _toConsumableArray2.default)(rest)));
  return complete;
}
/**
 * This function checks if the given schema matches a single
 * constant value.
 */


export function isConstant(schema) {
  // eslint-disable-next-line
  return (0, _isArray["default"])(schema["enum"]) && schema["enum"].length === 1 || schema.hasOwnProperty("const");
}

export function toConstant(schema) {
  if ((0, _isArray.default)(schema.enum) && schema.enum.length === 1)
    return schema.enum[0];
   if (schema.hasOwnProperty('const'))
    return schema.const;

    throw new Error('schema cannot be inferred as a constant');
}

export function isSelect(_schema) {
  const definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const schema = retrieveSchema(_schema, definitions);
  const altSchemas = schema.oneOf || schema.anyOf;

  if ((0, _isArray.default)(schema.enum))
    return true;
   if ((0, _isArray.default)(altSchemas))
    return altSchemas.every((altSchemas) => isConstant(altSchemas));


  return false;
}

export function isMultiSelect(schema) {
  const definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!schema.uniqueItems || !schema.items)
    return false;


  return isSelect(schema.items, definitions);
}

export function isFilesArray(schema, uiSchema) {
  const definitions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (uiSchema['ui:widget'] === 'files')
    return true;
   if (schema.items) {
    const itemsSchema = retrieveSchema(schema.items, definitions);
    return itemsSchema.type === 'string' && itemsSchema.format === 'data-url';
  }

  return false;
}

export function isFixedItems(schema) {
  return (0, _isArray.default)(schema.items) && schema.items.length > 0 && schema.items.every((item) => isObject(item));
}

export function allowAdditionalItems(schema) {
  if (schema.additionalItems === true)
    console.warn('additionalItems=true is currently not supported');


  return isObject(schema.additionalItems);
}

export function optionsList(schema) {
  if (schema.enum) {
    return schema.enum.map((value, i) => {
      // eslint-disable-next-line
      var label = schema.enumNames && schema.enumNames[i] || String(value);
      return {
        label,
        value
      };
    });
  }
    const altSchemas = schema.oneOf || schema.anyOf;
    return altSchemas.map((schema, i) => {
      const value = toConstant(schema);
      const label = schema.title || String(value);
      return {
        label,
        value
      };
    });
}

export function findSchemaDefinition($ref) {
  const definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Extract and use the referenced definition if we have it.
  const match = /^#\/definitions\/(.*)$/.exec($ref);

  if (match && match[1]) {
    const parts = match[1].split('/');
    let current = definitions;
    let _iteratorNormalCompletion = true;
    let _didIteratorError = false;
    let _iteratorError;

    try {
      for (var _iterator = (0, _getIterator2.default)(parts), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let part = _step.value;
        part = part.replace(/~1/g, '/').replace(/~0/g, '~');

        while (current.hasOwnProperty('$ref'))
          current = findSchemaDefinition(current.$ref, definitions);


        if (current.hasOwnProperty(part))
          current = current[part];
         else {
          // No matching definition found, that's an error (bogus schema?)
          throw new Error('Could not find a definition for '.concat($ref, '.'));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null)
          _iterator.return();
      } finally {
        if (_didIteratorError)
          throw _iteratorError;
      }
    }

    return current;
  } // No matching definition found, that's an error (bogus schema?)


  throw new Error('Could not find a definition for '.concat($ref, '.'));
} // In the case where we have to implicitly create a schema, it is useful to know what type to use
//  based on the data we are defining


export function guessType(value) {
  if ((0, _isArray.default)(value))
    return 'array';
   if (typeof value === 'string')
    return 'string';
   if (value == null)
    return 'null';
   if (typeof value === 'boolean')
    return 'boolean';
   if (!isNaN(value))
    return 'number';
   if ((0, _typeof2.default)(value) === 'object')
    return 'object';
   // Default to string if we can't figure it out


  return 'string';
} // This function will create new "properties" items for each key in our formData
// var guessType =(value)=> {
//   if ((0, _isArray["default"])(value)) {
//     return "array";
//   } else if (typeof value === "string") {
//     return "string";
//   } else if (value == null) {
//     return "null";
//   } else if (typeof value === "boolean") {
//     return "boolean";
//   } else if (!isNaN(value)) {
//     return "number";
//   } else if ((0, _typeof2["default"])(value) === "object") {
//     return "object";
//   } // Default to string if we can't figure it out
//
//
//   return "string";
// };


export function stubExistingAdditionalProperties(schema) {
  const definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Clone the schema so we don't ruin the consumer's original
  schema = (0, _objectSpread3.default)({}, schema, {
    properties: (0, _objectSpread3.default)({}, schema.properties)
  });
  (0, _keys.default)(formData).forEach((key) => {
    if (schema.properties.hasOwnProperty(key)) {
      // No need to stub, our schema already has the property
      return;
    }

    let additionalProperties;

    if (schema.additionalProperties.hasOwnProperty('$ref')) {
      additionalProperties = retrieveSchema({
        $ref: schema.additionalProperties.$ref
      }, definitions, formData);
    } else if (schema.additionalProperties.hasOwnProperty('type'))
      additionalProperties = (0, _objectSpread3.default)({}, schema.additionalProperties);
     else {
      additionalProperties = {
        type: guessType(formData[key])
      };
    } // The type of our new key should match the additionalProperties value;


    schema.properties[key] = additionalProperties; // Set our additional property flag so we know it was dynamically added

    schema.properties[key][ADDITIONAL_PROPERTY_FLAG] = true;
  });
  return schema;
}

export function resolveSchema(schema) {
  const definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (schema.hasOwnProperty('$ref'))
    return resolveReference(schema, definitions, formData);
   if (schema.hasOwnProperty('dependencies')) {
    const resolvedSchema = resolveDependencies(schema, definitions, formData);
    return retrieveSchema(resolvedSchema, definitions, formData);
  }
    // No $ref or dependencies attribute found, returning the original schema.
    return schema;
}

export function resolveReference(schema, definitions, formData) {
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref, definitions); // Drop the $ref property of the source schema.
// eslint-disable-next-line
  var $ref = schema.$ref,
      localSchema = (0, _objectWithoutProperties2.default)(schema, ['$ref']); // Update referenced schema definition with local schema properties.

  return retrieveSchema((0, _objectSpread3.default)({}, $refSchema, localSchema), definitions, formData);
}

export function retrieveSchema(schema) {
  const definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const resolvedSchema = resolveSchema(schema, definitions, formData);
  const hasAdditionalProperties = resolvedSchema.hasOwnProperty('additionalProperties') && resolvedSchema.additionalProperties !== false;

  if (hasAdditionalProperties)
    return stubExistingAdditionalProperties(resolvedSchema, definitions, formData);


  return resolvedSchema;
}

export function resolveDependencies(schema, definitions, formData) {
  // Drop the dependencies from the source schema.
  const _schema$dependencies = schema.dependencies;
      const dependencies = _schema$dependencies === void 0 ? {} : _schema$dependencies;
      let resolvedSchema = (0, _objectWithoutProperties2.default)(schema, ['dependencies']);

  if ('oneOf' in resolvedSchema)
    resolvedSchema = resolvedSchema.oneOf[getMatchingOption(formData, resolvedSchema.oneOf, definitions)];
   else if ('anyOf' in resolvedSchema)
    resolvedSchema = resolvedSchema.anyOf[getMatchingOption(formData, resolvedSchema.anyOf, definitions)];


  return processDependencies(dependencies, resolvedSchema, definitions, formData);
}

export function processDependencies(dependencies, resolvedSchema, definitions, formData) {
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (formData[dependencyKey] === undefined)
      continue;
     // Skip this dependency if it is not included in the schema (such as when dependencyKey is itself a hidden dependency.)


    if (resolvedSchema.properties && !(dependencyKey in resolvedSchema.properties))
      continue;


    const dependencyValue = dependencies[dependencyKey];
        const remainingDependencies = (0, _objectWithoutProperties2.default)(dependencies, [dependencyKey].map(_toPropertyKey));

    if ((0, _isArray.default)(dependencyValue))
      resolvedSchema = withDependentProperties(resolvedSchema, dependencyValue);
     else if (isObject(dependencyValue))
      resolvedSchema = withDependentSchema(resolvedSchema, definitions, formData, dependencyKey, dependencyValue);


    return processDependencies(remainingDependencies, resolvedSchema, definitions, formData);
  }

  return resolvedSchema;
}

export function withDependentProperties(schema, additionallyRequired) {
  if (!additionallyRequired)
    return schema;


  const required = (0, _isArray.default)(schema.required) ? (0, _from.default)(new _set.default([].concat((0, _toConsumableArray2.default)(schema.required), (0, _toConsumableArray2.default)(additionallyRequired)))) : additionallyRequired;
  return (0, _objectSpread3.default)({}, schema, {
    required
  });
}

export function withDependentSchema(schema, definitions, formData, dependencyKey, dependencyValue) {
  const _retrieveSchema = retrieveSchema(dependencyValue, definitions, formData);
      const { oneOf } = _retrieveSchema;
      const dependentSchema = (0, _objectWithoutProperties2.default)(_retrieveSchema, ['oneOf']);

  schema = mergeSchemas(schema, dependentSchema); // Since it does not contain oneOf, we return the original schema.

  if (oneOf === undefined)
    return schema;
   if (!(0, _isArray.default)(oneOf))
    throw new Error('invalid: it is some '.concat((0, _typeof2.default)(oneOf), ' instead of an array'));
   // Resolve $refs inside oneOf.


  const resolvedOneOf = oneOf.map((subschema) => (subschema.hasOwnProperty('$ref') ? resolveReference(subschema, definitions, formData) : subschema));
  return withExactlyOneSubschema(schema, definitions, formData, dependencyKey, resolvedOneOf);
}

export function withExactlyOneSubschema(schema, definitions, formData, dependencyKey, oneOf) {
  // eslint-disable-next-line
  var validSubschemas = oneOf.filter(function (subschema) {
    if (!subschema.properties)
      return false;


    const conditionPropertySchema = subschema.properties[dependencyKey];

    if (conditionPropertySchema) {
      const conditionSchema = {
        type: 'object',
        properties: (0, _defineProperty2.default)({}, dependencyKey, conditionPropertySchema)
      };

      const _validateFormData = (0, _validate.default)(formData, conditionSchema);
          const { errors } = _validateFormData;

      return errors.length === 0;
    }
  });

  if (validSubschemas.length !== 1) {
    console.warn("ignoring oneOf in dependencies because there isn't exactly one subschema that is valid");
    return schema;
  }

  const subschema = validSubschemas[0];
  const _subschema$properties = subschema.properties;
      const dependentSubschema = (0, _objectWithoutProperties2.default)(_subschema$properties, [dependencyKey].map(_toPropertyKey));
  const dependentSchema = (0, _objectSpread3.default)({}, subschema, {
    properties: dependentSubschema
  });
  return mergeSchemas(schema, retrieveSchema(dependentSchema, definitions, formData));
}

export function mergeSchemas(schema1, schema2) {
  return mergeObjects(schema1, schema2, true);
}

export function isArguments(object) {
  return Object.prototype.toString.call(object) === '[object Arguments]';
}

export function deepEquals(a, b) {
  const ca = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  // Partially extracted from node-deeper and adapted to exclude comparison
  // checks for functions.
  // https://github.com/othiym23/node-deeper
  if (a === b)
    return true;
   if (typeof a === 'function' || typeof b === 'function') {
    // Assume all functions are equivalent
    // see https://github.com/mozilla-services/react-jsonschema-form/issues/255
    return true;
  } if ((0, _typeof2.default)(a) !== 'object' || (0, _typeof2.default)(b) !== 'object')
    return false;
   if (a === null || b === null)
    return false;
   if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
   if (a instanceof RegExp && b instanceof RegExp)
    return a.source === b.source && a.global === b.global && a.multiline === b.multiline && a.lastIndex === b.lastIndex && a.ignoreCase === b.ignoreCase;
   if (isArguments(a) || isArguments(b)) {
    if (!(isArguments(a) && isArguments(b)))
      return false;


    const { slice } = Array.prototype;
    return deepEquals(slice.call(a), slice.call(b), ca, cb);
  }
    if (a.constructor !== b.constructor)
      return false;


    const ka = (0, _keys.default)(a);
    const kb = (0, _keys.default)(b); // don't bother with stack acrobatics if there's nothing there

    if (ka.length === 0 && kb.length === 0)
      return true;


    if (ka.length !== kb.length)
      return false;


    let cal = ca.length;

    while (cal--) {
      if (ca[cal] === a)
        return cb[cal] === b;
    }

    ca.push(a);
    cb.push(b);
    ka.sort();
    kb.sort();

    for (let j = ka.length - 1; j >= 0; j--) {
      if (ka[j] !== kb[j])
        return false;
    }

    let key;

    for (let k = ka.length - 1; k >= 0; k--) {
      key = ka[k];

      if (!deepEquals(a[key], b[key], ca, cb))
        return false;
    }

    ca.pop();
    cb.pop();
    return true;
}

export function shouldRender(comp, nextProps, nextState) {
  const { props } = comp;
      const { state } = comp;
  return !deepEquals(props, nextProps) || !deepEquals(state, nextState);
}

export function toIdSchema(schema, id, definitions) {
  const formData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const idPrefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'root';
  const idSchema = {
    $id: id || idPrefix
  };

  if ('$ref' in schema || 'dependencies' in schema) {
    const _schema = retrieveSchema(schema, definitions, formData);

    return toIdSchema(_schema, id, definitions, formData, idPrefix);
  }

  if ('items' in schema && !schema.items.$ref)
    return toIdSchema(schema.items, id, definitions, formData, idPrefix);


  if (schema.type !== 'object')
    return idSchema;


  for (const name in schema.properties || {}) {
    const field = schema.properties[name];
    const fieldId = `${idSchema.$id}_${name}`;
    idSchema[name] = toIdSchema(field, fieldId, definitions, // It's possible that formData is not an object -- this can happen if an
    // array item has just been added, but not populated with data yet
    (formData || {})[name], idPrefix);
  }

  return idSchema;
}

export function toPathSchema(schema) {
  const name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  const definitions = arguments.length > 2 ? arguments[2] : undefined;
  const formData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const pathSchema = {
    $name: name.replace(/^\./, '')
  };

  if ('$ref' in schema || 'dependencies' in schema) {
    const _schema = retrieveSchema(schema, definitions, formData);

    return toPathSchema(_schema, name, definitions, formData);
  }

  if (schema.hasOwnProperty('items') && (0, _isArray.default)(formData)) {
    formData.forEach((element, i) => {
      pathSchema[i] = toPathSchema(schema.items, ''.concat(name, '.').concat(i), definitions, element);
    });
  } else if (schema.hasOwnProperty('properties')) {
    for (const property in schema.properties) {
      pathSchema[property] = toPathSchema(schema.properties[property], ''.concat(name, '.').concat(property), definitions, // It's possible that formData is not an object -- this can happen if an
      // array item has just been added, but not populated with data yet
      (formData || {})[property]);
    }
  }

  return pathSchema;
}

export function parseDateString(dateString) {
  const includeTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (!dateString) {
    return {
      year: -1,
      month: -1,
      day: -1,
      hour: includeTime ? -1 : 0,
      minute: includeTime ? -1 : 0,
      second: includeTime ? -1 : 0
    };
  }

  const date = new Date(dateString);

  if ((0, _isNan.default)(date.getTime()))
    throw new Error(`Unable to parse date ${dateString}`);


  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    // oh you, javascript.
    day: date.getUTCDate(),
    hour: includeTime ? date.getUTCHours() : 0,
    minute: includeTime ? date.getUTCMinutes() : 0,
    second: includeTime ? date.getUTCSeconds() : 0
  };
}

export function toDateString(_ref2) {
  const { year } = _ref2;
      const { month } = _ref2;
      const { day } = _ref2;
      const _ref2$hour = _ref2.hour;
      const hour = _ref2$hour === void 0 ? 0 : _ref2$hour;
      const _ref2$minute = _ref2.minute;
      const minute = _ref2$minute === void 0 ? 0 : _ref2$minute;
      const _ref2$second = _ref2.second;
      const second = _ref2$second === void 0 ? 0 : _ref2$second;
  const time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const utcTime = Date.UTC(year, month - 1, day, hour, minute, second);
  const datetime = new Date(utcTime).toJSON();
  return time ? datetime : datetime.slice(0, 10);
}

export function pad(num, size) {
  let s = String(num);

  while (s.length < size)
    s = `0${s}`;


  return s;
}

export function setState(instance, state, callback) {
  const { safeRenderCompletion } = instance.props;

  if (safeRenderCompletion)
    instance.setState(state, callback);
   else {
    instance.setState(state);
    (0, _setImmediate2.default)(callback);
  }
}

export function dataURItoBlob(dataURI) {
  // Split metadata from data
  const splitted = dataURI.split(','); // Split params

  const params = splitted[0].split(';'); // Get mime-type from params

  const type = params[0].replace('data:', ''); // Filter the name property from params

  const properties = params.filter((param) => param.split('=')[0] === 'name'); // Look for the name and use unknown if no name property.

  let name;

  if (properties.length !== 1)
    name = 'unknown';
   else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split('=')[1];
  } // Built the Uint8Array Blob parameter from the base64 string.


  const binary = atob(splitted[1]);
  const array = [];

  for (let i = 0; i < binary.length; i++)
    array.push(binary.charCodeAt(i));
   // Create the blob object


  const blob = new window.Blob([new Uint8Array(array)], {
    type
  });
  return {
    blob,
    name
  };
}

export function rangeSpec(schema) {
  const spec = {};

  if (schema.multipleOf)
    spec.step = schema.multipleOf;


  if (schema.minimum || schema.minimum === 0)
    spec.min = schema.minimum;


  if (schema.maximum || schema.maximum === 0)
    spec.max = schema.maximum;


  return spec;
}

export function getMatchingOption(formData, options, definitions) {
  for (let i = 0; i < options.length; i++) {
    // Assign the definitions to the option, otherwise the match can fail if
    // the new option uses a $ref
    const option = (0, _assign.default)({
      definitions
    }, options[i]); // If the schema describes an object then we need to add slightly more
    // strict matching to the schema, because unless the schema uses the
    // "requires" keyword, an object will match the schema as long as it
    // doesn't have matching keys with a conflicting type. To do this we use an
    // "anyOf" with an array of requires. This augmentation expresses that the
    // schema should match if any of the keys in the schema are present on the
    // object and pass validation.

    if (option.properties) {
      // Create an "anyOf" schema that requires at least one of the keys in the
      // "properties" object
      const requiresAnyOf = {
        anyOf: (0, _keys.default)(option.properties).map((key) => ({
            required: [key]
          }))
      };
      let augmentedSchema = void 0; // If the "anyOf" keyword already exists, wrap the augmentation in an "allOf"

      if (option.anyOf) {
        // Create a shallow clone of the option
        const shallowClone = (0, _extends2.default)({}, option);

        if (!shallowClone.allOf)
          shallowClone.allOf = [];
         else {
          // If "allOf" already exists, shallow clone the array
          shallowClone.allOf = shallowClone.allOf.slice();
        }

        shallowClone.allOf.push(requiresAnyOf);
        augmentedSchema = shallowClone;
      } else
        augmentedSchema = (0, _assign.default)({}, option, requiresAnyOf);
       // Remove the "required" field as it's likely that not all fields have
      // been filled in yet, which will mean that the schema is not valid


      delete augmentedSchema.required;

      if ((0, _validate.isValid)(augmentedSchema, formData))
        return i;
    } else if ((0, _validate.isValid)(options[i], formData))
      return i;
  }

  return 0;
}
