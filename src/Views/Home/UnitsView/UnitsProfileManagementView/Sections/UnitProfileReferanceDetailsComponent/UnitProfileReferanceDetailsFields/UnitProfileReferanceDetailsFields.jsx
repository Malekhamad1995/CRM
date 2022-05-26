import React from 'react';
import PropTypes from 'prop-types';
import {
  AutocompleteComponent,
  Inputs,
  RadiosGroupComponent,
} from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';

export const UnitProfileReferanceDetailsFields = ({
  data,
  state,
  schema,
  loadings,
  selected,
  activeItem,
  searchTimer,
  isSubmitted,
  onStateChange,
  translationPath,
  onSelectedChange,
  parentTranslationPath,
  getAllInternalReferralId,
}) => (
  <div className='units-referance-details-wrapper'>
    <div className='form-item'>
      <Inputs
        isDisabled
        labelValue='ref-no'
        idRef='basePriceRef'
        value={activeItem.refNo || ''}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
    <div className='form-item'>
      <AutocompleteComponent
        isWithError
        multiple={false}
        withoutSearchButton
        idRef='activityTypeIdRef'
        isSubmitted={isSubmitted}
        data={data.internalReferralId}
        labelValue='internal-referral'
        labelClasses='Requierd-Color'
        translationPath={translationPath}
        isLoading={loadings.internalReferralId}
        selectedValues={selected.internalReferralId}
        parentTranslationPath={parentTranslationPath}
        displayLabel={(option) => option.fullName || ''}
        onInputKeyUp={(e) => {
          const { value } = e.target;
          if (searchTimer.current) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            getAllInternalReferralId(value);
          }, 700);
        }}
        error={getErrorByName(schema, 'internalReferralId').error}
        helperText={getErrorByName(schema, 'internalReferralId').message}
        getOptionSelected={(option) => option.id === state.internalReferralId}
        onChange={(event, newValue) => {
          onSelectedChange('internalReferralId', newValue);
          onStateChange('internalReferralId', (newValue && newValue.id) || null);
          onStateChange('internalReferralName', (newValue && newValue.fullName) || null);
        }}
      />
    </div>
    <div className='form-item'>
      <Inputs
        isWithError
        idRef='basePriceRef'
        labelValue='rera-str'
        labelClasses='Requierd-Color'
        isSubmitted={isSubmitted}
        value={state.reraSpecialTransactionReport}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        error={getErrorByName(schema, 'reraSpecialTransactionReport').error}
        helperText={getErrorByName(schema, 'reraSpecialTransactionReport').message}
        onInputChanged={(event) =>
          onStateChange('reraSpecialTransactionReport', event.target.value)}
      />
    </div>
    <div className='form-item'>
      <Inputs
        isWithError
        type='number'
        idRef='basePriceRef'
        isSubmitted={isSubmitted}
        labelValue='transaction-no'
        labelClasses='Requierd-Color'
        value={state.transactionNo}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        error={getErrorByName(schema, 'transactionNo').error}
        helperText={getErrorByName(schema, 'transactionNo').message}
        onInputChanged={(event) => onStateChange('transactionNo', +event.target.value)}
      />
    </div>
    <div className='form-item'>
      <AutocompleteComponent
        multiple={false}
        withoutSearchButton
        labelValue='key-status'
        idRef='activityTypeIdRef'
        isSubmitted={isSubmitted}
        data={data.keyStatusId}
        translationPath={translationPath}
        isLoading={loadings.keyStatusId}
        selectedValues={selected.keyStatusId}
        parentTranslationPath={parentTranslationPath}
        displayLabel={(option) => option.ownerKeyAccessName || ''}
        getOptionSelected={(option) => option.ownerKeyAccessId === state.keyStatusId}
        onChange={(event, newValue) => {
          onSelectedChange('keyStatusId', newValue);
          onStateChange('keyStatusId', (newValue && newValue.ownerKeyAccessId) || null);
          onStateChange('keyStatusName', (newValue && newValue.ownerKeyAccessName) || null);
        }}
      />
    </div>
    <div className='form-item'>
      <Inputs
        isWithError
        type='number'
        idRef='number-of-keys'
        isSubmitted={isSubmitted}
        labelValue='number-of-keys'
        labelClasses='Requierd-Color'
        value={state.numberOfKeys}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        error={getErrorByName(schema, 'numberOfKeys').error}
        helperText={getErrorByName(schema, 'numberOfKeys').message}
        onInputChanged={(event) => onStateChange('numberOfKeys', +event.target.value)}
      />
    </div>
    <div className='form-item'>
      <Inputs
        isWithError
        type='number'
        idRef='basePriceRef'
        isSubmitted={isSubmitted}
        value={state.referralCommission}
        translationPath={translationPath}
        labelValue='referral-commission-%'
        labelClasses='Requierd-Color'
        parentTranslationPath={parentTranslationPath}
        error={getErrorByName(schema, 'referralCommission').error}
        helperText={getErrorByName(schema, 'referralCommission').message}
        onInputChanged={(event) => onStateChange('referralCommission', +event.target.value)}
      />
    </div>
    <div className='form-item'>
      <RadiosGroupComponent
        data={[
          {
            key: true,
            value: 'yes',
          },
          {
            key: false,
            value: 'no',
          },
        ]}
        valueInput='key'
        labelInput='value'
        labelValue='send-for-approval'
        idRef='isPriceOnApplicationRef'
        value={state.sendForApproval}
        translationPath={translationPath}
        translationPathForData={translationPath}
        parentTranslationPath={parentTranslationPath}
        onSelectedRadioChanged={(e, newValue) =>
          onStateChange('sendForApproval', newValue === 'true')}
      />
    </div>
  </div>
);
UnitProfileReferanceDetailsFields.propTypes = {
  loadings: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChange: PropTypes.func.isRequired,
  getAllKeyStatus: PropTypes.func.isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  getAllInternalReferralId: PropTypes.func.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
  searchTimer: PropTypes.instanceOf(Object).isRequired,
};
