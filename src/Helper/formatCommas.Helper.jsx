export const formatCommas = (number) => {
  if (!(Number.isInteger(number)))
    return number;
  const decimalSeparator = '.';
  const thousandSeparator = '';
  // const thousandSeparator = ',';
  let result = String(number);
  const parts = result.split(decimalSeparator);
  if (!parts[1])
    parts[1] = '00';
  result = parts[0].split('').reverse().join('');
  result = result.replace(/(\d{3}(?!$))/g, `$1${thousandSeparator}`);
  parts[0] = result.split('').reverse().join('');
  return parts.join(decimalSeparator);
};

  export const formatSizeUnits = (bytes) => {
  if (bytes >= 1073741824) bytes = `${(bytes / 1073741824).toFixed(2)} GB`; else if (bytes >= 1048576) bytes = `${(bytes / 1048576).toFixed(2)} MB`; else if (bytes >= 1024) bytes = `${(bytes / 1024).toFixed(2)} KB`; else if (bytes > 1) bytes = `${bytes} bytes`; else if (bytes == 1) bytes = `${bytes} byte`; else bytes = '0 bytes';
  return bytes;
};
