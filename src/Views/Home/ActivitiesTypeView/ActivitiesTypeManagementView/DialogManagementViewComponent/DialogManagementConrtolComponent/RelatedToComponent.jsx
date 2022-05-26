import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { ActivitiesRelatedToActivitiesTypeEnum } from '../../../../../../Enums';

export const RelatedToComponent = ({
 parentTranslationPath, translationPath, setState, Data
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selected, setSelected] = useState([]);
  // relatedTo: Array(1)
  // 0: {activityTypeId: 420, relatedToId: 0, relatedToName: "0"
  useEffect(() => {
    if (Data) {
      setSelected(
        Data &&
          Data &&
          Data.relatedTo &&
          Data.relatedTo.map((x) => ({
            key: x.relatedToId,
            value:
              Object.values(ActivitiesRelatedToActivitiesTypeEnum).findIndex(
                (element) => element.key === x.relatedToId
              ) !== -1 &&
              Object.values(ActivitiesRelatedToActivitiesTypeEnum).find(
                (element) => element.key === x.relatedToId
              ).value,
          }))
      );
    }
    setState(
      Data &&
        Data &&
        Data.relatedTo &&
        Data.relatedTo.map((x) => ({
          relatedToId: x.activityTypeId,
        }))
    );
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='RelatedtoRef'
        labelValue='Relatedto'
        selectedValues={selected || []}
        multiple
        labelClasses='Requierd-Color'
        data={Object.values(ActivitiesRelatedToActivitiesTypeEnum) || []}
        chipsLabel={(option) => t(`${option.value || ''}`)}
        displayLabel={(option) => t(`${option.value || ''}`)}
        getOptionSelected={(option) =>
          selected.findIndex((item) => item.key === option.key) !== -1 || ''}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Select-multiple`)}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setState(
            newValue &&
              newValue.map((x) => ({
                relatedToId: x.key,
              }))
          );
          setSelected(
            newValue &&
              newValue.map((x) => ({
                key: x.key,
                value: x.value,
              }))
          );
        }}
      />
    </div>
  );
};

RelatedToComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};
