import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckboxesComponent, Inputs } from '../../../../../../../../Components';
import { getErrorByName } from '../../../../../../../../Helper';

export const PropertyMarketingRemarks = ({
  state,
  schema,
  onStateChanged,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  return (
    <div className='property-marketing-remarks-wrapper presentational-wrapper'>
      <div className='w-100 px-2'>
        <span className='fw-simi-bold'>{t(`${translationPath}notes`)}</span>
        <span>:</span>
        <span className='px-1'>{t(`${translationPath}marketing-remarks-notes-description`)}</span>
      </div>
      <div className='w-100 px-2 mb-2'>
        <CheckboxesComponent
          idRef='addToWebRef'
          label='add-to-web'
          singleChecked={state.isShowInWeb}
          onSelectedCheckboxChanged={(event) =>
            onStateChanged({ id: 'isShowInWeb', value: event.target.checked })}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='propertyOverViewRef'
          labelValue='property-overview'
          value={state.propertyOverView || ''}
          helperText={getErrorByName(schema, 'propertyOverView').message}
          error={getErrorByName(schema, 'propertyOverView').error}
          isWithError
          isWithCharactersCounter
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'propertyOverView', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='localAreaAndAmenitiesDescriptionRef'
          labelValue='local-area-and-amenities-description'
          value={state.localAreaAndAmenitiesDescription || ''}
          helperText={getErrorByName(schema, 'localAreaAndAmenitiesDescription').message}
          error={getErrorByName(schema, 'localAreaAndAmenitiesDescription').error}
          isWithError
          isWithCharactersCounter
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'localAreaAndAmenitiesDescription', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='webRemarksRef'
          labelValue='web-remarks'
          value={state.webRemarks || ''}
          helperText={getErrorByName(schema, 'webRemarks').message}
          error={getErrorByName(schema, 'webRemarks').error}
          isWithError
          isWithCharactersCounter
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'webRemarks', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='siteInfoAndAmenitiesDescriptionRef'
          labelValue='site-info-and-amenities-description'
          value={state.siteInfoAndAmenitiesDescription || ''}
          helperText={getErrorByName(schema, 'siteInfoAndAmenitiesDescription').message}
          error={getErrorByName(schema, 'siteInfoAndAmenitiesDescription').error}
          isWithError
          isWithCharactersCounter
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'siteInfoAndAmenitiesDescription', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='developerDescriptionRef'
          labelValue='developer-description'
          value={state.developerDescription || ''}
          helperText={getErrorByName(schema, 'developerDescription').message}
          error={getErrorByName(schema, 'developerDescription').error}
          isWithError
          isWithCharactersCounter
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'developerDescription', value: event.target.value });
          }}
        />
      </div>
    </div>
  );
};

PropertyMarketingRemarks.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
