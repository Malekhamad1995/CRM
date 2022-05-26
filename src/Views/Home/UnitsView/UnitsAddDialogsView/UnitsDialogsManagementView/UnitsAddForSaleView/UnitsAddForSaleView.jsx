import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { InputAdornment } from '@material-ui/core';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useHistory } from 'react-router-dom';
import { de } from 'date-fns/locale';
import { Newunit, OperationType, Unitmodel } from './UnitsAddForSaleViewComponents';
import {
  getErrorByName, GlobalHistory, showError, showSuccess
} from '../../../../../../Helper';
import { Spinner, Inputs } from '../../../../../../Components';
import {
  Bathrooms,
  Bedrooms,
  FacilitiesandAmenities,
  Fittingandfixtures,
  ListingAgent,
  Ownerlead,
  PropertyName,
  Size,
  Unit,
  Unittype,
  View,
} from '../SharedComponentsRentandSalesView';
import PriceAndPercentage from '../../../../FormBuilder/Utilities/PriceAndPercentage';
import { unitPost } from '../../../../../../Services';

const translationPath = '';
export const UnitsAddForSaleView = ({ setview, parentTranslationPath, isClose }) => {
  const startAgencyFee = 0;

  const { t } = useTranslation(parentTranslationPath);
  const [ViewType, setViewType] = useState(1);
  const [operationType, setOperationType] = useState(1);
  const [IsLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [State, setState] = useState({
    unit_ref_no: null,
    selling_price_agency_fee: {
      salePrice: 0,
      agencyFee: 0,
      persantageFee: 0

    },
    unit_type_id: 1,
    operation_type: {
      lookupItemId: 430,
      lookupItemName: 'Sale',
      lookupItemCode: null,
      description: null,
      order: 1,
      parentLookupItemId: null,
      parentLookupItemName: null,
      parentLookupTypeId: 0,
      parentLookupTypeName: null,
      isEditable: false,
    },
    new_unit: 'Yes',
    unit_type: '',
    furnished: 'No',
    property_name: '',
    owner: null,
    lead_owner: null,
    floor_number: null,
    mandates: null,
    mandate_type: null,
    unit_number: null,
    mortgaged: null,
    can_view: null,
    unique_selling_proposition_usp: null,
    municipality_number: null,
    ejari_approval_refno: null,
    inventory_list_from: null,
    website_unit_link: null,
    fully_unit_description: null,
    unit_model: null,
    full_floor: null,
    bedrooms: null,
    bathrooms: null,
    maid_rooms: null,
    store_room: null,
    study_room: null,
    kids_breakfast_room: null,
    kitchen_details: null,
    number_of_balcony: null,
    number_of_terraces: null,
    floor_height: null,
    plot_area_sqft: null,
    builtup_area_sqft: null,
    gfa_sqft: null,
    balcony_area_size_sqft: null,
    terrace_size_sqft: null,
    total_area_size_sqft: null,
    price_per_sqm: null,
    amenities: null,
    fitting_and_fixtures: null,
    primary_view: null,
    secondary_view: null,
    pets_allowed: null,
    rating: null,
    listing_agent: {},
    listing_date: null,
    listing_expiry_period: null,
    listing_expiry_date: null,
    last_available_for_rent: null,
    market_value_rent: null,
    rent_security_deposit: null,
    rent_general_deposit: null,
    chiller_charge_type: null,
    chiller_charge_for_rent_unit: null,
    chiller_capacity_for_rent_unit: null,
    chiller_deposit: null,
    expenses: null,
    expected_rent: null,
    rent_targeted_price: null,
    rent_price_fees: null,
    rent_roi: null,
    unit_images: null,
    unit_documents_files: null,
    data_completed: null,
    rent_listing_agent:null ,
    lease_lead_owner : null  ,

  });
  const schema = Joi.object({
    property_name: Joi.object()
      .required()
      .messages({
        'object.base': t(`${translationPath}property_name`),
        'object.empty': t(`${translationPath}property_name`),
      }),
    unit_type: Joi.object()
      .required()
      .messages({
        'object.base': t(`${translationPath}unit_type-is-required`),
        'object.empty': t(`${translationPath}unit_type-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(State);

  const saveHandler = useCallback(async (isContinue) => {
    setIsLoading(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }
    const res = await unitPost({ unitJson: { unit: State } });

    if (res && res.unitId) {
      showSuccess(t`${translationPath}unit-created-successfully`);
      if (isContinue)
        history.push(`/home/units-sales/unit-profile-edit?formType=1&id=${res.unitId}`);
      isClose();
    }

    // showError(`${translationPath}asset-updated-failed`);
    setIsLoading(false);
  }, [State, isClose, schema.error, t]);

  useEffect(() => {
    setview(ViewType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ViewType]);

  return (
    <div>
      <div className='UnitsAdd-Sale-View-wrapper'>
        <Spinner isActive={IsLoading} isAbsolute />
        <div className='UnitsAdd-section-title mb-3'>{t(`${translationPath}location`)}</div>
        <div className='row-Units-section-num-1'>
          <div className='First-section'>
            <div className='form-item'>
              <OperationType
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                setViewType={(event) => {
                  setOperationType(event);
                  setViewType(event);
                }}
                value={State.OperationType}

              />
            </div>
            <div className='form-item'>
              <Newunit
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.new_unit}
                setvalue={(value) => setState((item) => ({ ...item, new_unit: (value ? 'Yes' : 'No') || null }))}
              />
            </div>
            <div className='form-item'>
              <Unittype
                labelClasses='Requierd-Color'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.unit_type}
                setvalue={(value) => setState((item) => ({ ...item, unit_type: value }))}
                helperText={getErrorByName(schema, 'unit_type').message}
                error={getErrorByName(schema, 'unit_type').error}
              />
            </div>
          </div>
          <div className='scaned-section'>
            <div className='form-item'>
              <PropertyName
                labelClasses='Requierd-Color'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.property_name}
                setvalue={(value) => setState((item) => ({ ...item, property_name: value }))}
                helperText={getErrorByName(schema, 'property_name').message}
                error={getErrorByName(schema, 'property_name').error}
              />
            </div>
            <div className='form-item'>
              <Unit
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.unit_number}
                setvalue={(value) => setState((item) => ({ ...item, unit_number: value }))}
              />
            </div>
          </div>
        </div>
        <div className='UnitsAdd-section-title mb-3'>{t(`${translationPath}unit-details`)}</div>
        <div className='row-Units-section-num-2'>
          <div className='First-section'>
            <div className='form-item-inline'>
              <Bedrooms
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.bedrooms}
                setvalue={(value) => setState((item) => ({ ...item, bedrooms: value }))}
              />

              <Bathrooms
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.bathrooms}
                setvalue={(value) => setState((item) => ({ ...item, bathrooms: value }))}
              />
            </div>
            <div className='form-item'>
              {/* <Unitmodel
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.unit_model}
                setvalue={(value) => setState((item) => ({ ...item, unit_model: value }))}
              /> */}
              <Size
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.builtup_area_sqft}
                setvalue={(value) => setState((item) => ({ ...item, builtup_area_sqft: value }))}
              />
            </div>
            <div className='form-item'>
              <View
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.primary_view}
                setvalue={(value) => setState((item) => ({ ...item, primary_view: value }))}
              />
            </div>
          </div>
          <div className='scaned-section'>
            <div className='form-item'>
              <Fittingandfixtures
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.fitting_and_fixtures}
                setvalue={(value) => setState((item) => ({ ...item, fitting_and_fixtures: value }))}
              />
            </div>
            <div className='form-item'>
              <FacilitiesandAmenities
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.amenities}
                setvalue={(value) => setState((item) => ({ ...item, amenities: value }))}
              />
            </div>
          </div>
        </div>
        <div className='UnitsAdd-section-title mb-3'>
          {t(`${translationPath}Pricing-and-ownership`)}
        </div>
        <div className='row-Units-section-num-2'>
          <div className='First-section'>
            <div className='form-rent_price_fees'>
              {/* <PriceAndPercentage
                type='Sale Type'
                currency='AED'
                labelValue='OR'
                ORAdornment
                value={State.selling_price_agency_fee}
                onChange={(e) => {
                  if (e === null) return;
                  setState((item) => ({ ...item, selling_price_agency_fee: e }));
                }}
              /> */}
              <div className='form-item'>
                <Inputs
                  idRef='priceRef7'
                  startAdornment={(
                    <InputAdornment position='start' className='px-2'>
                      AED
                    </InputAdornment>
                  )}
                  min={0}
                  type='number'
                  withNumberFormat
                  labelValue='Selling Price'
                  value={State.selling_price_agency_fee.salePrice}
                  onInputChanged={(e) => {
                    if (!e.target.value) {
                      const editSellingPriceAgencyFee = {
                        ...State.selling_price_agency_fee,
                        salePrice: 0,
                        persantageFee: 0,
                        agencyFee: 0

                      };
                      setState((item) => ({ ...item, selling_price_agency_fee: editSellingPriceAgencyFee }));
                      return;
                    }
                    const salePrice = e.target.value;
                    const agencyFeeValue = State.selling_price_agency_fee.agencyFee;
                    const editSellingPriceAgencyFee = {
                      ...State.selling_price_agency_fee,
                      salePrice,
                      persantageFee: agencyFeeValue && salePrice ? (agencyFeeValue / salePrice) * 100 : 0

                    };
                    setState((item) => ({ ...item, selling_price_agency_fee: editSellingPriceAgencyFee }));
                  }}
                />
              </div>
              <div className='form-item'>
                <Inputs
                  idRef='priceRef8'
                  withNumberFormat
                  startAdornment={(
                    <InputAdornment position='start' className='px-2'>
                      AED
                    </InputAdornment>
                  )}
                  type='number'
                  labelValue='Agency Fee'
                  value={State.selling_price_agency_fee.agencyFee}
                  onKeyUp={(e) => {
                    const salePriceValue = State.selling_price_agency_fee.salePrice;

                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let agencyFee = fixed ? parseFloat(fixed) : 0;

                    if (agencyFee > salePriceValue)
                    agencyFee = salePriceValue;

                    const editSellingPriceAgencyFee = {
                      ...State.selling_price_agency_fee,
                      agencyFee: salePriceValue ? agencyFee : 0,
                      persantageFee: (salePriceValue && agencyFee ? ((agencyFee / salePriceValue) * 100) : 0),
                    };
                    setState((item) => ({ ...item, selling_price_agency_fee: editSellingPriceAgencyFee }));
                  }}
                />
              </div>
              <div className='form-item'>
                <Inputs
                  idRef='priceRef9'
                  endAdornment={(
                    <InputAdornment position='end' className='px-2'>
                      %
                    </InputAdornment>
                  )}
                  labelValue='Percentage Agency Fee'
                  value={State.selling_price_agency_fee.persantageFee}
                  type='number'
                  min={0}
                  withNumberFormat

                  isAttachedInput
                  onKeyUp={(e) => {
                    const salePriceValue = State.selling_price_agency_fee.salePrice;
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    const fixed = (value && value.replace(/,/g, ''));

                    // let persantageFee = salePriceValue ? e.target.value : 0;
                    let persantageFee = salePriceValue && fixed ? parseFloat(fixed) : 0;
                    if (persantageFee > 100)
                    persantageFee = 100;

                    /* let parsedSecurityDeposit = fixed? parseFloat(fixed):0;
*/
                    const agencyFeeValue = salePriceValue && persantageFee ? (persantageFee / 100) * salePriceValue : 0;
                    const editSellingPriceAgencyFee = {
                      ...State.selling_price_agency_fee,
                      agencyFee: agencyFeeValue,
                      persantageFee,
                    };
                    setState((item) => ({ ...item, selling_price_agency_fee: editSellingPriceAgencyFee }));
                  }}
                />
              </div>

            </div>

          </div>
            <div className='scaned-section'>
            <div className='form-item'>
              <ListingAgent
                operationType={1}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.listing_agent}
                setvalue={(value) => setState((item) => ({ ...item, listing_agent: value }))}
              />
            </div>
            
            <div className='form-item'>
              <Ownerlead
                operationType={1}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.lead_owner}
                setvalue={(value) => setState((item) => ({ ...item, lead_owner: value }))}
              />
            </div>
          </div>
          
         
        </div>
      </div>
      <div className='actions-form'>
        <Button
          className='MuiButtonBase-root btns theme-transparent mb-2'
          onClick={() => isClose()}
        >
          <span className='bbt-delete'>{t(`${translationPath}cancel`)}</span>
          <span className='MuiTouchRipple-root' />
        </Button>
        <div className='d-flex-v-center-h-end flex-wrap'>
          <Button
            className='MuiButtonBase-root btns theme-transparent mb-2'
            onClick={() => { isClose(); GlobalHistory.push('/home/units-sales/add?formType=1'); }}
          >
            <span>{t(`${translationPath}OpenoldUnitFile`)}</span>
            <span className='MuiTouchRipple-root' />
          </Button>

          <Button
            className='MuiButtonBase-root btns theme-transparent mb-2'
            disabled={schema.error}
            onClick={() => saveHandler(true)}
          >
            <span>{t(`${translationPath}Save and Continue`)}</span>
            <span className='MuiTouchRipple-root' />
          </Button>

          <Button
            disabled={schema.error}
            className='MuiButtonBase-root btns theme-solid mb-2'
            onClick={() => saveHandler()}
          >
            <span>{t(`${translationPath}Save`)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
UnitsAddForSaleView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  setview: PropTypes.number.isRequired,
  isClose: PropTypes.bool.isRequired,
};
