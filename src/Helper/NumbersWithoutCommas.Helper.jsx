export const NumbersWithoutCommas = (number) => {
     const convertToNumber = number ? (number && number.replace(/,/g, '')) : 0;
     return (convertToNumber ? parseFloat(convertToNumber) : 0);
};
