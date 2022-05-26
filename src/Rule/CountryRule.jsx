import { GetLocationByAddress } from '../Services/map';
import { lookupItemsGetId } from '../Services/LookupsServices';

// import { reRender } from '../Helper';
export async function getCurrentLocation() {
  if (!localStorage.getItem('CurrentAddress')) return { latitude: 25.2048, longitude: 55.2708 };
  const data = await GetLocationByAddress(localStorage.getItem('CurrentAddress'));
  try {
    const obje = data.results[0].geometry.location;
    return { latitude: obje.lat, longitude: obje.lng };
  } catch (e) {
    return { latitude: 25.2048, longitude: 55.2708 };
  }
}
function resetAllValue(id, setData, item, itemList) {
  try {
    const i = itemList.indexOf(
      itemList.find((f) => (f.field.id.toLowerCase() === item.data.hasEffectOn.toLowerCase()) || (f.field.id.toLowerCase() === item.data.effectOnMap) )
    );
  
    if (i !== -1) {
      // itemList[i].data.enum = [];
      resetAllValue(itemList[i].field.id, setData, itemList[i], itemList);
    }
    setData(itemList[i].field.id, {});
   
    
  } catch (e) {
    if (id !== -1) setData(id, {});
  }
}
export async function OnchangeCountryRule(id, setData, item, itemList, v) {
  if (item.data.specialKey === 'country')
    localStorage.setItem('CurrentAddress', `${v&&v.lookupItemName}`);

  if (!item.data.specialKey) return;

  if (item.data.specialKey !== 'country') return;

  resetAllValue(id, setData, item, itemList);

  const currentIndex = itemList.indexOf(itemList.find((f) => f.field.id.toLowerCase() === id));
  const i1 = itemList.indexOf(
    itemList.find(
      (f) => f.field.id.toLowerCase() === itemList[currentIndex].data.hasEffectOn.toLowerCase()
    )
  );
  if (!itemList[i1]) {
    // eslint-disable-next-line no-console
    return;
  }
  const result = await lookupItemsGetId({
    lookupTypeId: itemList[i1].data.lookup,
    lookupParentId: v.lookupItemId,
  });
  itemList[i1].data.enum = [];
  if (!(result && result.status && result.status !== 200))
    result.map((items) => itemList[i1].data.enum.push(items));
  if (!itemList[i1].data.effectOnMap) {
    setData(itemList[i1].field.id, null);
    return;
  }
  const i2 = itemList.indexOf(
    itemList.find((f) => f.field.id.toLowerCase() === itemList[i1].data.effectOnMap)
  );
  const data = await getCurrentLocation();
  setData(itemList[i2].field.id, undefined);
  setTimeout(() => {
    setData(itemList[i2].field.id, data);
  }, 100);
}

export async function OnchangeCityRule(id, v, itemList, setData, item) {
  const cname = localStorage.getItem('CurrentAddress') ?
    localStorage.getItem('CurrentAddress').split(',')[0] :
    'United Arab Emirates';
  if (item.data.specialKey === 'city')
    localStorage.setItem('CurrentAddress', `${cname} , ${v.lookupItemName}`);

  if (!item.data.specialKey) return;
  if (item.data.specialKey !== 'city') return;
  const currentIndex = itemList.indexOf(itemList.find((f) => f.field.id.toLowerCase() === id));
  resetAllValue(id, setData, itemList[currentIndex], itemList);
  const i1 = itemList.indexOf(
    itemList.find(
      (f) => f.field.id.toLowerCase() === itemList[currentIndex].data.hasEffectOn.toLowerCase()
    )
  );
  if (!itemList[i1]) return;
  const result = await lookupItemsGetId({
    lookupTypeId: itemList[i1].data.lookup,
    lookupParentId: v.lookupItemId,
  });
  itemList[i1].data.enum = [];
  if (!(result && result.status && result.status !== 200))
    result.map((items) => itemList[i1].data.enum.push(items));

  const i1countryIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'country');
  const Lookup = {
    lookupItemId: v.parentLookupItemId,
    parentLookupTypeName: v.LookupType,
    lookupItemName: v.parentLookupItemName,
  };
  if (
    itemList[i1countryIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === Lookup.lookupItemId
    ) === -1
  )
    itemList[i1countryIndex].data.enum.push(Lookup);
  setTimeout(() => {
    setData(itemList[i1countryIndex].field.id, Lookup);
  }, 100);

  if (!itemList[currentIndex].data.effectOnMap) {
    setData(itemList[i1].field.id, null);
    return;
  }
  if (!itemList[currentIndex].data.effectOnMap) return;
  const i2 = itemList.indexOf(
    itemList.find((f) => f.field.id.toLowerCase() === itemList[currentIndex].data.effectOnMap)
  );
  const data = await getCurrentLocation();
  setData(itemList[i2].field.id, undefined);
  setTimeout(() => {
    setData(itemList[i2].field.id, data);
  }, 100);
}

export async function OnchangeDistrictRule(id, setData, item, itemList, v) {
  const cname = localStorage.getItem('CurrentAddress') ?
    localStorage.getItem('CurrentAddress').split(',,')[0] :
    'United Arab Emirates';
  if (item.data.specialKey === 'district')
    localStorage.setItem('CurrentAddress', `${cname} ,, ${v.lookupItemName}`);

  if (!item.data.specialKey) return;
  if (item.data.specialKey !== 'district') return;

  const currentIndex = itemList.indexOf(itemList.find((f) => f.field.id.toLowerCase() === id));

  resetAllValue(id, setData, itemList[currentIndex], itemList);

  const i1 = itemList.indexOf(
    itemList.find(
      (f) => f.field.id.toLowerCase() === itemList[currentIndex].data.hasEffectOn.toLowerCase()
    )
  );
  if (!itemList[i1]) return;
  const result = await lookupItemsGetId({
    lookupTypeId: itemList[i1].data.lookup,
    lookupParentId: v.lookupItemId,
  });
  itemList[i1].data.enum = [];
  if (!(result && result.status && result.status !== 200))
    result.map((items) => itemList[i1].data.enum.push(items));
  v.addressType = item.data.addressType;

  const cityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'city');
  const countryIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'country');
  const parentsItems = JSON.parse(v.lookupItemParents);
  const cityLookup = {
    lookupType: parentsItems[0].LookupType,
    lookupItemId: parentsItems[0].LookupItemId,
    lookupItemName: parentsItems[0].LookupItemName,
  };
  const countryLookup = {
    lookupType: parentsItems[1].LookupType,
    lookupItemId: parentsItems[1].LookupItemId,
    lookupItemName: parentsItems[1].LookupItemName,
  };

  if (countryIndex !== -1)
    setData(itemList[countryIndex].field.id, countryLookup || {});

  if (cityIndex !== -1)
    setData(itemList[cityIndex].field.id, cityLookup || {});

  if (!itemList[currentIndex].data.effectOnMap) return;
  const i2 = itemList.indexOf(
    itemList.find((f) => f.field.id.toLowerCase() === itemList[currentIndex].data.effectOnMap)
  );

  const data = await getCurrentLocation();
  setData(itemList[i2].field.id, undefined);
  setTimeout(() => {
    setData(itemList[i2].field.id, data);
  }, 100);
}

export async function OnchangeCommunityRule(id, setData, item, itemList, v) {
  const cname = localStorage.getItem('CurrentAddress') ?
    localStorage.getItem('CurrentAddress').split(',,,')[0] :
    'United Arab Emirates';

  if (!item.data.specialKey) return;
  if (item.data.specialKey !== 'community') return;

  if (item.data.specialKey === 'community')
    localStorage.setItem('CurrentAddress', `${cname} ,,, ${v.lookupItemName}`);

  const currentIndex = itemList.indexOf(itemList.find((f) => f.field.id.toLowerCase() === id));
  resetAllValue(id, setData, itemList[currentIndex], itemList);
  const i1 = itemList.indexOf(
    itemList.find(
      (f) => f.field.id.toLowerCase() === itemList[currentIndex].data.hasEffectOn.toLowerCase()
    )
  );
  if (!itemList[i1]) return;
  const result = await lookupItemsGetId({
    lookupTypeId: itemList[i1].data.lookup,
    lookupParentId: v.lookupItemId,
  });
  itemList[i1].data.enum = [];
  if (!(result && result.status && result.status !== 200))
    result.map((items) => itemList[i1].data.enum.push(items));
  v.addressType = item.data.addressType;

  const countryIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'country');
  const cityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'city');
  const districtIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'district');
  const parentsItems = JSON.parse(v.lookupItemParents);

  const districtLookup = {
    lookupType: parentsItems[0].LookupType,
    lookupItemId: parentsItems[0].LookupItemId,
    lookupItemName: parentsItems[0].LookupItemName,
  };
  const cityLookup = {
    lookupType: parentsItems[1].LookupType,
    lookupItemId: parentsItems[1].LookupItemId,
    lookupItemName: parentsItems[1].LookupItemName,
  };
  const countryLookup = {
    lookupType: parentsItems[2].LookupType,
    lookupItemId: parentsItems[2].LookupItemId,
    lookupItemName: parentsItems[2].LookupItemName,
  };

  if (
    itemList[cityIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === cityLookup.lookupItemId
    ) === -1
  )
    itemList[cityIndex].data.enum.push(cityLookup);
  setData(itemList[cityIndex].field.id, cityLookup);
  if (
    itemList[countryIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === countryLookup.lookupItemId
    ) === -1
  )
    itemList[countryIndex].data.enum.push(countryLookup);
  setData(itemList[countryIndex].field.id, countryLookup);

  if (
    itemList[districtIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === districtLookup.lookupItemId
    ) === -1
  )
    itemList[districtIndex].data.enum.push(districtLookup);
  setData(itemList[districtIndex].field.id, districtLookup);

  if (!itemList[currentIndex].data.effectOnMap) return;
  const i2 = itemList.indexOf(
    itemList.find((f) => f.field.id.toLowerCase() === itemList[currentIndex].data.effectOnMap)
  );

  const data = await getCurrentLocation();
  setData(itemList[i2].field.id, undefined);
  setTimeout(() => {
    setData(itemList[i2].field.id, data);
  }, 100);
}

export async function OnchangeSubCommunityRule(id, setData, item, itemList, v) {
  const cname = localStorage.getItem('CurrentAddress') ?
    localStorage.getItem('CurrentAddress').split(',,,,')[0] :
    'United Arab Emirates';

  if (!item.data.specialKey) return;
  if (item.data.specialKey !== 'subcommunity') return;
  if (item.data.specialKey === 'subcommunity')
    localStorage.setItem('CurrentAddress', `${cname} ,,,, ${v.lookupItemName}`);
  const currentIndex = itemList.indexOf(itemList.find((f) => f.field.id.toLowerCase() === id));
  resetAllValue(id, setData, itemList[currentIndex], itemList);
  // const i1 = itemList.indexOf(
  //   itemList.find(
  //     (f) => f.field.id.toLowerCase() === itemList[currentIndex].data.hasEffectOn.toLowerCase()
  //   )
  // );
  // if (!itemList[i1]) return;
  // const result = await lookupItemsGetId({
  //   lookupTypeId: itemList[i1].data.lookup,
  //   lookupParentId: v.lookupItemId,
  // });
  // itemList[i1].data.enum = [];
  // if (!(result && result.status && result.status !== 200))
  //   result.map((items) => itemList[i1].data.enum.push(items));
  // v.addressType = item.data.addressType;
  const countryIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'country');
  const cityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'city');
  const districtIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'district');
  const communityIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === 'community');
  const parentsItems = JSON.parse(v.lookupItemParents);
  const districtLookup = {
    lookupType: parentsItems[1].LookupType,
    lookupItemId: parentsItems[1].LookupItemId,
    lookupItemName: parentsItems[1].LookupItemName,
  };
  const cityLookup = {
    lookupType: parentsItems[2].LookupType,
    lookupItemId: parentsItems[2].LookupItemId,
    lookupItemName: parentsItems[2].LookupItemName,
  };
  const countryLookup = {
    lookupType: parentsItems[3].LookupType,
    lookupItemId: parentsItems[3].LookupItemId,
    lookupItemName: parentsItems[3].LookupItemName,
  };
  const communityLookup = {
    lookupType: parentsItems[0].LookupType,
    lookupItemId: parentsItems[0].LookupItemId,
    lookupItemName: parentsItems[0].LookupItemName,
  };

  if (
    itemList[cityIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === cityLookup.lookupItemId
    ) === -1
  )
    itemList[cityIndex].data.enum.push(cityLookup);
  setData(itemList[cityIndex].field.id, cityLookup);
  if (
    itemList[countryIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === countryLookup.lookupItemId
    ) === -1
  )
    itemList[countryIndex].data.enum.push(countryLookup);
  setData(itemList[countryIndex].field.id, countryLookup);

  if (
    itemList[districtIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === districtLookup.lookupItemId
    ) === -1
  )
    itemList[districtIndex].data.enum.push(districtLookup);
  setData(itemList[districtIndex].field.id, districtLookup);

  if (
    itemList[communityIndex].data.enum.findIndex(
      (elamant) => elamant.lookupItemId === communityLookup.lookupItemId
    ) === -1
  )
    itemList[communityIndex].data.enum.push(communityLookup);
  setData(itemList[communityIndex].field.id, communityLookup);

  if (!itemList[currentIndex].data.effectOnMap) return;
  const i2 = itemList.indexOf(
    itemList.find((f) => f.field.id.toLowerCase() === itemList[currentIndex].data.effectOnMap)
  );

  const data = await getCurrentLocation();
  setData(itemList[i2].field.id, undefined);
  setTimeout(() => {
    setData(itemList[i2].field.id, data);
  }, 100);
}
