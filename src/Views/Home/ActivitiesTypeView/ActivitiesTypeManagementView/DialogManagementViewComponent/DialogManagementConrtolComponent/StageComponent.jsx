import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';

export const StageComponent = ({
  parentTranslationPath,
  translationPath,
  helperText,
  setState,
  Data,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [StageRES, setStageRES] = useState({});
  const [loadings, setloadings] = useState(false);
  const [selected, setSelected] = useState([]);


  const lookupGetStage = useCallback(async () => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: 34, // Lookups.Servicesoffered,
    });
    setloadings(false);
    setStageRES(result);
  }, []);
  useEffect(() => {
    lookupGetStage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Data) {
      setSelected({
        lookupItemId: (Data && Data.leadStageId) || '',
        lookupItemName: (Data && Data.leadStageName) || '',
      });
    }
    setState(Data && Data.leadStageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);
  return (
    <div>
      <AutocompleteComponent
        idRef='StageRef'
        labelValue='Stage'
        labelClasses='Requierd-Color'
        selectedValues={selected || []}
        multiple={false}
        data={StageRES || []}
        displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
        getOptionSelected={(option) => option.lookupItemId === selected.lookupItemId}
        withoutSearchButton
        isLoading={loadings}
        helperText={helperText}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setState(newValue && +newValue.lookupItemId);
          setSelected({
            lookupItemId: (newValue && +newValue.lookupItemId) || '',
            lookupItemName: (newValue && newValue.lookupItemName) || '',
          });
        }}
      />
    </div>
  );
};
StageComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};
