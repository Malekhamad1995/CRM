import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { config } from '../config/config';
import { ProgressEnum } from '../Enums';
// import { ActiveItemActions } from '../store/ActiveItem/ActiveItemActions';

// eslint-disable-next-line import/no-mutable-exports
export let GlobalTranslate = null;
// eslint-disable-next-line import/no-mutable-exports
export let GlobalHistory = null;
let logoutAction = null;
// eslint-disable-next-line no-unused-vars
let setReRenderSideMenu = null;
let renderVar = false;
let setRenderVar = null;
// eslint-disable-next-line import/no-mutable-exports
export const ResetActiveItem = null;

export const SetGlobalRerender = (setRender, render) => {
  renderVar = render;
  setRenderVar = setRender;
};

// variable which will point to react-router history
let loading = null;
let loginDialog = null;
let contactDialog = null;
let mapDialog = null;
const look = [];
let setSideMenuIsOpen = null;
let sideMenuIsOpen = false;
let setSideMenuComponent = null;
let setBottomBoxComponent = null;
let sideMenuComponent = null;
let setBXRerender = null;
let bXRerender = null;
const dispatchLog = null;

// component which we will mount on top of the app
function MiddlewareHelper() {
  GlobalTranslate = useTranslation();
  GlobalHistory = useHistory();
  return null;
}
export { MiddlewareHelper as Middleware };

export const GlobalRerender = () => {
  setRenderVar(!renderVar);
};

// export react-router history

export function setLogoutAction(callback) {
  logoutAction = callback;
}

export function LogoutAction() {
  return logoutAction;
}
export function setLoading(callback) {
  loading = callback;
}

export function changeLoading(flag) {
  loading(flag);
}

export function setloginDialog(callback) {
  loginDialog = callback;
}

export function ShowloginDialog() {
  loginDialog(true);
}
export function setSideMenuIsOpenCallback(callback) {
  setSideMenuIsOpen = callback;
}

export function getSideMenuStatus() {
  return sideMenuIsOpen;
}
export function sideMenuComponentCallback(callback) {
  setSideMenuComponent = callback;
}
export function bottomBoxComponentCallback(callback) {
  setBottomBoxComponent = callback;
}
export function setReRenderSideMenuCallback(callback) {
  setReRenderSideMenu = callback;
}
export function sideMenuComponentUpdate(component) {
  setSideMenuComponent(component);
  sideMenuComponent = component;
}
export function bottomBoxComponentUpdate(component) {
  if (setBottomBoxComponent) setBottomBoxComponent(component);
}
export function getSideMenuComponent() {
  return sideMenuComponent;
}
export function bxSliderRerenderCallback(callback) {
  setBXRerender = callback;
  bXRerender = false;
}
export function bxSliderRerenderUpdate(status) {
  setBXRerender(status);
  bXRerender = status;
}
export function bxSliderRerenderClear() {
  setBXRerender = null;
  bXRerender = null;
}
export function getBxSliderRerender() {
  return bXRerender;
}
export function sideMenuIsOpenUpdate(state = null) {
  setSideMenuIsOpen(state !== null ? state : !sideMenuIsOpen);
  sideMenuIsOpen = state !== null ? state : !sideMenuIsOpen;
  if (bXRerender !== null) bxSliderRerenderUpdate(!bXRerender);
}
// export function getSideMenuComponent() {
//   return sideMenuIsOpen;
// }

export function setContactDialogs(callback) {
  contactDialog = callback;
}

export function setMapDialog(callback) {
  mapDialog = callback;
}

export function ShowMapDialog() {
  mapDialog(true);
}

export function ShowContactDialog() {
  contactDialog(true);
}

export function getLook() {
  return look;
}
export const getBgProgressColor = (value) => {
  if (value >= 80) return ProgressEnum['100-80'];
  if (value >= 60) return ProgressEnum['80-60'];
  if (value >= 30) return ProgressEnum['60-30'];
  if (value >= 0) return ProgressEnum['30-0'];
  return null;
};
export function getDownloadableLink(fileId) {
  const session = JSON.parse(localStorage.getItem('session'));
  const userId = session ? session.userId : '';
  const fileToken = session ? session.fileToken : '';
  return `${config.server_address}/FileManager/File/DownloadFile/${userId}/${config.applicationId}/${fileToken}/${fileId}?sourceId=${config.source}`;
}

export function getPublicDownloadableLink(fileName) {
  return `${config.server_address}/FileManager/File/DownloadPublicFile/${fileName}`;
}

export function Log(data) {
  if (dispatchLog) dispatchLog(data);
}
export const floatHandler = (value, maxFloatNumbers) => {
  const valueAfterSplit = value.toString().split('.');
  if (valueAfterSplit.length === 2 && valueAfterSplit[1].length > maxFloatNumbers)
    return Number(value).toFixed(maxFloatNumbers);
  return Number(value).toFixed(0);
};
export const getErrorByName = (schemaObject, fieldName, type) => {
  if (!schemaObject.error || !schemaObject.error.details) {
    return {
      message: undefined,
      error: undefined,
      type: undefined,
    };
  }
  const item = schemaObject.error.details.find(
    (element) =>
      (!Number.isNaN(fieldName) && element.path.includes(fieldName)) ||
      (Number.isNaN(fieldName) && !fieldName.includes('.') && element.path.includes(fieldName)) ||
      (Number.isNaN(fieldName) &&
        fieldName.includes('.') &&
        element.path.length >= fieldName.split('.').length &&
        element.path.slice(0, fieldName.split('.').length).join('.') === fieldName)
  );
  if (!item || (type && item.type !== type)) {
    return {
      message: undefined,
      error: undefined,
      type: undefined,
    };
  }
  return {
    message: item.message,
    error: true,
  };
};
