import { lookupItemsGetId, GetLocationByAddress } from '../Services';

const clearAllEffectedFieldsValues = (item, onValueChanged, allItems, allItemsValues) => {
  const effectedItemIndex = allItems.findIndex(
    (f) => f.field.id.toLowerCase() === item.data.hasEffectOn.toLowerCase()
  );
  if (effectedItemIndex === -1 || !allItems[effectedItemIndex].data.lookup) return;
  if (allItemsValues[allItems[effectedItemIndex].field.id]) {
    onValueChanged(null, effectedItemIndex);
    clearAllEffectedFieldsValues(
      allItems[effectedItemIndex],
      onValueChanged,
      allItems,
      allItemsValues
    );
  }
};
const getCurrentLocation = async (lookupItem) => {
  let adderss = '';
  if (!lookupItem.lookupItemParents) adderss = lookupItem.lookupItemName;
  else {
    const l = JSON.parse(lookupItem.lookupItemParents);
    const country = l.find((f) => f.LookupType.toLowerCase() === 'country');
    const city = l.find((f) => f.LookupType.toLowerCase() === 'city');
    const district = l.find((f) => f.LookupType.toLowerCase() === 'district');
    const comunity = l.length === 3 ? lookupItem : null;
    if (comunity)
      adderss = `${comunity.lookupItemName}, ${district.LookupItemName}, ${city.LookupItemName}, ${country.LookupItemName}`;
    else if (district)
      adderss = `${lookupItem.lookupItemName}, ${city.LookupItemName}, ${country.LookupItemName}`;
    else if (city) adderss = `${lookupItem.lookupItemName}, ${country.LookupItemName}`;
  }

  const data = await GetLocationByAddress(adderss);
  try {
    const obje = data.results[0].geometry.location;
    return { latitude: obje.lat, longitude: obje.lng };
  } catch (e) {
    return { latitude: 25.2048, longitude: 55.2708 };
  }
};
const titleHandler = (
  newValue,
  item,
  onItemChanged,
  onValueChanged,
  allItems,
  effectedItemIndex
) => {
  if (item.field.id === 'title') {
    if (newValue && effectedItemIndex !== -1) {
      const effectedNewValue = allItems[effectedItemIndex].data.enum.find(
        (f) => f.parentLookupItemId === newValue.lookupItemId
      );
      if (!effectedNewValue) return;
      onValueChanged(effectedNewValue, effectedItemIndex);
      if (!allItems[effectedItemIndex].data.isReadonly)
        onItemChanged(true, effectedItemIndex, 'isReadonly', 'data');
    } else if (allItems[effectedItemIndex].data.isReadonly)
      onItemChanged(false, effectedItemIndex, 'isReadonly', 'data');
  }
};
const currentLocationHandler = async (
  newValue,
  item,
  onValueChanged,
  allItems,
  effectedItemIndex
) => {
  // if (!(item.field.id === 'country' || item.field.id === 'city')) return;
  // const cname = localStorage.getItem('CurrentAddress') ?
  //   localStorage.getItem('CurrentAddress').split(' ')[0] :
  //   'United Arab Emirates';
  // localStorage.setItem('CurrentAddress', `${cname} ${newValue.lookupItemName}`);
  if (
    effectedItemIndex === -1 ||
    !allItems[effectedItemIndex] ||
    !allItems[effectedItemIndex].data ||
    !allItems[effectedItemIndex].data.effectOnMap
  )
    return;
  const i2 = allItems.findIndex(
    (f) => f.field.id.toLowerCase() === allItems[effectedItemIndex].data.effectOnMap
  );
  if (i2 === -1) return;
  const data = await getCurrentLocation(newValue);
  onValueChanged(data, i2);
};
export const LookupsEffectedOnRules = async (
  newValue,
  item,
  onValueChanged,
  onItemChanged,
  allItems,
  allItemsValues,
  onLoadingsChanged
) => {
  if (
    !(
      item.field.FieldType === 'select' ||
      (item.field.FieldType === 'address' && item.data.uiType === 'select')
    )
  )
    return;
  // if(item.data.specialKey==='country') {
  //     CountryHandler(id,newValue,item, onValueOrItemChanged, allItems)
  // }
  const effectedItemIndex = allItems.findIndex(
    (f) => f.field.id.toLowerCase() === item.data.hasEffectOn.toLowerCase()
  );
  if (
    effectedItemIndex === -1 ||
    !allItems[effectedItemIndex] ||
    !allItems[effectedItemIndex].data ||
    !allItems[effectedItemIndex].data.lookup
  )
    return;
  titleHandler(newValue, item, onItemChanged, onValueChanged, allItems, effectedItemIndex);
  if (item.field.id === 'title') return;
  clearAllEffectedFieldsValues(item, onValueChanged, allItems, allItemsValues);
  // ||
  //   (allItemsValues[allItems[effectedItemIndex].field.id] &&
  //     allItems[effectedItemIndex].data.enum.findIndex(
  //       (element) =>
  //         element.lookupItemId === allItemsValues[allItems[effectedItemIndex]
  // .field.id].lookupItemId
  //     ) !== -1)
  if (!newValue) return;
  onLoadingsChanged(true, allItems[effectedItemIndex].field.id);
  const result = await lookupItemsGetId({
    lookupTypeId: allItems[effectedItemIndex].data.lookup,
    lookupParentId: newValue.lookupItemId,
  });
  if (!(result && result.status && result.status !== 200))
    onItemChanged(result, effectedItemIndex, 'enum', 'data');
  onLoadingsChanged(false, allItems[effectedItemIndex].field.id);
  currentLocationHandler(newValue, item, onValueChanged, allItems, effectedItemIndex);
};
