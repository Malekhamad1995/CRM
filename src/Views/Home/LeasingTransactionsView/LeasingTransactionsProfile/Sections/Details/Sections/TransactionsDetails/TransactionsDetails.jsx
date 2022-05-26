import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { DatePickerComponent, Inputs, Spinner } from '../../../../../../../../Components';
import {
  GetLeaseTransactionDetails,
} from '../../../../../../../../Services';

export const TransactionsDetails = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useReducer(reducer, {
    cityName: null,
    propertyName: null,
    unitReferenceNo: null,
    leadReferenceNo: null,
    claimDate: null,
    exteranalAgencyName: null,
    splitComm: null,
    rentPerYear: null,
    totalAgencyFee: null,
    breakLeaseDate: null,
  });
  const getLeasingTransactionDetails = useCallback(async () => {
    setIsLoading(true);
    // const res = await GetLeasingTransactionDetails(unitTransactionId);
    const res = await GetLeaseTransactionDetails(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) setState({ id: 'edit', value: res });
    setIsLoading(false);
  }, [unitTransactionId]);

  useEffect(() => {
    if (unitTransactionId) getLeasingTransactionDetails();
  }, [getLeasingTransactionDetails, unitTransactionId]);

  return (
    <div className='transactions-details-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='form-item'>
        <Inputs
          idRef='cityNameRef'
          labelValue='state'
          value={state.cityName || ''}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='propertyNameRef'
          labelValue='property-name'
          value={state.propertyName || ''}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='unitReferenceNoRef'
          labelValue='unit-no'
          value={state.unitReferenceNo || ''}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='leadReferenceNoRef'
          labelValue='lead-ref-no'
          value={state.leadReferenceNo || ''}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='exteranalAgencyNameRef'
          labelValue='external-agency-name'
          value={state.exteranalAgencyName || ''}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='splitCommRef'
          labelValue='split-comm-description'
          value={state.splitComm || ''}
          endAdornment={<span className='px-1'>%</span>}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='claimDateRef'
          labelValue='claim-date'
          placeholder='DD/MM/YYYY'
          value={state.claimDate}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={() => {}}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='rentPerYearRef'
          labelValue='rent-year-description'
          value={state.rentPerYear || 0}
          isDisabled
          type='number'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='totalAgencyFeeRef'
          labelValue='total-agency-fee'
          value={state.totalAgencyFee || 0}
          isDisabled
          type='number'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='breakLeaseDateRef'
          labelValue='break-lease-date'
          placeholder='DD/MM/YYYY'
          value={state.breakLeaseDate}
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={() => {}}
        />
      </div>
    </div>
  );
};

TransactionsDetails.propTypes = {
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TransactionsDetails.defaultProps = {
  unitTransactionId: null,
};
