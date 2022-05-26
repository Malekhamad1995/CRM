import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllTemplatesByCategoriesId } from '../../../../../../Services';
import { AssetsActivitiesTypeTypeEnum } from '../../../../../../Enums/AssetsActivitiesTypeTypeEnum.Enum';
import { RecipientTypeCoreEnum } from '../../../../../../Enums';

export const AssignNotificationTemplateComponent = ({
  parentTranslationPath,
  translationPath,
  setState,
  stateNotification,
  state,
  AssigntoNOT,
  Data,
  setTypePrerequisites,
  setAssigntoData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selected, setSelected] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadings, setloadings] = useState(false);
  const [filter] = useState(
    {
      pageIndex: 0,
      pageSize: 9999,
    }
  );

  const getAllTemplatesByCategoriesId = useCallback(async () => {
    setloadings(true);
    const res = await GetAllTemplatesByCategoriesId({
      ...filter,
      categoriesIds: [AssetsActivitiesTypeTypeEnum.AssignToNotificationTemplateCategoriesId],
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
      AssignToTemplat: {
        templateId: selected.templateId,
        recipientTypeId: selected.recipientTypeId,
        activityTypeTemplateRecipientTypeSources:
          stateNotification.CreatedFromNotificationByComponent
      },
    }));
  }, [selected.templateId, stateNotification.CreatedFromNotificationByComponent]);

  useEffect(() => {
    if (Data) {
      const filterData =
        Data &&
        Data &&
        Data.activityTypeTemplateRecipientTypes &&
        Data.activityTypeTemplateRecipientTypes.filter(
          (obj) => obj.recipientTypeId === RecipientTypeCoreEnum.AssignTo.key
        );

      setTypePrerequisites((item) => ({
        ...item,
        AssignToTemplat: {
          templateId: filterData && filterData[0] && filterData[0].templateId,
          recipientTypeId: RecipientTypeCoreEnum.AssignTo.key,
          activityTypeTemplateRecipientTypeSources:
            stateNotification.lineManagerNotificationTemplateComponent,
        },
      }));
      setSelected({
        templateId: (filterData && filterData[0] && filterData[0].templateId) || '',
        templateName: (filterData && filterData[0] && filterData[0].templateName) || '',
        recipientTypeId: RecipientTypeCoreEnum.AssignTo.key,
      });
    }
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='Assign-Notification-templateRef'
        labelValue='Assign-Notification-template'
        selectedValues={selected || []}
        multiple={false}
        data={(templates && templates) || []}
        displayLabel={(option) => t(`${option.templateName || ''}`)}
        getOptionSelected={(option) => option.templateId === selected.templateId}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Select`)}
        isLoading={loadings}
        isWithError
        isDisabled={(AssigntoNOT.length === 0 &&
          AssigntoNOT.length === 0
        )}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setTypePrerequisites((item) => ({
            ...item,
            AssignToTemplat: {
              templateId: newValue && +newValue.templateId,
              recipientTypeId: RecipientTypeCoreEnum.AssignTo.key,
              activityTypeTemplateRecipientTypeSources:
                stateNotification.CreatedFromNotificationByComponent,
            },
          }));
          setSelected({
            templateId: (newValue && +newValue.templateId) || '',
            templateName: (newValue && newValue.templateName) || '',
            recipientTypeId: RecipientTypeCoreEnum.AssignTo.key,
          });
          setAssigntoData(((newValue === null) && []) || [newValue.templateId]);
        }}
      />
    </div>
  );
};
AssignNotificationTemplateComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  stateNotification: PropTypes.string.isRequired,
};
