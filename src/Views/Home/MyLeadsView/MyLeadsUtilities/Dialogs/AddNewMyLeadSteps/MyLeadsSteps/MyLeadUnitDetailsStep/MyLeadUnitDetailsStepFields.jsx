import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent, Inputs } from '../../../../../../../../Components';
import { ContactsDialog } from '../../../../../../FormBuilder/Dialogs/ContactsDialog';
import { PROPERTIES } from '../../../../../../../../config/pagesName';
import { getErrorByName } from '../../../../../../../../Helper';

const parentTranslationPath = 'MyLeadView';
const translationPath = '';
export const MyLeadUnitDetailsFields = ({
  data,
  state,
  schema,
  selected,
  loadings,
  isSubmitted,
  getAllProperty,
  onStateChangeHandler,
  onSelectedChangeHandler,
  labelClasses
}) => {
  const searchTimer = useRef(null);
  const [isOpenContactsDialog, setIsOpenContactsDialog] = useState(false);

  return (
    <div className='dialog-content-wrapper'>
      {/* <div className='form-item'>
        <AutocompleteComponent
          multiple={false}
          withoutSearchButton
          idRef='nationalityRef'
          data={data.property}
          labelValue='property'
          buttonOptions={{
            className: 'btns-icon theme-solid bg-blue-lighter',
            iconClasses: 'mdi mdi-plus',
            isRequired: false,
            onActionClicked: () => {
              const item = {
                itemId: null,
                type: null,
              };
              item.itemId = PROPERTIES;
              item.type = '1';
              localStorage.setItem('current', JSON.stringify(item));
              setIsOpenContactsDialog(true);
            },
          }}
          selectedValues={selected.property}
          isLoading={loadings.property}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllProperty(value);
            }, 500);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          displayLabel={(option) => option.property.property_name || ''}
          renderOption={(option) => option.property.property_name || ''}
          onChange={(event, newValue) => {
            onSelectedChangeHandler('property', newValue || null);
            onStateChangeHandler('propertyId', (newValue && newValue.propertyId) || null);
            onStateChangeHandler('cityId', (newValue && newValue.property && newValue.property.city && newValue.property.city.lookupItemId) || null);
            onStateChangeHandler('districtId', (newValue && newValue.property && newValue.property.district && newValue.property.district.lookupItemId) || null);
            onStateChangeHandler('communityId', (newValue && newValue.property && newValue.property.community && newValue.property.community.lookupItemId) || null);
          }}
        />
      </div> */}

      {(state.leadClassId && (state.leadClassId === 1 || state.leadClassId === 2)) && (
        <div className='form-item'>
          <AutocompleteComponent
            multiple={false}
            withoutSearchButton
            idRef='nationalityRef'
            data={data.property}
            labelValue='property'
            labelClasses={labelClasses}
            helperText={getErrorByName(schema, 'propertyId').message}
            error={getErrorByName(schema, 'propertyId').error}
            isWithError
            isSubmitted={isSubmitted}
            buttonOptions={{
              className: 'btns-icon theme-solid bg-blue-lighter',
              iconClasses: 'mdi mdi-plus',
              isRequired: false,
              onActionClicked: () => {
                const item = {
                  itemId: null,
                  type: null,
                };
                item.itemId = PROPERTIES;
                item.type = '1';
                localStorage.setItem('current', JSON.stringify(item));
                setIsOpenContactsDialog(true);
              },
            }}
            selectedValues={selected.property}
            isLoading={loadings.property}
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllProperty(value);
              }, 500);
            }}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            displayLabel={(option) => option.property.property_name || ''}
            renderOption={(option) => option.property.property_name || ''}
            onChange={(event, newValue) => {
              onSelectedChangeHandler('property', newValue || null);
              onStateChangeHandler('propertyId', (newValue && newValue.propertyId) || null);
              onStateChangeHandler('cityId', (newValue && newValue.property && newValue.property.city && newValue.property.city.lookupItemId) || null);
              onStateChangeHandler('districtId', (newValue && newValue.property && newValue.property.district && newValue.property.district.lookupItemId) || null);
              onStateChangeHandler('communityId', (newValue && newValue.property && newValue.property.community && newValue.property.community.lookupItemId) || null);
            }}
          />
        </div>
      )}
      {((state.leadClassId && (state.leadClassId === 3 || state.leadClassId === 4)) || !state.leadClassId) && (
        <div className='form-item'>
          <AutocompleteComponent
            multiple={false}
            withoutSearchButton
            idRef='nationalityRef'
            data={data.property}
            labelValue='property'
            buttonOptions={{
              className: 'btns-icon theme-solid bg-blue-lighter',
              iconClasses: 'mdi mdi-plus',
              isRequired: false,
              onActionClicked: () => {
                const item = {
                  itemId: null,
                  type: null,
                };
                item.itemId = PROPERTIES;
                item.type = '1';
                localStorage.setItem('current', JSON.stringify(item));
                setIsOpenContactsDialog(true);
              },
            }}
            selectedValues={selected.property}
            isLoading={loadings.property}
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllProperty(value);
              }, 500);
            }}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            displayLabel={(option) => option.property.property_name || ''}
            renderOption={(option) => option.property.property_name || ''}
            onChange={(event, newValue) => {
              onSelectedChangeHandler('property', newValue || null);
              onStateChangeHandler('propertyId', (newValue && newValue.propertyId) || null);
              onStateChangeHandler('cityId', (newValue && newValue.property && newValue.property.city && newValue.property.city.lookupItemId) || null);
              onStateChangeHandler('districtId', (newValue && newValue.property && newValue.property.district && newValue.property.district.lookupItemId) || null);
              onStateChangeHandler('communityId', (newValue && newValue.property && newValue.property.community && newValue.property.community.lookupItemId) || null);
            }}
          />
        </div>
      )}
      <div className='form-item'>
        <AutocompleteComponent
          multiple={false}
          withoutSearchButton
          idRef='nationalityRef'
          data={data.unitType}
          labelClasses={labelClasses}
          labelValue='unit-type'
          helperText={getErrorByName(schema, 'unitTypeId').message}
          error={getErrorByName(schema, 'unitTypeId').error}
          isWithError
          isSubmitted={isSubmitted}
          isLoading={loadings.unitType}
          translationPath={translationPath}
          selectedValues={selected.unitType}
          parentTranslationPath={parentTranslationPath}
          displayLabel={(option) => option.lookupItemName || ''}
          renderOption={(option) => option.lookupItemName || ''}
          onChange={(event, newValue) => {
            onSelectedChangeHandler('unitType', newValue || null);
            onStateChangeHandler('unitTypeId', (newValue && newValue.lookupItemId) || null);
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='portfolioNameRef'
          labelValue='no-of-bedroom'
          type='number'
          min={0}
          value={state.numberOfBedrooms || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const list = [];
            if (event && event.target && event.target.value !== '')
            list.push(event.target.value);
            onStateChangeHandler('numberOfBedrooms',
              list);
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          type='number'
          idRef='portfolioNameRef'
          labelValue='no-of-bathroom'
          min={0}
          value={state.numberOfBathrooms || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const list = [];
            if (event && event.target && event.target.value !== '')
              list.push(event.target.value);

            onStateChangeHandler('numberOfBathrooms', list);
          }}
        />
      </div>
      {(state.leadClassId === 1 || state.leadClassId === 2) && (
        <>
          <div className='form-item'>
            <Inputs
              type='number'
              idRef='portfolioNameRef'
              labelValue='price'
              labelClasses={labelClasses}
              helperText={getErrorByName(schema, 'priceFrom').message}
              error={getErrorByName(schema, 'priceFrom').error}
              isWithError
              min={0}
              isSubmitted={isSubmitted}
              value={state.priceFrom || ''}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => onStateChangeHandler('priceFrom', +event.target.value || '')}
            />
          </div>
          <div className='form-item'>
            <Inputs
              type='number'
              idRef='portfolioNameRef'
              labelValue='area'
              labelClasses={labelClasses}
              min={0}
              helperText={getErrorByName(schema, 'areaFrom').message}
              error={getErrorByName(schema, 'areaFrom').error}
              isWithError
              isSubmitted={isSubmitted}
              value={state.areaFrom || ''}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => onStateChangeHandler('areaFrom', +event.target.value || '')}
            />
          </div>
        </>
      )}
      {(state.leadClassId === 3 || state.leadClassId === 4) && (
        <>
          <div className='form-item form-item-two-fields'>
            <Inputs
              type='number'
              idRef='portfolioNameRef'
              labelValue='price'
              value={state.priceFrom || ''}
              labelClasses={labelClasses}
              error={getErrorByName(schema, 'priceFrom').error}
              isWithError
              min={0}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                onStateChangeHandler('priceFrom', +event.target.value || '');
              }}
            />
            <Inputs
              type='number'
              idRef='portfolioNameRef'
              labelValue='to'
              min={0}
              value={state.priceTo || ''}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => onStateChangeHandler('priceTo', +event.target.value)}
            />
          </div>
          <div className='form-item form-item-two-fields'>
            <Inputs
              type='number'
              idRef='portfolioNameRef'
              labelValue='area'
              value={state.areaFrom || ''}
              labelClasses={labelClasses}
              error={getErrorByName(schema, 'areaFrom').error}
              isWithError
              isSubmitted={isSubmitted}
              min={0}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => onStateChangeHandler('areaFrom', +event.target.value || '')}
            />
            <Inputs
              type='number'
              idRef='portfolioNameRef'
              labelValue='to'
              min={0}
              value={state.areaTo || ''}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => onStateChangeHandler('areaTo', +event.target.value)}
            />
          </div>
        </>
      )}
      <ContactsDialog
        open={isOpenContactsDialog}
        closeDialog={() => setIsOpenContactsDialog(false)}
      />
    </div>
  );
};
MyLeadUnitDetailsFields.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
  getAllProperty: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  loadings: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
