import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../Services';
import { UnitTypes } from '../../../../../../../Enums';
import { RotationManagementLookupsAutocomplete } from '../Controls/RotationManagementLookupsAutocomplete';

export const UnitTypeComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  state,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [lookups, setLookups] = useState([]);
  const getAllLookups = useCallback(async () => {
    const res = await lookupItemsGetId({
      lookupTypeId: UnitTypes.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) setLookups(res || []);
    else setLookups([]);
  }, []);
  useEffect(() => {
    getAllLookups();
  }, [getAllLookups]);

  return (
    <>
      <div className='dialog-content-item'>
        <RotationManagementLookupsAutocomplete
          idRef='uniteTypeIdRef'
          lookupTypeId={UnitTypes.lookupTypeId}
          labelValue={t(`${translationPath}unitType`)}
          value={state.rotationSchemeUnitTypes}
          mapedData={{ id: 'unitTypeId', name: 'unitTypeName' }}
          onStateChanged={(newValue) => {
              const localNewValue = {
                id: 'rotationSchemeUnitTypes',
                value: [
                    ...newValue,
                ]
              };
              onStateChanged(localNewValue);
            }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
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
UnitTypeComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
};
