import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllTemplatesByCategoriesId } from '../../../../../../Services';
import { AssetsActivitiesTypeTypeEnum } from '../../../../../../Enums/AssetsActivitiesTypeTypeEnum.Enum';
import { RecipientTypeCoreEnum } from '../../../../../../Enums';

export const NotificationTemplateSuperAdminComponent = ({
  parentTranslationPath,
  translationPath,
  setState,
  state,
  setSuperAdminData,
  stateNotification,
  TypePrerequisites,
  setTypePrerequisites,
  Data,
  SuperAdminnNOT,
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
      categoriesIds: [AssetsActivitiesTypeTypeEnum.SuperAdminNotificationTemplateCategoriesId],
    });
    if (!((res && res.data && res.data.ErrorId) || !res)) setTemplates(res.result || []);
    else setTemplates([]);
    setloadings(false);
  }, [filter]);

  useEffect(() => {
    getAllTemplatesByCategoriesId();
  }, []);


  useEffect(() => {
    setTypePrerequisites((item) => ({
      ...item,
      SuperAdminTemplat: {
        templateId: selected.templateId,
        recipientTypeId: selected.recipientTypeId,
        activityTypeTemplateRecipientTypeSources: stateNotification.NotificationSuperAdminComponent,
      },
    }));
  }, [selected.templateId, stateNotification.NotificationSuperAdminComponent]);


  useEffect(() => {
    if (Data) {
      const filterData =
        Data &&
        Data &&
        Data.activityTypeTemplateRecipientTypes &&
        Data.activityTypeTemplateRecipientTypes.filter(
          (obj) => obj.recipientTypeId === RecipientTypeCoreEnum.SuperAdmin.key
        );

      setTypePrerequisites((item) => ({
        ...item,
        lineManagerTemplat: {
          templateId: filterData && filterData[0] && filterData[0].templateId,
          recipientTypeId: RecipientTypeCoreEnum.SuperAdmin.key,
          activityTypeTemplateRecipientTypeSources:
            stateNotification.NotificationSuperAdminComponent,
        },
      }));
      setSelected({
        templateId: (filterData && filterData[0] && filterData[0].templateId) || '',
        templateName: (filterData && filterData[0] && filterData[0].templateName) || '',
        recipientTypeId: RecipientTypeCoreEnum.SuperAdmin.key,
      });
    }
  }, [Data]);


  return (
    <div>
      <AutocompleteComponent
        idRef='Notification-template-Super-AdminRef'
        labelValue='Notification-template-Super-Admin'
        selectedValues={selected || []}
        multiple={false}
        isLoading={loadings}
        data={(templates && templates) || []}
        displayLabel={(option) => t(`${option.templateName || ''}`)}
        getOptionSelected={(option) => option.templateId === selected.templateId}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Select`)}
        isLoading={loadings}
        isDisabled={(SuperAdminnNOT.length === 0 &&
          SuperAdminnNOT.length === 0
        )}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setTypePrerequisites((item) => ({
            ...item,
            SuperAdminTemplat: {
              templateId: newValue && +newValue.templateId,
              recipientTypeId: RecipientTypeCoreEnum.SuperAdmin.key,
              activityTypeTemplateRecipientTypeSources:
                stateNotification.NotificationSuperAdminComponent,
            },
          }));
          setSelected({
            templateId: (newValue && +newValue.templateId) || '',
            templateName: (newValue && newValue.templateName) || '',
            recipientTypeId: RecipientTypeCoreEnum.SuperAdmin.key,
          });
          setSuperAdminData(
           ((newValue === null) && []) || [newValue.templateId]
          );
        }}
      />
    </div>
  );
};
NotificationTemplateSuperAdminComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  stateNotification: PropTypes.func.isRequired,
};
