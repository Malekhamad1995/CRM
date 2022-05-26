import moment from 'moment';

export function DateRule(item, itemList, e) {
  if (item.field.id === 'dateFrom' || item.field.id === 'fromDate') {
    const dateToIndex = itemList.indexOf(
      itemList.find((f) => f.field.id === 'dateTo')
    );
    const toDateIndex = itemList.indexOf(
      itemList.find((f) => f.field.id === 'toDate')
    );

    if (e) {
      if (dateToIndex !== -1)

        itemList[dateToIndex].data.minDate = moment(e);

      else if (toDateIndex !== -1)
        itemList[toDateIndex].data.minDate = moment(e);
    } else
      itemList[dateToIndex].data.minDate = moment(e) || '';
  } else if (item.field.id === 'from_date') {
    const dateToIndex = itemList.indexOf(
      itemList.find((f) => f.field.id === 'to_date')
    );

    if (e && dateToIndex !== -1)
      itemList[dateToIndex].data.minDate = moment(e);

    else
      itemList[dateToIndex].data.minDate = '';
  } else if (item.field.id === 'from_transaction-date') {
    const dateToIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'to_transaction-date'));
    if (e && dateToIndex !== -1)
      itemList[dateToIndex].data.minDate = moment(e);
    else
      itemList[dateToIndex].data.minDate = '';
  }
}

export const CheckIsDateToAfterDateFromRule = (dateFromValue, item, values) => {
  let isDateFromLarger = false;
  if ((item.field.id === 'dateFrom' && values && values.dateTo) || (item.field.id === 'fromDate' && values && values.dateTo))
    isDateFromLarger = moment(dateFromValue).diff(moment(values.dateTo)) > 0;

  else if (item.field.id === 'fromDate' && values && values.toDate)
    isDateFromLarger = moment(dateFromValue).diff(moment(values.toDate)) > 0;

  else if (item.field.id === 'from_date' && values && values.to_date)
    isDateFromLarger = moment(dateFromValue).diff(moment(values.to_date)) > 0;

  else if (item.field.id === 'from_transaction-date' && values && values['to_transaction-date'])
    isDateFromLarger = moment(dateFromValue).diff(moment(values['to_transaction-date'])) > 0;

  return isDateFromLarger;
};

export const CheckIsDateValidRule = (dateToValue, item, values) => {
  let isDateFromLarger = false;
  if (item.field.id === 'dateTo' && values && values.dateFrom)
    isDateFromLarger = moment(dateToValue).diff(moment(values.dateFrom)) < 0;

  else if (item.field.id === 'dateTo' && values && values.fromDate)
    isDateFromLarger = moment(dateToValue).diff(moment(values.fromDate)) < 0;

  else if (item.field.id === 'toDate' && values && values.fromDate)
    isDateFromLarger = moment(dateToValue).diff(moment(values.fromDate)) < 0;

  else if (item.field.id === 'to_date' && values && values.from_date)
    isDateFromLarger = moment(dateToValue).diff(moment(values.from_date)) < 0;

  else if (item.field.id === 'to_transaction-date' && values && values['from_transaction-date'])
    isDateFromLarger = moment(dateToValue).diff(moment(values['from_transaction-date'])) < 0;

  return isDateFromLarger;
};
