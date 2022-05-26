export const TableActions = {
  add: {
    key: 'add', // must be unique
    icon: 'table-action-icon mdi mdi-plus',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-green',
  },
  edit: {
    key: 'edit', // must be unique
    icon: 'table-action-icon  mdi mdi-lead-pencil',
    buttonClasses: 'table-action-btn  btns-icon theme-solid bg-secondary',
  },
  view: {
    key: 'view', // must be unique
    icon: 'table-action-icon mdi mdi-eye-outline',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-green',
  },
  viewSchemaTabelView: {
    key: 'viewText', // must be unique
    icon: 'table-action-icon mdi mdi-eye-outline bg-green',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:view',
  },
  delete: {
    key: 'delete', // must be unique
    icon: 'table-action-icon mdi mdi-trash-can',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-danger',
  },
  check: {
    key: 'check',
    icon: 'table-action-icon mdi mdi-check ',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-green',
  },
  close: {
    key: 'close',
    icon: 'table-action-icon mdi mdi-close',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-secondary',
  },
  phone: {
    key: 'phone',
    icon: 'table-action-icon mdi mdi-phone',
    buttonClasses: 'table-action-btn btns-icon theme-action active bg-phone',
  },
  email: {
    key: 'email',
    icon: 'table-action-icon icons i-email',
    buttonClasses: 'table-action-btn btns-icon theme-action active bg-email',
  },
  whatsapp: {
    key: 'whatsapp',
    icon: 'table-action-icon mdi mdi-whatsapp',
    buttonClasses: 'table-action-btn btns-icon theme-action active bg-whatsapp',
  },
  account: {
    key: 'account',
    icon: 'table-action-icon icons i-account',
    buttonClasses: 'table-action-btn btns-icon theme-action active bg-account',
  },
  dotsHorizontal: {
    key: 'dotsHorizontal',
    icon: 'table-action-icon mdi mdi-dots-horizontal',
    buttonClasses: 'table-action-btn btns-icon c-white bg-secondary',
  },
  phoneSolid: {
    key: 'phoneSolid',
    icon: 'table-action-icon mdi mdi-phone',
    buttonClasses: 'table-action-btn btns-icon c-white bg-primary',
  },
  emailSolid: {
    key: 'emailSolid',
    icon: 'table-action-icon icons i-email',
    buttonClasses: 'table-action-btn btns-icon bg-primary',
  },
  openFile: {
    key: 'openFile',
    icon: 'table-action-icon mdi mdi-folder-open-outline c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:tables.open-file',
  },
  viewDetails: {
    key: 'viewDetails',
    icon: 'table-action-icon mdi mdi-eye-outline c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:tables.view-details',
  },
  deleteText: {
    key: 'deleteText',
    icon: 'table-action-icon mdi mdi-trash-can c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:delete',
  },
  editText: {
    key: 'editText',
    icon: 'table-action-icon mdi mdi-lead-pencil c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:edit',
  },
  approvedText: {
    key: 'approvedText',
    icon: 'table-action-icon mdi mdi-thumb-up-outline c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:approved',
  },
  downloadText: {
    key: 'downloadText',
    icon: 'table-action-icon mdi mdi-download-outline c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:download',
  },
  addPrimary: {
    key: 'addPrimary', // must be unique
    icon: 'table-action-icon mdi mdi-plus',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-primary',
  },
  print: {
    key: 'print', // must be unique
    icon: 'table-action-icon mdi mdi-cloud-print-outline',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-primary',
  },
  transaction: {
    key: 'transaction', // must be unique
    icon: 'table-action-icon mdi mdi-currency-usd',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-primary',
  },
  // buttonWithText: {
  //   key: 'buttonWithText',
  //   buttonClasses: 'btns',
  // },
  // textOnly: {
  //   key: 'textOnly',
  // },
  externalComponent: {
    key: 'externalComponent',
  },
  smsSolid: {
    key: 'smsSolid',
    icon: 'table-action-icon mdi mdi-cellphone',
    buttonClasses: 'table-action-btn btns-icon theme-solid',
  },
  whatsappSolid: {
    key: 'whatsappSolid', // must be unique
    icon: 'table-action-icon mdi mdi-whatsapp',
    buttonClasses: 'table-action-btn btns-icon theme-solid bg-green-dark',
  },
  virtualTour: {
    key: 'virtualTour',
    icon: 'table-action-icon mdi mdi-eye-outline c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:virtual-tour',
  },
  manageAgents: {
    key: 'manageAgents',
    icon: 'table-action-icon mdi mdi-account-multiple-outline bg-primary',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:manage-agents',
  },
  editIconAndLabel: {
    key: 'editIconAndLabel',
    icon: 'table-action-icon mdi mdi-lead-pencil bg-primary',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:edit',
  },
  deleteIconAndLabel: {
    key: 'deleteIconAndLabel',
    icon: 'table-action-icon mdi mdi-trash-can bg-danger',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:delete',
  },
  replyText: {
    key: 'replyText',
    icon: 'table-action-icon mdi mdi-reply c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:reply',
  },

  addPrimaryText: {
    key: 'addPrimaryText', // must be unique
    icon: 'table-action-icon mdi mdi-plus c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:addReceipt',
  },
  printText: {
    key: 'printText', // must be unique
    icon: 'table-action-icon mdi mdi-cloud-print c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:print',
  },
  transactionText: {
    key: 'transactionText', // must be unique
    icon: 'table-action-icon mdi mdi-currency-usd c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:transaction',
  },
  reassignAgent: {
    key: 'reassign-agent', // must be unique
    icon: 'table-action-icon mdi mdi-account-switch c-white',
    buttonClasses: 'table-action-btn btns theme-transparent miw-0',
    labelClasses: 'px-1 c-white fw-normal',
    label: 'Shared:reassign-agent',
  },
};
