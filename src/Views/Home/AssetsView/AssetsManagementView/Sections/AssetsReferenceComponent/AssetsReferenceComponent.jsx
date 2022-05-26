import React, {
 useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Joi from 'joi';
import moment from 'moment';
import {
  bottomBoxComponentUpdate,
  getErrorByName,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  AutocompleteComponent,
  DatePickerComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
  SelectComponet,
  DataFileAutocompleteComponent,
} from '../../../../../../Components';
import {
  GetAllPortfolio,
  GetAllPropertyByPortfolioId,
  GetContacts,
  UpdateAsset,
  CreateAsset,
  GetAssetById,
  lookupItemsGetId,
  getUnits,
} from '../../../../../../Services';
import {
  AssetsTypeEnum,
  OwnerTypeEnum,
  AssetsCategoryEnum,
  CommonAreaEnum,
} from '../../../../../../Enums';

export const AssetsReferenceComponent = ({ parentTranslationPath, translationPath }) => {
  const pathName = window.location.pathname.split('/home/')[1].split('/')[1];
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimer = useRef(null);

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    portfolioName: null,
    propertyName: null,
    itemCategory: null,
    unitNumber: null,
    owner: null,
    suplier: null,
    commonArea: null,
  });
  const [data, setData] = useReducer(reducer, {
    portfolioName: [],
    propertyName: [],
    itemCategory: [],
    unitNumber: [],
    owner: [],
    suplier: [],
    commonArea: [],
  });
  const [loadings, setLoadings] = useState({
    portfolioName: false,
    propertyName: false,
    itemCategory: false,
    unitNumber: false,
    owner: false,
    suplier: false,
    commonArea: false,
  });
  const [radioValues, setRadioValues] = useState({
    location: 1,
    underWarenty: 1,
  });
  const defaultState = {
    portfolioId: null,
    propertyId: null,
    assetType: null,
    assetItemName: null,
    assetItemCategoryId: null,
    floorNo: null,
    locationCommonAreaId: null,
    locationUnitId: null,
    locationDescription: null,
    assetOwnerId: null,
    supplierId: null,
    purchaseDate: null,
    purchasePrice: null,
    isUnderWarranty: true,
    warrantyExpireDate: null,
    remarks: null,
  };
  const [state, setState] = useReducer(reducer, defaultState);
  const schema = Joi.object({
    portfolioId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}portfolio-is-required`),
        'number.empty': t(`${translationPath}portfolio-is-required`),
      }),
    propertyId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}proprty-name-is-required`),
        'number.empty': t(`${translationPath}proprty-name-is-required`),
      }),
    assetType: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}type-is-required`),
        'number.empty': t(`${translationPath}type-is-required`),
      }),
    assetItemName: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}item-name-is-required`),
      }),
    assetItemCategoryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}category-is-required`),
        'number.empty': t(`${translationPath}category-is-required`),
      }),
    assetOwnerId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}owner-is-required`),
        'number.empty': t(`${translationPath}owner-is-required`),
      }),
    purchasePrice: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}price-is-required`),
        'number.empty': t(`${translationPath}price-is-required`),
      }),
    unitId: Joi.any()
      .custom((value, helpers) => {
        if (!value && !state.locationCommonAreaId && !state.locationUnitId)
          return helpers.error('state.unitRequired');
        return value;
      })
      .messages({
        'state.unitRequired': t(`${translationPath}unit-is-required`),
      }),
    supplierId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}communication-media-is-required`),
        'number.empty': t(`${translationPath}communication-media-is-required`),
      }),
    purchaseDate: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}purchase-date-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const getOwnerTypeLookupItems = useCallback(async () => {
    setLoadings((items) => ({ ...items, owner: true }));
    const result = await lookupItemsGetId({ lookupTypeId: OwnerTypeEnum.lookupTypeId });
    if (!(result && result.status && result.status !== 200))
      setData({ id: 'owner', value: result });
    setLoadings((items) => ({ ...items, owner: false }));
  }, []);
  const getAssetsCategoryLookupItems = useCallback(async () => {
    setLoadings((items) => ({ ...items, itemCategory: true }));
    const result = await lookupItemsGetId({ lookupTypeId: AssetsCategoryEnum.lookupTypeId });
    if (!(result && result.status && result.status !== 200))
      setData({ id: 'itemCategory', value: result });
    setLoadings((items) => ({ ...items, itemCategory: false }));
  }, []);
  const getCommonAreaLookupItems = useCallback(async () => {
    setLoadings((items) => ({ ...items, commonArea: true }));
    const result = await lookupItemsGetId({ lookupTypeId: CommonAreaEnum.lookupTypeId });
    if (!(result && result.status && result.status !== 200))
      setData({ id: 'commonArea', value: result });
    setLoadings((items) => ({ ...items, commonArea: false }));
  }, []);
  const getAllContacts = useCallback(async (value) => {
    setLoadings((items) => ({ ...items, suplier: true }));
    const res = await GetContacts({ pageIndex: 0, pageSize: 25, search: value , isAdvance:false });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'suplier', value: res.result });
    setLoadings((items) => ({ ...items, suplier: false }));
  }, []);
  const getAllUnits = useCallback(async (value) => {
    setLoadings((items) => ({ ...items, unitNumber: true }));
    const res = await getUnits({ pageIndex: 0, pageSize: 25, search: value });
    if (!(res && res.status && res.status !== 200))
      setData({ id: 'unitNumber', value: res.result });
    setLoadings((items) => ({ ...items, unitNumber: false }));
  }, []);
  const getAssetById = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAssetById(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) {
      setState({
        id: 'edit',
        value: {
          portfolioId: result.portfolioId,
          propertyId: result.propertyId,
          assetType: result.assetType,
          assetItemName: result.assetItemName,
          assetItemCategoryId: result.assetItemCategoryId,
          floorNo: result.floorNo,
          locationCommonAreaId: result.locationCommonAreaId,
          locationUnitId: result.locationUnitId,
          locationDescription: result.locationDescription,
          assetOwnerId: result.assetOwnerId,
          supplierId: result.supplierId,
          purchaseDate: result.purchaseDate,
          purchasePrice: result.purchasePrice,
          isUnderWarranty: result.isUnderWarranty ? 1 : 2,
          warrantyExpireDate: result.warrantyExpireDate,
          remarks: result.remarks,
        },
      });
      setSelected({
        id: 'edit',
        value: {
          portfolioName: { portfolioName: result.portfolioName, portfolioId: result.portfolioId },
          propertyName: { propertyName: result.propertyName, propertyId: result.propertyId },
          itemCategory: {
            lookupItemName: result.assetItemCategoryName,
            lookupItemId: result.assetItemCategoryId,
          },
          unitNumber: {
            unitId: result.locationUnitId,
            unit: {
              unit_ref_no: result.locationUnitName,
            },
          },
          owner: { lookupItemName: result.assetOwnerName, lookupItemId: result.assetOwnerId },
          suplier: {
            contactsId: result.supplierId,
            contact: {
              first_name: result.supplierName,
            },
          },
          commonArea: {
            lookupItemName: result.locationCommonAreaName,
            lookupItemId: result.locationCommonAreaId,
          },
        },
      });
      setRadioValues({
        location: result.locationUnitId ? 1 : 2,
        underWarenty: result.isUnderWarranty ? 1 : 2,
      });
    }
    setIsLoading(false);
  }, []);
  const getAllPortfolio = useCallback(async (value) => {
    setLoadings((items) => ({ ...items, portfolioName: true }));
    const res = await GetAllPortfolio({ pageIndex: 0, pageSize: 25, search: value });
    if (!(res && res.status && res.status !== 200))
      setData({ id: 'portfolioName', value: (res && res.result) || [] });
    setLoadings((items) => ({ ...items, portfolioName: false }));
  }, []);
  const getAllProperties = useCallback(async () => {
    if (state.portfolioId) {
      setLoadings((items) => ({ ...items, propertyName: true }));
      const result = await GetAllPropertyByPortfolioId(state.portfolioId, 0, 25);
      if (!(result && result.status && result.status !== 200))
        setData({ id: 'propertyName', value: result.result });
      setLoadings((items) => ({ ...items, propertyName: false }));
    }
  }, [state.portfolioId]);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    let result;
    if (pathName === 'add') result = await CreateAsset(state);
    else result = await UpdateAsset(GetParams('id'), state);
    if (!(result && result.status && result.status !== 200)) {
      cancelHandler();
      if (pathName === 'add') showSuccess(`${translationPath}asset-created-successfully`);
      else showSuccess(`${translationPath}asset-updated-successfully`);
    } else if (pathName === 'add') showError(`${translationPath}asset-created-failed`);
    else showError(`${translationPath}asset-updated-failed`);
    setIsLoading(false);
  }, [pathName, schema.error, state, t, translationPath]);

  useEffect(() => {
    getOwnerTypeLookupItems();
  }, [getOwnerTypeLookupItems]);
  useEffect(() => {
    getCommonAreaLookupItems();
  }, [getCommonAreaLookupItems]);
  useEffect(() => {
    getAllProperties();
  }, [getAllProperties]);
  useEffect(() => {
    if (GetParams('id')) getAssetById();
  }, [getAssetById]);
  useEffect(() => {
    getAllUnits('');
  }, [getAllUnits]);
  useEffect(() => {
    getAllContacts('');
  }, [getAllContacts]);
  useEffect(() => {
    getAllPortfolio('');
  }, [getAllPortfolio]);
  useEffect(() => {
    getAssetsCategoryLookupItems();
  }, [getAssetsCategoryLookupItems]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  }, [saveHandler, schema.error, t]);
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  return (
    <div className='work-order-reference-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='work-order-reference-body'>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='PortfolioName'
            labelValue='portfolio-nameReq'
            selectedValues={selected.portfolioName}
            multiple={false}
            data={data.portfolioName || []}
            displayLabel={(option) => option.portfolioName || ''}
            getOptionSelected={(option) => option.portfolioId === state.portfolioId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'portfolioId').message}
            error={getErrorByName(schema, 'portfolioId').error}
            isWithError
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllPortfolio(value);
              }, 700);
            }}
            isLoading={loadings.portfolioName}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'propertyName', value: null });
              setState({
                id: 'propertyId',
                value: null,
              });
              setSelected({ id: 'portfolioName', value: newValue });
              setState({
                id: 'portfolioId',
                value: (newValue && newValue.portfolioId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='Property-nameRef'
            labelValue='property-nameReq'
            isDisabled={!state.portfolioId || data.portfolioName.length === 0}
            selectedValues={selected.propertyName}
            multiple={false}
            data={data.propertyName || []}
            displayLabel={(option) => option.propertyName || `${option.propertyId}` || ''}
            getOptionSelected={(option) => option.propertyId === state.propertyId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'propertyId').message}
            error={getErrorByName(schema, 'propertyId').error}
            isWithError
            isLoading={loadings.propertyName}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'propertyName', value: newValue });
              setState({
                id: 'propertyId',
                value: (newValue && newValue.propertyId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <SelectComponet
            data={AssetsTypeEnum}
            value={state.assetType}
            valueInput='key'
            textInput='value'
            labelValue='typeReq'
            helperText={getErrorByName(schema, 'assetType').message}
            error={getErrorByName(schema, 'assetType').error}
            isWithError
            isSubmitted={isSubmitted}
            onSelectChanged={(value) => {
              setState({
                id: 'assetType',
                value,
              });
            }}
            idRef='relatedToTypeRef'
            translationPath={translationPath}
            translationPathForData={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='TitleRef'
            labelValue='item-nameReq'
            value={state.assetItemName}
            helperText={getErrorByName(schema, 'assetItemName').message}
            error={getErrorByName(schema, 'assetItemName').error}
            isWithError
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'assetItemName', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='Property-nameRef'
            labelValue='item-categoryReq'
            selectedValues={selected.itemCategory}
            multiple={false}
            data={data.itemCategory || []}
            displayLabel={(option) => option.lookupItemName || `${option.lookupItemName}` || ''}
            getOptionSelected={(option) => option.lookupItemId === state.assetItemCategoryId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'assetItemCategoryId').message}
            error={getErrorByName(schema, 'assetItemCategoryId').error}
            isWithError
            isSubmitted={isSubmitted}
            isLoading={loadings.itemCategory}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'itemCategory', value: newValue });
              setState({
                id: 'assetItemCategoryId',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='TitleRef'
            labelValue='floor-no'
            value={state.floorNo}
            isWithError
            type='number'
            min={0}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'floorNo', value: +event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <RadiosGroupComponent
            data={[
              { id: 1, value: 'unit' },
              { id: 2, value: 'common-area' },
            ]}
            valueInput='id'
            labelInput='value'
            value={radioValues.location}
            onSelectedRadioChanged={(e, newValue) => {
              setRadioValues({ ...radioValues, location: +newValue });
              setSelected({ id: 'unitNumber', value: null });
              setState({
                id: 'locationUnitId',
                value: null,
              });
              setState({ id: 'locationCommonAreaId', value: null });
            }}
            name='radioGroups'
            titleClasses='texts gray-primary-bold'
            wrapperClasses='mb-3'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
            labelValue='location'
          />
        </div>
        {radioValues.location === 1 ? (
          <div className='form-item'>
            <AutocompleteComponent
              idRef='contactPersonRef'
              labelValue='choose-unit-number'
              multiple={false}
              selectedValues={selected.unitNumber}
              data={data.unitNumber || []}
              displayLabel={(option) => (option.unit && option.unit.unit_ref_no) || 'N/A'}
              withoutSearchButton
              helperText={getErrorByName(schema, 'unitId').message}
              error={getErrorByName(schema, 'unitId').error}
              isWithError
              isSubmitted={isSubmitted}
              onInputKeyUp={(e) => {
                const { value } = e.target;
                if (searchTimer.current) clearTimeout(searchTimer.current);
                searchTimer.current = setTimeout(() => {
                  getAllUnits(value);
                }, 700);
              }}
              isLoading={loadings.unitNumber}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'unitNumber', value: newValue });
                setState({
                  id: 'locationUnitId',
                  value: (newValue && newValue.unitId) || null,
                });
              }}
            />
          </div>
        ) : (
          <div className='form-item'>
            <AutocompleteComponent
              idRef='contactPersonRef'
              labelValue='common-area'
              selectedValues={selected.commonArea}
              multiple={false}
              data={data.commonArea || []}
              displayLabel={(option) => option.lookupItemName || `${option.lookupItemName}` || ''}
              getOptionSelected={(option) => option.lookupItemId === state.locationCommonAreaId}
              withoutSearchButton
              helperText={getErrorByName(schema, 'unitId').message}
              error={getErrorByName(schema, 'unitId').error}
              isWithError
              isLoading={loadings.commonArea}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'commonArea', value: newValue });
                setState({
                  id: 'locationCommonAreaId',
                  value: (newValue && newValue.lookupItemId) || null,
                });
              }}
            />
          </div>
        )}
        <div className='form-item'>
          <Inputs
            idRef='TitleRef'
            labelValue='location-description'
            value={state.locationDescription}
            isWithError
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'locationDescription', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='Property-nameRef'
            labelValue='owner'
            selectedValues={selected.owner}
            multiple={false}
            data={data.owner || []}
            isWithError
            isSubmitted={isSubmitted}
            helperText={getErrorByName(schema, 'assetOwnerId').message}
            error={getErrorByName(schema, 'assetOwnerId').error}
            displayLabel={(option) => option.lookupItemName || `${option.lookupItemName}` || ''}
            getOptionSelected={(option) => option.lookupItemId === state.assetOwnerId}
            withoutSearchButton
            isLoading={loadings.owner}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'owner', value: newValue });
              setState({
                id: 'assetOwnerId',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <DataFileAutocompleteComponent
            idRef='contactPersonRef'
            labelValue='suplierReq'
            multiple={false}
            helperText={getErrorByName(schema, 'supplierId').message}
            error={getErrorByName(schema, 'supplierId').error}
            isWithError
            selectedValues={selected.suplier}
            isSubmitted={isSubmitted}
            data={data.suplier || []}
            displayLabel={(option) =>
              ((option.contact.first_name || option.contact.last_name) &&
                `${option.contact.first_name || ''} ${option.contact.last_name || ''}`) ||
              (option.contact.company_name && `${option.contact.company_name}`)}
            withoutSearchButton
            renderFor='contact'
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllContacts(value);
              }, 700);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'suplier', value: newValue });
              setState({
                id: 'supplierId',
                value: (newValue && newValue.contactsId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <DatePickerComponent
            idRef='curredonDateRef'
            labelValue='purchase-date'
            placeholder='DD/MM/YYYY'
            value={state.purchaseDate}
            helperText={getErrorByName(schema, 'purchaseDate').message}
            error={getErrorByName(schema, 'purchaseDate').error}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onDateChanged={(newValue) => {
              setState({
                id: 'purchaseDate',
                value: (newValue && moment(newValue).format()) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='TitleRef'
            labelValue='price'
            value={state.purchasePrice}
            isWithError
            helperText={getErrorByName(schema, 'purchasePrice').message}
            error={getErrorByName(schema, 'purchasePrice').error}
            type='number'
            min={0}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'purchasePrice', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <RadiosGroupComponent
            data={[
              { id: 1, value: 'yes' },
              { id: 2, value: 'no' },
            ]}
            valueInput='id'
            labelInput='value'
            value={radioValues.underWarenty}
            onSelectedRadioChanged={(e, newValue) => {
              setRadioValues({ ...radioValues, underWarenty: +newValue });
              setState({ id: 'isUnderWarranty', value: +newValue === 1 });
              setState({
                id: 'warrantyExpireDate',
                value: null,
              });
            }}
            name='radioGroups'
            titleClasses='texts gray-primary-bold'
            wrapperClasses='mb-3'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
            labelValue='under-warranty'
          />
        </div>
        {radioValues.underWarenty === 1 && (
          <div className='form-item'>
            <DatePickerComponent
              idRef='curredonDateRef'
              labelValue='warranty-expiry-date'
              placeholder='DD/MM/YYYY'
              value={state.warrantyExpireDate}
              helperText={getErrorByName(schema, 'warrantyExpireDate').message}
              error={getErrorByName(schema, 'warrantyExpireDate').error}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onDateChanged={(newValue) => {
                setState({
                  id: 'warrantyExpireDate',
                  value: (newValue && moment(newValue).format()) || null,
                });
              }}
            />
          </div>
        )}
        <div className='form-item w-50'>
          <Inputs
            idRef='DescriptionRef'
            labelValue='remarks'
            value={state.remarks}
            isWithError
            isSubmitted={isSubmitted}
            multiline
            rows={5}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'remarks', value: event.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
};

AssetsReferenceComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
