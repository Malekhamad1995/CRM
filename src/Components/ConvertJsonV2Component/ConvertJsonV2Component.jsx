import React, { useCallback, useEffect, useState } from 'react';
import { Slider, Button, InputAdornment } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import ChipInput from 'material-ui-chip-input';
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import {
  LookupRule,
  ContactRule,
  PropertyRule,
  PropertyOrUnitRule,
  VisaRules,
  LookupsEffectedOnRules,
  UserRule,
  TitleRuleV2,
  UserDefaultRule,
  StatusLeadDefaulRule2,
  OperationTypeRule,
  ListingDateRule2,
  ListingExpiryDateRule2,
  ListingDate,

} from '../../Rule';
import { OnchangePropertyInUnitRuleV2, UnitRule } from '../../Rule/UnitRule';
import {
  AutocompleteComponent,
  CheckboxesComponent,
  DatePickerComponent,
  Inputs,
  PhonesComponent,
  RadiosGroupComponent,
} from '../Controls';
import { RepeatedItemDialog } from '../../Views/Home/FormBuilder/Dialogs/RepeatedItemDialog';
import PriceAndPercentage from '../../Views/Home/FormBuilder/Utilities/PriceAndPercentage';
import { ContactsDialog } from '../../Views/Home/FormBuilder/Dialogs/ContactsDialog';
import { UploadDialog } from '../../Views/Home/FormBuilder/Dialogs/UploadDialog';
import { MapDialog } from '../../Views/Home/FormBuilder/Dialogs/MapDialog';
import { ModelsUnitsDialog } from '../../Views/Home/FormBuilder/Dialogs/ModelsUnitsDialog';
import { LeadOwnerDialog } from '../../Views/Home/FormBuilder/Dialogs/LeadOwnerDialog';
import { CONTACTS, PROPERTIES, UNITS } from '../../config/pagesName';
import { UnitModelPopoverComponent } from '../UnitModelPopoverComponent/UnitModelPopoverComponent';
import { RepeatedLinkDialog } from '../../Views/Home/FormBuilder/Dialogs/RepeatedLinkDialog';
import { BathroomsAndBedroomsDefaultRuleV2 } from '../../Rule/BathroomsAndBedroomsDefaultRule';
import { GetParams, showError } from '../../Helper';
import { LeadTypeIdEnum } from '../../Enums';
import { LeaseLeadOwnerDialog } from '../../Views/Home/FormBuilder/Dialogs/LeaseLeadOwnerDialog';

// import { lookupItemsGet } from '../../Services';

export const ConvertJsonV2Component = ({
  item, // item properties & data
  itemValue, // value of item
  allItems, // all items as properties
  allItemsValues, // all items values
  // onValueChanged, // on itemValue or on element of properties like enum changed
  onItemChanged, // on itemValue or on element of properties like enum changed
  onValueChanged, // on itemValue or on element of properties like enum changed
  error, // if this item is invalid (bool)
  helperText, // the error message (string)
  isSubmitted,
  // loadings, // array of current items loading on
  onLoadingsChanged,
  isLoading, // currentItemIsLoadingOrNot
  setIsLoading,
}) => {
  const { t } = useTranslation(['Shared']);
  const { id } = item.field;
  const [unitModelPopoverAttachedWith, setUnitModelPopoverAttachedWith] = useState(null);
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [modelsUnitsDialog, setModelsUnitsDialog] = useState(false);
  const [RepeatedDialog, setRepeatedDialog] = useState(false);
  const [repeatedLinkDialog, setRepeatedLinkDialog] = useState(false);
  const [isOpenContactsDialog, setIsOpenContactsDialog] = useState(false);
  const [isOpenLeadOwnerDialog, setIsOpenLeadOwnerDialog] = useState(false);
  const [leadOwnerValue, setLeadOwnerValue] = useState(null);
  const [isOpenLeaseLeadOwnerDialog, setisOpenLeaseLeadOwnerDialog] = useState(false);
  const [LeaseleadOwnerValue, setLeaseLeadOwnerValue] = useState(null);

  const [isUnitUpdate, setIsUnitUpdate] = useState(false);

  const onSearchFieldActionClicked = useCallback(() => {
    const itemIndex = allItems.findIndex(
      (effectedItem) => effectedItem.data.title.replace('*', '').trim() === item.data.dependOn
    );
    let l = {};
    if (allItemsValues[itemIndex] && itemValue)
      l = { ...itemValue, itemId: allItemsValues[itemIndex] };
    else if (!allItemsValues[itemIndex] && itemValue)
      l = { ...itemValue, itemId: item.data.searchKey };
    else if (allItemsValues[itemIndex]) l = { itemId: allItemsValues[itemIndex] };
    else l = { itemId: item.data.searchKey };
    // if (!itemValue && item.data.dependOn && !allItemsValues[itemIndex]) return;

    if (l.itemId && l.itemId.toLowerCase() === 'contact') l.itemId = CONTACTS;

    if (l.itemId && l.itemId.toLowerCase() === 'property') {
      l.itemId = PROPERTIES;
      l.type = '1';
    }
    if (l.itemId && l.itemId.toLowerCase() === 'unit') l.itemId = UNITS;

    localStorage.setItem('current', JSON.stringify(l));

    setIsOpenContactsDialog(true);
  }, [allItems, allItemsValues, item.data.dependOn, item.data.searchKey, itemValue]);
  const openUnitModelPopoverHandler = useCallback((event) => {
    setUnitModelPopoverAttachedWith(event.currentTarget);
  }, []);
  const onPopoverClose = useCallback(() => {
    setUnitModelPopoverAttachedWith(null);
  }, []);

  useEffect(() => {
    if (id === 'title')
      setTimeout(() => { TitleRuleV2(id, onValueChanged, item, allItems, itemValue); }, 2000);
  }, []);

  useEffect(() => {
    if (id === 'unit_ref_number' || id === 'unit_ref-number') {
      if (allItemsValues && allItemsValues.operation_type && allItemsValues.operation_type.lookupItemName === 'Buy' || allItemsValues && allItemsValues.operation_type && allItemsValues.operation_type.lookupItemName === 'Rent')
        item.data.isReadonly = false;
      else item.data.isReadonly = true;
    }
    setTimeout(() => {
      const leadStatus = localStorage.getItem('leadStatus');
      if (leadStatus) {
        const leadStatusJson = JSON.parse(leadStatus);
        if (item.field.id === 'status' && leadStatusJson && leadStatusJson.lookupItemName === 'Closed')
          item.data.isReadonly = true;
        else if (item.field.id === 'status' && leadStatusJson && leadStatusJson.lookupItemName === 'Open')
          item.data.isReadonly = false;
      }
    }, 300);
    // const unitModelRelatedData = localStorage.getItem('unitModelRelatedData');
    // if (unitModelRelatedData) {
    //   const unitModelRelatedDataJson = JSON.parse(unitModelRelatedData);
    //   if (id === 'operation_type' && +GetParams('id') && unitModelRelatedDataJson && unitModelRelatedDataJson.operation_type) {
    //     setTimeout(() => {
    //       OperationTypeRule(item, onItemChanged, unitModelRelatedDataJson.operation_type);
    //     }, 1000);
    //   }
    // }
  }, [item]);

  const getStatusValue = () => {
    if (item.field.id === 'referredto') {
      const { status } = allItemsValues;
      if (status)
        return !!((status && status.lookupItemName === 'Closed'));
    }
    return false;
  };
  const getStatusValue2 = () => {
    const { status } = allItemsValues;
    if (status && status.lookupItemName === 'Closed')
      return true;
    return false;
  };

  const getLeadOperationValue = () => {
    if (item.field.id === 'lead_operation')
      return true;
    return false;
  };

  const disableUnitRefNumber = () => {
    if (item.field.id === 'unit_ref_number' && LeadTypeIdEnum.Owner.leadTypeId === +GetParams('formType'))
      return true;
    return false;
  };

  const getIsUpdateCloseResonAndRemarks = () => {
    if ((id === 'close_reason')) {
      const leadStatus = localStorage.getItem('leadStatus');
      if (leadStatus) {
        const leadStatusJson = JSON.parse(leadStatus);
        if (leadStatusJson && leadStatusJson.lookupItemName === 'Closed')
          return true;
      }
    } else if (id === 'closing_remarks')
      return !(allItemsValues.status && allItemsValues.status.lookupItemName === 'Closed');

    return false;
  };

  useEffect(() => {
    if ((item.field.id === 'bathrooms' && item.field.FieldType === 'select') || (item.field.id === 'bedrooms' && item.field.FieldType === 'select')) {
      setTimeout(() => {
        BathroomsAndBedroomsDefaultRuleV2(item, onValueChanged, allItems, allItemsValues);
      }, 500);
    }
    setTimeout(() => {
      if (item.field.id === 'status') {
        getStatusValue();
        getStatusValue2();
        getIsUpdateCloseResonAndRemarks();
      }
    }, 700);
  }, []);

  useEffect(() => {
    if (item.field.id === 'operation_type') {
      const unitModelRelatedData = localStorage.getItem('unitModelRelatedData');
      if (unitModelRelatedData) {
        const unitModelRelatedDataJson = JSON.parse(unitModelRelatedData);
        if (id === 'operation_type' && +GetParams('id') && unitModelRelatedDataJson && unitModelRelatedDataJson.operation_type) {
          if (unitModelRelatedDataJson.operation_type && unitModelRelatedDataJson.operation_type.lookupItemName === 'SaleAndRent')
            item.data.isReadonly = true;
          else
            OperationTypeRule(item, onItemChanged, unitModelRelatedDataJson.operation_type, setIsLoading);
        }
      }
    }

    if (item.field.id === 'listing_date') {
      if (allItemsValues && allItemsValues.listing_date) {
        setTimeout(() => {
          ListingDate(id, allItems, allItemsValues.listing_date);
        }, 500);
      }
    }
    if (item.field.id === 'rent_listing_date') {
      if (allItemsValues && allItemsValues.rent_listing_date) {
        setTimeout(() => {
          ListingDate(id, allItems, allItemsValues.rent_listing_date);
        }, 500);
      }
    }
  }, [item.field.id]);

  useEffect(() => {
    if (id === 'seller_has_paid' || id === 'selling_price_agency_fee') {
      const sellerhaspaid = allItemsValues && allItemsValues.seller_has_paid ? allItemsValues.seller_has_paid : 0;
      const sellingpriceagencyfee = allItemsValues && allItemsValues.selling_price_agency_fee ? allItemsValues.selling_price_agency_fee.salePrice : 0;
      const sub = sellingpriceagencyfee - sellerhaspaid;

      setTimeout(() => {
        onValueChanged(sub, 0, 'amount_due_to_developer');
      }, 300);
    }
  }, [itemValue]);

  return (
    <>
      {item.field.FieldType === 'UnitsModels' && (
        <div className='form-item'>
          <div className='d-flex-column w-100'>
            <label htmlFor={item.field.id} className='label-wrapper'>
              {item.data.title}
            </label>
            <div className='chip-input-wrapper'>
              <ChipInput
                className='chip-input theme-form-builder'
                InputProps={{ autoComplete: 'new-password' }}
                id={item.field.id}
                value={itemValue && itemValue.Models ? itemValue.Models : []}
                onAdd={(chip) => {
                  if (itemValue && itemValue.Models && itemValue.Models.length > 0) {
                    Object.keys(itemValue).forEach((key) => {
                      if (typeof itemValue[key] === 'object' && key !== 'Models') {
                        const isExist = itemValue.Models.findIndex((modelItem) => modelItem === key);
                        if (isExist === -1)
                          delete itemValue[key];
                      }
                    });
                  } else if (itemValue && itemValue.Models && itemValue.Models.length === 0) {
                    Object.keys(itemValue).forEach((key) => {
                      if (typeof itemValue[key] === 'object' && key !== 'Models')
                        delete itemValue[key];
                    });
                  }
                  if (itemValue && itemValue.Models) {
                    onValueChanged({
                      ...itemValue,
                      Models: [...itemValue.Models, chip],
                    });
                  } else onValueChanged({ Models: [chip] });
                }}
                onDelete={(chip, itemIndex) => {
                  if (itemValue && itemValue.Models)
                    itemValue.Models.splice(itemIndex, 1);
                  delete itemValue[chip];
                  if (itemValue && itemValue.Models && itemValue.Models.length > 0) {
                    Object.keys(itemValue).forEach((key) => {
                      if (typeof itemValue[key] === 'object' && key !== 'Models') {
                        const isExist = itemValue.Models.findIndex((modelItem) => modelItem === key);
                        if (isExist === -1)
                          delete itemValue[key];
                      }
                    });
                  } else if (itemValue && itemValue.Models && itemValue.Models.length === 0) {
                    Object.keys(itemValue).forEach((key) => {
                      if (typeof itemValue[key] === 'object' && key !== 'Models')
                        delete itemValue[key];
                    });
                    onValueChanged(null, undefined, 'units_models');
                    return;
                  }
                  onValueChanged({ ...itemValue });
                }}
              // variant="standard"
              />
              <Button
                className='ml-2-reversed btns-icon theme-solid bg-blue-lighter'
                disabled={!(itemValue && itemValue.Models && itemValue.Models.length > 0)}
                onClick={() => {
                  if (itemValue && itemValue.Models && itemValue.Models.length > 0)
                    setModelsUnitsDialog(true);
                }}
              >
                <span className='mdi mdi-plus' />
              </Button>
            </div>
          </div>
        </div>
      )}
      {((item.field.FieldType === 'address' &&
        (item.data.uiType === 'text' || item.data.uiType === 'map')) ||
        item.field.FieldType === 'MapField') && (
          <div className='form-item'>
            <Inputs
              labelClasses={item.field.isRequired ? 'c-red' : ''}
              idRef={item.field.id}
              isRequired={item.field.isRequired}
              isDisabled={
                item.data.uiType === 'map' ||
                item.field.FieldType === 'MapField' ||
                item.data.specialKey === 'IsDisabled' ||
                item.data.specialKey === 'UnitRefNo' ||
                item.data.isReadonly
              }
              labelValue={item.data.title}
              value={
                (itemValue &&
                  ((item.data.uiType === 'text' && itemValue.value) ||
                    ((item.data.uiType === 'map' || item.field.FieldType === 'MapField') &&
                      `${itemValue.latitude} , ${itemValue.longitude}`) ||
                    '')) ||
                ''
              }
              isSubmitted={isSubmitted}
              isWithError
              helperText={helperText}
              error={error}
              onInputChanged={
                (item.data.uiType === 'text' &&
                  ((e) => {
                    onValueChanged({
                      value: e.target.value,
                      type: item.data.addressType,
                    });
                  })) ||
                undefined

              }
              buttonOptions={
                ((item.data.uiType === 'map' || item.field.FieldType === 'MapField') && {
                  className: 'btns-icon theme-outline c-blue-lighter',
                  iconClasses: 'mdi mdi-map-marker',
                  isDisabled: false,
                  isRequired: false,
                  onActionClicked: () => {
                    setOpenMapDialog(true);
                  },
                }) ||
                undefined
              }
            />
          </div>
        )}
      {((item.field.FieldType === 'textField' && (item.data.specialKey !== 'currency' && item.data.specialKey !== 'size' && item.data.specialKey !== 'decimal')) || item.field.FieldType === 'textarea') && (
        <div className='form-item'>
          <div className='w-100 p-relative'>
            {item.field.id !== 'unit_model' && item.field.id !== 'closing_remarks' && (
              <Inputs
                labelClasses={item.field.isRequired ? 'c-red' : ''}
                idRef={item.field.id}
                isRequired={item.field.isRequired}
                isDisabled={
                  getIsUpdateCloseResonAndRemarks() ||
                  item.data.isReadonly ||
                  item.data.specialKey === 'IsDisabled' ||
                  item.data.specialKey === 'UnitRefNo'
                }
                labelValue={item.data.title}
                value={itemValue || ''}
                isWithError
                multiline={item.field.FieldType === 'textarea'}
                isSubmitted={isSubmitted}
                helperText={helperText}
                onInputFocus={
                  (item.field.id === 'unit_model' && openUnitModelPopoverHandler) || undefined
                }
                onInputBlur={(item.field.id === 'unit_model' && onPopoverClose) || undefined}
                error={error}
                rows={(item.field.FieldType === 'textarea' && 4) || undefined}
                onInputChanged={(e) => {
                  onValueChanged(e.target.value);
                }}
              />

            )}

            {(item.field.id !== 'unit_model' && item.field.id === 'closing_remarks' && allItemsValues.status && allItemsValues.status.lookupItemName === 'Closed') && (
              <Inputs
                labelClasses={item.field.isRequired ? 'c-red' : ''}
                idRef={item.field.id}
                isRequired={item.field.isRequired}
                isDisabled={
                  getIsUpdateCloseResonAndRemarks() ||
                  item.data.isReadonly ||
                  item.data.specialKey === 'IsDisabled' ||
                  item.data.specialKey === 'UnitRefNo'
                }
                labelValue={item.data.title}
                value={itemValue || ''}
                isWithError
                multiline={item.field.FieldType === 'textarea'}
                isSubmitted={isSubmitted}
                helperText={helperText}
                onInputFocus={
                  (item.field.id === 'unit_model' && openUnitModelPopoverHandler) || undefined
                }
                onInputBlur={(item.field.id === 'unit_model' && onPopoverClose) || undefined}
                error={error}
                rows={(item.field.FieldType === 'textarea' && 4) || undefined}
                onInputChanged={(e) => {
                  onValueChanged(e.target.value);
                }}
              />

            )}

            {allItemsValues && allItemsValues.property_name && item.field.id === 'unit_model' && (
              <UnitModelPopoverComponent
                unitModelPopoverAttachedWith={unitModelPopoverAttachedWith}
                onPopoverClose={onPopoverClose}
                item={item}
                itemValue={itemValue}
                allItems={allItems}
                propertyId={allItemsValues.property_name.id}
                onValueChanged={onValueChanged}
                labelValue={item.data.title}
                idRef={id}
                allItemsValues={allItemsValues}
                propertyName={allItemsValues && allItemsValues.property_name}

              />
            )}
          </div>
        </div>
      )}

      {(item.field.FieldType === 'textField' && (item.data.specialKey === 'currency' || item.data.specialKey === 'size' || item.data.specialKey === 'decimal')) && (
        <div className='form-item'>
          <div className='w-100 p-relative'>
            <Inputs
              isAttachedInput
              type='number'
              startAdornment={(item.data.specialKey === 'currency' && (
                <InputAdornment position='start' className='px-2'>
                  AED
                </InputAdornment>
              ))}
              labelClasses={item.field.isRequired ? 'c-red' : ''}
              idRef={item.field.id}
              isRequired={item.field.isRequired}
              isDisabled={
                item.data.isReadonly || (id === 'amount_due_to_developer' || id === 'pricesqm')
              }
              labelValue={item.data.title}
              value={itemValue}
              isWithError
              isSubmitted={isSubmitted}
              helperText={helperText}
              error={error}
              withNumberFormat
              onKeyUp={(e) => {
                if (id === 'pricesqm') {
                  const { value } = e.target;
                  const fixed = (value && value.replace(/,/g, ''));
                  const editValue = fixed ? parseFloat(fixed) : 0;
                  if (editValue)
                    onValueChanged(parseFloat(editValue));
                  else
                    onValueChanged(editValue);
                }
              }}
              onInputChanged={(e) => {
                if (id !== 'pricesqm') {
                  if (!Number.isNaN(e.target.value))
                    onValueChanged(parseFloat(e.target.value));
                  else
                    onValueChanged(0);
                }
              }}

            />
          </div>
        </div>
      )}

      {item.field.FieldType === 'communication' &&
        (item.data.CommunicationType === 'Email' ||
          item.data.CommunicationType === 'SocialMedia') && (
          <div className='form-item'>
            <Inputs
              labelClasses={item.field.isRequired ? 'c-red' : ''}
              idRef={item.field.id}
              isRequired={item.field.isRequired}
              isDisabled={
                item.data.isReadonly ||
                item.data.specialKey === 'IsDisabled' ||
                item.data.specialKey === 'UnitRefNo'
              }
              labelValue={item.data.title}
              value={
                (itemValue &&
                  ((item.data.CommunicationType === 'Email' && itemValue.email) ||
                    itemValue.link ||
                    '')) ||
                ''
              }
              isWithError
              isSubmitted={isSubmitted}
              helperText={helperText}
              error={error}
              onInputChanged={(e) => {
                if (item.data.CommunicationType === 'Email') {
                  onValueChanged({
                    email: e.target.value.toLowerCase(),
                    typeId: item.data.lookupItem,
                  });
                } else {
                  onValueChanged({
                    link: e.target.value,
                    typeId: item.data.lookupItem,
                  });
                }
              }}
              buttonOptions={
                (item.data.CommunicationType === 'Email' && {
                  className: 'btns-icon theme-solid bg-blue-lighter',
                  iconClasses: 'mdi mdi-plus',
                  isDisabled: !(
                    itemValue &&
                    new RegExp(item.data.regExp).test(itemValue.email) &&
                    itemValue.email &&
                    itemValue.email.length > 0
                  ),
                  isRequired: false,
                  onActionClicked: () => {
                    if (
                      itemValue &&
                      new RegExp(item.data.regExp).test(itemValue.email) &&
                      itemValue.email &&
                      itemValue.email.length > 0
                    )
                      setRepeatedDialog(true);
                  },
                }) ||
                undefined
              }
            />
          </div>
        )}
      {item.field.FieldType === 'rangeField' && (
        <div className='form-item flex-wrap px-0'>
          <div className='w-50 px-2'>
            <Inputs
              idRef={item.field.id}
              labelClasses={item.field.isRequired ? 'c-red' : ''}
              labelValue={item.data.title}
              inputPlaceholder={t('from')}
              value={itemValue ? itemValue[0] : Number(item.data.minNumber)}
              isRequired={item.field.isRequired}
              helperText={helperText}
              error={error}
              isWithError
              isSubmitted={isSubmitted}
              onInputChanged={(e) => {
                if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                  const v = itemValue || [];
                  v[0] = Number(e.target.value);
                  onValueChanged(v);
                }
              }}
              onInputBlur={(e) => {
                if (Number(e.target.value) < Number(item.data.minNumber)) {
                  const v = itemValue || [];
                  v[0] = Number(item.data.minNumber);
                  onValueChanged(v);
                } else if (Number(e.target.value) > Number(item.data.maxNumber)) {
                  const v = itemValue || [];
                  v[0] = Number(item.data.maxNumber);
                  onValueChanged(v);
                } else {
                  const v = itemValue || [];
                  v[0] = Number(e.target.value);
                  onValueChanged(v);
                }
              }}
            />
          </div>
          <div className='w-50 px-2'>
            <Inputs
              idRef={`${item.field.id}to`}
              labelValue={t('to')}
              value={itemValue ? itemValue[1] : Number(item.data.maxNumber)}
              isRequired={item.field.isRequired}
              labelClasses={item.field.isRequired ? 'c-red' : ''}
              helperText={helperText}
              error={error}
              isWithError
              isSubmitted={isSubmitted}
              onInputChanged={(e) => {
                if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                  const v = itemValue || [];
                  v[1] = Number(e.target.value);
                  onValueChanged(v);
                }
              }}
              onInputBlur={(e) => {
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
                if (Number(e.target.value) < Number(item.data.minNumber)) {
                  const v = itemValue || [];
                  v[1] = Number(marks[1].value);

                  onValueChanged(v);
                } else if (Number(e.target.value) > Number(item.data.maxNumber)) {
                  const v = itemValue || [];
                  v[1] = Number(item.data.maxNumber);
                  onValueChanged(v);
                } else {
                  const v = itemValue || [];
                  v[1] = Number(e.target.value);
                  onValueChanged(v);
                }
              }}
            />
          </div>
          <div className='w-100 px-4'>
            <Slider
              required={item.field.isRequired}
              className='sliders'
              aria-labelledby='range-slider'
              valueLabelDisplay='auto'
              onChange={(event, value) => {
                if (!itemValue || value[0] !== itemValue[0] || value[1] !== itemValue[1])
                  onValueChanged(value);
              }}
              value={
                itemValue ?
                  [Number(itemValue[0]), Number(itemValue[1])] :
                  [Number(item.data.minNumber), Number(item.data.maxNumber)]
              }
              step={200}
              marks={[
                {
                  value: Number(item.data.minNumber),
                  label: `${Number(item.data.minNumber)}`,
                },
                {
                  value: Number(item.data.maxNumber),
                  label: `${Number(item.data.maxNumber)}`,
                },
              ]}
              min={Number(item.data.minNumber)}
              max={Number(item.data.maxNumber)}
            />
          </div>
        </div>
      )}
      {(item.data.CommunicationType === 'Phone' || item.field.FieldType === 'phone') && (
        <div className='form-item'>
          <PhonesComponent
            labelClasses={item.field.isRequired ? 'c-red' : ''}
            idRef={item.field.id}
            labelValue={item.data.title}
            required={item.field.isRequired}
            value={
              itemValue === null || itemValue === undefined || !itemValue.phone ?
                item.data.defaultCountryCode :
                itemValue.phone
            }
            onInputChanged={(value) => {
              if (value.length > 14) return;
              onValueChanged({ phone: value, typeId: item.data.lookupItem });
            }}
            isSubmitted={isSubmitted}
            error={error}
            helperText={helperText}
            buttonOptions={{
              className: 'btns-icon theme-solid bg-blue-lighter',
              iconClasses: 'mdi mdi-plus',
              isDisabled: !(itemValue && itemValue.phone && itemValue.phone.length >= 9),
              isRequired: false,
              onActionClicked: () => {
                if (itemValue && itemValue.phone && itemValue.phone.length >= 9)
                  setRepeatedDialog(true);
              },
            }}
          />
        </div>
      )}
      {item.field.FieldType === 'radio' && (
        <div className='form-item'>
          <RadiosGroupComponent
            data={item.data.enum}
            idRef={item.field.id}
            onSelectedRadioChanged={(e) => onValueChanged(e.target.value)}
            value={itemValue}
          // name='Active'
          // labelInput='item.data.title'
          // valueInput='value'
          />
        </div>
      )}
      {(item.field.FieldType === 'checkbox' || item.field.FieldType === 'checkboxes') && (
        <div className='form-item'>
          <CheckboxesComponent
            data={
              (item.field.FieldType === 'checkbox' && [itemValue]) || item.data.items.enum || []
            }
            onSelectedCheckboxChanged={(e) => {
              if (item.field.FieldType === 'checkboxes') {
                const result = (itemValue && [...itemValue]) || [];
                if (e.target.checked && result.indexOf(e.target.value) === -1)
                  result.push(e.target.value);
                else result.splice(result.indexOf(e.target.value), 1);
                onValueChanged(result);
              } else onValueChanged(e.target.checked);
            }}
            isRow
            idRef={item.field.id}
            labelClasses={item.field.isRequired ? 'c-red' : ''}
            labelValue={item.data.title}
            required={item.field.isRequired}
            checked={(selectedItem) => itemValue && [...itemValue].indexOf(selectedItem) !== -1}
            value={(item.field.FieldType === 'checkbox' && itemValue) || undefined}
          />
        </div>
      )}
      {item.field.FieldType === 'alt-date' && (
        <div className='form-item'>
          <DatePickerComponent
            required={item.field.isRequired}
            idRef={item.field.id}
            labelValue={item.data.title}
            labelClasses={item.field.isRequired ? 'c-red' : ''}
            value={(itemValue && moment(itemValue).isValid() && moment(itemValue))}
            helperText={helperText}
            error={error}
            isSubmitted={isSubmitted}
            maxDate={
              item.data.maxDate && moment(new Date(item.data.maxDate)).isValid() ?
                moment(new Date(item.data.maxDate)) :
                undefined
            }
            minDate={
              item.data.minDate && moment(new Date(item.data.minDate)).isValid() ?
                moment(new Date(item.data.minDate)) :
                undefined
            }
            onDateChanged={(e) => {
              VisaRules(e, item, onValueChanged, allItems);
              ListingDate(id, allItems, e);
              ListingExpiryDateRule2(item, onValueChanged);
              onValueChanged(e);
            }}
          />
        </div>
      )}
      {((item.data.uiType === 'select'
        &&
        LookupRule(item, allItems)
      ) ||
        item.field.FieldType === 'UploadFiles' ||
        (item.field.FieldType === 'searchField' && item.data.searchKey === 'User' && UserDefaultRule(item, onItemChanged, allItems, allItemsValues)) ||
        (item.field.FieldType === 'searchField' && item.field.id !== 'owner') || (item.field.FieldType === 'select' && item.field.id !== 'close_reason')
      ) && (
      <div className='form-item'>
        <AutocompleteComponent
          labelClasses={item.field.isRequired ? 'c-red' : ''}
          idRef={item.field.id}
          isRequired={item.field.isRequired}
          isDisabled={
                getStatusValue() ||
                getLeadOperationValue() ||
                disableUnitRefNumber() ||
                isLoading ||
                item.data.isReadonly ||
                item.data.specialKey === 'IsDisabled' ||
                item.data.specialKey === 'UnitRefNo'
              }
          isLoading={isLoading}
          withLoader
          isWithError
          isSubmitted={isSubmitted}
          helperText={helperText}
          error={error}
          multiple={(item.data.multi && item.data.multi === 'true') || false}
          filterOptions={
                ((item.data.searchKey === 'property' ||
                  item.data.searchKey === 'contact' ||
                  item.data.searchKey === 'PropertyOrUnit') &&
                  ((option) => option)) ||
                undefined
              }
          renderOption={
                (item.data.searchKey === 'property' &&
                  ((option) => <span>{`${option.name || ''} - ${option.city || ''}`}</span>)) ||
                (item.data.searchKey === 'User' &&
                  ((option) => (
                    <div className='d-flex-column'>
                      <div className='d-flex-v-center-h-between w-100 texts-truncate'>
                        {option.name}
                      </div>
                      <span className='c-gray-secondary'>{option.branch || ''}</span>
                    </div>
                  ))) ||
                (item.data.searchKey === 'contact' &&
                  ((option) => (
                    <div className='d-flex-column'>
                      <div className='d-flex-v-center-h-between w-100 texts-truncate'>
                        {option.name}
                      </div>
                      <span className='c-gray-secondary'>{option.phone}</span>
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
          selectedValues={
                item.data.multi && item.data.multi === 'true' ?
                  (itemValue &&
                    ((item.field.FieldType === 'UploadFiles' && [...itemValue.selected]) ||
                      (!Array.isArray(itemValue) && [itemValue]) || [...itemValue])) ||
                  [] :
                  itemValue || null
              }
          data={item.data.enum}
          chipsLabel={
                (item.data && item.data.multi &&
                  item.data.multi === 'true' &&
                  ((item.field.FieldType === 'searchField' &&
                    ((option) => (option && option.name) || '')) ||
                    ((option) => (!item.data.lookup ? option : option && option.lookupItemName || undefined)))) ||
                undefined
              }
          onInputChange={
                (item.field.FieldType === 'searchField' &&
                  ((e, v) => {
                    ContactRule(item, v, onItemChanged);
                    PropertyRule(item, v, onItemChanged);
                    UserRule(item, v, onItemChanged, allItems, allItemsValues);
                    PropertyOrUnitRule(item, v, onItemChanged, allItems, allItemsValues);
                    UnitRule(item, v, onItemChanged);
                  })) ||
                undefined
              }
          inputClasses='inputs theme-form-builder'
          displayLabel={
                (item.field.FieldType === 'searchField' &&
                  ((option) => (option && `${option.name} ${option.barnch || ''}`) || '')) ||
                ((option) => (!item.data.lookup ? option : option.lookupItemName) || '')
              }
          getOptionSelected={
                (item.field.FieldType === 'searchField' &&
                  ((option) =>
                    (item.data.multi &&
                      item.data.multi === 'true' &&
                      itemValue &&
                      ((!Array.isArray(itemValue) && [itemValue]) || itemValue).findIndex(
                        (element) => (element.id && element.id === option.id) || option === element
                      ) !== -1) ||
                    (itemValue.id && itemValue.id === option.id) ||
                    option === itemValue)) ||
                ((option) =>
                  (item.data.multi &&
                    item.data.multi === 'true' &&
                    (
                      (itemValue &&
                        ((item.field.FieldType === 'UploadFiles' && itemValue.selected) ||
                          (!Array.isArray(itemValue) && [itemValue]) ||
                          itemValue)) ||
                      []
                    ).findIndex(
                      (element) =>
                        (element.lookupItemId && element.lookupItemId === option.lookupItemId) ||
                        option === element
                    ) !== -1) ||
                  (((item.field.FieldType === 'UploadFiles' && itemValue.selected) || itemValue)
                    .lookupItemId &&
                    ((item.field.FieldType === 'UploadFiles' && itemValue.selected) || itemValue)
                      .lookupItemId === option.lookupItemId) ||
                  option === itemValue)
              }
          onChange={(e, v) => {
                if (item.field.id === 'bedrooms' || item.field.id === 'bathrooms') {
                  const findAnyBathroomsAndBedrooms = v.find((num) => num === 'Any' || num === 'any');
                  if (findAnyBathroomsAndBedrooms) {
                    onValueChanged([findAnyBathroomsAndBedrooms]);
                    return;
                  }
                }
                if (item.field.id === 'listing_expiry_period' || item.field.id === 'rent_listing_expiry_period')
                  ListingDateRule2(item, v, onValueChanged, allItems, allItemsValues);
                if (item.field.id === 'status') {
                  if ((v && v.lookupItemName === 'Open') || !v)
                    StatusLeadDefaulRule2(item, onValueChanged, allItems, allItemsValues);
                }
                TitleRuleV2(id, onValueChanged, item, allItems, v);
                OnchangePropertyInUnitRuleV2(item, v, onValueChanged);
                if (item.field.FieldType === 'UploadFiles')
                  onValueChanged({ ...itemValue, selected: v });
                else onValueChanged(v);
                LookupsEffectedOnRules(
                  v,
                  item,
                  onValueChanged,
                  onItemChanged,
                  allItems,
                  allItemsValues,
                  onLoadingsChanged
                );
                if (item.field.id === 'lead_owner') {
                  if (v === null) {
                    setLeadOwnerValue(itemValue);
                    setIsOpenLeadOwnerDialog(true);
                  }
                }
                if (item.field.id === 'lease_lead_owner') {
                  if (v === null) {
                    setLeaseLeadOwnerValue(itemValue);
                    setisOpenLeaseLeadOwnerDialog(true);
                  }
                }
              }}
          withoutSearchButton
          buttonOptions={
                (item.field.FieldType === 'UploadFiles' && {
                  className: 'btns-icon theme-solid bg-blue-lighter',
                  iconClasses:
                    item.field.id === 'external_url' ? 'mdi mdi-plus' : 'mdi mdi-attachment',
                  isDisabled: !(itemValue && itemValue.selected && itemValue.selected.length > 0),
                  isRequired: false,
                  onActionClicked: () => {
                    if (
                      itemValue &&
                      itemValue.selected &&
                      itemValue.selected.length > 0 &&
                      item.field.id !== 'external_url'
                    )
                      setOpenUploadDialog(true);
                    if (
                      itemValue &&
                      itemValue.selected &&
                      itemValue.selected.length > 0 &&
                      item.field.id === 'external_url'
                    )
                      setRepeatedLinkDialog(true);
                  },
                }) ||
                (item.field.FieldType === 'searchField' &&
                  item.field.id !== 'referredto' &&
                  item.field.id !== 'referredby' &&
                  item.field.id !== 'listing_agent' &&
                  item.field.id !== 'rent_listing_agent' &&
                {
                  className: 'btns-icon theme-outline c-blue-lighter',
                  iconClasses: itemValue ? 'mdi mdi-eye-outline' : 'mdi mdi-plus',
                  isDisabled:
                    (item.data.multi && item.data.multi === 'true') ||
                    item.field.id === 'listing_agent',
                  isRequired: false,
                  onActionClicked: onSearchFieldActionClicked,
                }) ||
                undefined
              }
          labelValue={item.data.title}
        />
      </div>
        )}
      {/* /************************ display colse reason when lead status  is closed only  ************************** */}
      {(item.field.id === 'close_reason') && allItemsValues.status && allItemsValues.status.lookupItemName === 'Closed' && (
        <div className='form-item'>
          <AutocompleteComponent
            labelClasses={item.field.isRequired ? 'c-red' : ''}
            idRef={item.field.id}
            isRequired={item.field.isRequired}
            isDisabled={getIsUpdateCloseResonAndRemarks()}
            isLoading={isLoading}
            withLoader
            isWithError
            isSubmitted={isSubmitted}
            helperText={helperText}
            error={error}
            multiple={(item.data.multi && item.data.multi === 'true') || false}
            filterOptions={
              ((item.data.searchKey === 'property' ||
                item.data.searchKey === 'contact' ||
                item.data.searchKey === 'PropertyOrUnit') &&
                ((option) => option)) ||
              undefined
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
                    <span className='c-gray-secondary'>{option.phone}</span>
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
            selectedValues={
              item.data.multi && item.data.multi === 'true' ?
                (itemValue &&
                  ((item.field.FieldType === 'UploadFiles' && [...itemValue.selected]) ||
                    (!Array.isArray(itemValue) && [itemValue]) || [...itemValue])) ||
                [] :
                itemValue || null
            }
            data={item.data.enum}
            chipsLabel={
              (item.data && item.data.multi &&
                item.data.multi === 'true' &&
                ((item.field.FieldType === 'searchField' &&
                  ((option) => (option && option.name) || '')) ||
                  ((option) => (!item.data.lookup ? option : option && option.lookupItemName || undefined)))) ||
              undefined
            }
            onInputChange={
              (item.field.FieldType === 'searchField' &&
                ((e, v) => {
                  ContactRule(item, v, onItemChanged);
                  PropertyRule(item, v, onItemChanged);
                  UserRule(item, v, onItemChanged, allItems, allItemsValues);
                  PropertyOrUnitRule(item, v, onItemChanged, allItems, allItemsValues);
                })) ||
              undefined
            }
            inputClasses='inputs theme-form-builder'
            displayLabel={
              (item.field.FieldType === 'searchField' &&
                ((option) => (option && option.name) || '')) ||
              ((option) => (!item.data.lookup ? option : option.lookupItemName) || '')
            }
            getOptionSelected={
              (item.field.FieldType === 'searchField' &&
                ((option) =>
                  (item.data.multi &&
                    item.data.multi === 'true' &&
                    itemValue &&
                    ((!Array.isArray(itemValue) && [itemValue]) || itemValue).findIndex(
                      (element) => (element.id && element.id === option.id) || option === element
                    ) !== -1) ||
                  (itemValue.id && itemValue.id === option.id) ||
                  option === itemValue)) ||
              ((option) =>
                (item.data.multi &&
                  item.data.multi === 'true' &&
                  (
                    (itemValue &&
                      ((item.field.FieldType === 'UploadFiles' && itemValue.selected) ||
                        (!Array.isArray(itemValue) && [itemValue]) ||
                        itemValue)) ||
                    []
                  ).findIndex(
                    (element) =>
                      (element.lookupItemId && element.lookupItemId === option.lookupItemId) ||
                      option === element
                  ) !== -1) ||
                (((item.field.FieldType === 'UploadFiles' && itemValue.selected) || itemValue)
                  .lookupItemId &&
                  ((item.field.FieldType === 'UploadFiles' && itemValue.selected) || itemValue)
                    .lookupItemId === option.lookupItemId) ||
                option === itemValue)
            }
            onChange={(e, v) => {
              if (item.field.id === 'bedrooms' || item.field.id === 'bathrooms') {
                const findAnyBathroomsAndBedrooms = v.find((num) => num === 'Any' || num === 'any');
                if (findAnyBathroomsAndBedrooms) {
                  onValueChanged([findAnyBathroomsAndBedrooms]);
                  return;
                }
              }
              TitleRuleV2(id, onValueChanged, item, allItems, v);
              OnchangePropertyInUnitRuleV2(item, v, onValueChanged);
              if (item.field.FieldType === 'UploadFiles')
                onValueChanged({ ...itemValue, selected: v });
              else onValueChanged(v);
              LookupsEffectedOnRules(
                v,
                item,
                onValueChanged,
                onItemChanged,
                allItems,
                allItemsValues,
                onLoadingsChanged
              );
            }}
            withoutSearchButton
            buttonOptions={
              (item.field.FieldType === 'UploadFiles' && {
                className: 'btns-icon theme-solid bg-blue-lighter',
                iconClasses:
                  item.field.id === 'external_url' ? 'mdi mdi-plus' : 'mdi mdi-attachment',
                isDisabled: !(itemValue && itemValue.selected && itemValue.selected.length > 0),
                isRequired: false,
                onActionClicked: () => {
                  if (
                    itemValue &&
                    itemValue.selected &&
                    itemValue.selected.length > 0 &&
                    item.field.id !== 'external_url'
                  )
                    setOpenUploadDialog(true);
                  if (
                    itemValue &&
                    itemValue.selected &&
                    itemValue.selected.length > 0 &&
                    item.field.id === 'external_url'
                  )
                    setRepeatedLinkDialog(true);
                },
              }) ||
              (item.field.FieldType === 'searchField' &&
                item.field.id !== 'referredto' &&
                item.field.id !== 'referredby' &&
              {
                className: 'btns-icon theme-outline c-blue-lighter',
                iconClasses: itemValue ? 'mdi mdi-eye-outline' : 'mdi mdi-plus',
                isDisabled:
                  (item.data.multi && item.data.multi === 'true') ||
                  item.field.id === 'listing_agent',
                isRequired: false,
                onActionClicked: onSearchFieldActionClicked,
              }) ||
              undefined
            }
            labelValue={item.data.title}
          />
        </div>
      )}
      {item.field.FieldType === 'PriceAndPercentage' && (
        <PriceAndPercentage
          type={item.data.controlType}
          allItemsValues={allItemsValues}
          onValueChanged={onValueChanged}
          currency='AED'
          value={itemValue}
          onChange={(e) => {
            if (e === null) return;
            onValueChanged(e);
          }}
          // sqrSalePrice={(allItemsValues && allItemsValues.pricesqm && Number(allItemsValues.pricesqm))}
          depositSum={((allItemsValues.rent_general_deposit || 0) + (allItemsValues.rent_security_deposit ||
            0) + (allItemsValues.chiller_deposit || 0))}

        />
      )}
      {itemValue && itemValue.selected && itemValue.selected.length > 0 && (
        <UploadDialog
          open={openUploadDialog}
          onChange={(e) => {
            onValueChanged({ ...e, selected: itemValue.selected });
          }}
          initialState={itemValue}
          closeDialog={() => {
            setOpenUploadDialog(false);
          }}
        />
      )}
      {itemValue && openMapDialog && (
        <MapDialog
          open={openMapDialog}
          onChange={(e) => {
            onValueChanged({ ...e });
          }}
          initialState={itemValue}
          closeDialog={() => {
            setOpenMapDialog(false);
          }}
        />
      )}
      {/* item.field.id==="property_name" &&  */}
      {itemValue && itemValue.Models && (
        <ModelsUnitsDialog
          initialState={itemValue}
          items={item.data.enum}
          open={modelsUnitsDialog}
          closeDialog={() => {
            setModelsUnitsDialog(false);
          }}
          onChange={(value) => {
            onValueChanged({
              ...value,
              Models: itemValue.Models,
            });
          }}
        />
      )}
      {
      }
      <ContactsDialog
        open={isOpenContactsDialog}
        onSave={() => { }}
        closeDialog={() => {
          setIsOpenContactsDialog(false);
        }}
        isViewContact={itemValue}
      />
      {RepeatedDialog && (
        <RepeatedItemDialog
          open={RepeatedDialog}
          item={item}
          type={(item.data.CommunicationType === 'Email' && 'email') || 'phone'}
          initialState={itemValue}
          label={item.data.title}
          closeDialog={() => {
            setRepeatedDialog(false);
          }}
          selectedValues={allItemsValues}
          itemList={allItems}
          onChange={
            (item.data.CommunicationType === 'Email' &&
              ((value) => {
                onValueChanged({
                  ...value,
                  email: itemValue.email,
                  typeId: item.data.lookupItem,
                });
              })) ||
            ((newValue) => {
              onValueChanged({
                ...newValue,
                phone: itemValue.phone,
                typeId: item.data.lookupItem,
              });
            })
          }
        />
      )}
      {repeatedLinkDialog && (
        <RepeatedLinkDialog
          item={item}
          itemList={allItems}
          label={item.data.title}
          initialState={itemValue}
          open={repeatedLinkDialog}
          selectedValues={allItemsValues}
          onChange={(newValue) => {
            onValueChanged({
              ...newValue,
            });
          }}
          closeDialog={() => setRepeatedLinkDialog(false)}
        />
      )}
      {isOpenLeadOwnerDialog && (
        <LeadOwnerDialog
          open={isOpenLeadOwnerDialog}
          onSave={() => setIsOpenLeadOwnerDialog(false)}
          close={() => {
            onValueChanged(leadOwnerValue, 0, 'lead_owner');
            setIsOpenLeadOwnerDialog(false);
          }}
        />
      )}
      {isOpenLeaseLeadOwnerDialog && (
        <LeaseLeadOwnerDialog
          open={isOpenLeaseLeadOwnerDialog}
          onSave={() => setisOpenLeaseLeadOwnerDialog(false)}
          close={() => {
            onValueChanged(leadOwnerValue, 0, 'lease_lead_owner');
            setisOpenLeaseLeadOwnerDialog(false);
          }}

        />
      )}
    </>
  );
};
const convertJsonItemShape = PropTypes.shape({
  data: PropTypes.shape({
    enum: PropTypes.instanceOf(Array),
    CommunicationType: PropTypes.string,
    searchKey: PropTypes.string,
    title: PropTypes.string,
    regExp: PropTypes.string,
    dependOn: PropTypes.string,
    uiType: PropTypes.string,
    defaultCountryCode: PropTypes.string,
    minNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isReadonly: PropTypes.bool,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    lookup: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    controlType: PropTypes.string, // this type is not sure is string
    multi: PropTypes.oneOf(['true', 'false']),
    lookupItem: PropTypes.number,
    items: PropTypes.shape({
      enum: PropTypes.instanceOf(Array),
    }),
  }),
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    FieldType: PropTypes.string,
    isRequired: PropTypes.bool,
  }),
});
const convertJsonValueShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
  PropTypes.instanceOf(Object),
  PropTypes.instanceOf(Array),
]);
ConvertJsonV2Component.propTypes = {
  item: convertJsonItemShape.isRequired,
  itemValue: convertJsonValueShape,
  allItems: PropTypes.arrayOf(convertJsonItemShape).isRequired,
  allItemsValues: PropTypes.objectOf(convertJsonValueShape).isRequired,
  onItemChanged: PropTypes.func.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onLoadingsChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
ConvertJsonV2Component.defaultProps = {
  itemValue: undefined,
};
