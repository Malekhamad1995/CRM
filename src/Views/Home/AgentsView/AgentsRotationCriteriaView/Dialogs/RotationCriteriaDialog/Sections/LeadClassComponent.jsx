import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ContactClassIdEnum } from '../../../../../../../Enums';
import { RotationManagementLookupsAutocomplete } from '../Controls/RotationManagementLookupsAutocomplete';

export const LeadClassComponent = ({
  parentTranslationPath,
  translationPath,
  state,
  onStateChanged,
  schema,
  schemaKey,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='dialog-content-item'>
      <RotationManagementLookupsAutocomplete
        labelClasses='Requierd-Color'
        idRef='LeasClassRef'
        lookupTypeId={ContactClassIdEnum.lookupTypeId}
        labelValue={t(`${translationPath}leadClass`)}
        value={state.rotationSchemaContactCLasses}
        mapedData={{ id: 'contactClassId', name: 'contactClassName' }}
        onStateChanged={(newValue) => {
          const localNewValue = {
            id: 'rotationSchemaContactCLasses',
            value: [...newValue],
          };
          onStateChanged(localNewValue);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        validation
        schema={schema}
        schemaKey={schemaKey}
        isSubmitted={isSubmitted}
      />
    </div>
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
LeadClassComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  onStateChanged: PropTypes.func.isRequired,
};
