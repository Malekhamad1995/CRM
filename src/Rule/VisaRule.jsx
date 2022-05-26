import moment from 'moment';

export function VisaRule(id, item, itemList, value) {
  if (id === 'visa_issue-date') {
    const i = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === item.data.hasEffectOn.toLowerCase())
    );
    if (i !== -1)
      itemList[i].data.minDate = moment(value).add(1, 'days');
  }
  if (id === 'visa_expiry-date') {
    const i = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'visa_issue-date')
);

    if (i !== -1)
      itemList[i].data.maxDate = moment(value).add(-1, 'days');
  }
}
