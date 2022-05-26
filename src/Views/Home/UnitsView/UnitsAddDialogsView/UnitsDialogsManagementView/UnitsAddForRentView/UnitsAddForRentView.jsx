import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { useHistory } from 'react-router-dom';
import { Unit, Unitmodel, OperationType } from './UnitsAddForRentViewComponents';
import { Spinner } from '../../../../../../Components';
import {
 getErrorByName, GlobalHistory, showError, showSuccess
} from '../../../../../../Helper';
import PriceAndPercentage from '../../../../FormBuilder/Utilities/PriceAndPercentage';
import { unitPost } from '../../../../../../Services';
import {
  Bathrooms,
  Bedrooms,
  FacilitiesandAmenities,
  Fittingandfixtures,
  ListingAgent,
  Ownerlead,
  PropertyName,
  SelectOwner,
  Size,
  Unittype,
  View,
} from '../SharedComponentsRentandSalesView';

const translationPath = '';
export const UnitsAddForRentView = ({ setview, parentTranslationPath, isClose }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [ViewType, setViewType] = useState(2);

  const [State, setState] = useState({
    unit_ref_no: null,
    unit_type_id: 1,
    operation_type: {
      lookupItemId: 431,
      lookupItemName: 'Rent',
      lookupItemCode: null,
      description: null,
      order: 2,
      parentLookupItemId: null,
      parentLookupItemName: null,
      parentLookupTypeId: 0,
      parentLookupTypeName: null,
      isEditable: false,
    },
    new_unit: null,
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
    lease_lead_owner : null , 
    rent_listing_agent: null 

  });
  const history = useHistory();
  const [IsLoading, setIsLoading] = useState(false);
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
      history.push(`/home/units-lease/unit-profile-edit?formType=1&id=${res.unitId}`);
      isClose();
    }

    // showError(`${translationPath}asset-updated-failed`);
    setIsLoading(false);
  }, [State, history, isClose, schema.error, t]);

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
                setViewType={(event) => setViewType(event)}
                value={State.OperationType}
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
              <div className='size'>
                <Size
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  value={State.builtup_area_sqft}
                  setvalue={(value) =>
                    setState((item) => ({ ...item, builtup_area_sqft: value }))}
                />
              </div>
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
        <div className='form-PriceAndPercentage'>
          <PriceAndPercentage
            type='Rent Type'
            currency='AED'
            labelValue='OR'
            ORAdornment
            value={State.rent_price_fees}
            onChange={(e) => {
              if (e === null) return;
              setState((item) => ({ ...item, rent_price_fees: e }));
            }}
            hideRentPerSqFt
            builtupAreaSqftQuickAdd
          />
        </div>
        <div className='row-Units-section-num-2'>
          <div className='scaned-section'>
            <div className='form-item'>
              <ListingAgent
                operationType={2}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.rent_listing_agent}
                setvalue={(value) => setState((item) => ({ ...item, rent_listing_agent: value }))}
              />
            </div>
            {/* <div className='form-item'>
              <SelectOwner
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.owner}
                setvalue={(value) => setState((item) => ({ ...item, owner: value }))}
              />
            </div> */}
            <div className='form-item'>
              <Ownerlead
               operationType={2}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                value={State.lease_lead_owner}
                setvalue={(value) => setState((item) => ({ ...item, lease_lead_owner: value }))}
              />
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
              onClick={() => { saveHandler(true); }}
              disabled={schema.error}
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
    </div>
  );
};
UnitsAddForRentView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  setview: PropTypes.number.isRequired,
  isClose: PropTypes.bool.isRequired,
};
