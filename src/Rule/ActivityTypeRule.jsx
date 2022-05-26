/* eslint-disable no-unused-vars */
import { GetAllActivityTypesAPI } from '../Services';

let oldvalue = '';
let timer = null;

export const ActivityTypeRule = async (item, value, setRerender) => {
  if (!item.data.searchKey) return;
  if (item.data.searchKey !== 'ActivityType') return;
  if (item.value === '') return;
  if (value === '') return;
  if (timer !== null) clearTimeout(timer);
  if (oldvalue === value) return;
  oldvalue = value;

  const filter = {
    pageSize: 25,
    pageIndex: 0,
    search: value,

  };
  timer = setTimeout(async () => {
    const rs = await GetAllActivityTypesAPI({ ...filter });

    item.data.enum = [];
    if (!rs || !rs.result) return;
    rs.result.map((element) => {
      item.data.enum.push({
        id: element.activityTypeId,
        name: element.activityTypeName,
      });
    });
    if (
      item.data.valueToEdit &&
      item.data.valueToEdit.id &&
      item.data.enum.findIndex(
        (element) => element.id === item.data.valueToEdit && item.data.valueToEdit.id
      ) === -1
    )
      item.data.enum.push(item.data.valueToEdit && item.data.valueToEdit);

    setRerender(Math.random());
  }, 500);
};

export const ActivityTypeRuleDefaultRule = async (item, setRerender, itemList, values) => {
  if (item.data.searchKey !== 'ActivityType') return;
  if (item.data.enum) return;

  const rs = await GetAllActivityTypesAPI({ pageIndex: 0, pageSize: 25 });
  item.data.enum = [];
  if (!rs || !rs.result) return;
  rs.result.map((value) => {
    item.data.enum.push({
        id: value.activityTypeId,
        name: value.activityTypeName,

    });
  });
  setRerender(Math.random());
};
