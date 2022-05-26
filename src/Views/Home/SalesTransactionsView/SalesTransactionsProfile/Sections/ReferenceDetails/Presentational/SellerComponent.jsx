import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';
import { ReferenceDetailsUsersAutocomplete } from '../Controls';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';

export const SellerComponent = ({
  state,
  selected,
  schema,
  isSubmitted,
  onStateChanged,
  onSelectedChanged,
  parentTranslationPath,
  translationPath,
  isDisabled
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='seller-wrapper presentational-wrapper'>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}seller`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='sellerNameRef'
          labelValue='referred-by'
          value={state.sellerName || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={isDisabled}
        />
      </div>
      <div className='form-item'>
        <ReferenceDetailsUsersAutocomplete
          stateValue={state.internalReferralSellerId}
          selectedValue={selected.sellerInternalReferral}
          selectedKey='sellerInternalReferral'
          stateKey='internalReferralSellerId'
          idRef='sellerInternalReferralRef'
          labelValue='internal-referral'
          isSubmitted={isSubmitted}
          schema={schema}
          onStateChanged={onStateChanged}
          onSelectedChanged={onSelectedChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={isDisabled}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='internalReferralSellerSharePercentageRef'
          labelValue='internal-referral-comm'
          value={state.internalReferralSellerSharePercentage || 0}
          helperText={getErrorByName(schema, 'internalReferralSellerSharePercentage').message}
          error={getErrorByName(schema, 'internalReferralSellerSharePercentage').error}
          isWithError
          isSubmitted={isSubmitted}
          endAdornment={<span className='px-1'>%</span>}
          type='number'
          min={0}
          max={100}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            let value = floatHandler(event.target.value, 3);
            if (value > 100) value = 100;
            onStateChanged({ id: 'internalReferralSellerSharePercentage', value });
          }}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

SellerComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
