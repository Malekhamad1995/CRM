import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { DialogComponent, Inputs, Spinner } from '../../../../../../../../../../../Components';
import { getErrorByName, showError, showSuccess } from '../../../../../../../../../../../Helper';
import {
  UpdateMarketingTemplate,
  CreateMarketingTemplate,
} from '../../../../../../../../../../../Services';

export const Template = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    templateName: null,
    templateText: null,
  });
  const schema = Joi.object({
    templateName: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}template-name-is-required`),
        'string.empty': t(`${translationPath}template-name-is-required`),
      }),
    templateText: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}template-description-is-required`),
        'string.empty': t(`${translationPath}template-description-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res =
      (activeItem && activeItem.id && (await UpdateMarketingTemplate(activeItem.id, state))) ||
      (await CreateMarketingTemplate(state));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem && activeItem.id)
        showSuccess(t(`${translationPath}marketing-template-updated-successfully`));
      else showSuccess(t(`${translationPath}marketing-template-created-successfully`));
      onSave();
    } else if (activeItem && activeItem.id)
      showError(t(`${translationPath}marketing-template-update-failed`));
    else showError(t(`${translationPath}marketing-template-create-failed`));
  };
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-marketing-template') || 'add-marketing-template'}
      saveText={(activeItem && 'edit-marketing-template') || 'add-marketing-template'}
      dialogContent={(
        <div className='marketing-template-management-dialog view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='dialog-item'>
            <Inputs
              idRef='templateNameRef'
              labelValue='template-name'
              value={state.templateName || ''}
              helperText={getErrorByName(schema, 'templateName').message}
              error={getErrorByName(schema, 'templateName').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                const { value } = event.target;
                setState((items) => ({ ...items, templateName: value }));
              }}
            />
          </div>
          <div className='w-100'>
            <Inputs
              idRef='templateTextRef'
              labelValue='template-description'
              value={state.templateText || ''}
              helperText={getErrorByName(schema, 'templateText').message}
              error={getErrorByName(schema, 'templateText').error}
              isWithError
              isSubmitted={isSubmitted}
              multiline
              rows={6}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                const { value } = event.target;
                setState((items) => ({ ...items, templateText: value }));
              }}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

Template.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
Template.defaultProps = {
  activeItem: null,
};
