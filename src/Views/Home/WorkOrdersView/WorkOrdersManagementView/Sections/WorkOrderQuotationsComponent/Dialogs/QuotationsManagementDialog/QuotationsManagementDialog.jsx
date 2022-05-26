import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { ButtonBase } from '@material-ui/core';
import {
  AutocompleteComponent,
  DialogComponent,
  Inputs,
  Spinner,
  Tables,
} from '../../../../../../../../Components';
import {
  CreateOrUpdateQuotations,
  GetWorkOrderQuotationById,
  lookupItemsGetId,
} from '../../../../../../../../Services';
import {
  floatHandler,
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../Helper';
import {
  Payableby,
  Termsofpayment,
  quotationTypes,
} from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const QuotationsManagementDialog = ({
  id,
  activeItem,
  reloadData,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [payableBy, setPayableBy] = useState([]);
  const [termOfPayment, setTermOfPayment] = useState([]);
  const [types, setTypes] = useState([]);
  const [editQuotationItems, setEditQuotationItems] = useState([]);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [selected, setSelected] = useReducer(reducer, {
    payableBy: null,
    termOfPayment: null,
  });
  const [loadings, setLoadings] = useState({
    payableBy: false,
    termOfPayment: false,
    types: false,
  });
  const [state, setState] = useReducer(reducer, {
    payableById: null,
    termOfPaymentId: null,
    workOrderId: id,
    quotationItems: [],
  });
  const schema = Joi.object({
    payableById: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}payable-by-is-required`),
        'number.empty': t(`${translationPath}payable-by-is-required`),
      }),
    termOfPaymentId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}term-of-payment-is-required`),
        'number.empty': t(`${translationPath}term-of-payment-is-required`),
      }),
    quotationItems: Joi.array().items(
      Joi.object({
        quotationItemId: Joi.any(),
        typeId: Joi.any()
          .custom((value, helpers) => {
            if (!value) return helpers.error('state.typeNotSet');
            return value;
          })
          .messages({
            'state.typeNotSet': t(`${translationPath}type-is-required`),
          }),
        description: Joi.string().allow(null, ''),
        quantity: Joi.number()
          .min(1)
          .messages({
            'number.base': t(`${translationPath}quantity-is-required`),
            'number.min': t(`${translationPath}quantity-is-required`),
          }),
        price: Joi.number()
          .min(0.001)
          .messages({
            'number.base': t(`${translationPath}price-is-required`),
            'number.min': t(`${translationPath}price-is-required`),
          }),
      })
    ),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const editSchema = Joi.array()
    .items(
      Joi.object({
        quotationItemId: Joi.any(),
        typeId: Joi.any()
          .custom((value, helpers) => {
            if (!value) return helpers.error('state.typeNotSet');
            return value;
          })
          .messages({
            'state.typeNotSet': t(`${translationPath}type-is-required`),
          }),
        description: Joi.string().allow(null, ''),
        quantity: Joi.number()
          .min(1)
          .messages({
            'number.base': t(`${translationPath}quantity-is-required`),
            'number.min': t(`${translationPath}quantity-is-required`),
          }),
        price: Joi.number()
          .min(0.001)
          .messages({
            'number.base': t(`${translationPath}price-is-required`),
            'number.min': t(`${translationPath}price-is-required`),
          }),
      })
    )
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(editQuotationItems);
  const getIsEditingIndex = (index) => editQuotationItems.findIndex((item) => item.index === index);
  const getIsEditingValue = (index, key) =>
    getIsEditingIndex(index) !== -1 && editQuotationItems.find((item) => item.index === index)[key];
  const getAllPayableBy = useCallback(async () => {
    setLoadings((items) => ({ ...items, payableBy: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: Payableby,
    });
    if (!(res && res.status && res.status !== 200)) setPayableBy(res || []);
    else setPayableBy([]);
    setLoadings((items) => ({ ...items, payableBy: false }));
  }, []);
  const getAllTermOfPayment = useCallback(async () => {
    setLoadings((items) => ({ ...items, termOfPayment: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: Termsofpayment,
    });
    if (!(res && res.status && res.status !== 200)) setTermOfPayment(res || []);
    else setTermOfPayment([]);
    setLoadings((items) => ({ ...items, termOfPayment: false }));
  }, []);
  const getAllTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, types: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: quotationTypes,
    });
    if (!(res && res.status && res.status !== 200)) setTypes(res || []);
    else setTypes([]);
    setLoadings((items) => ({ ...items, types: false }));
  }, []);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res = await CreateOrUpdateQuotations({ ...state, workOrderId: id });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem) showSuccess(t`${translationPath}quotation-updated-successfully`);
      else showSuccess(t`${translationPath}quotation-created-successfully`);
      reloadData();
    } else if (activeItem) showError(t(`${translationPath}quotation-update-failed`));
    else showError(t`${translationPath}quotation-create-failed`);
  };
  const getTotal = (key) =>
    (state.quotationItems &&
      state.quotationItems.reduce((total, item) => +(item[key] || 0) + total, 0)) ||
    0;
  const getTotalAmountRow = (price, quantity) => +(price || 0) * +(quantity || 0);
  const getTotalAmount = () =>
    (state.quotationItems &&
      state.quotationItems.reduce(
        (total, item) => +(item.price || 0) * +(item.quantity || 0) + total,
        0
      )) ||
    0;
  const quotationItemsHandler = (process, index, stateItem) => () => {
    if (process === 'add') {
      const toAddItem = {
        typeId: null,
        type: null,
        description: null,
        quantity: null,
        price: null,
      };
      state.quotationItems.splice(index + 1, 0, toAddItem);
      setState({ id: 'quotationItems', value: state.quotationItems });
      setEditQuotationItems((items) => {
        let localItems = [...items];
        localItems = items.map((item) => {
          if (item.index >= index + 1) item.index += 1;
          return item;
        });
        localItems.splice(index + 1, 0, { ...toAddItem, index: index + 1, isSubmitted: false });
        return [...localItems];
      });
    } else if (process === 'remove') {
      state.quotationItems.splice(index, 1);
      setState({ id: 'quotationItems', value: state.quotationItems });
      const editIndex = getIsEditingIndex(index);
      if (editIndex !== -1) {
        setEditQuotationItems((items) => {
          let localItems = [...items];
          localItems = items.map((item) => {
            if (item.index >= index) item.index -= 1;
            return item;
          });
          localItems.splice(editIndex, 1);
          return [...localItems];
        });
      }
    } else if (process === 'edit') {
      setEditQuotationItems((items) => {
        const localItems = [...items];
        localItems.splice(index, 0, { ...stateItem, index, isSubmitted: false });
        return [...localItems];
      });
    } else if (process === 'close') {
      setEditQuotationItems((items) => {
        const localItems = [...items];
        const editItemIndex = getIsEditingIndex(index);
        if (editItemIndex !== -1) localItems.splice(editItemIndex, 1);
        return [...localItems];
      });
    } else if (process === 'save') {
      const editItemIndex = getIsEditingIndex(index);
      if (editItemIndex !== -1) {
        if (
          getErrorByName(editSchema, `${editItemIndex}.typeId`).error ||
          getErrorByName(editSchema, `${editItemIndex}.quantity`).error ||
          getErrorByName(editSchema, `${editItemIndex}.price`).error
        ) {
          setEditQuotationItems((items) => {
            items[editItemIndex].isSubmitted = true;
            return [...items];
          });
          return;
        }
        state.quotationItems[index] = {
          typeId: editQuotationItems[editItemIndex].typeId,
          type: editQuotationItems[editItemIndex].type,
          description: editQuotationItems[editItemIndex].description,
          quantity: editQuotationItems[editItemIndex].quantity,
          price: editQuotationItems[editItemIndex].price,
        };
        setState({ id: 'quotationItems', value: state.quotationItems });
        setEditQuotationItems((items) => {
          items.splice(editItemIndex, 1);
          return [...items];
        });
      }
    }
  };
  const getWorkOrderQuotationById = useCallback(async (quotationById) => {
    setIsLoading(true);
    const res = await GetWorkOrderQuotationById({ quotationById });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);

  const getEditInit = useCallback(async () => {
    if (!state.quotationId && activeItem && activeItem.quotationId) {
      const res = await getWorkOrderQuotationById(activeItem.quotationId);
      if (res) setState({ id: 'edit', value: res });
      else setState({ id: 'quotationId', value: (activeItem && activeItem.quotationId) });
    }
    if (state.payableById && !selected.payableBy && payableBy.length > 0) {
      const payableByIndex = payableBy.findIndex((item) => item.lookupItemId === state.payableById);
      if (payableByIndex !== -1) {
        selected.payableBy = payableBy[payableByIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
    if (state.termOfPaymentId && !selected.termOfPayment && termOfPayment.length > 0) {
      const termOfPaymentIndex = termOfPayment.findIndex(
        (item) => item.lookupItemId === state.termOfPaymentId
      );
      if (termOfPaymentIndex !== -1) {
        selected.termOfPayment = termOfPayment[termOfPaymentIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
    if (
      state.quotationItems &&
      state.quotationItems.length > 0 &&
      types.length > 0 &&
      state.quotationItems.findIndex((item) => !item.type && item.typeId) !== -1
    ) {
      state.quotationItems = state.quotationItems.map((item) => {
        if (item.typeId && !item.type) {
          const typeIndex = types.findIndex((element) => element.lookupItemId === item.typeId);
          if (typeIndex !== -1) item.type = types[typeIndex];
        }
        return item;
      });
      setState({ id: 'quotationItems', value: state.quotationItems });
    }
  }, [
    activeItem,
    getWorkOrderQuotationById,
    payableBy,
    selected,
    state.payableById,
    state.quotationId,
    state.quotationItems,
    state.termOfPaymentId,
    termOfPayment,
    types,
  ]);

  useEffect(() => {
    if (!activeItem && state.quotationItems && state.quotationItems.length === 0) {
      const toAddItem = {
        typeId: null,
        type: null,
        description: null,
        quantity: null,
        price: null,
      };
      state.quotationItems.push(toAddItem);
      setState({ id: 'quotationItems', value: state.quotationItems });
      setEditQuotationItems([{ ...toAddItem, index: 0, isSubmitted: false }]);
    }
  }, [activeItem, state.quotationItems]);
  // todo:- add edit activeItem to state
  // useEffect(() => {
  //   if (activeItem) setState({ id: 'edit', value: {

  //     payableById: null,
  //   termOfPaymentId: null,
  //   workOrderId: id,
  //   quotationItems: [],
  //   } });
  // }, [activeItem]);
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);
  useEffect(() => {
    getAllPayableBy();
    getAllTermOfPayment();
    getAllTypes();
  }, [getAllPayableBy, getAllTermOfPayment, getAllTypes]);
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-quotation') || 'add-quotation'}
      saveText={(activeItem && 'edit-quotation') || 'add-quotation'}
      maxWidth='lg'
      dialogContent={(
        <div className='quotations-management-dialog'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='dialog-item'>
            <AutocompleteComponent
              idRef='payableByIdRef'
              labelValue='payable-by'
              selectedValues={selected.payableBy}
              multiple={false}
              data={payableBy}
              displayLabel={(option) => option.lookupItemName || ''}
              getOptionSelected={(option) => option.lookupItemId === state.payableById}
              withoutSearchButton
              helperText={getErrorByName(schema, 'payableById').message}
              error={getErrorByName(schema, 'payableById').error}
              isWithError
              isLoading={loadings.payableBy}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'payableBy', value: newValue });
                setState({
                  id: 'payableById',
                  value: (newValue && newValue.lookupItemId) || null,
                });
              }}
            />
          </div>
          <div className='dialog-item'>
            <AutocompleteComponent
              idRef='termOfPaymentIdRef'
              labelValue='term-of-payment'
              selectedValues={selected.termOfPayment}
              multiple={false}
              data={termOfPayment}
              displayLabel={(option) => option.lookupItemName || ''}
              getOptionSelected={(option) => option.lookupItemId === state.termOfPaymentId}
              withoutSearchButton
              helperText={getErrorByName(schema, 'termOfPaymentId').message}
              error={getErrorByName(schema, 'termOfPaymentId').error}
              isWithError
              isLoading={loadings.termOfPayment}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'termOfPayment', value: newValue });
                setState({
                  id: 'termOfPaymentId',
                  value: (newValue && newValue.lookupItemId) || null,
                });
              }}
            />
          </div>
          <div className='w-100 px-2'>
            <Tables
              data={state.quotationItems}
              headerData={[
                {
                  id: 1,
                  label: 'type',
                  component: (item, index) =>
                    (getIsEditingIndex(index) !== -1 && (
                      <AutocompleteComponent
                        idRef={`typeIdRef${index + 1}`}
                        inputPlaceholder='type'
                        selectedValues={getIsEditingValue(index, 'type')}
                        multiple={false}
                        data={types}
                        displayLabel={(option) => option.lookupItemName || ''}
                        getOptionSelected={(option) =>
                          option.lookupItemId === getIsEditingValue(index, 'typeId')}
                        withoutSearchButton
                        isLoading={loadings.types}
                        helperText={getErrorByName(editSchema, `${index}.typeId`).message}
                        error={getErrorByName(editSchema, `${index}.typeId`).error}
                        isWithError
                        isSubmitted={isSubmitted || getIsEditingValue(index, 'isSubmitted')}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onChange={(event, newValue) => {
                          setEditQuotationItems((items) => {
                            const typeEditIndex = items.findIndex(
                              (element) => element.index === index
                            );
                            if (typeEditIndex !== -1) {
                              items[typeEditIndex] = {
                                ...items[typeEditIndex],
                                typeId: (newValue && newValue.lookupItemId) || null,
                                type: newValue,
                              };
                            } else {
                              items.push({
                                index,
                                typeId: (newValue && newValue.lookupItemId) || null,
                                type: newValue,
                                description: null,
                                quantity: null,
                                price: null,
                              });
                            }
                            return [...items];
                          });
                        }}
                      />
                    )) || <span>{(item.type && item.type.lookupItemName) || 'N/A'}</span>,
                },
                {
                  id: 2,
                  label: 'description',
                  component: (item, index) =>
                    (getIsEditingIndex(index) !== -1 && (
                      <Inputs
                        idRef={`descriptionIdRef${index + 1}`}
                        inputPlaceholder='description'
                        value={getIsEditingValue(index, 'description') || ''}
                        helperText={getErrorByName(editSchema, `${index}.description`).message}
                        error={getErrorByName(editSchema, `${index}.description`).error}
                        isWithError
                        isSubmitted={isSubmitted || getIsEditingValue(index, 'isSubmitted')}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onInputChanged={(event) => {
                          const { value } = event.target;
                          setEditQuotationItems((items) => {
                            const typeEditIndex = items.findIndex(
                              (element) => element.index === index
                            );
                            if (typeEditIndex !== -1) items[typeEditIndex].description = value;
                            else {
                              items.push({
                                index,
                                typeId: null,
                                type: null,
                                description: value,
                                quantity: null,
                                price: null,
                              });
                            }
                            return [...items];
                          });
                        }}
                      />
                    )) || <span>{item.description !== null ? item.description : 'N/A'}</span>,
                },
                {
                  id: 3,
                  label: 'quantity',
                  component: (item, index) =>
                    (getIsEditingIndex(index) !== -1 && (
                      <Inputs
                        idRef={`quantityIdRef${index + 1}`}
                        inputPlaceholder='quantity'
                        value={
                          getIsEditingValue(index, 'quantity') ||
                            getIsEditingValue(index, 'quantity') === 0 ?
                            getIsEditingValue(index, 'quantity') :
                            ''
                        }
                        helperText={getErrorByName(editSchema, `${index}.quantity`).message}
                        error={getErrorByName(editSchema, `${index}.quantity`).error}
                        type='number'
                        min={0}
                        isWithError
                        isSubmitted={isSubmitted || getIsEditingValue(index, 'isSubmitted')}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onInputChanged={(event) => {
                          const value = floatHandler(event.target.value, 0);
                          setEditQuotationItems((items) => {
                            const typeEditIndex = items.findIndex(
                              (element) => element.index === index
                            );
                            if (typeEditIndex !== -1) {
                              items[typeEditIndex] = {
                                ...items[typeEditIndex],
                                quantity: value,
                              };
                            } else {
                              items.push({
                                index,
                                typeId: null,
                                type: null,
                                description: null,
                                quantity: value,
                                price: null,
                              });
                            }
                            return [...items];
                          });
                        }}
                      />
                    )) || <span>{item.quantity !== null ? item.quantity : 'N/A'}</span>,
                },
                {
                  id: 4,
                  label: 'price',
                  component: (item, index) =>
                    (getIsEditingIndex(index) !== -1 && (
                      <Inputs
                        idRef={`priceIdRef${index + 1}`}
                        inputPlaceholder='price'
                        value={
                          getIsEditingValue(index, 'price') ||
                            getIsEditingValue(index, 'price') === 0 ?
                            getIsEditingValue(index, 'price') :
                            ''
                        }
                        helperText={getErrorByName(editSchema, `${index}.price`).message}
                        error={getErrorByName(editSchema, `${index}.price`).error}
                        endAdornment={<span className='px-2'>AED</span>}
                        type='number'
                        min={0}
                        isWithError
                        isSubmitted={isSubmitted || getIsEditingValue(index, 'isSubmitted')}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onInputChanged={(event) => {
                          const value = floatHandler(event.target.value, 3);
                          setEditQuotationItems((items) => {
                            const typeEditIndex = items.findIndex(
                              (element) => element.index === index
                            );
                            if (typeEditIndex !== -1) {
                              items[typeEditIndex] = {
                                ...items[typeEditIndex],
                                price: value,
                              };
                            } else {
                              items.push({
                                index,
                                typeId: null,
                                type: null,
                                description: null,
                                quantity: null,
                                price: value,
                              });
                            }
                            return [...items];
                          });
                        }}
                      />
                    )) || <span>{item.price !== null ? item.price : 'N/A'}</span>,
                },
                {
                  id: 5,
                  label: 'amount',
                  component: (item) => <span>{getTotalAmountRow(item.price, item.quantity)}</span>,
                },
                {
                  id: 6,
                  label: 'actions',
                  component: (item, index) => (
                    <span className='d-flex-v-center'>
                      {(getIsEditingIndex(index) !== -1 && (
                        <>
                          <ButtonBase
                            className='btns-icon theme-transparent c-success mx-3'
                            onClick={quotationItemsHandler('save', index)}
                          >
                            <span className='mdi mdi-checkbox-marked-circle-outline c-success' />
                          </ButtonBase>
                          {(state.quotationItems &&
                            state.quotationItems[index] &&
                            state.quotationItems[index].typeId && (
                              <ButtonBase
                                className='btns-icon theme-transparent'
                                onClick={quotationItemsHandler('close', index)}
                              >
                                <span className='mdi mdi-close c-warning' />
                              </ButtonBase>
                            )) ||
                            null}
                        </>
                      )) || (
                      <ButtonBase
                        className='btns-icon theme-transparent'
                        onClick={quotationItemsHandler('edit', index, item)}
                      >
                        <span className='mdi mdi-lead-pencil c-success' />
                      </ButtonBase>
                        )}
                      {state.quotationItems && state.quotationItems.length > 1 && (
                        <ButtonBase
                          className='btns-icon theme-transparent'
                          onClick={quotationItemsHandler('remove', index)}
                        >
                          <span className='mdi mdi-trash-can-outline c-warning' />
                        </ButtonBase>
                      )}
                      <ButtonBase
                        className='btns theme-transparent'
                        onClick={quotationItemsHandler('add', index)}
                      >
                        <span className='mdi mdi-plus-circle' />
                        <span className='px-2'>{t(`${translationPath}add-line`)}</span>
                      </ButtonBase>
                    </span>
                  ),
                },
              ]}
              footerData={[
                {
                  value: t(`${translationPath}total`),
                  colSpan: 2,
                },
                {
                  component: () => <span>{getTotal('quantity')}</span>,
                },
                {
                  component: () => <span>{getTotal('price')}</span>,
                },
                {
                  component: () => <span>{getTotalAmount()}</span>,
                  colSpan: 2,
                },
              ]}
              defaultActions={[]}
              activePage={filter.pageIndex}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              totalItems={(selected.tableContacts && selected.tableContacts.length) || 0}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

QuotationsManagementDialog.propTypes = {
  id: PropTypes.number,
  activeItem: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
QuotationsManagementDialog.defaultProps = {
  id: undefined,
  activeItem: null,
};
