import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { ButtonBase } from '@material-ui/core';
import { ReferenceDetailsUsersAutocomplete } from './Controls';
import {
  bottomBoxComponentUpdate,
  floatHandler,
  getErrorByName,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { Inputs, Spinner, PermissionsComponent } from '../../../../../../Components';
import {
  CreateOrUpdateUnitTransactionReferenceDetail,
  GetSalesTransactionReferenceDetailsByUnitTransactionId,
} from '../../../../../../Services';
import { BuyerComponent, SellerComponent } from './Presentational';
import { SalesTransactionsPermissions } from '../../../../../../Permissions';

export const ReferenceDetails = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    manager: null,
    sellerInternalReferral: null,
    buyerInternalReferral: null,
  });
  const [state, setState] = useReducer(reducer, {
    unitTransactionReferenceDetailsId: 0,
    unitTransactionId,
    agencyShare: 0,
    managerSharePercentage: 0,
    managerId: null,
    internalReferralSellerId: null,
    internalReferralBuyerId: null,
    sellerName: null,
    buyerName: null,
    internalReferralSellerSharePercentage: 0,
    internalReferralBuyerSharePercentage: 0,
  });
  const schema = Joi.object({
    // paymentTypeId: Joi.number()
    //   .required()
    //   .messages({
    //     'number.base': t(`${translationPath}payment-type-is-required`),
    //   }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const onSelectedChanged = (newValue) => {
    setSelected(newValue);
  };
  const getSalesTransactionReferenceDetailsByUnitTransactionId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetSalesTransactionReferenceDetailsByUnitTransactionId(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setState({
        id: 'edit',
        value: {
          unitTransactionReferenceDetailsId: res.unitTransactionReferenceDetailsId || 0,
          unitTransactionId,
          agencyShare: res.agencyShare || 0,
          managerSharePercentage: res.managerSharePercentage || 0,
          managerId: res.managerId || null,
          internalReferralSellerId: res.internalReferralSellerId || null,
          internalReferralBuyerId: res.internalReferralBuyerId || null,
          sellerName: res.sellerName || null,
          buyerName: res.buyerName || null,
          internalReferralSellerSharePercentage: res.internalReferralSellerSharePercentage || 0,
          internalReferralBuyerSharePercentage: res.internalReferralBuyerSharePercentage || 0,
        },
      });
    }
    setIsLoading(false);
  }, [unitTransactionId]);
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res = await CreateOrUpdateUnitTransactionReferenceDetail(state);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200))
      showSuccess(t`${translationPath}transaction-reference-details-saved-successfully`);
    else showError(t(`${translationPath}transaction-reference-details-save-failed`));
  }, [schema.error, state, t, translationPath]);
  const cancelHandler = () => {
    GlobalHistory.push('/home/sales-transactions/view');
  };
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(SalesTransactionsPermissions)}
          permissionsId={SalesTransactionsPermissions.UpdateReferenceDetailsInSalesTransactions.permissionsId}
        >
          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    );
  }, [saveHandler, t]);
  useEffect(() => {
    if (unitTransactionId) getSalesTransactionReferenceDetailsByUnitTransactionId();
  }, [getSalesTransactionReferenceDetailsByUnitTransactionId, unitTransactionId]);
  return (
    <div className='sale-transactions-reference-details-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}reference-details`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyShareRef'
          labelValue='agency-share'
          value={state.agencyShare || 0}
          helperText={getErrorByName(schema, 'agencyShare').message}
          error={getErrorByName(schema, 'agencyShare').error}
          isWithError
          isSubmitted={isSubmitted}
          type='number'
          min={0}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'agencyShare', value });
          }}
          isDisabled
        />
      </div>
      <div className='form-item'>
        <ReferenceDetailsUsersAutocomplete
          stateValue={state.managerId}
          selectedValue={selected.manager}
          selectedKey='manager'
          stateKey='managerId'
          idRef='managerRef'
          labelValue='manager'
          isSubmitted={isSubmitted}
          schema={schema}
          onStateChanged={onStateChanged}
          onSelectedChanged={onSelectedChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='managerSharePercentageRef'
          labelValue='manager-amount'
          value={state.managerSharePercentage || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}referrals`)}</span>
      </div>
      <div className='form-double-item'>
        <BuyerComponent
          state={state}
          selected={selected}
          isSubmitted={isSubmitted}
          schema={schema}
          onStateChanged={onStateChanged}
          onSelectedChanged={onSelectedChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled
        />
      </div>
      <div className='form-double-item'>
        <SellerComponent
          state={state}
          selected={selected}
          isSubmitted={isSubmitted}
          schema={schema}
          onStateChanged={onStateChanged}
          onSelectedChanged={onSelectedChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled
        />
      </div>
    </div>
  );
};

ReferenceDetails.propTypes = {
  //   unitId: PropTypes.number,
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ReferenceDetails.defaultProps = {
  //   unitId: null,
  unitTransactionId: null,
};
