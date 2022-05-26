export const log = (data) => {
  const info = {
    user: localStorage.getItem('session'),
    data,
    date: new Date(),
  };

  return info;
};
