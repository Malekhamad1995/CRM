export const PermissionsExtract = (obj) =>
  Object.keys(obj).map(function (key) {
    return obj[key];
  });
