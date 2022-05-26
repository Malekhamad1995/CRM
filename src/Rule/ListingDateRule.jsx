import moment from 'moment';

function dateWithMonthsDelay(newDate, months) {
  const date = new Date(newDate);
  date.setMonth(date.getMonth() + months);
  return date;
}

export const ListingDateRule = async (id ,item,itemList, v, values  , setData) => {
  if(id === 'listing_expiry-period')
    {
       if(!v)
       {
         
        setTimeout(() => {
          setData('listing_expiry-date', null);
          setData('listing_expiry_date',{});

        }, 100);
       
      }
      else {
            const listingDateValue = values &&  values['listing_date'] &&  new Date(values['listing_date']);
            const addMonths = v && v.lookupItemName === '1 Month' ? 1 : 3;
            const dateWithMonths = dateWithMonthsDelay(listingDateValue, addMonths);
            const expiryDate = moment(dateWithMonths);
            setData('listing_expiry-date', expiryDate);
            setData('listing_expiry_date',expiryDate);
        }    
  }
   else if(id === 'rent_listing-expiry-period')
  { 
    if(!v)
    {
     setTimeout(() => {
      setData('rent_listing-expiry-date', null);
      setData('rent_listing_expiry_date',{});

     }, 100);
    }
     else {
      const rentListingDateValue = values &&  values['rent_listing_date'] &&  new Date(values['rent_listing_date']);
      const addMonths = v && v.lookupItemName === '1 Month' ? 1 : 3;
      const dateWithMonths = dateWithMonthsDelay(rentListingDateValue, addMonths);
      const rentExpiryDate = moment(dateWithMonths);
      setData('rent_listing-expiry-date', rentExpiryDate);
      setData('rent_listing_expiry_date',rentExpiryDate);

     }
    
         
  }
 
};

export const ListingDateRule2 = async (item, value, onValueChanged, allItems, allItemsValues) => {
  if (item.field.id === 'listing_expiry_period') {
    if(!value){
      onValueChanged(null, 0, 'listing_expiry_date');
      return;

    }
    const listingDate = allItemsValues.listing_date;
    const newValue = new Date(listingDate);
    const addMonths = value && value.lookupItemName === '1 Month' ? 1 : (value && value.lookupItemName === '3 Months' ? 3:0);
    const dateWithMonths = dateWithMonthsDelay(newValue, addMonths);
    const expiryDate = moment(dateWithMonths);
    onValueChanged(expiryDate, 0, 'listing_expiry_date');
  } else if (item.field.id === 'rent_listing_expiry_period') {
    if(!value){
      onValueChanged(null, 0, 'rent_listing_expiry_date');
      return;

    }
    const leaseListingDate = allItemsValues.rent_listing_date;
    const newValue = new Date(leaseListingDate);
    const addMonths = value && value.lookupItemName === '1 Month' ? 1 : 3;
    const dateWithMonths = dateWithMonthsDelay(newValue, addMonths);
    const expiryDate = moment(dateWithMonths);
    onValueChanged(expiryDate, 0, 'rent_listing_expiry_date');
  }
};

export const ListingExpiryDateRule1  = async (item, setData) => {
  debugger; 
  if (item.field.id === 'listing_expiry-date') {
    setTimeout(() => {
      setData('listing_expiry_period' , {});
      setData('listing_expiry-period' , {});
    }, 100);
    
  }

  else if (item.field.id === 'rent_listing-expiry-date') {
    setTimeout(() => {
      setData('rent_listing_expiry_period' , {});
      setData('rent_listing-expiry-period' , {});
    }, 100);
    
  }

};

export const ListingExpiryDateRule2  = (item, onValueChanged) => {
  if (item.field.id === 'listing_expiry_date') 
      onValueChanged(null, 0, 'listing_expiry_period');

  else if (item.field.id === 'rent_listing_expiry_date') 
    onValueChanged(null, 0, 'rent_listing_expiry_period');

};



export const ListingDate = (id,itemList, value) => {
  if (id === 'listing_date') {

    const listingExpiryDateIndex = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'listing_expiry_date')
    );
    if (listingExpiryDateIndex !== -1)
      itemList[listingExpiryDateIndex].data.minDate = moment(value).add(1, 'days');
  }
  if (id === 'rent_listing_date') {
    const rentListingExpiryDateIndex = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'rent_listing_expiry_date')
    );
    if (rentListingExpiryDateIndex !== -1)
      itemList[rentListingExpiryDateIndex].data.minDate = moment(value).add(1, 'days');
  }
};

export const ListingDate1 = (id,itemList, value) => {
  if (id === 'listing_date') {

    const listingExpiryDateIndex = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'listing_expiry-date')
    );
    if (listingExpiryDateIndex !== -1)
      itemList[listingExpiryDateIndex].data.minDate = moment(value).add(1, 'days');
  }
  if (id === 'rent_listing-date') {
    const rentListingExpiryDateIndex = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'rent_listing-expiry-date')
    );
    if (rentListingExpiryDateIndex !== -1)
      itemList[rentListingExpiryDateIndex].data.minDate = moment(value).add(1, 'days');
  }
};



