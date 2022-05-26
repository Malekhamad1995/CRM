import { lookupItemsGetId } from '../Services';

export const LookupsRules = (
  // item,
  // onValueOrItemChanged,
  allItems,
  allItemsValues,
  onLoadingsChanged
  // loadings,
) => {
  if (!allItems || !Array.isArray(allItems)) return;
  const allItemsLocal = [...allItems];
  // const newItems = allItemsLocal.map((allItems, tabIndex) => {
  allItems.map(async (item, index) => {
    if (
      item &&
      item.data &&
      item.data.lookup &&
      item.data.lookup !== ''
      // && item.data.enum.length === 0
      // loadings.findIndex(
      //   (element) =>
      //     element.key === item.field.id && !element.result
      // && element.fromEffect !== 'fromEffect'
      // ) === -1
    ) {
      const hasEffectFromIndex = allItems.findIndex(
        (f) =>
          f.field.id.toLowerCase() ===
          (item.data.hasEffectedFrom && item.data.hasEffectedFrom.toLowerCase())
      );
      // if (hasEffectFromIndex !== -1 && !allItemsValues[allItems[hasEffectFromIndex].field.id])
      //   return;
      onLoadingsChanged(true, item.field.id);
      const result = await lookupItemsGetId({
        lookupTypeId: item.data.lookup,
        lookupParentId:
          (hasEffectFromIndex !== -1 &&
            allItemsValues[allItems[hasEffectFromIndex].field.id] &&
            allItemsValues[allItems[hasEffectFromIndex].field.id].lookupItemId) ||
          null,
      });
      if (!(result && result.status && result.status !== 200))
        allItemsLocal[index].data.enum = result;
      // {
      // if (result.length > 0) {
      //   onValueOrItemChanged(result, undefined, 'enum', 'data');
      onLoadingsChanged(false, item.field.id);
      // } else onLoadingsChanged(false, item.field.id, []);
      // } else onLoadingsChanged(false, item.field.id, []);
    }
  });
  // return allItems[tabIndex];
  // });
  return allItemsLocal;
};
