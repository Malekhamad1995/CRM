export const GetParams = (value) => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  return params.get(value);
};
