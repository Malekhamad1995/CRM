export const VisaRules = (newValue, item, onValueOrItemChanged, allItems) => {
  if (item.field.id === 'visa_issue_date') {
    const i = allItems.findIndex(
      allItems.find((f) => f.field.id.toLowerCase() === item.data.hasEffectOn.toLowerCase())
    );
    if (i !== -1) onValueOrItemChanged(newValue, i, 'minDate', 'data');
  }
};
