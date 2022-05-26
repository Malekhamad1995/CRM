import {
  getUnits, GetPropertyFixturesAndAmenities, propertyDetailsGet, GetAllUnitsForLeadOwner
} from '../Services';
import { GetParams } from '../Helper';
import { LeadTypeIdEnum } from '../Enums';
let timer = null;



let oldvalue = '';
export async function UnitRule(item, value, setNewValue, itemList, values) {
  if (oldvalue === value) return;
  oldvalue = value;
  if (!item.data.searchKey) return;
  if (item.data.searchKey !== 'unit') return;
  if (value.length < 1) return;

  const leadOperationIndex = itemList &&  itemList.indexOf(itemList.find((f) => f.field.id === 'lead_operation'));
  const isUnitRefNumberForOwnerLead = ((item.field.id === 'unit_ref-number') && +(GetParams('formType')) === LeadTypeIdEnum.Owner.leadTypeId && (leadOperationIndex !== -1 && values[leadOperationIndex]));
  const unitType = values &&  values[leadOperationIndex] && values[leadOperationIndex] === 'Seller' ? true : false;

  const rs = !isUnitRefNumberForOwnerLead ? await getUnits({ pageIndex: 0, pageSize: 10, search: value }) :
    await GetAllUnitsForLeadOwner({ pageIndex: 0, pageSize: 10, isSaleUnitType: unitType });;

  item.data.enum = [];
  if (!rs && !rs.result) return;
  rs.result.map((valueLoop) => {
    item.data.enum.push({
      id: valueLoop.unitId,
      name: valueLoop.unit.unit_ref_no,
      type: valueLoop.unit.unit_type_id,
    });
  });

  setNewValue(Math.random());

}

export async function UnitDefaultRule(item, setNewValue, itemList, values) {
  if (item.field.id === 'unit_ref-number' && +GetParams('formType') === LeadTypeIdEnum.Owner.leadTypeId)
    return;

  if (item.data.searchKey !== 'unit') return;
  if (item.data.enum) return;
  const isUnitRefNumberForOwnerLead = ((item.field.id === 'unit_ref-number') && (item.field.FieldType === 'searchField') && (item.field.Required === 'true'));
  const rs = !isUnitRefNumberForOwnerLead ? await getUnits({ pageIndex: 0, pageSize: 10 }) :
    await getUnits({
      pageIndex: 0, pageSize: 10, excludeLeadOwnerInUnits: true
    });

  item.data.enum = [];
  if (!rs || !rs.result) return;
  rs.result.map((value) => {
    item.data.enum.push({
      id: value.unitId,
      name: value.unit.unit_ref_no,
      type: value.unit.unit_type_id,
    });
  });

  setNewValue(Math.random());
}

export async function OnchangePropertyInUnitRule(
  item,
  v,
  itemList,
  setData , 
  setRerender ,
) {
  if (item && item.data && item.data.searchKey === 'property') {
    const key = 'amenities';
    const i1amenitiesIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === key);
    const res = await GetPropertyFixturesAndAmenities((v && v.id) || 0);

    if (res)
      setData(itemList[i1amenitiesIndex].field.id,res.amenities || null);

  }
}
export async function OnchangePropertyInUnitRuleV2(
  item,
  v,
  setData
) {
  if (item && item.data && item.data.searchKey === 'property') {
    const key = 'amenities';
    const res = await GetPropertyFixturesAndAmenities((v && v.id) || 0);

    if (res && res && res.amenities !== null && res.amenities !== undefined)
      setData([...res.amenities], 0, key);
  }
}

export async function OnchangePropertyOnLeadRule(
  item,
  v,
  itemList,
  setData
) {
  if (item && item.data && item.data.searchKey === 'property') {
    if (!v || !v.id) return;
    const res = await propertyDetailsGet({ id: v.id });
    if (res) {
      const countryIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'country');
      const cityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'city');
      const districtIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'district');
      const communityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'community');
      const subcommunityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'sub_community');

      if (countryIndex !== -1)
        setData(itemList[countryIndex].field.id, res.property.country || {});

      if (cityIndex !== -1)
        setData(itemList[cityIndex].field.id, res.property.city || {});

      if (districtIndex !== -1)
        setData(itemList[districtIndex].field.id, res.property.district || {});

      if (communityIndex !== -1)
        setData(itemList[communityIndex].field.id, res.property.community || {});

      if (subcommunityIndex !== -1)
        setData(itemList[subcommunityIndex].field.id, res.property.sub_community || {});
    }
  }
}
export async function OnAddnewUnitRule(
  itemList,
  setData,
  itemsDialogValue,
) {
  //  This is function When User Add New Unit Ref Number //
  if (itemsDialogValue && itemsDialogValue.unitId !== null) {
    const fieldkey = 'unit_ref-number';
    const i1Index = itemList.findIndex((f) => f.field.id.toLowerCase() === fieldkey);
    if (i1Index && itemsDialogValue.unitId) {
      const FinalJSON = JSON.parse(itemsDialogValue.unitJson);
      setData(itemList[i1Index].field.id, {
        id: itemsDialogValue && itemsDialogValue.unitId,
        name: FinalJSON && FinalJSON.unit && FinalJSON.unit.unit_ref_no,
        type: FinalJSON && FinalJSON.unit && FinalJSON.unit.unit_type_id,
      });
      setData('unit_ref_number', {
        id: itemsDialogValue && itemsDialogValue.unitId,
        name: FinalJSON && FinalJSON.unit && FinalJSON.unit.unit_ref_no,
        type: FinalJSON && FinalJSON.unit && FinalJSON.unit.unit_type_id,
      });

    }
  }
}

// export async function OnchangePropertyInUnitRuleV2(id, setData, item, itemList, value) {
//   if (value === null || value === undefined) return;
//   const key = 'amenities';
//   const res = await GetPropertyFixturesAndAmenities((value && value.id) || 0);
//   if (id === key) {
//     const i1amenitiesIndex = itemList.indexOf(
//         itemList.find((f) => f.field.id.toLowerCase() === item.data.hasEffectOn.toLowerCase())
//     );
//     if (res && res && res.amenities !== null && res.amenities !== undefined)
//       setData({ amenities: [...res.amenities] });
//   }
// }


export async function UnitForLeadOwnerRule(item, value, setNewValue, itemList, values, setData) {

  const unitRefNumberIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'unit_ref-number')); 
  itemList[unitRefNumberIndex].data.enum = [];
  setData(itemList[unitRefNumberIndex].field.id, {});
  setData('unit_ref_number', {});


  if(!value)
  return; 

  timer = setTimeout(async () => {
    itemList[unitRefNumberIndex].data.isReadonly = false;
    const unitType = value && value === 'Seller' ? true : false;
    const unitsLeadOwner = await GetAllUnitsForLeadOwner({ pageIndex: 0, pageSize: 10, isSaleUnitType: unitType });
    if (unitsLeadOwner && unitsLeadOwner.result && unitRefNumberIndex !== -1) {
      unitsLeadOwner.result.map((value) => {
        itemList[unitRefNumberIndex].data.enum.push({
          id: value.unitId,
          name: value.unit.unit_ref_no,
          type: value.unit.unit_type_id,
        });
      });
    }
  }, 300)

}
