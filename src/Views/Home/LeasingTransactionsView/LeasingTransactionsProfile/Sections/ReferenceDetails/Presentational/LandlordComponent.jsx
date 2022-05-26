import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';
import { ReferenceDetailsUsersAutocomplete } from '../../../../../SalesTransactionsView/SalesTransactionsProfile/Sections/ReferenceDetails';

export const LandlordComponent = ({
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
    <div className='landlord-wrapper presentational-wrapper'>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}landlord`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='landlordNameRef'
          labelValue='referred-by'
          value={state.landlordName || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={isDisabled}
        />
      </div>
      <div className='form-item'>
        <ReferenceDetailsUsersAutocomplete
          stateValue={state.internalReferralLandlordId}
          selectedValue={selected.landlordInternalReferral}
          selectedKey='landlordInternalReferral'
          stateKey='internalReferralLandlordId'
          idRef='landlordInternalReferralRef'
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
          idRef='internalReferralLandlordSharePercentageRef'
          labelValue='internal-referral-comm'
          value={state.internalReferralLandlordSharePercentage || 0}
          helperText={getErrorByName(schema, 'internalReferralLandlordSharePercentage').message}
          error={getErrorByName(schema, 'internalReferralLandlordSharePercentage').error}
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
            onStateChanged({ id: 'internalReferralLandlordSharePercentage', value });
          }}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

LandlordComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
