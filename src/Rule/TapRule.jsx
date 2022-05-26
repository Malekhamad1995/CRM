export const TabRule = async (
  item,
  setJsonForm,
  jsonForm,
  v,
  setSteps,
  steps,
  itemList,
  setitemList
) => {

  if (item && item.data && item.data.specialKey !== 'UnitOperationType') return;
  if (v === undefined || v === null) return;
  const rentTap = item.data.hasEffectOn;
  const salesTap = item.data.hasEffectedFrom;

  let unitForm = localStorage.getItem('unit_form') ?
    JSON.parse(localStorage.getItem('unit_form')) :
    undefined;

  let unitsteps = localStorage.getItem('unit_step') ?
    JSON.parse(localStorage.getItem('unit_step')) :
    undefined;

  if (!unitForm) {
    localStorage.setItem('unit_form', JSON.stringify(jsonForm));
    unitForm = JSON.parse(localStorage.getItem('unit_form'));
  }

  if (!unitsteps) {
    localStorage.setItem('unit_step', JSON.stringify(steps));
    unitsteps = JSON.parse(localStorage.getItem('unit_step'));
  }

  const salesTapIndex = unitForm.indexOf(unitForm.find((f) => f[0].data.description === salesTap));
  const rentTapIndex = unitForm.indexOf(unitForm.find((f) => f[0].data.description === rentTap));
  const salesListingTapIndex = unitForm.indexOf(unitForm.find((f) => f[0].data.description === 'Lease Listing Details'));
  const rentListingTapIndex = unitForm.indexOf(unitForm.find((f) => f[0].data.description === 'Sale Listing Details'));
  const saleValue = 430;
  const rcentValue = 431;

  const getItemList = (unit) => {
    const list = [];
    unit.map((value) => {
      value.map((sub) => {
        list.push(sub);
      });
    });
    return list;
  };

  if (v && v.lookupItemId === saleValue) {
    unitsteps.splice(salesTapIndex, 1);
    unitForm.splice(salesTapIndex, 1);
    unitsteps.splice(salesListingTapIndex, 1);
    unitForm.splice(salesListingTapIndex, 1);
    setJsonForm([...unitForm]);
    setSteps([...unitsteps]);
    setitemList([...getItemList(unitForm)]);
  } else if (v && v.lookupItemId === rcentValue) {
    unitForm.splice(rentTapIndex, 1);
    unitsteps.splice(rentTapIndex, 1);
     unitForm.splice(rentListingTapIndex, 1);
    unitsteps.splice(rentListingTapIndex, 1);
    setJsonForm([...unitForm]);
    setSteps([...unitsteps]);



    setitemList([...getItemList(unitForm)]);
  } else {
    setJsonForm([...unitForm]);
    setSteps([...unitsteps]);



    setitemList([...getItemList(unitForm)]);
  }
};
