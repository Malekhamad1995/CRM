export const SellerHasPaidRule = async (item, value, setRerender , values, setData  , setNewValue) => {
    if (item.field.id === 'seller_has-paid' ) {
        const sellerHasPaid =  value ;
        const sellingPriceAgencyfee =  values && values.selling_price_agency_fee  ? values.selling_price_agency_fee.salePrice: 0 ;
        let sub = sellingPriceAgencyfee -  sellerHasPaid ;
         setTimeout(() => {
            setData('amount_due_to_developer',sub || '0' ) ; 
            setData('amount_due-to-developer',sub || '0' ) ; 
             
         }, 100);
          
    }
  
};

