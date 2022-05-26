import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Inputs, Spinner } from '../../../../../../Components';
import { GetBuyerSummary, UpdateBuyerSummary } from '../../../../../../Services';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showSuccess,
} from '../../../../../../Helper';

export const UnitProfileBuyerSummaryComponent = ({ parentTranslationPath, translationPath }) => {
  const defaultState = {
    agencyFeeBuyer: 0,
    amountDueToDeveloper: 0,
    buyersTotal: 0,
    discount: 0,
    sellerHasPaid: 0,
    toSeller: 0,
    transferFeeBuyer: 0,
    transferFeeCompletedAndPaidProp: 0,
  };
  const [state, setState] = useState(defaultState);
  const [Discardstate, setDiscardstate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const getUnitSaleDetails = useCallback(async () => {
    const result = await GetBuyerSummary(+GetParams('id'));
    setState(result);
    setDiscardstate(result);
  }, []);
  const { t } = useTranslation(parentTranslationPath);
  useEffect(() => {
    getUnitSaleDetails();
  }, [getUnitSaleDetails]);

  const cancelHandler = () => {
    GlobalHistory.push('/home/units-lease/view');
  };

  const saveHandler = useCallback(async () => {
    setIsLoading(true);
    await UpdateBuyerSummary(+GetParams('id'), state);
    setIsLoading(false);
    getUnitSaleDetails();
    showSuccess(t(`${translationPath}edit-successfully`));
  }, [getUnitSaleDetails, state, t, translationPath]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={() => cancelHandler()}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-transparent mb-2' onClick={() => setState(Discardstate)}>
          <span>{t(`${translationPath}discard-change`)}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={() => saveHandler()}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  });

  return (
    <div className='units-information-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='agency-fees-buyer-description'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.agencyFeeBuyer}
          onInputChanged={(event) => setState({ ...state, agencyFeeBuyer: +event.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='transfer-fees-buyer-description'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.transferFeeBuyer}
          onInputChanged={(event) => setState({ ...state, transferFeeBuyer: +event.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='transfer-fees-completed-properties-description'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.transferFeeCompletedAndPaidProp}
          onInputChanged={(event) =>
            setState({ ...state, transferFeeCompletedAndPaidProp: +event.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='seller-has-paid'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.sellerHasPaid}
          onInputChanged={(event) => setState({ ...state, sellerHasPaid: +event.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='to-seller'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.toSeller}
          onInputChanged={(event) => setState({ ...state, toSeller: +event.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='discount'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.discount}
          onInputChanged={(event) => setState({ ...state, discount: +event.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='NoOfapartmentRef'
          labelValue='buyers-total'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type='number'
          min={0}
          value={state.buyersTotal}
          onInputChanged={(event) => setState({ ...state, buyersTotal: +event.target.value })}
        />
      </div>
    </div>
  );
};

UnitProfileBuyerSummaryComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
