import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';
import { ReferenceDetailsUsersAutocomplete } from '../../../../../SalesTransactionsView/SalesTransactionsProfile/Sections/ReferenceDetails';

export const TenantComponent = ({
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
    <div className='tenant-wrapper presentational-wrapper'>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}tenant`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='tenantNameRef'
          labelValue='referred-by'
          value={state.tenantName || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={isDisabled}
        />
      </div>
      <div className='form-item'>
        <ReferenceDetailsUsersAutocomplete
          stateValue={state.internalReferralTenantId}
          selectedValue={selected.tenantInternalReferral}
          selectedKey='tenantInternalReferral'
          stateKey='internalReferralTenantId'
          idRef='tenantInternalReferralRef'
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
          idRef='internalReferralTenantSharePercentageRef'
          labelValue='internal-referral-comm'
          value={state.internalReferralTenantSharePercentage || 0}
          helperText={getErrorByName(schema, 'internalReferralTenantSharePercentage').message}
          error={getErrorByName(schema, 'internalReferralTenantSharePercentage').error}
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
            onStateChanged({ id: 'internalReferralTenantSharePercentage', value });
          }}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

TenantComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
