import { lookupItemsGetId, lookupItemsGet } from '../Services';
import { getLook as look } from '../Helper';

export async function LookupRule(item, allItems) {
  if (
    !(
      item.field.FieldType === 'select' ||
      (item.field.FieldType === 'address' && item.data.uiType === 'select') ||
      item.field.FieldType === 'UploadFiles'
    )
  )
    return;
  if (!item.data.enum) item.data.enum = [];
  if (!item.data.lookup) return;
  const effectedItemIndex = allItems.findIndex(
    (f) =>
      item.data.hasEffectedFrom &&
      f.field.id &&
      f.field.id.toLowerCase() === item.data.hasEffectedFrom.toLowerCase()
  );
  if ((look() && !look().find((f) => f === item.field.id)) || item.data.lookup) {
    if (
      (effectedItemIndex !== -1 &&
        allItems[effectedItemIndex].data &&
        allItems[effectedItemIndex].data.valueToEdit &&
        allItems[effectedItemIndex].data.valueToEdit.lookupItemId) ||
      !item.data.specialKey || item.data.lookup
    ) {
      const result = await lookupItemsGetId({
        lookupTypeId: item.data.lookup,
        lookupParentId:
          (effectedItemIndex !== -1 &&
            allItems[effectedItemIndex].data &&
            allItems[effectedItemIndex].data.valueToEdit &&
            allItems[effectedItemIndex].data.valueToEdit.lookupItemId) ||
          null,
      });
      if ((result && result.data && result.data.ErrorId) || !result) return;
      if (item.data.enum.length === 0) result.map((items) => item.data.enum.push(items));
    } else if (item.data.specialKey) {
      const res = await lookupItemsGet({
        lookupTypeName: item.data.specialKey,
        pageIndex: 1,
        pageSize: 25,
      });
      if ((res && res.data && res.data.ErrorId) || !res || !res.result) return;
      if (item.data.enum.length === 0) res.result.map((items) => item.data.enum.push(items));
    }
    look().push(item.field.id);
    // await fillAllEffectedByDataOnEdit(item, allItems);
  }
}
