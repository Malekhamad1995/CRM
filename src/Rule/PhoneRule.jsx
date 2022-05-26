
export function duplicatePhoneRole(type, item, itemList, itemsValue) {
  if (type !== 'phone') return;
  if (!item.data.duplicateValidation) return true;

  const currentIndex = itemList.indexOf(itemList.find((f) => f.field.id === item.field.id));
  const mobiles = itemList.filter((f) => f.field.FieldType === 'phone' && f.data.duplicateValidation);
  let state = true;

if (itemsValue[currentIndex] === undefined) return false;
  if (!itemsValue[currentIndex]) return false;
  if (itemsValue[currentIndex].length === 4) return false;
  mobiles.map((value) => {
    const eIndex = itemList.indexOf(itemList.find((f) => f.field.id === value.field.id));
    if (currentIndex === eIndex) {} else if (!state) {} else if (itemsValue[currentIndex] && itemsValue[currentIndex].phone && itemsValue[eIndex] && itemsValue[eIndex].phone && itemsValue[currentIndex].phone === itemsValue[eIndex].phone) state = false;
  });

  return state;
}


/**
 * @return {boolean}
 */
export function PhoneValidationRole(value) {
  if (!value) return true;
if (value.length === 4) return true;
  return value.length >= 9;
}
