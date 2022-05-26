export const OperationTypeRule = async (item, setRerender, value , setIsLoading , type) => {
  if (!value) return;
  if (item.data.specialKey !== 'UnitOperationType') return;

  // eslint-disable-next-line no-unused-vars
  let oprationTypeList = [];
  setTimeout(() => {
    if ( (value &&  value.lookupItemName &&  value.lookupItemName === 'Sale') ||   (value && value.operation_type_name === 'Sale'))
      oprationTypeList = item.data.enum.filter((ot) => ot.lookupItemName === 'Sale' || ot.lookupItemName === 'SaleAndRent');
     else if ((value && value.lookupItemName &&  value.lookupItemName === 'Rent') ||  (value && value.operation_type_name === 'Rent'))
      oprationTypeList = item.data.enum.filter((ot) => ot.lookupItemName === 'Rent' || ot.lookupItemName === 'SaleAndRent');
    //  else if ((value &&  value.lookupItemName &&  value.lookupItemName === 'SaleAndRent') || (value && value.operation_type_name === 'SaleAndRent'))
    // item.data.isReadonly = true;
    if (oprationTypeList && oprationTypeList.length !== 0) {
      item.data.enum = [];
      oprationTypeList.map((element) => {
        item.data.enum.push(element);
      });
      
    }
     setRerender(Math.random());
    }, 700);

};
