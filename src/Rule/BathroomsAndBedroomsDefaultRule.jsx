export const BathroomsAndBedroomsDefaultRule = async (item, setRerender, itemList, values, setData  , setNewValue) => {
    if (item.field.id === 'bathrooms' && item.field.FieldType === 'select') {
        const bathrooms = 'bathrooms' ; 
        // const bathroomsIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'bathrooms'));
        // if (bathroomsIndex !== -1) {
        //     if (values[bathroomsIndex] && values[bathroomsIndex].length === 0)
        //         setData(bathroomsIndex, ['Any']);
        // }
        if ((values[bathrooms] && values[bathrooms].length === 0) || !values[bathrooms]){

             setData(bathrooms, ['Any']);
             setNewValue(['Any']);


        }
        


    } else if (item.field.id === 'bedrooms' && item.field.FieldType === 'select') {
        // const bedroomsIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'bedrooms'));
        // if (bedroomsIndex !== -1) {
        //     if (values[bedrooms] && values[bedroomsIndex].length === 0)
        //         setData(bedroomsIndex, ['Any']);
        // }
        const bedrooms = 'bedrooms';
            if ((values[bedrooms] && values[bedrooms].length === 0 ) ||  !values[bedrooms]){ 
                setData(bedrooms, ['Any']);
                setNewValue(['Any']);

            }
               
        
    }
    setRerender(Math.random());
};

export const BathroomsAndBedroomsDefaultRuleV2 = async (item, onValueChanged, allItems, allItemsValues) => {
    if (item.field.id === 'bathrooms' && item.field.FieldType === 'select') {
        const { bathrooms } = allItemsValues;
        if ((bathrooms && bathrooms.length === 0 ) || !bathrooms)
            onValueChanged(['Any'], 0, 'bathrooms');
    } else if (item.field.id === 'bedrooms' && item.field.FieldType === 'select') {
        const { bedrooms } = allItemsValues;
        if ((bedrooms && bedrooms.length === 0) || !bedrooms)
            onValueChanged(['Any'], 0, 'bedrooms');
    }
};
