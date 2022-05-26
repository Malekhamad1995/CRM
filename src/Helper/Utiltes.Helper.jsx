export const toPascalCase = (oldObject) => {
  const newObject = {};
  let newKey;
  let value;
  if (oldObject instanceof Array) {
    return oldObject.map((item) => {
      if (typeof item === 'object') value = toPascalCase(item);
      return value;
    });
  }
  Object.keys(oldObject).map((origKey) => {
    if (({}).hasOwnProperty.call(oldObject, origKey)) {
      newKey = (origKey.charAt(0).toUpperCase() + origKey.slice(1) || origKey).toString();
      value = oldObject[origKey];
      if (value instanceof Array || (value !== null && value.constructor === Object))
        value = toPascalCase(value);
      newObject[newKey] = value;
    }
    return undefined;
  });

  return newObject;
};
export const toCamelCase = (oldObject) => {
  const newObject = {};
  let newKey;
  let value;
  if (oldObject instanceof Array) {
    return oldObject.map((item) => {
      if (typeof item === 'object') value = toPascalCase(item);
      return value;
    });
  }
  Object.keys(oldObject).map((origKey) => {
    if (({}).hasOwnProperty.call(oldObject, origKey)) {
      newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
      value = oldObject[origKey];
      if (value instanceof Array || (value !== null && value.constructor === Object))
        value = toPascalCase(value);
      newObject[newKey] = value;
    }
    return undefined;
  });

  return newObject;
};

export const unCamelCase = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
