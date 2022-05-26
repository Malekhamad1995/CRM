import { getProperties } from '../Services';

let oldvalue = '';
export async function PropertyRule(item, value, setNewValue) {
  if (oldvalue === value) return;
  oldvalue = value;
  if (!item.data.searchKey) return;
  if (item.data.searchKey !== 'property') return;
  if (value.length < 1) return;

  const rs = await getProperties({ pageIndex: 0, pageSize: 10, search: value });
  item.data.enum = [];
  if ((rs && rs.data && rs.data.ErrorId) || !rs || !rs.result) return;
  rs.result.map((valueLoop) => {
    item.data.enum.push({
      id: valueLoop.propertyId,
      name: valueLoop.property.property_name,
      city: (valueLoop.property.city && valueLoop.property.city.lookupItemName) || '',
    });
  });

  setNewValue(Math.random());
}

export async function PropertyDefaultRule(item, setNewValue) {
  if (item.data.searchKey !== 'property') return;
  if (item.data.enum) return;

  const rs = await getProperties({ pageIndex: 0, pageSize: 10 });

  item.data.enum = [];
  if (!rs || !rs.result) return;
  rs.result.map((value) => {
    item.data.enum.push({ id: value.propertyId, name: value.property.property_name, city: (value.property.city && value.property.city.lookupItemName) || '' });
  });

  setNewValue(Math.random());
}


export async function OnAddnewPropertyRule(
  item,
  itemList,
  setData,
  itemsDialogValue,
) {
  //  This is function When User Add New Property //
  let fieldkey;
  if (item && item.field.id === 'property_name')
    fieldkey = 'property_name';

  if (itemsDialogValue && itemsDialogValue.propertyId !== null) {
    const i1Index = itemList.findIndex((f) => f.field.id.toLowerCase() === fieldkey);
    const FinalJSON = JSON.parse(itemsDialogValue.propertyJson);
    if (i1Index && itemsDialogValue && itemsDialogValue.propertyId) {
      setData(i1Index, {
        id: itemsDialogValue && itemsDialogValue.propertyId,
        name: FinalJSON && FinalJSON.property && FinalJSON.property.property_name,
        city: FinalJSON && FinalJSON.property && FinalJSON.property.city.lookupItemName,
      });
    }
  }
}
