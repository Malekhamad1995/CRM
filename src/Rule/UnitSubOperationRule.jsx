import UnitSubOperation from '../assets/json/UnitSubOperation.json';

export function UnitSubOperationRule(id, item, itemList, itemsValue) {
    if (id !== 'unit_sub_operation') return;

    const i = itemList.indexOf(itemList.find((f) => f.field.id.toLowerCase() === 'unit_operation'));
    if (itemsValue[i]) {
        if (UnitSubOperation.filter((f) => f.UnitOperation === itemsValue[i])[0])
            item.data.enum = UnitSubOperation.filter((f) => f.UnitOperation === itemsValue[i])[0].UnitSubOperation;
        else
            item.data.enum = [];
    }
}
