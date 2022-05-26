import { getUnits, getProperties } from '../Services';

let oldvalue = '';
export async function PropertyOrUnitRule(item, value, setNewValue, itemList, selectedValues) {
  if (oldvalue === value) return;
  oldvalue = value;

  if (!item.data.searchKey) return;

  if (item.data.searchKey !== 'PropertyOrUnit') return;

  if (value.length < 2) return;

  const index = itemList.findIndex(
    (effectedItem) => effectedItem.data.title.replace('*', '').trim() === item.data.dependOn
  );

  if (selectedValues[index] === 'Property') {
    const rs = await getProperties({ pageIndex: 0, pageSize: 10, search: value });
    item.data.enum = [];
    if (!rs && !rs.result) return;
    rs.result.map((val) => {
      item.data.enum.push({
        isProperty: true,
        id: val.propertyId,
        name: val.property.property_name,
        city: (val.property.city && val.property.city.lookupItemName) || '',
      });
    });
  }

  if (selectedValues[index] === 'Unit') {
    if (!item.data.enum) {
      item.data.enum = [];
      const rs = await getUnits({ pageIndex: 0, pageSize: 10, search: value });
      if (!rs && !rs.result) return;
      rs.result.map((val) => {
        item.data.enum.push({
          id: val.unitId,
          unitModel: val.unit.unit_model || '',
          unitBedrooms: val.unit.bedrooms || '',
          unitRefNo: val.unit.unit_ref_no || '',
          name: (val.unit.property_name && val.unit.property_name.name) || '',
          unitType:
            val.unit.unit_type && val.unit.unit_type !== '[object Object]' ?
              val.unit.unit_type.lookupItemName || val.unit.unit_type :
              '',
          type: val.unit.unit_type_id,
        });
      });
    }
  }
  setNewValue(Math.random());
}

export async function PropertyOrUnitDefaultRule(
  item,
  value,
  itemList,
  setNewValue,
  selectedValues
) {
  if (oldvalue === value) return;
  oldvalue = value;

  if (!item.data.searchKey) return;

  if (item.data.searchKey !== 'PropertyOrUnit') return;

  const index = itemList.findIndex(
    (effectedItem) => effectedItem.data.title.replace('*', '').trim() === item.data.dependOn
  );

  if (selectedValues[index] === 'Property') {
    const rs = await getProperties({ pageIndex: 0, pageSize: 10, search: '' });
    item.data.enum = [];
    if (!rs) return;
    rs.map((val) => {
      item.data.enum.push({
        isProperty: true,
        id: val.propertyId,
        name: val.property.property_name,
        city: (val.property.city && val.property.city.lookupItemName) || '',
      });
    });
  }

  if (selectedValues[index] === 'Unit') {
    const rs = await getUnits({ pageIndex: 0, pageSize: 10, search: '' });
    item.data.enum = [];
    if (!rs) return;
    rs.map((val) => {
      item.data.enum.push({
        id: val.unitId,
        unitModel: val.unit.unit_model || '',
        unitBedrooms: val.unit.bedrooms || '',
        unitRefNo: val.unit.unit_ref_no || '',
        name: (val.unit.property_name && val.unit.property_name.name) || '',
        unitType:
          val.unit.unit_type && val.unit.unit_type !== '[object Object]' ?
            val.unit.unit_type.lookupItemName || val.unit.unit_type :
            '',
        type: val.unit.unit_type_id,
      });
    });
  }
  setNewValue(Math.random());
}
