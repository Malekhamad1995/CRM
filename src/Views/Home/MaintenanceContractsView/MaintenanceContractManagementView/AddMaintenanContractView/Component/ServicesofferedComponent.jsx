import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';
import Lookups from '../../../../../../assets/json/StaticLookupsIds.json';
// import { getErrorByName } from '../../../../../../Helper';

export const ServicesofferedComponent = ({
  parentTranslationPath,
  translationPath,
  setmaintenanceContractServices,
  maintenanceContractServices,
  setSelected,
  selected , 
  helperText ,
  error,
  isSubmitted
  

}) => {
  const [Services, setServices] = useState({});
  const [loadings, setloadings] = useState(false);
  const { t } = useTranslation(parentTranslationPath);
  
  const lookupGetServices = useCallback(async () => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: Lookups.Servicesoffered,
    });
    setloadings(false);
    setServices(result);
  }, []);
  useEffect(() => {
    lookupGetServices();
  }, [lookupGetServices]);

  return (
    <div>
      <AutocompleteComponent
        idRef='ServicesofferedRef'
        labelValue='Servicesoffered'
        data={Services}
        displayLabel={(option) => option.lookupItemName || ''}
        chipsLabel={(option) => option.lookupItemName || ''}
        selectedValues={selected || []}
        getOptionSelected={(option) =>
          selected.findIndex(
            (item) => item.lookupItemId === option.lookupItemId
          ) !== -1 || ''}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Servicesofferedselectd`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isLoading={loadings}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setmaintenanceContractServices(newValue.map((x) => x.lookupItemId));
          setSelected(
            newValue &&
              newValue.map((x) => ({
                lookupItemId: x.lookupItemId,
                lookupItemName: x.lookupItemName,
              }))
          );

        }}
      />

      
    </div>
  );
};
ServicesofferedComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setmaintenanceContractServices: PropTypes.number.isRequired,
  maintenanceContractServices: PropTypes.string.isRequired,
  setSelected: PropTypes.string.isRequired,
};
