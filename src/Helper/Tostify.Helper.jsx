import { useToasts } from 'react-toast-notifications';

let GlobalAddToaster = null;
export const GlobalToasterGenerator = () => {
  GlobalAddToaster = useToasts();

  return null;
};

export const showSuccess = (
  message,
  onDismiss,
  configuration = {
    appearance: 'success',
    autoDismiss: true,
    autoDismissTimeout: 4000,
  },
) => {
  if (GlobalAddToaster)
    GlobalAddToaster.addToast(message, { ...configuration, onDismiss });
};

export const showError = (
  message,
  onDismiss,
  configuration = {
    appearance: 'error',
    autoDismiss: true,
    autoDismissTimeout: 4000,
  },
) => {
  if (GlobalAddToaster)
    GlobalAddToaster.addToast(message, { ...configuration, onDismiss });
};

export const showinfo = (
  message,
  onDismiss,
  configuration = {
    appearance: 'info',
    autoDismiss: true,
    autoDismissTimeout: 4000,
  },
) => {
  if (GlobalAddToaster)
    GlobalAddToaster.addToast(message, { ...configuration, onDismiss });
};

export const showWarn = (
  message,
  onDismiss,
  configuration = {
    appearance: 'warning',
    autoDismiss: true,
    autoDismissTimeout: 4000,
  },
) => {
  if (GlobalAddToaster)
    GlobalAddToaster.addToast(message, { ...configuration, onDismiss });
};

// import { toast } from 'react-toastify';
//    "react-toastify": "^5.4.1",
// function showSuccess(message, conifgration = { autoClose: 3000 }) {
//   toast.success(message, conifgration);
// }

// function showError(message, conifgration = { autoClose: 3000 }) {
//   toast.error(message, conifgration);
// }

// function showWarn(message, conifgration = { autoClose: 3000 }) {
//   toast.warn(message, conifgration);
// }

// function showinfo(message, conifgration = { autoClose: 3000 }) {
//   toast.info(message, conifgration);
// }

// export {
//  showSuccess, showError, showWarn, showinfo
