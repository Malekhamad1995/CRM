import React, { useState, useEffect, useCallback } from 'react';
import {
  FormControlLabel,
  Radio,
  FormControl,
  RadioGroup,
  FormLabel,
  Typography,
  Slider,
  Grid,
  Button,
  InputAdornment
} from '@material-ui/core';

import ChipInput from 'material-ui-chip-input';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { setTimeout } from 'core-js';
import {
  TitleRule,
  ContactRule,
  PropertyRule,
  PropertyOrUnitRule,
  OnchangeCountryRule,
  OnchangeCityRule,
  ContactDefaultRule,
  PropertyDefaultRule,
  OnchangeDistrictRule,
  OnchangeCommunityRule,
  LookupRule,
  OnchangeSubCommunityRule,
  UserRule,
  UserDefaultRule,
  ListingDateRule,
  AutoSelectContactRule,
  OnAddnewContactRule,
  OnAddnewPropertyRule,
  PassportRule,
  ActivityTypeRuleDefaultRule,
  ActivityTypeRule,
  StatusLeadDefaulRule1,
  OperationTypeRule,
  DateRule,
  CheckIsDateToAfterDateFromRule,
  CheckIsDateValidRule,
  ListingExpiryDateRule1,
  ListingDate1,
  SellerHasPaidRule,
  PriceSqmRule,
} from '../../../../../Rule';
import { PhoneValidationRole } from '../../../../../Rule/PhoneRule';
import { duplicateEmailRole, duplicatePhoneRole } from '../../../../../Rule/EmailRule';
import PriceAndPercentage from '../PriceAndPercentage';
import { VisaRule } from '../../../../../Rule/VisaRule';
import { MapDialog } from '../../Dialogs/MapDialog';
import { UploadDialog } from '../../Dialogs/UploadDialog';
import { ModelsUnitsDialog } from '../../Dialogs/ModelsUnitsDialog';
import { RepeatedItemDialog } from '../../Dialogs/RepeatedItemDialog';
import { RepeatedLinkDialog } from '../../Dialogs/RepeatedLinkDialog';
import {
  Inputs,
  AutocompleteComponent,
  PhonesComponent,
  CheckboxesComponent,
  DatePickerComponent,
  UnitModelPopoverComponent,
} from '../../../../../Components';
import { ContactsDialog } from '../../Dialogs/ContactsDialog';
import { LeadOwnerDialog } from '../../Dialogs/LeadOwnerDialog';
import { CONTACTS, PROPERTIES, UNITS } from '../../../../../config/pagesName';
import {
  OnchangePropertyInUnitRule,
  OnchangePropertyOnLeadRule,
  OnAddnewUnitRule,
  UnitDefaultRule,
  UnitRule,
  UnitForLeadOwnerRule
} from '../../../../../Rule/UnitRule';
import { TabRule } from '../../../../../Rule/TapRule';
import { SearchLookupRule } from '../../../../../Rule/SearchLookupRule';
import { GetParams, isEmptyObject, showError, showSuccess } from '../../../../../Helper';
import { BathroomsAndBedroomsDefaultRule } from '../../../../../Rule/BathroomsAndBedroomsDefaultRule';
import { getValueToEditinUint } from '../../../../../Rule/UnitOperationTypeDefaultRule';
import { LeadTypeIdEnum } from '../../../../../Enums';
import { LeaseLeadOwnerDialog } from '../../Dialogs/LeaseLeadOwnerDialog';

const ConvertJson = ({
  item,
  setData,
  setError,
  index,
  itemValue,
  itemList,
  selectedValues,
  isSubmitted,
  setJsonForm,
  jsonForm,
  setSteps,
  steps,
  setitemList,
  values,
  setIsLoading,
}) => {
  const { id } = item.field;
  const type = item.field.FieldType;
  const label = item.data.title;
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0]

  const isRequired =
    (item.field.isRequired !== undefined && item.field.isRequired) ||
    (item.field.Required && item.field.Required.toUpperCase() === 'TRUE');
  const items = item.data.enum;
  const itemRegex = new RegExp(item.data.regExp);
  const [newValue, setNewValue] = useState(itemValue || item.data.valueToEdit || item.data.default);
  const [, setRerender] = useState(0);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [inputValue, setInputValue] = useState('');
  const [DialogType, setDialogType] = useState(null);
  const [helperText, setHelperText] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [errorMsg] = useState(item.data.errorMsg);
  const [unitModelPopoverAttachedWith, setUnitModelPopoverAttachedWith] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isOpenLeadOwnerDialog, setIsOpenLeadOwnerDialog] = useState(false);
  const [leadOwnerValue, setLeadOwnerValue] = useState(null);
  const [isOpenLeaseLeadOwnerDialog, setisOpenLeaseLeadOwnerDialog] = useState(false);
  const [LeaseleadOwnerValue, setLeaseLeadOwnerValue] = useState(null);

  const [, setNewItems] = useState(
    items ?
      items.map((ele, itemIndex) => ({
        label: ele,
        value: itemIndex,
        checked: false,
      })) :
      null
  );

  const [loading, setLoading] = useState(false);
  const Input = React.useRef(null);
  let time = setTimeout(() => { }, 300);
  const [, setLabelWidth] = useState(0);
  const [country] = useState('United Arab Emirates');

  useEffect(() => {
    if (item.data.title === 'Listing Date') {
      if (newValue) return;
      const currentDate = moment(new Date());
      setNewValue(currentDate);
      setData(index, currentDate);
    }
  }, [index, item.data.title, newValue, setData]);



  useEffect(() => {
    if (item.field.id === 'listing_expiry-date') {
      const listingExpiryDate = values && values['listing_expiry_date'] && new Date(values['listing_expiry_date']);
      if (listingExpiryDate) setNewValue(listingExpiryDate);
      else if (!listingExpiryDate) {
        setNewValue(undefined);
      }
      else setNewValue();

    }
    else if (item.field.id === 'rent_listing-expiry-date') {
      const rentListingExpiryDate = values['rent_listing_expiry_date'] && new Date(values['rent_listing_expiry_date']);
      if (rentListingExpiryDate) setNewValue(rentListingExpiryDate);
      else if (!rentListingExpiryDate) {
        setNewValue(undefined);
      }
      else setNewValue();
    }
  }, [values]);



  useEffect(() => {
    if (itemValue) {
      setData(itemValue);
    }
    else if (item.data.valueToEdit) {
      if (
        item.data.valueToEdit &&
        Object.keys(item.data.valueToEdit).length === 0 &&
        item.data.valueToEdit.constructor === Object
      ) {
        setNewValue(null);


      }

      else {

        setData(index, ((itemValue === undefined || itemValue === null) ? null : item.data.valueToEdit));
        setNewValue(itemValue);
        TabRule(
          item,
          setJsonForm,
          jsonForm,
          item.data.valueToEdit,
          setSteps,
          steps,
          itemList,
          setitemList
        );
      }
    } else if (item.data.default)
      setData(index, item.data.default);

    if (Input.current !== null) setLabelWidth(Input.current.offsetWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, item.data.default, item.data.valueToEdit]);

  const getStatusValue = () => {
    const statusIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'status'));
    if (item.field.id === 'referredto' || item.field.id === 'close_reason') {
      if (statusIndex !== -1)
        return !!((values[statusIndex] && values[statusIndex].lookupItemName === 'Closed'));
    }
    return false;
  };

  const getOperationTypeValue = () => {
    if (item.field.id === 'operation_type' && GetParams('id')) {
      const unitModelRelatedData = localStorage.getItem('activeItem');
      if (unitModelRelatedData) {
        const unitModelRelatedDataJson = JSON.parse(unitModelRelatedData);
        if (unitModelRelatedDataJson && unitModelRelatedDataJson.operation_type && unitModelRelatedDataJson.operation_type.lookupItemName === 'SaleAndRent')
          return true;
      }
    }
    return false;
  };

  const getLeadOperationValue = () => {
    if (item.field.id === 'unit_ref-number' && GetParams('id') && LeadTypeIdEnum.Owner.leadTypeId === +GetParams('formType'))
      return true;
    else if (item.field.id === 'lead_operation' && GetParams('id'))
      return true;
    return false;
  };


  const getStatusValue2 = () => {
    const statusIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'status'));
    const status = 'status';
    if (item.field.id === 'close_reason') {
      const closeReasonIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'close_reason'));

      if (statusIndex !== -1) {
        if ((values[status] && values[status].lookupItemName === 'Open') || (isEmptyObject(values)) || !values[status]) {
          if (closeReasonIndex !== -1) {
            setTimeout(() => {
            }, 1000);
          }
          return true;
        }
      }
    }
    else if (item.field.id === 'closing_remarks') {
      const closingRemarksIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'closing_remarks'));
      if (statusIndex !== -1) {
        if ((values[status] && values[status].lookupItemName === 'Open') || (isEmptyObject(values)) || !values[status]) {
          if (closingRemarksIndex !== -1) {
            setTimeout(() => {
            }, 1000);
          }
          return true;
        }
      }

    }
    return false;
  };

  useEffect(() => {
    if (GetParams('id'))
    {
      if ((item.field.id === 'bathrooms' && item.field.FieldType === 'select') || (item.field.id === 'bedrooms' && item.field.FieldType === 'select')) {
        setTimeout(() => {
          BathroomsAndBedroomsDefaultRule(item, setRerender, itemList, values, setData, setNewValue);
        }, 500);
  
      }
    }
   
    if (item.field.id === 'listing_date') {
      setTimeout(() => {
        if (values && values.listing_date)
          ListingDate1(id, itemList, values.listing_date);
      }, 100);
    }
    else if (item.field.id === 'rent_listing-date') {
      setTimeout(() => {
        if (values && values.rent_listing_date)
          ListingDate1(id, itemList, values.rent_listing_date);
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (item.field.id === 'operation_type' && GetParams('id')) {
      const unitModelRelatedData = localStorage.getItem('activeItem');
      if (unitModelRelatedData) {
        const unitModelRelatedDataJson = JSON.parse(unitModelRelatedData);
        if (unitModelRelatedDataJson && unitModelRelatedDataJson.operation_type) {
          if (unitModelRelatedDataJson.operation_type && unitModelRelatedDataJson.operation_type.lookupItemName === 'SaleAndRent')
            item.data.isReadonly = true;
          else {
            setTimeout(() => {
              OperationTypeRule(item, setRerender, unitModelRelatedDataJson.operation_type, setIsLoading);
              item.data.isReadonly = false;
            });
          }
        }

      }

    }

    if (item.field.id === 'seller_has-paid' || item.field.id === 'selling_price-agency-fee') {
      setTimeout(() => {
        SellerHasPaidRule(item, (values && values.seller_has_paid) || 0, setRerender, values, setData, setNewValue);
      }, 100);
    }

  }, [item.field.id]);


  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [modelsUnitsDialog, setModelsUnitsDialog] = useState(false);
  const [RepeatedDialog, setRepeatedDialog] = useState(false);
  const [repeatedLinkDialog, setRepeatedLinkDialog] = useState(false);
  const [isOpenContactsDialog, setIsOpenContactsDialog] = useState(false);
  const openUnitModelPopoverHandler = useCallback((event) => {
    setUnitModelPopoverAttachedWith(event.currentTarget);
  }, []);
  const onPopoverClose = useCallback(() => {
    setUnitModelPopoverAttachedWith(null);
  }, []);

  useEffect(() => {
    LookupRule(item, itemList);
  }, [item, itemList]);

  useEffect(() => {
    if (itemValue && Object.keys(itemValue).length === 0 && itemValue.constructor === Object) {
      setInputValue('');
      setNewValue(null);
      setData(index, null);
    }
  }, [itemValue, values]);

  useEffect(() => {
    if (itemValue && !newValue) {
      if (Object.keys(itemValue).length === 0 && itemValue.constructor === Object) {
        setInputValue('');
        setNewValue(null);
      } else setNewValue(itemValue);
    } else if (typeof (newValue) !== 'boolean' && newValue && !itemValue) {
      setData(index, newValue);
    }

  }, [setData, itemValue]);

  useEffect(() => {
    const contactId = +GetParams('contactId');
    if (contactId && (item && item.data && item.data.title && !(item.data.title === 'Developer')))
      AutoSelectContactRule(item, setRerender, contactId, setData, index, setNewValue);
  }, []);

  const getAreaValue = () => {
    // const builtupAreaSqftIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'builtup_area-sqft'));
    // if (builtupAreaSqftIndex !== -1)
    //   return +values[builtupAreaSqftIndex];
    const builtupAreaSqft = 'builtup_area-sqft';
    if (values && values[builtupAreaSqft])
      return +values[builtupAreaSqft];


    return 0;
  };
  const getSqrSalePrice = () => {
    // const priceSqmIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'pricesqm'));
    // if (priceSqmIndex !== -1 && values[priceSqmIndex]) {
    //   const sqmPrice = +values[priceSqmIndex];
    //   return sqmPrice;
    // }
    if (values && values['pricesqm']) {
      return +values['pricesqm'];
    }
    return 0;
  };

  const getLeadStatusValue = () => {
    const statusIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'status'));
    const status = statusIndex !== -1 && itemList[statusIndex].field.id;
    if (status !== -1 && values && values[status] && (values[status].lookupItemName === 'Open' || !values[status]))
      return true;
    return false;
  };


  useEffect(() => {
    setTimeout(() => {
      const leadStatus = localStorage.getItem('leadStatus');
      if (leadStatus) {
        const leadStatusJson = JSON.parse(leadStatus);
        if (item.field.id === 'status' && +GetParams('id') && leadStatusJson && leadStatusJson.lookupItemName === 'Closed' && !GetParams('contactId'))
          item.data.isReadonly = true;
        else if (item.field.id === 'status' && GetParams('id') && leadStatusJson && leadStatusJson.lookupItemName === 'Open' && !GetParams('contactId'))
          item.data.isReadonly = false;
        else if (+GetParams('id') && id === 'close_reason' || (GetParams('id') && id === 'closing_remarks')) {
          const closeReasonIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'close_reason'));
          const closingRemarksIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'closing_remarks'));


          if (leadStatusJson && leadStatusJson.lookupItemName === 'Closed' && closeReasonIndex !== -1 && values[itemList[closeReasonIndex].field.id])
            item.data.isReadonly = true;
          else if (leadStatusJson && leadStatusJson.lookupItemName === 'Closed' && closingRemarksIndex !== -1 && values[itemList[closingRemarksIndex].field.id])
            item.data.isReadonly = true;
          else
            item.data.isReadonly = false;
        }
      }
    }, 300);


  }, [item]);


  useEffect(() => {
    setTimeout(() => {
      if (item.field.id === 'operation_type' && +GetParams('id')) {
        const unitActive = localStorage.getItem('activeItem');
        if (activeItem) {
          const activeItemJson = JSON.parse(unitActive);
          if (activeItemJson && activeItemJson.operation_type)
            OperationTypeRule(item, setRerender, activeItemJson.operation_type);
          else if (activeItemJson && activeItemJson.unit_ref_number) {
            OperationTypeRule(item, setRerender, activeItemJson.unit_ref_number);

          }

        }
      }
    }, 1200);
  }, [item]);


  let component = <></>;
  switch (type) {
    case 'address':
      if (item && item.data && item.data.uiType) {
        switch (item.data.uiType) {
          case 'text':
            component = (
              <Inputs
                idRef={id}
                isRequired={isRequired}
                isDisabled={item.data.isReadonly}
                labelValue={label}
                value={newValue ? newValue.value : ''}
                labelClasses={isRequired ? 'c-red' : ''}
                isSubmitted={isSubmitted}
                isWithError
                helperText={helperText}
                error={helperText !== '' || (isRequired && (!newValue || newValue.value === ''))}
                onInputChanged={(e) => {
                  setHelperText('');
                  setError(index, '');
                  if (!itemRegex.test(e.target.value)) {
                    setHelperText(errorMsg);
                    setError(index, errorMsg);
                  }
                  setNewValue({ value: e.target.value, type: item.data.addressType });
                  setData(index, { value: e.target.value, type: item.data.addressType });
                  if (!duplicateEmailRole(item, itemList, selectedValues)) {
                    setHelperText('Duplicate Email Value');
                    setError(index, 'Duplicate Email Value');
                  }
                }}
              />
            );
            break;
          case 'map':
            component = (
              <>
                <Inputs
                  idRef={id}
                  isRequired={isRequired}
                  isDisabled
                  labelValue={label}
                  labelClasses={isRequired ? 'c-red' : ''}
                  value={itemValue ? `${itemValue.latitude} , ${itemValue.longitude}` : ''}
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={helperText}
                  error={helperText !== '' || (isRequired && (!newValue || newValue === ''))}
                  buttonOptions={{
                    className: 'btns-icon theme-outline c-blue-lighter',
                    iconClasses: 'mdi mdi-map-marker',
                    isDisabled: false,
                    isRequired: false,
                    onActionClicked: () => {
                      setOpenMapDialog(true);
                    },
                  }}
                />
                {itemValue && openMapDialog && (
                  <MapDialog
                    open={openMapDialog}
                    onChange={(e) => {
                      setNewValue({ ...e });
                      setData(index, { ...e });
                    }}
                    initialState={itemValue}
                    closeDialog={() => {
                      setOpenMapDialog(false);
                    }}
                  />
                )}
              </>
            );
            break;
          case 'select':
            component = (
              <AutocompleteComponent
                idRef={id}
                isRequired={isRequired}
                isDisabled={
                  loading ||
                  // getValueToUpdate() ||
                  // getValueOprationType() ||
                  item.data.isReadonly ||
                  item.data.specialKey === 'IsDisabled' ||
                  item.data.specialKey === 'UnitRefNo'
                }
                isLoading={loading}
                withLoader
                multiple={item.data.multi ? item.data.multi === 'true' : false}
                selectedValues={
                  item.data.multi && item.data.multi === 'true' ?
                    (itemValue && Array.isArray(itemValue) && [...itemValue]) || [] :
                    itemValue || null
                }
                data={item.data.enum}
                inputClasses='inputs theme-form-builder'
                labelClasses={isRequired ? 'c-red' : ''}
                displayLabel={(option) =>
                  (!item.data.lookup ? option : option && option.lookupItemName || undefined) || ''}
                chipsLabel={
                  (item.data.multi &&
                    item.data.multi === 'true' &&
                    ((option) => (!item.data.lookup ? option : option && option.lookupItemName || undefined))) ||
                  undefined
                }
                getOptionSelected={(option) =>
                  (item.data.multi &&
                    item.data.multi === 'true' &&
                    itemValue.findIndex(
                      (element) =>
                        (element.lookupItemId && element.lookupItemId === option.lookupItemId) ||
                        option === element
                    ) !== -1) ||
                  (itemValue.lookupItemId && itemValue.lookupItemId === option.lookupItemId) ||
                  option === itemValue}
                onInputKeyUp={(event) => {
                  const { value } = event.target;
                  time = setTimeout(() => {
                    SearchLookupRule(item, value, itemList, setData, setRerender, setLoading);
                  }, 700);
                }}
                onKeyDown={() => {
                  clearTimeout(time);
                }}
                onChange={async (event, v) => {
                  if (item.field.id === 'status') {
                    if ((v && v.lookupItemName === 'Open') || !v) {
                      StatusLeadDefaulRule1(item, setRerender, itemList, values, setData);
                    }
                  }
                  if (v === null) {
                    setNewValue(v);
                    setData(index, v);
                    return;
                  }
                  openUnitModelPopoverHandler(event);
                  // ListingDateRule(id ,item,itemList, v, values ,setData) ;
                  TitleRule(id, setData, item, itemList, v);
                  TabRule(item, setJsonForm, jsonForm, v, setSteps, steps, itemList, setitemList);
                  await OnchangeCountryRule(id, setData, item, itemList, v);
                  await OnchangeCityRule(id, v, itemList, setData, item);
                  await OnchangeDistrictRule(id, setData, item, itemList, v);
                  await getValueToEditinUint(item, setRerender, itemList, values, setData);
                  await OnchangeCommunityRule(id, setData, item, itemList, v);
                  await OnchangeSubCommunityRule(id, setData, item, itemList, v);
                  setNewValue(v);
                  setData(index, v);


                }}
                withoutSearchButton
                labelValue={label}
              />
            );
            break;
          default:
            break;
        }
      }
      break;

    case 'communication':
      switch (item.data.CommunicationType) {
        case 'Phone':
          component = (
            <>
              <PhonesComponent
                idRef={id}
                isValid={() => PhoneValidationRole(newValue ? newValue.phone : '') && isValidPhone}
                labelValue={label}
                labelClasses={isRequired ? 'c-red' : ''}
                country={country}
                required={isRequired}
                helperText={helperText}
                error={helperText !== '' || (isRequired && (!newValue || newValue === ''))}
                value={
                  newValue === null || newValue === undefined || !newValue.phone ?
                    item.data.defaultCountryCode :
                    newValue.phone
                }
                onInputChanged={(value) => {
                  if (value.length > 14) return;
                  if (selectedValues[index] && selectedValues[index].others) {
                    setNewValue({
                      ...selectedValues[index],
                      phone: value,
                      typeId: item.data.lookupItem,
                    });
                    setData(index, {
                      ...selectedValues[index],
                      phone: value,
                      typeId: item.data.lookupItem,
                    });
                  } else {
                    setNewValue({ phone: value, typeId: item.data.lookupItem });
                    setData(index, { phone: value, typeId: item.data.lookupItem });
                  }
                }}
                onKeyUp={() => {
                  setTimer(
                    setTimeout(async () => {
                      if (!newValue && !newValue.phone) return;
                      const isPhoneRole = await PhoneValidationRole(newValue.phone);
                      const isDuplicate = await duplicatePhoneRole(item, newValue.phone);
                      if (!isPhoneRole) {
                        setIsValidPhone(isPhoneRole);
                        setHelperText('Phone number must be 6 And above');
                        setError(index, 'Phone number must be  6 And above');
                      } else if (!isDuplicate) {
                        setIsValidPhone(isDuplicate);
                        setHelperText('Duplicate phone Value With Other Contact');
                        setError(index, 'Duplicate phone Value With Other Contact');
                      } else {
                        setIsValidPhone(true);
                        setHelperText('');
                        setError(index, '');
                      }
                    }, 500)
                  );
                }}
                onKeyDown={() => {
                  if (timer) clearTimeout(timer);
                }}
                buttonOptions={{
                  className: 'btns-icon theme-solid bg-blue-lighter',
                  iconClasses: 'mdi mdi-plus',
                  isDisabled: !(newValue && newValue.phone && newValue.phone.length >= 9),
                  isRequired: false,
                  onActionClicked: () => {
                    if (newValue && newValue.phone && newValue.phone.length >= 9)
                      setRepeatedDialog(true);
                  },
                }}
              />
              <RepeatedItemDialog
                open={RepeatedDialog}
                item={item}
                type='phone'
                initialState={newValue}
                label={label}
                Textcancel='delete-all'
                closeDialog={() => {
                  setRepeatedDialog(false);
                }}
                selectedValues={selectedValues}
                itemList={itemList}
                onChange={(value) => {
                  setNewValue({ ...value, phone: newValue.phone, typeId: item.data.lookupItem });
                  setData(index, {
                    ...value,
                    phone: newValue.phone,
                    typeId: item.data.lookupItem,
                  });
                }}
              />
            </>
          );
          break;
        case 'Email':
          component = (
            <>
              <Inputs
                idRef={id}
                isRequired={isRequired}
                labelClasses={isRequired ? 'c-red' : ''}
                isDisabled={
                  item.data.isReadonly ||
                  item.data.specialKey === 'IsDisabled' ||
                  item.data.specialKey === 'UnitRefNo'
                }
                labelValue={label}
                value={newValue && newValue.email ? newValue.email : ''}
                helperText={helperText}
                error={helperText !== '' || (isRequired && (!newValue || newValue === ''))}
                onKeyUp={() => {
                  // if (!itemRegex.test(itemValue) || itemValue === '')
                  //   return;
                  if (newValue && newValue.email) {
                    setTimer(
                      setTimeout(async () => {
                        if (newValue && newValue.email && itemRegex.test(newValue.email)) {
                          setHelperText('Please wait Check from server if Duplicate Email Value With Other Contact');
                          setError(index, 'Check from sever if Duplicate Email Value With Other Contact ');
                          const isDuplicate = await duplicateEmailRole(item, newValue.email);
                          if (!isDuplicate) {
                            setHelperText('Duplicate Email Value With Other Contact');
                            setError(index, 'Duplicate Email Value With Other Contact ');
                          } else {
                            setHelperText('');
                            setError(index, '');
                          }
                        }
                      }, 800)
                    );
                  }
                }}
                onKeyDown={() => {
                  if (timer) clearTimeout(timer);
                }}
                onInputChanged={(e) => {
                  setHelperText('');
                  setError(index, '');
                  if (e.target.value === '') {
                    setHelperText('Email is required');
                    setError(index, 'The Email Is Required');
                  }
                  if (!itemRegex.test(e.target.value)) {
                    setHelperText(errorMsg);
                    setError(index, errorMsg);
                  }
                  if (selectedValues[index]) {
                    setNewValue({
                      ...selectedValues[index],
                      email: e.target.value,
                      typeId: item.data.lookupItem,
                    });
                    setData(index, {
                      ...selectedValues[index],
                      email: e.target.value,
                      typeId: item.data.lookupItem,
                    });
                  } else {
                    setNewValue({ email: e.target.value, typeId: item.data.lookupItem });
                    setData(index, { email: e.target.value, typeId: item.data.lookupItem });
                  }
                }}
                buttonOptions={{
                  className: 'btns-icon theme-solid bg-blue-lighter',
                  iconClasses: 'mdi mdi-plus',
                  isDisabled: !(
                    newValue &&
                    itemRegex.test(newValue.email) &&
                    newValue.email &&
                    newValue.email.length > 0
                  ),
                  isRequired: false,
                  onActionClicked: () => {
                    if (
                      newValue &&
                      itemRegex.test(newValue.email) &&
                      newValue.email &&
                      newValue.email.length > 0
                    )
                      setRepeatedDialog(true);
                  },
                }}
              />
              <RepeatedItemDialog
                open={RepeatedDialog}
                item={item}
                type='email'
                initialState={newValue}
                label={label}
                Textcancel='delete-all'
                closeDialog={() => {
                  setRepeatedDialog(false);
                }}
                selectedValues={selectedValues}
                itemList={itemList}
                onChange={(value) => {
                  setNewValue({ ...value, email: newValue.email, typeId: item.data.lookupItem });
                  setData(index, {
                    ...value,
                    email: newValue.email,
                    typeId: item.data.lookupItem,
                  });
                }}
              />
            </>
          );
          break;
        case 'SocialMedia':
          component = (
            <Inputs
              idRef={id}
              isRequired={isRequired}
              labelClasses={isRequired ? 'c-red' : ''}
              isDisabled={
                item.data.isReadonly ||
                item.data.specialKey === 'IsDisabled' ||
                item.data.specialKey === 'UnitRefNo'
              }
              labelValue={label}
              value={newValue && newValue.link ? newValue.link : ''}
              helperText={helperText}
              error={helperText !== '' || (isRequired && (!newValue || newValue === ''))}
              onInputChanged={(e) => {
                setHelperText('');
                setError(index, '');
                if (!itemRegex.test(e.target.value)) {
                  setHelperText(errorMsg);
                  setError(index, errorMsg);
                }
                setNewValue({ link: e.target.value, typeId: item.data.lookupItem });
                setData(index, { link: e.target.value, typeId: item.data.lookupItem });
              }}
            />
          );
          break;
        default:
          break;
      }
      break;
    case 'UnitsModels':
      component = (
        <Grid container>
          <div className='w-100'>
            <label htmlFor={id} className='label-wrapper'>
              {label}
            </label>
            <div className='chip-input-wrapper'>
              <ChipInput
                className='chip-input theme-form-builder'
                InputProps={{ autoComplete: 'new-password' }}
                id={id}
                value={newValue && newValue.Models ? newValue.Models : []}
                onAdd={(chip) => {
                  if (newValue && newValue.Models && newValue.Models.length > 0) {
                    Object.keys(newValue).forEach((key) => {
                      if (typeof newValue[key] === 'object' && key !== 'Models') {
                        const isExist = newValue.Models.findIndex((modelItem) => modelItem === key);
                        if (isExist === -1)
                          delete newValue[key];
                      }
                    });
                  } else if (newValue && newValue.Models && newValue.Models.length === 0) {
                    Object.keys(newValue).forEach((key) => {
                      if (typeof newValue[key] === 'object' && key !== 'Models')
                        delete newValue[key];
                    });
                  }
                  if (newValue && newValue.Models) {
                    setNewValue({ ...newValue, Models: [...newValue.Models, chip] });
                    setData(index, { ...newValue, Models: [...newValue.Models, chip] });
                  } else {
                    setNewValue({ Models: [chip] });
                    setData(index, { Models :[chip ]});
                  }
                }}
                onDelete={(chip, itemIndex) => {
                  if (newValue.Models && newValue.Models.length > 0) newValue.Models.splice(itemIndex, 1);
                  delete newValue[chip];
                  const unitModelIndex = itemList.findIndex((i) => i.field.id === 'units_models');
                  if (newValue && newValue.Models && newValue.Models.length > 0) {
                    Object.keys(newValue).forEach((key) => {
                      if (typeof newValue[key] === 'object' && key !== 'Models') {
                        const isExist = newValue.Models.findIndex((modelItem) => modelItem === key);
                        if (isExist === -1)
                          delete newValue[key];
                      }
                    });
                  } else if (newValue && newValue.Models && newValue.Models.length === 0) {
                    Object.keys(newValue).forEach((key) => {
                      if (typeof newValue[key] === 'object')
                        delete newValue[key];
                    });
                    // setNewValue(null);
                    setData(itemList[unitModelIndex].field.id, newValue ? null : newValue);
                    return;
                  }
                  setNewValue({ ...newValue });
                  setData(itemList[unitModelIndex].field.id, newValue);
                }}
              />
              <Button
                className='ml-2 btns-icon theme-solid bg-blue-lighter'
                onClick={() => {
                  if (newValue && newValue.Models && newValue.Models.length > 0) setModelsUnitsDialog(true);
                }}
              >
                <span className='mdi mdi-plus' />
              </Button>
            </div>
          </div>
          {/* <Grid item xs={12} md={1}> */}
          {newValue && newValue.Models && (
            <ModelsUnitsDialog
              initialState={newValue}
              items={items}
              open={modelsUnitsDialog}
              closeDialog={() => {
                setModelsUnitsDialog(false);
              }}
              onChange={(value) => {
                setData(index, { ...value, Models: newValue.Models });
                setNewValue({ ...value, Models: newValue.Models });
              }}
            />
          )}
          {/* </Grid> */}
        </Grid>
      );
      break;
    case 'UploadFiles':
      component = (
        <>
          <AutocompleteComponent
            idRef={id}
            isRequired={isRequired}
            labelClasses={isRequired ? 'c-red' : ''}
            multiple={item.data.multi ? item.data.multi === 'true' : false}
            selectedValues={
              item.data.multi && item.data.multi === 'true' ?
                (itemValue && [...itemValue.selected]) || [] :
                itemValue || null
            }
            defaultValue={null}
            data={item && item.data ? item.data.enum : []}
            displayLabel={(option) => (!item.data.lookup ? option : option.lookupItemName) || ''}
            chipsLabel={(option) => (!item.data.lookup ? option : option.lookupItemName)}
            getOptionSelected={(option) =>
              (item.data.multi &&
                item.data.multi === 'true' &&
                ((itemValue && [...itemValue.selected]) || []).findIndex(
                  (element) =>
                    (element.lookupItemId && element.lookupItemId === option.lookupItemId) ||
                    option === element
                ) !== -1) ||
              (itemValue.lookupItemId && itemValue.lookupItemId === option.lookupItemId) ||
              option === itemValue}
            onChange={(e, v) => {
              if (v == null) {
                setNewValue(v);
                setData(index, v);
                return;
              }
              setNewValue({ ...itemValue, selected: v });
              setData(index, { ...itemValue, selected: v });
            }}
            withoutSearchButton
            labelValue={label}
            buttonOptions={{
              className: 'btns-icon theme-solid bg-blue-lighter',
              iconClasses: id === 'external_url' ? 'mdi mdi-plus' : 'mdi mdi-attachment',
              isDisabled: !(itemValue && itemValue.selected && itemValue.selected.length > 0),
              isRequired: false,
              onActionClicked: () => {
                if (
                  itemValue &&
                  itemValue.selected &&
                  itemValue.selected.length > 0 &&
                  id !== 'external_url'
                )
                  setOpenUploadDialog(true);
                if (
                  itemValue &&
                  itemValue.selected &&
                  itemValue.selected.length > 0 &&
                  id === 'external_url'
                )
                  setRepeatedLinkDialog(true);
              },
            }}
          />
          {openUploadDialog && (
            <UploadDialog
              open={openUploadDialog}
              onChange={(e) => {
                setNewItems(e);
                setData(index, { ...e, selected: itemValue.selected });
              }}
              initialState={itemValue}
              closeDialog={() => {
                setOpenUploadDialog(false);
              }}
            />
          )}
          {repeatedLinkDialog && (
            <RepeatedLinkDialog
              item={item}
              // label={label}
              label={item.data.title}
              itemList={itemList}
              initialState={itemValue}
              // initialState={newValue}
              open={repeatedLinkDialog}
              selectedValues={selectedValues}
              onChange={(e) => {
                setData(index, { ...e });
              }}
              closeDialog={() => setRepeatedLinkDialog(false)}
            />
          )}
        </>
      );
      break;
    case 'MapField':
      component = (
        <Grid container>
          <Inputs
            idRef={id}
            isRequired={isRequired}
            labelClasses={isRequired ? 'c-red' : ''}
            isDisabled
            labelValue={label}
            value={itemValue ? `${itemValue.latitude} , ${itemValue.longitude}` : ''}
            helperText={helperText}
            error={helperText !== '' || (isRequired && (!newValue || newValue === ''))}
            buttonOptions={{
              className: 'btns-icon theme-outline c-blue-lighter',
              iconClasses: 'mdi mdi-map-marker',
              isDisabled: false,
              isRequired: false,
              onActionClicked: () => {
                setOpenMapDialog(true);
              },
            }}
          />
          {itemValue && openMapDialog && (
            <MapDialog
              open={openMapDialog}
              onChange={(e) => {
                setNewValue({ ...e });
                setData(index, { ...e });
              }}
              initialState={itemValue}
              closeDialog={() => {
                setOpenMapDialog(false);
              }}
            />
          )}
        </Grid>
      );

      break;
    case 'textField':
      component = (
        <div className='w-100 p-relative'>
          {item.field.id !== 'unit_model' && item.data.specialKey !== 'currency' && item.data.specialKey !== 'size' && item.data.specialKey !== 'decimal' &&
            (
              <Inputs
                idRef={id}
                labelClasses={isRequired ? 'c-red' : ''}
                isRequired={isRequired}
                isDisabled={
                  item.data.isReadonly ||
                  item.data.searchableKey === 'unit_ref_no' ||
                  item.data.specialKey === 'IsDisabled' ||
                  item.data.specialKey === 'UnitRefNo'
                }
                labelValue={label}
                value={itemValue}
                isSubmitted={isSubmitted}
                isWithError
                helperText={helperText || errorMsg}
                onInputFocus={(item.field.id === 'unit_model' && openUnitModelPopoverHandler) || undefined}
                onInputBlur={(item.field.id === 'unit_model' && onPopoverClose) || undefined}
                error={helperText !== '' || (isRequired && (!itemValue || itemValue === ''))}
                onInputChanged={(e) => {
                  setHelperText('');
                  setError(index, '');
                  if (!itemRegex.test(e.target.value)) {
                    setHelperText(errorMsg);
                    setError(index, errorMsg);
                  }
                  setNewValue(e.target.value);
                  setData(index, e.target.value);
                  if (!duplicateEmailRole(item, itemList, selectedValues)) {
                    setHelperText('Duplicate Email Value');
                    setError(index, 'Duplicate Email Value');
                  }
                }}
              />

            )}

          {item.field.id === 'unit_model' &&
            itemList &&
            itemList.findIndex((element) => element.field.id === 'property_name') !== -1 &&
            selectedValues['property_name']
            && (
              <UnitModelPopoverComponent
                unitModelPopoverAttachedWith={unitModelPopoverAttachedWith}
                onPopoverClose={onPopoverClose}
                item={item}
                itemValue={itemValue}
                allItems={itemList}
                propertyId={
                  selectedValues[
                    'property_name'
                  ].id
                }
                setData={setData}
                indexV1={index}
                labelValue={label}
                idRef={id}
                allItemsValues={values}
                propertyName={
                  selectedValues[
                  'property_name'
                  ]
                }
              />
            )}
          {
            (item.data.specialKey === 'currency' || item.data.specialKey === 'size' || item.data.specialKey === 'decimal') && (
              <Inputs
                type='number'
                isAttachedInput
                withNumberFormat
                min={0}
                startAdornment={(item.data.specialKey === 'currency' && (
                  <InputAdornment position='start' className='px-2'>
                    AED
                  </InputAdornment>
                )) || false}
                labelClasses={item.field.isRequired ? 'c-red' : ''}
                idRef={item.field.id}
                isRequired={item.field.isRequired}
                isDisabled={
                  item.data.isReadonly || id === 'amount_due-to-developer' || id === 'pricesqm' 
                }
                labelValue={item.data.title}
                value={itemValue || ''}
                isWithError
                isSubmitted={isSubmitted}
                helperText={helperText}
                error={helperText !== '' || (isRequired && (!itemValue || itemValue === ''))}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  const editValue = fixed ? parseFloat(fixed) : 0;
                  SellerHasPaidRule(item, editValue, setRerender, values, setData, setNewValue);
                  setNewValue(editValue);
                  setData(index, editValue);


                }
                }
              />

            )

          }
        </div>
      );
      break;

    case 'textarea':
      component = item.field.id === 'closing_remarks' && getLeadStatusValue()
        ? <> </> :
        <Inputs
          idRef={id}
          isRequired={isRequired}
          labelClasses={isRequired ? 'c-red' : ''}
          isDisabled={
            getStatusValue2() ||
            item.data.isReadonly ||
            item.data.specialKey === 'IsDisabled' ||
            item.data.specialKey === 'UnitRefNo'
          }
          labelValue={label}
          value={newValue}
          helperText={errorMsg}
          multiline
          rows={4}
          onInputChanged={(e) => {
            setNewValue(e.target.value);
            setData(index, e.target.value);
          }}
        />
        ;
      // (
      //   <Inputs
      //     idRef={id}
      //     isRequired={isRequired}
      //     labelClasses={isRequired ? 'c-red' : ''}
      //     isDisabled={
      //       getStatusValue2() || 
      //       item.data.isReadonly ||
      //       item.data.specialKey === 'IsDisabled' ||
      //       item.data.specialKey === 'UnitRefNo'
      //     }
      //     labelValue={label}
      //     value={newValue}
      //     helperText={errorMsg}
      //     multiline
      //     rows={4}
      //     onInputChanged={(e) => {
      //       setNewValue(e.target.value);
      //       setData(index, e.target.value);
      //     }}
      //   />
      //  )  ||

      break;


    case 'select':
      component = (
        <AutocompleteComponent
          idRef={id}
          isRequired={isRequired}
          labelClasses={isRequired ? 'c-red' : ''}
          isDisabled={
            getStatusValue2() ||
            getLeadOperationValue() ||
            getOperationTypeValue() ||
            loading ||
            item.data.isReadonly ||
            item.data.specialKey === 'IsDisabled' ||
            item.data.specialKey === 'UnitRefNo'
          }
          isLoading={loading}
          withLoader
          multiple={item.data.multi ? item.data.multi === 'true' : false}
          selectedValues={
            item.data.multi && item.data.multi === 'true' ?
              (itemValue && Array.isArray(itemValue) && [...itemValue]) || [] :
              itemValue || null
          }
          data={item.data.enum}
          inputClasses='inputs theme-form-builder'
          displayLabel={(option) => ((!item.data.lookup) ? option : (option && option.lookupItemName) || undefined) || ''}
          chipsLabel={
            (item.data.multi &&
              item.data.multi === 'true' &&
              ((option) => ((!item.data.lookup) ? option : (option && option.lookupItemName) || undefined))) ||
            undefined
          }
          getOptionSelected={(option) =>
            (item.data.multi &&
              item.data.multi === 'true' &&
              itemValue.findIndex(
                (element) =>
                  (element.lookupItemId && element.lookupItemId === option.lookupItemId) ||
                  option === element
              ) !== -1) ||
            (itemValue.lookupItemId && itemValue.lookupItemId === option.lookupItemId) ||
            option === itemValue}
          onInputKeyUp={(event) => {
            const { value } = event.target;
            time = setTimeout(() => {
              SearchLookupRule(item, value, itemList, setData, setRerender);
            }, 700);
          }}
          onKeyDown={() => {
            clearTimeout(time);
          }}
          onChange={async (event, v) => {
            if (item.field.id === 'lead_operation' && +(GetParams('formType')) === LeadTypeIdEnum.Owner.leadTypeId)
              UnitForLeadOwnerRule(item, v, setRerender, itemList, values, setData);

            if (item.field.id === 'status') {
              if ((v && v.lookupItemName === 'Open') || !v)
                StatusLeadDefaulRule1(item, setRerender, itemList, values, setData);
            }

            if ((item.field.id === 'bedrooms' && item.field.FieldType === 'select') || (item.field.id === 'bathrooms' && item.field.FieldType === 'select')) {
              const findAnyBathroomsAndBedrooms = v.find((num) => num === 'Any' || num === 'any');
              if (findAnyBathroomsAndBedrooms) {
                setNewValue([findAnyBathroomsAndBedrooms]);
                setData(index, [findAnyBathroomsAndBedrooms]);
                return;
              }
            }

            ListingDateRule(id, item, itemList, v, values, setData);
            if (v === null) {
              setNewValue(v);
              setData(index, v);
              return;
            }
            TitleRule(id, setData, item, itemList, v);
            TabRule(item, setJsonForm, jsonForm, v, setSteps, steps, itemList, setitemList);
            await OnchangeCountryRule(id, setData, item, itemList, v);
            await OnchangeCityRule(id, v, itemList, setData, item);
            await OnchangeDistrictRule(id, setData, item, itemList, v);
            await getValueToEditinUint(item, setRerender, itemList, values, setData);
            await OnchangeCommunityRule(id, setData, item, itemList, v);
            await OnchangeSubCommunityRule(id, setData, item, itemList, v);

            setNewValue(v);
            setData(index, v);
          }}
          withoutSearchButton
          labelValue={label}
        />
      );

      break;


    case 'alt-date':
      if (newValue === undefined) setNewValue(null);
      component = (
        <DatePickerComponent
          required={isRequired}
          idRef={id}
          labelClasses={isRequired ? 'c-red' : ''}
          labelValue={label}
          value={(newValue && moment(newValue).isValid() && moment(newValue))}
          helperText={errorMsg}
          isSubmitted
          buttonOptions={{ isDisabled: item.data.title === 'Listing Expiry Date' }}
          maxDate={item.data.maxDate ? new Date(item.data.maxDate) : undefined}
          minDate={item.data.minDate ? new Date(item.data.minDate) : undefined}
          onDateChanged={(e) => {
            VisaRule(id, item, itemList, e);
            ListingDate1(id, itemList, e);
            PassportRule(id, item, itemList, e);
            DateRule(item, itemList, e, values);
            if (CheckIsDateToAfterDateFromRule(e, item, values)) {
              showError('Please select date from befor date to   or update date to');
              return;
            }
            if (CheckIsDateValidRule(e, item, values)) {
              showError('Please select date to  after date from or update date from');
              return;
            }
            ListingExpiryDateRule1(item, setData);
            setNewValue(e);
            setData(index, e);
          }}
        />
      );
      break;

    case 'checkboxes': {
      let result = [];
      if (newValue) result = [...newValue];
      component = (
        <CheckboxesComponent
          data={item.data.items.enum || []}
          labelClasses={isRequired ? 'c-red' : ''}
          onSelectedCheckboxChanged={(e) => {
            if (e.target.checked && result.indexOf(e.target.value) === -1)
              result.push(e.target.value);
            else result.splice(result.indexOf(e.target.value), 1);
            setNewValue(result);
            setData(index, result);
          }}
          isRow
          idRef={id}
          labelValue={label}
          required={isRequired}
          checked={(selectedItem) => result.indexOf(selectedItem) !== -1}
        />
      );
      break;
    }
    case 'radio':
      component = (
        <div>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>{label}</FormLabel>
            <RadioGroup id={id} value={newValue} onChange={(e) => setData(index, e.target.value)}>
              {item.data.enum.map((ele) => (
                <FormControlLabel value={ele} control={<Radio />} label={ele} />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      );
      break;

    case 'checkbox':
      component = (
        <CheckboxesComponent
          data={[newValue]}
          onSelectedCheckboxChanged={(item1, index1, checkedValue, event1) => {
            setData(index, checkedValue);
          }}
          isRow
          labelValue={label}
          idRef={id}
          value={newValue}
        />
      );
      break;

    case 'phone':
      component = (
        <>
          <PhonesComponent
            idRef={id}
            isValid={() => PhoneValidationRole(newValue ? newValue.phone : '')}
            labelValue={label}
            labelClasses={isRequired ? 'c-red' : ''}
            country={country}
            required={isRequired}
            value={
              newValue === null || newValue === undefined || !newValue.phone ?
                item.data.defaultCountryCode :
                newValue.phone
            }
            onInputChanged={(value) => {
              if (value.length > 14) return;
              setNewValue({ phone: value, typeId: item.data.lookupItem });
              setData(index, { phone: value, typeId: item.data.lookupItem });
            }}
            buttonOptions={{
              className: 'btns-icon theme-solid bg-blue-lighter',
              iconClasses: 'mdi mdi-plus',
              isDisabled: !(newValue && newValue.phone && newValue.phone.length >= 9),
              isRequired: false,
              onActionClicked: () => {
                if (newValue && newValue.phone && newValue.phone.length >= 9)
                  setRepeatedDialog(true);
              },
            }}
          />
          <RepeatedItemDialog
            open={RepeatedDialog}
            item={item}
            type={type}
            initialState={newValue}
            label={label}
            Textcancel='delete-all'
            closeDialog={() => {
              setRepeatedDialog(false);
            }}
            selectedValues={selectedValues}
            itemList={itemList}
            onChange={(value) => {
              setNewValue({ ...value, phone: newValue.phone });
              setData(index, { ...value, phone: newValue.phone });
            }}
          />
        </>
      );
      break;

    case 'rangeField': {
      if (newValue === '') {
        setNewValue([Number(item.data.minNumber), Number(item.data.maxNumber)]);
        setData(index, [Number(item.data.minNumber), Number(item.data.maxNumber)]);
      }
      const marks = [
        {
          value: Number(item.data.minNumber),
          label: `${Number(item.data.minNumber)}`,
        },

        {
          value: Number(item.data.maxNumber),
          label: `${Number(item.data.maxNumber)}`,
        },
      ];
      component = (
        <>
          <Typography gutterBottom>{label}</Typography>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xl={6} lg={6} sm={6} xs={12}>
              <Inputs
                idRef={id}
                labelValue='From'
                labelClasses={isRequired ? 'c-red' : ''}
                value={newValue ? newValue[0] : Number(item.data.minNumber)}
                onInputChanged={(e) => {
                  if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                    const v = newValue || [];
                    v[0] = Number(e.target.value);
                    setNewValue(v);
                    setData(index, v);
                  }
                }}
                onInputBlur={(e) => {
                  if (Number(e.target.value) < Number(item.data.minNumber)) {
                    const v = newValue || [];
                    v[0] = Number(item.data.minNumber);
                    setNewValue(v);
                    setData(index, v);
                  } else if (Number(e.target.value) > Number(item.data.maxNumber)) {
                    const v = newValue || [];
                    v[0] = Number(item.data.maxNumber);
                    setNewValue(v);
                    setData(index, v);
                  } else {
                    const v = newValue || [];
                    v[0] = Number(e.target.value);
                    setNewValue(v);
                    setData(index, v);
                  }
                }}
              />
            </Grid>
            <Grid item xl={6} lg={6} sm={6} xs={12}>
              <Inputs
                idRef={id}
                labelValue='To'
                value={newValue ? newValue[1] : Number(item.data.maxNumber)}
                onInputChanged={(e) => {
                  if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                    const v = newValue || [];
                    v[1] = Number(e.target.value);
                    setNewValue(v);
                    setData(index, v);
                  }
                }}
                onInputBlur={(e) => {
                  if (Number(e.target.value) < Number(item.data.minNumber)) {
                    const v = newValue || [];
                    v[1] = Number(marks[1].value);

                    setNewValue(v);
                    setData(index, v);
                  } else if (Number(e.target.value) > Number(item.data.maxNumber)) {
                    const v = newValue || [];
                    v[1] = Number(item.data.maxNumber);
                    setNewValue(v);
                    setData(index, v);
                  } else {
                    const v = newValue || [];
                    v[1] = Number(e.target.value);
                    setNewValue(v);
                    setData(index, v);
                  }
                }}
              />
            </Grid>
          </Grid>
          <div className='w-100 px-3'>
            <Slider
              required={isRequired}
              className='sliders'
              aria-labelledby='range-slider'
              valueLabelDisplay='auto'
              onChange={(event, value) => {
                if (value[0] !== newValue[0] || value[1] !== newValue[1]) {
                  setNewValue(value);
                  setData(index, value);
                }
              }}
              value={
                newValue ?
                  [Number(newValue[0]), Number(newValue[1])] :
                  [Number(item.data.minNumber), Number(item.data.maxNumber)]
              }
              step={200}
              marks={marks}
              min={Number(item.data.minNumber)}
              max={Number(item.data.maxNumber)}
            />
          </div>
        </>
      );
      break;
    }
    case 'searchField':
      if (id !== 'owner') {
        ContactDefaultRule(item, setRerender);
        PropertyDefaultRule(item, setRerender);
        UnitDefaultRule(item, setRerender);
        UserDefaultRule(item, setRerender, itemList, values);
        ActivityTypeRuleDefaultRule(item, setRerender, itemList, values);
        component = (
          <>
            <AutocompleteComponent
              idRef={id}
              isRequired={isRequired}
              labelClasses={isRequired ? 'c-red' : ''}
              isDisabled={
                getStatusValue() ||
                getLeadOperationValue() ||
                loading ||
                item.data.isReadonly ||
                item.data.specialKey === 'IsDisabled' ||
                item.data.specialKey === 'UnitRefNo'
              }
              isLoading={loading}
              filterOptions={(options) => options}
              withLoader
              multiple={item.data.multi ? item.data.multi === 'true' : false}
              selectedValues={
                item.data.multi && item.data.multi === 'true' ?
                  (itemValue && Array.isArray(itemValue) && [...itemValue]) || [] :
                  itemValue || newValue || null
              }
              renderOption={
                (item.data.searchKey === 'property' &&
                  ((option) => <span>{`${option.name || ''} - ${option.city || ''}`}</span>)) ||
                (item.data.searchKey === 'contact' &&
                  ((option) => (
                    <div className='d-flex-column'>
                      <div className='d-flex-v-center-h-between w-100 texts-truncate'>
                        {option.name}
                      </div>
                      <span className='c-gray-secondary'>{option.phone || ''}</span>
                    </div>
                  ))) ||
                (item.data.searchKey === 'User' &&
                  ((option) => (
                    <div className='d-flex-column'>
                      <div className='d-flex-v-center-h-between w-100 texts-truncate'>
                        {option.name}
                      </div>
                      <span className='c-gray-secondary'>{option.branch || ''}</span>
                    </div>
                  ))) ||
                (item.data.searchKey === 'PropertyOrUnit' &&
                  ((option) =>
                    (option.isProperty && (
                      <span>{`${option.name || ''} - ${option.city || ''}`}</span>
                    )) || (
                      <div className='d-flex-column'>
                        <span>{`${option.unitModel} - ${option.name} - ${option.unitType}`}</span>
                        <span className='c-gray-secondary'>
                          {`${option.unitBedrooms} - ${option.unitRefNo}`}
                        </span>
                      </div>
                    ))) ||
                undefined
              }
              data={item.data.enum || []}
              inputClasses='inputs theme-form-builder'
              displayLabel={(option) => option.name || ''}
              chipsLabel={(option) => option.name || ''}
              onChange={(e, v) => {
                if (v === null || v === undefined) setInputValue('');
                setNewValue(v);
                if (item.field.id === 'lead_owner') {
                  if (v === null) {
                    setLeadOwnerValue(itemValue);
                    setIsOpenLeadOwnerDialog(true);
                  }
                }
                if (item.field.id === 'lease_lead-owner') {
                  if (v === null) {
                    setLeaseLeadOwnerValue(itemValue);
                    setisOpenLeaseLeadOwnerDialog(true);
                  }
                }
                OnchangePropertyInUnitRule(item, v, itemList, setData , setRerender);
                OnchangePropertyOnLeadRule(item, v, itemList, setData);
                setData(index, v);
                if (v && v[0]) setInputValue('');
              }}
              inputValue={inputValue}
              onInputChange={(e, v) => {
                setInputValue(e && e.target && e.target.value ? e.target.value : inputValue);
                setInputValue(v !== '' ? v : e && e.target && e.target.value);
                ContactRule(item, v, setRerender);
                PropertyRule(item, v, setRerender);
                UnitRule(item, v, setRerender, itemList, values);
                ActivityTypeRule(item, v, setRerender);
                UserRule(item, v, setRerender, itemList, values);
                PropertyOrUnitRule(item, v, setRerender, itemList, selectedValues);
              }}
              withoutSearchButton
              getOptionSelected={(option) =>
                (item.data.multi &&
                  item.data.multi === 'true' &&
                  itemValue.findIndex(
                    (element) => (element.id && element.id === option.id) || option === element
                  ) !== -1) ||
                (itemValue && itemValue.id && itemValue.id === option.id) ||
                option === itemValue}
              labelValue={label}
              buttonOptions={
                (item.data.searchKey !== 'User' && item.data.searchKey !== 'ActivityType' && item.field.id !== 'leadId' && id !== 'listing_agent' && id !== 'rent_listing_agent' && id !== 'rent_listing-agent') && {
                  className: 'btns-icon theme-outline c-blue-lighter ',
                  iconClasses: itemValue ? 'mdi mdi-eye-outline' : 'mdi mdi-plus',
                  isDisabled: item.data.multi && item.data.multi === 'true',
                  isRequired: false,
                  onActionClicked: itemValue ?
                    () => {
                      const itemIndex = itemList.findIndex(
                        (effectedItem) =>
                          effectedItem.data.title.replace('*', '').trim() === item.data.dependOn
                      );
                      let l = {};
                      if (selectedValues[itemIndex])
                        l = { ...itemValue, itemId: item.data.searchKey };
                      else l = { ...itemValue, itemId: item.data.searchKey };
                      if (l.itemId && l.itemId.toLowerCase() === 'contact') l.itemId = CONTACTS;
                      if (l.itemId && l.itemId.toLowerCase() === 'property') {
                        l.itemId = PROPERTIES;
                        l.type = '1';
                      }
                      if (l.itemId && l.itemId.toLowerCase() === 'unit') l.itemId = UNITS;

                      localStorage.setItem('current', JSON.stringify(l));

                      setIsOpenContactsDialog(true);
                    } :
                    () => {
                      const itemIndex = itemList.findIndex(
                        (effectedItem) =>
                          effectedItem.data.title.replace('*', '').trim() === item.data.dependOn
                      );

                      let l = {};
                      if (selectedValues[itemIndex]) l = { itemId: selectedValues[itemIndex] };
                      else l = { itemId: item.data.searchKey };

                      if (l.itemId && l.itemId.toLowerCase() === 'contact') l.itemId = CONTACTS;
                      if (l.itemId && l.itemId.toLowerCase() === 'property') {
                        l.itemId = PROPERTIES;
                        l.type = '1';
                      }
                      if (l.itemId && l.itemId.toLowerCase() === 'unit') {
                        l.itemId = UNITS;
                        l.type = '1';
                      }
                      setDialogType((l.itemId && l.itemId.toLowerCase()) || null);
                      localStorage.setItem('current', JSON.stringify(l));
                      setIsOpenContactsDialog(true);
                    },
                }
              }
            />
            <ContactsDialog
              open={isOpenContactsDialog}
              onSave={() => { }}
              closeDialog={(itemsDialog) => {
                if (DialogType === UNITS) OnAddnewUnitRule(itemList, setData, itemsDialog);
                if (DialogType === CONTACTS)
                  OnAddnewContactRule(item, itemList, setData, itemsDialog);
                if (DialogType === PROPERTIES)
                  OnAddnewPropertyRule(item, itemList, setData, itemsDialog);
                setIsOpenContactsDialog(false);
              }}
            />
            {isOpenLeadOwnerDialog && (
              <LeadOwnerDialog
                open={isOpenLeadOwnerDialog}
                onSave={() => setIsOpenLeadOwnerDialog(false)}
                close={() => {
                  const leadOwnerIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'lead_owner'));
                  if (leadOwnerIndex !== -1)
                    setData(itemList[leadOwnerIndex].field.id, leadOwnerValue);

                  setIsOpenLeadOwnerDialog(false);
                }}
              />
            )}
            {isOpenLeaseLeadOwnerDialog && (
              <LeaseLeadOwnerDialog
                open={isOpenLeaseLeadOwnerDialog}
                onSave={() => setisOpenLeaseLeadOwnerDialog(false)}
                close={() => {
                  const LeaseleadOwnerIndex = itemList.indexOf(itemList.find((f) => f.field.id === 'lease_lead-owner'));
                  if (LeaseleadOwnerIndex !== -1)
                    setData(itemList[LeaseleadOwnerIndex].field.id, LeaseleadOwnerValue);
                  setData('lease_lead_owner', LeaseleadOwnerValue);
                  setisOpenLeaseLeadOwnerDialog(false);
                }}
              />
            )}
          </>
        );
        break;
      }
      break;

    case 'PriceAndPercentage':
      component = (
        <>
          <PriceAndPercentage
            type={item.data.controlType}
            currency='AED'
            value={newValue}
            area={values && values['builtup_area_sqft'] && +values['builtup_area_sqft']}
            sqrSalePrice={getSqrSalePrice()}
            onChange={(e) => {
              if (e === null) return;
              setNewValue(e);
              setData(index, e);
            }}
            setData={setData}
            itemList={itemList}
            values={values}
            depositSum={((values['rent_general_deposit'] || 0) + (values['rent_security_deposit']
              || 0) + (values['chiller_deposit'] || 0))}
          />
        </>
      );
      break;

    default:
      break;
  }

  return component;
};
export default ConvertJson;
