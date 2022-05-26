export const StatusLeadDefaulRule2 = async (item, onValueChanged, allItems, allItemsValues) => {
    if (item.field.id === 'status') {
        if (allItemsValues) {
            setTimeout(() => {
                onValueChanged(null, 0, 'close_reason');
                onValueChanged(null, 0, 'closing_remarks');
            }, 200);
        }
    }
};

export const StatusLeadDefaulRule1 = async (item, setRerender, itemList, values, setData) => {
    if (item.field.id === 'status') {
        const closeReasonIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'close_reason'));
        const closingRemarksIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'closing_remarks'));
        if (closeReasonIndex !== -1 &&  closingRemarksIndex !== -1 ){
         setData(itemList[closeReasonIndex].field.id, {});
         setData(itemList[closingRemarksIndex].field.id,{});
        }
    }
};
