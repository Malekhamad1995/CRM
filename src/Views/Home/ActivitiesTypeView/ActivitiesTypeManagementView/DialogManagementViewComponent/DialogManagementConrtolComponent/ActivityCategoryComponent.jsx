import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';
import { AssetsActivitiesTypeTypeEnum } from '../../../../../../Enums/AssetsActivitiesTypeTypeEnum.Enum';

export const ActivityCategoryComponent = ({
  parentTranslationPath,
  translationPath,
  setState,
  helperText,
  Data,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [ActivityCategoryres, setActivityCategoryres] = useState({});
  const [loadings, setloadings] = useState(false);
  const [selected, setSelected] = useState([]);

  const lookupActivityCategory = useCallback(async () => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: AssetsActivitiesTypeTypeEnum.lookupActivityCategory,
    });
    setloadings(false);
    setActivityCategoryres(result);
  }, []);
  useEffect(() => {
    lookupActivityCategory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Data) {
      setSelected({
        lookupItemId: (Data && Data.categoryId) || '',
        lookupItemName: (Data && Data.categoryName) || '',
      });
    }
    setState(Data && Data.categoryId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='MaintenanceCompanyRef'
        labelValue='Activity-category'
        labelClasses='Requierd-Color'
        selectedValues={selected || []}
        multiple={false}
        data={ActivityCategoryres || []}
        displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
        getOptionSelected={(option) => option.lookupItemId === selected.lookupItemId}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Activity-category`)}
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
ActivityCategoryComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  setState: PropTypes.number.isRequired,
};
