import moment from 'moment';

export function PassportRule(id, item, itemList, value) {
  if (id === 'passport_issue-date') {
    const i = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'passport_expiry-date')
    );
    if (i !== -1)
      itemList[i].data.minDate = moment(value).add(1, 'days');;
  }
  if (id === 'passport_expiry-date') {
    const i = itemList.indexOf(
      itemList.find((f) => f.field.id.toLowerCase() === 'passport_issue-date'));

    if (i !== -1)
      itemList[i].data.maxDate = moment(value).add(-1, 'days');
  }

}


