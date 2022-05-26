import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllTemplatesByCategoriesId } from '../../../../../../Services';
import { AssetsActivitiesTypeTypeEnum } from '../../../../../../Enums/AssetsActivitiesTypeTypeEnum.Enum';
import { RecipientTypeCoreEnum } from '../../../../../../Enums';

export const NotificationTemplatelineManagerComponent = ({
  parentTranslationPath,
  translationPath,
  // setState,
  // state,
  stateNotification,
    lineManagerNOT,
  setTypePrerequisites,
  Data,
  setlineManagerTemplatData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selected, setSelected] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadings, setloadings] = useState(false);
  const [filter] = useState(
    {
      pageIndex: 0,
      pageSize: 9999,
    },
  );

  const getAllTemplatesByCategoriesId = useCallback(async () => {
    setloadings(true);
    const res = await GetAllTemplatesByCategoriesId({
      ...filter,
      categoriesIds: [AssetsActivitiesTypeTypeEnum.lineManagerNotificationTemplateCategoriesId],
    });
    if (!((res && res.data && res.data.ErrorId) || !res)) setTemplates(res.result || []);
    else setTemplates([]);
    setloadings(false);
  }, [filter]);

  useEffect(() => {
    getAllTemplatesByCategoriesId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTypePrerequisites((item) => ({
      ...item,
      lineManagerTemplat: {
        templateId: selected.templateId,
        recipientTypeId: selected.recipientTypeId,
        activityTypeTemplateRecipientTypeSources:
          stateNotification.lineManagerNotificationTemplateComponent,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.templateId, stateNotification.lineManagerNotificationTemplateComponent]);

  useEffect(() => {
    if (Data) {
      const filterData =
        Data &&
        Data &&
        Data.activityTypeTemplateRecipientTypes &&
        Data.activityTypeTemplateRecipientTypes.filter(
          (obj) => obj.recipientTypeId === RecipientTypeCoreEnum.LineManager.key
        );

      setTypePrerequisites((item) => ({
        ...item,
        lineManagerTemplat: {
          templateId: filterData && filterData[0] && filterData[0].templateId,
          recipientTypeId: RecipientTypeCoreEnum.LineManager.key,
          activityTypeTemplateRecipientTypeSources:
            stateNotification.lineManagerNotificationTemplateComponent,
        },
      }));
      setSelected({
        templateId: (filterData && filterData[0] && filterData[0].templateId) || '',
        templateName: (filterData && filterData[0] && filterData[0].templateName) || '',
        recipientTypeId: RecipientTypeCoreEnum.LineManager.key,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='Notification-template-line-Manager-AdminRef'
        labelValue='Notification-template-line-Manager'
        selectedValues={selected || []}
        multiple={false}
        data={(templates && templates) || []}
        displayLabel={(option) => t(`${option.templateName || ''}`)}
        getOptionSelected={(option) => option.templateId === selected.templateId}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Select`)}
        isLoading={loadings}
        isDisabled={(lineManagerNOT.length=== 0 &&
          lineManagerNOT.length === 0
        )}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setTypePrerequisites((item) => ({
            ...item,
            lineManagerTemplat: {
              templateId: newValue && +newValue.templateId,
              recipientTypeId: RecipientTypeCoreEnum.LineManager.key,
              activityTypeTemplateRecipientTypeSources:
                stateNotification.lineManagerNotificationTemplateComponent,
            },
          }));
          setlineManagerTemplatData(((newValue === null) && []) || [newValue.templateId]);
          setSelected({
            templateId: (newValue && +newValue.templateId) || '',
            templateName: (newValue && newValue.templateName) || '',
            recipientTypeId: RecipientTypeCoreEnum.LineManager.key,
          });
        }}
      />
    </div>
  );
};
