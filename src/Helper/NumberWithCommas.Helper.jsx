
 export const NumberWithCommas = (number) => {
    let value= number  &&   Number(number); 
    value = value &&   value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return value  ; 
};

