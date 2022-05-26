import { lookupItemsGet } from '../Services';
//setLoading in Parmeatres
export async function SearchLookupRule(item, searchValue, itemList, setData, setreRnder) {
  // setLoading(true);
  if (
    !(
      item.field.FieldType === 'select' ||
      (item.field.FieldType === 'address' && item.data.uiType === 'select')
    )
  )
    return;
  if (!item.data.lookup) return;
  const res = await lookupItemsGet({
    lookupTypeName: item.data.specialKey,
    lookupTypeId: item.data.lookup,
    pageIndex: 1,
    pageSize: 25,
    searchedItem: searchValue,
  });

  if ((res && res.data && res.data.ErrorId) || !res || !res.result) return;
  const itemIndex = itemList.findIndex((f) => f.field.id.toLowerCase() === item.field.id);
  // setData(itemIndex, null);
  itemList[itemIndex].data.enum = res.result;
  // setLoading(false);

  setreRnder(Math.random());
}
