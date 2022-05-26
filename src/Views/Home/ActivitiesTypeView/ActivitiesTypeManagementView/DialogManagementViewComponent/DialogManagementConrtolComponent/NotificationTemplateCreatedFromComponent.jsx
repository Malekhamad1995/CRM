import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllTemplatesByCategoriesId } from '../../../../../../Services';
import { AssetsActivitiesTypeTypeEnum } from '../../../../../../Enums/AssetsActivitiesTypeTypeEnum.Enum';
import { RecipientTypeCoreEnum } from '../../../../../../Enums';

export const NotificationTemplateCreatedFromComponent = ({
  parentTranslationPath,
  translationPath,
  // setState,
  CreatedFromNotificationByNOT,
  stateNotification,
  setCreatedFromNotificationByData,
  setTypePrerequisites,
  Data,
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
      categoriesIds: [AssetsActivitiesTypeTypeEnum.CreatedFromNotificationTemplateCategoriesId],
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
      CreatedFromNotificationByTemplat: {
        templateId: selected.templateId,
        recipientTypeId: selected.recipientTypeId,
        activityTypeTemplateRecipientTypeSources:
          stateNotification.CreatedFromNotificationByTemplatComponent,
      },
    }));
  }, [selected.recipientTypeId, selected.templateId, setTypePrerequisites, stateNotification.CreatedFromNotificationByTemplatComponent]);


  useEffect(() => {
    if (Data) {
      const filterData =
        Data &&
        Data &&
        Data.activityTypeTemplateRecipientTypes &&
        Data.activityTypeTemplateRecipientTypes.filter(
          (obj) => obj.recipientTypeId === RecipientTypeCoreEnum.CreatedBy.key
        );

      setTypePrerequisites((item) => ({
        ...item,
        CreatedFromNotificationByTemplat: {
          templateId: filterData && filterData[0] && filterData[0].templateId,
          recipientTypeId: RecipientTypeCoreEnum.CreatedBy.key,
          activityTypeTemplateRecipientTypeSources:
            stateNotification.CreatedFromNotificationByTemplatComponent,
        },
      }));
      setSelected({
        templateId: (filterData && filterData[0] && filterData[0].templateId) || '',
        templateName: (filterData && filterData[0] && filterData[0].templateName) || '',
        recipientTypeId: RecipientTypeCoreEnum.CreatedBy.key,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='Notification-template-Created-from-AdminRef'
        labelValue='Notification-template-Created-from'
        selectedValues={selected || []}
        multiple={false}
        data={(templates && templates) || []}
        displayLabel={(option) => t(`${option.templateName || ''}`)}
        getOptionSelected={(option) => option.templateId === selected.templateId}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Select`)}
        isLoading={loadings}
        isWithError
        isDisabled={(CreatedFromNotificationByNOT.length === 0 &&
          CreatedFromNotificationByNOT.length === 0
        )}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setTypePrerequisites((item) => ({
            ...item,
            CreatedFromNotificationByTemplat: {
              templateId: newValue && +newValue.templateId,
              recipientTypeId: RecipientTypeCoreEnum.CreatedBy.key,
              activityTypeTemplateRecipientTypeSources:
                stateNotification.CreatedFromNotificationByTemplatComponent,
            },
          }));
          setSelected({
            templateId: (newValue && +newValue.templateId) || '',
            templateName: (newValue && newValue.templateName) || '',
            recipientTypeId: RecipientTypeCoreEnum.CreatedBy.key,
          });
          setCreatedFromNotificationByData(((newValue === null) && []) || [newValue.templateId]);
        }}
      />
    </div>
  );
};
NotificationTemplateCreatedFromComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};
