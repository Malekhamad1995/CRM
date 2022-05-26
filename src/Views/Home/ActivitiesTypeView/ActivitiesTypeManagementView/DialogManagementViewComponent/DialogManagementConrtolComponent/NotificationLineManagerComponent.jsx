import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { RecipientTypeCoreEnum, ReminderTypeEnum } from '../../../../../../Enums';

export const NotificationLineManagerComponent = ({
  parentTranslationPath,
  translationPath,
  setStateNotification,
  Data,
  setlineManagerNOT
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    if (Data) {
      const filterData =
        Data &&
        Data &&
        Data.activityTypeTemplateRecipientTypes &&
        Data.activityTypeTemplateRecipientTypes.filter(
          (obj) => obj.recipientTypeId === RecipientTypeCoreEnum.LineManager.key
        );

      setStateNotification(
        filterData &&
        filterData[0] &&
        filterData[0] &&
        filterData[0].activityTypeTemplateRecipientTypeSources &&
        filterData[0].activityTypeTemplateRecipientTypeSources.map((x) => ({
          notifyBy: x.notifyById,
        }))
      );
      setSelected(
        filterData &&
        filterData[0] &&
        filterData[0] &&
        filterData[0].activityTypeTemplateRecipientTypeSources &&
        filterData[0].activityTypeTemplateRecipientTypeSources.map((x) => ({
          key: x.notifyById,
          value:
            Object.values(ReminderTypeEnum).findIndex(
              (element) => element.key === x.notifyById
            ) !== -1 &&
            Object.values(ReminderTypeEnum).find((element) => element.key === x.notifyById).value,
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='Notification-by-Created-fromRef'
        labelValue='Notification-line-Manager'
        selectedValues={selected || []}
        multiple
        data={Object.values(ReminderTypeEnum) || []}
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
          setStateNotification(
            newValue &&
            newValue.map((x) => ({
              notifyBy: x.key,
            }))
          );
          setlineManagerNOT(
            newValue &&
            newValue.map((x) => ({
              key: x.key,
              value: x.value,
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

NotificationLineManagerComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setStateNotification: PropTypes.func.isRequired,
};
