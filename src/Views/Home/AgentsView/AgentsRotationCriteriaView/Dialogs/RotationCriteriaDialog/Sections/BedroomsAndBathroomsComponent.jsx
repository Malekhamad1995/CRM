import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';

export const BedroomsAndBathroomsComponent = ({
  parentTranslationPath,
  translationPath,
  state,
  onStateChanged,
  schema,
  isInValidBedrooms,
  setIsInValidBedrooms,
  isInValidBathrooms,
  setIsInValidBathrooms,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  useEffect(() => {
    if (state && state.bedroomsFromId && state.bedroomsToId) {
      if (state.bedroomsToId < state.bedroomsFromId) setIsInValidBedrooms(true);
      else if (state.bedroomsToId === state.bedroomsFromId) setIsInValidBedrooms(true);
      else setIsInValidBedrooms(false);
    }
    if (state && state.bathroomsFromId && state.bathroomsToId) {
      if (state.bathroomsToId < state.bathroomsFromId) setIsInValidBathrooms(true);
      else if (state.bathroomsToId === state.bathroomsFromId) setIsInValidBathrooms(true);
      else setIsInValidBathrooms(false);
    }
  }, [state]);

  return (
    <>
      <div className='dialog-content-item'>
        <div className='reminder-wrapper'>
          <Inputs
            idRef='bedroomsFromRef'
            labelValue='bedrooms'
            type='number'
            value={state.bedroomsFromId}
            onInputChanged={(e) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...state,
                  bedroomsFromId: +e.target.value,
                },
              };
              onStateChanged(localNewValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <div className='section-to'>
            <span>{t(`${translationPath}to`)}</span>
          </div>

          <Inputs
            withoutText
            idRef='bedroomsToRef'
            type='number'
            wrapperClasses={isInValidBedrooms ? 'invalid' : ''}
            value={state.bedroomsToId}
            onInputChanged={(e) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...state,
                  bedroomsToId: +e.target.value,
                },
              };
              onStateChanged(localNewValue);
            }}
            // helperText={getErrorByName(schema, 'bedroomsToId').message}
            // error={getErrorByName(schema, 'bedroomsToId').error}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      </div>
      <div className='dialog-content-item'>
        <div className='reminder-wrapper'>
          <Inputs
            idRef='bathroomsFromRef'
            labelValue='bathrooms'
            type='number'
            value={state.bathroomsFromId}
            onInputChanged={(e) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...state,
                  bathroomsFromId: +e.target.value,
                },
              };
              onStateChanged(localNewValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <div className='section-to'>
            <span>{t(`${translationPath}to`)}</span>
          </div>

          <Inputs
            withoutText
            idRef='bathroomsToRef'
            type='number'
            wrapperClasses={isInValidBathrooms ? 'invalid' : ''}
            value={state.bathroomsToId}
            onInputChanged={(e) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...state,
                  bathroomsToId: +e.target.value,
                },
              };
              onStateChanged(localNewValue);
            }}
            // helperText={getErrorByName(schema, 'bathroomsToId').message}
            // error={getErrorByName(schema, 'bathroomsToId').error}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      </div>
    </>
  );
};
const convertJsonValueShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.array,
  PropTypes.array,
  PropTypes.array,
]);
BedroomsAndBathroomsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isInValidBedrooms: PropTypes.bool.isRequired,
  setIsInValidBedrooms: PropTypes.func.isRequired,
  isInValidBathrooms: PropTypes.bool.isRequired,
  setIsInValidBathrooms: PropTypes.func.isRequired,
};
