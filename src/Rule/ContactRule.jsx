import { ClassificationsContactEnum, ContactsFieldsId } from '../Enums';
import { GetAdvanceSearchContacts, GetContacts, GetCorporateContacts } from '../Services';

let oldvalue = '';
let timer = null;
let isAdvance = null;
// eslint-disable-next-line prefer-const
export const ContactRule = async (item, value, setRerender) => {
  // eslint-disable-next-line no-constant-condition

  /// ////////////////////////////////////////////////////////////////////////////////
  if (item.field.id === 'lease_lead_owner') isAdvance = true;
  if (item.field.id === 'lead_owner') isAdvance = true;
  // When Delete This Tow Line The Api Of Get contacts Will Ba Always Send (Is advance) == False In All Form Builder Contact Rule
  /// ////////////////////////////////////////////////////////////////////////////////

  if (!item.data.searchKey) return;
  if (item.data.searchKey !== 'contact') return;
  if (item.value === '') return;
  if (value === '') return;
  if (timer !== null) clearTimeout(timer);
  if (oldvalue === value) return;
  oldvalue = value;

  timer = setTimeout(async () => {
    let rs = null;
    let classIndex = -1;
    if (item.data.dependOn) classIndex = ClassificationsContactEnum.findIndex((f) => item.data.dependOn.toLowerCase() === f.name.toLowerCase());
    if (item.data.dependOn === 'company') rs = await GetCorporateContacts({ pageIndex: 0, pageSize: 10, search: value });
    else if (classIndex !== -1) {

      rs = await GetContacts({
        pageIndex: 0, pageSize: 10, search: value, classificationId: ClassificationsContactEnum[classIndex].Id
      });
    } else rs = await GetContacts({ pageIndex: 0, pageSize: 10, search: value, isAdvance: false });

    item.data.enum = [];

    if (!rs || !rs.result) return;
    rs.result.map((element) => {
      if (!element.contact) return;
      if (element.contact.contact_type_id !== 2) {
        item.data.enum.push({
          id: element.contactsId,
          name: `${element.contact.first_name} ${element.contact.last_name}`,
          phone: (element.contact.mobile && element.contact.mobile.phone) || '',
          type: element.contact.contact_type_id,
        });
      } else {
        item.data.enum.push({
          id: element.contactsId,
          name: element.contact.company_name,
          phone: (element.contact.landline_number && element.contact.landline_number.phone) || '',
          type: element.contact.contact_type_id,
        });
      }
    });

    setRerender(Math.random());
  }, 500);
};
export const ContactDefaultRule = async (item, setRerender) => {
  
  if (item.data.searchKey !== 'contact') return;
  if (item.data.enum) return;
  let rs = null;

  let classIndex = -1;
  if (item.data.dependOn) classIndex = ClassificationsContactEnum.findIndex((f) => item.data.dependOn.toLowerCase() === f.name.toLowerCase());
  if (item.data.dependOn === 'company') rs = await GetCorporateContacts({ pageIndex: 0, pageSize: 10 });
  else if (classIndex !== -1) rs = await GetContacts({ pageIndex: 0, pageSize: 10, classificationId: ClassificationsContactEnum[classIndex].Id });
  else rs = await GetContacts({ pageIndex: 0, pageSize: 10, isAdvance: false });

  item.data.enum = [];
  if (!rs || !rs.result) return;
  rs.result.map((value) => {
    if (value.contact.contact_type_id !== 2) {
      item.data.enum.push({
        id: value.contactsId,
        name: `${value.contact.first_name} ${value.contact.last_name}`,
        phone: (value.contact.mobile &&  value.contact.mobile.phone),
        type: value.contact.contact_type_id,
      });
    } else {
      item.data.enum.push({
        id: value.contactsId,
        name: value.contact.company_name,
        phone: (value.contact.landline_number && value.contact.landline_number.phone),
        type: value.contact.contact_type_id,
      });
    }
  });

  setRerender(Math.random());
};

export const AutoSelectContactRule = async (item, setRerender, contactId, setData, index, setNewValue) => {
  if (item.data.searchKey !== 'contact') return;
  if (item.data.enum) return;
  const rs = await GetAdvanceSearchContacts({ pageIndex: 0, pageSize: 1 }, { criteria: { Ids: [{ searchType: 2, value: contactId }] }, fromDate: null, toDate: null });
  if (!rs || !rs.result) return;
  rs.result.map((value) => {
    if (value.contact.contact_type_id !== 2) {
      const obj = {
        id: value.contactsId,
        name: `${value.contact.first_name} ${value.contact.last_name}`,
        type: value.contact.contact_type_id,
      };
      setData(index, obj);
      setNewValue(obj);
    } else {
      const company =
      {
        id: value.contactsId,
        name: value.contact.company_name,
        type: value.contact.contact_type_id,
      };

      setData(index, company);
      setNewValue(company);
    }
  });

  setRerender(Math.random());
};

export async function OnAddnewContactRule(
  item,
  itemList,
  setData,
  itemsDialogValue,
) {
  const fieldkey = ContactsFieldsId.filter((x) => x === item.field.id);
  if (itemsDialogValue && itemsDialogValue.contactId !== null) {
    const i1Index = itemList.findIndex((f) => f.field.id.toLowerCase() === fieldkey[0]);
    if (i1Index && itemsDialogValue && itemsDialogValue.contactId) {
      setData(fieldkey[0], {
        id: itemsDialogValue && itemsDialogValue.contactId,
        name: itemsDialogValue && itemsDialogValue.contactsTypeId === 1 ? `${itemsDialogValue.firstName} ${itemsDialogValue.lastName}` : itemsDialogValue.companyName,
        phone: itemsDialogValue && itemsDialogValue.contactsTypeId === 1 ? itemsDialogValue.mobile : itemsDialogValue.landLineNumber,
        type: itemsDialogValue && itemsDialogValue.contactsTypeId,
      });
    }
  }
}
