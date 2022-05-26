export const getValueToEditinUint = async (item, setRerender, itemList, values, setData) => {
    if (item.field.id === 'operation_type') {
        const On = itemList.find((f) => f.field.id === 'operation_type');
        const datas = On.data && On.data && On.data.enum ;
        // item.data.enum = datas.filter(((f) => f.lookupItemId !== 431));
        const selectedIndex = datas.findIndex((element) => element.lookupItemId === 431);
        datas.splice(selectedIndex, 1);
        item.data.enum = datas;
    }
};
