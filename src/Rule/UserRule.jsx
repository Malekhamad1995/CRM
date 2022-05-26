/* eslint-disable no-unused-vars */
import { OrganizationUserSearch } from '../Services';
import { AgentRoleEnum } from '../Enums/AgentRoleEnum';

let oldvalue = '';
let timer = null;
export const getUserTypeId = (itemList, values, fieldId) => {
  // const operationTypeIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'operation_type'));
  // const operationType = (operationTypeIndex !== -1) ? values[operationTypeIndex] : (values.operation_type || null);
  const operationType = values && values['operation_type'] ; 
  if (operationType) {
    if (operationType.lookupItemName === 'Buy' && fieldId && fieldId === 'listing_agent')
      return AgentRoleEnum.SaleListingAgent.value;

    if (operationType.lookupItemName === 'Sale' && fieldId && fieldId === 'listing_agent')
      return AgentRoleEnum.SaleListingAgent.value;

    if (operationType.lookupItemName === 'Rent' && fieldId && fieldId === 'listing_agent')
      return AgentRoleEnum.LeaseListingAgent.value;

    if (operationType.lookupItemName === 'Sale' && fieldId && fieldId === 'referredto')
      return AgentRoleEnum.SaleAgent.value;

    if (operationType.lookupItemName === 'Buy' && fieldId && fieldId === 'referredto')
      return AgentRoleEnum.SaleAgent.value;

    if (operationType.lookupItemName === 'Rent' && fieldId && fieldId === 'referredto')
      return AgentRoleEnum.LeaseAgent.value;
  }
    if (fieldId === 'listing_agent')
    return AgentRoleEnum.SaleListingAgent.value;

     if (fieldId === 'rent_listing_agent')
       return AgentRoleEnum.LeaseListingAgent.value;
     if (fieldId === 'rent_listing-agent')
    return AgentRoleEnum.LeaseListingAgent.value;

  return null;
};

export const UserRule = async (item, value, setRerender, itemList, values) => {
  if (!item.data.searchKey) return;
  if (item.data.searchKey !== 'User') return;
  if (item.value === '') return;
  if (value === '') return;
  if (timer !== null) clearTimeout(timer);
  if (oldvalue === value) return;
  oldvalue = value;

  let userTypeId = null;
  userTypeId = itemList && values ? getUserTypeId(itemList, values, item.field.id) : null;

  const filter = {
    pageSize: 25,
    pageIndex: 1,
    name: value,
    userName: null,
    phoneNumber: null,
    email: null,
    userStatusId: 2,
    userTypeId
 

  };
  timer = setTimeout(async () => {
    const rs = await OrganizationUserSearch({ ...filter });

    item.data.enum = [];
    if (!rs || !rs.result) return;
    rs.result.map((element) => {
      item.data.enum.push({
        id: element.id,
        name: element.fullName,
        phone: element.phoneNumber,
        email: element.email,
        userName: element.userName,
        branch:element.branch , 
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

export const UserDefaultRule = async (item, setRerender, itemList, values) => {
  if (item.data.searchKey !== 'User') return;
 if (item.data.enum) return;
  let userTypeId = null;
  userTypeId = itemList && values ? getUserTypeId(itemList, values, item.field.id) : null;

  const filter = {
    pageSize: 25,
    pageIndex: 1,
    name: null,
    userName: null,
    phoneNumber: null,
    email: null,
    userStatusId: 2,
    userTypeId
   
  };

  const rs = await OrganizationUserSearch({ ...filter });
  item.data.enum = [];
  if (!rs || !rs.result) return;
  rs.result.map((value) => {
    item.data.enum.push({
      id: value.id,
      name: value.fullName,
      phone: value.phoneNumber,
      email: value.email,
      userName: value.userName,
      branch:value.branch , 
    });
  });
  setRerender(Math.random());
};
