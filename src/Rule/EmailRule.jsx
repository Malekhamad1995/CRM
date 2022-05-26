import { GetContacts, GetContactByEmail } from '../Services';

export async function duplicateEmailRole(item, itemsValue) {
    if (item.data.CommunicationType !== 'Email') return true;
    const res = await GetContactByEmail({ pageIndex: 0, pageSize: 1, search: itemsValue });
    if (res && res.result && res.result.length !== 0) return false;

    return true;
}

export async function duplicatePhoneRole(item, itemsValue) {
    if (item.data.CommunicationType !== 'Phone') return true;
    const res = await GetContacts({ pageIndex: 0, pageSize: 1, search: itemsValue , isAdvance:false });
    if (res && res.result && res.result.length !== 0) return false;

    return true;
}
