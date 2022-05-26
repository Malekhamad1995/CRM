import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
 DialogComponent, Inputs, RadiosGroupComponent, Spinner
} from '../../../../../Components';
import { getErrorByName, showError, showSuccess } from '../../../../../Helper';
import { TemplateCategory } from '../../../../../assets/json/StaticLookupsIds.json';
import { ApplicationServicesAutocomplete, TemplatesLookupsAutocomplete } from './Controls';
import { TemplatesTypesEnum } from '../../../../../Enums';
import {
  EmailTemplateComponent,
  SMSTemplateComponent,
  WhatsappTemplateComponent,
} from './Sections';
import { CreateTemplate, UpdateTemplate } from '../../../../../Services';

export const TemplatesManagementDialog = ({
  activeItem,
  onSave,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [state, setState] = useReducer(reducer, {
    templateName: null,
    methodName: null,
    templateCategories: [],
    templateTypeId: 2,
    templateTokens: [],
    templateFileId: '',
    templateFileName: '',
    templateText: '',
    applicationServicesId: null,
  });
  const [selected, setSelected] = useReducer(reducer, {
    templateCategories: [],
    applicationServices: null,
  });
  const onSelectedChanged = (newValue) => {
    setSelected(newValue);
  };
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const schema = Joi.object({
    templateName: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}template-name-is-required`),
        'string.empty': t(`${translationPath}template-name-is-required`),
      }),
    templateCategories: Joi.array()
      .required()
      .min(1)
      .messages({
        'array.base': t(`${translationPath}please-select-at-least-one-template-category`),
        'array.empty': t(`${translationPath}please-select-at-least-one-template-category`),
        'array.min': t(`${translationPath}please-select-at-least-one-template-category`),
      }),
    applicationServicesId: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}application-service-is-required`),
        'string.empty': t(`${translationPath}application-service-is-required`),
      }),
      // methodName: Joi.string()
      // .required()
      // .messages({
      //   'string.base': t(`${translationPath}mothod-name-is-required`),
      //   'string.empty': t(`${translationPath}mothod-name-is-required`),
      // }),
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
      (activeItem && (await UpdateTemplate(activeItem.templateId, state))) ||
      (await CreateTemplate(state));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem) showSuccess(t(`${translationPath}template-updated-successfully`));
      else showSuccess(t(`${translationPath}template-created-successfully`));
      onSave();
    } else if (activeItem) showError(t(`${translationPath}template-update-failed`));
    else showError(t(`${translationPath}template-create-failed`));
  };
  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          templateName: activeItem.templateName || null,
          methodName: activeItem.methodName || null,
          templateCategories: activeItem.templateCategories || [],
          templateTypeId: activeItem.templateTypeId || 2,
          templateTokens: activeItem.templateTokens || [],
          templateFileId: activeItem.templateFileId || '',
          templateFileName: activeItem.templateFileName || '',
          templateText: activeItem.templateText || '',
          applicationServicesId: activeItem.applicationServicesId || null,
        },
      });
    }
  }, [activeItem]);
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-template') || 'add-template'}
      saveText={(activeItem && 'edit-template') || 'add-template'}
      maxWidth='lg'
      dialogContent={(
        <div className='templates-management-dialog-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='dialog-item'>
            <Inputs
              idRef='templateNameRef'
              labelValue='template-title'
              value={state.templateName || ''}
              helperText={getErrorByName(schema, 'templateName').message}
              error={getErrorByName(schema, 'templateName').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'templateName', value: event.target.value });
              }}
            />
          </div>
          <div className='dialog-item'>
            <Inputs
              idRef='methodNameRef'
              labelValue='method-name'
              value={state.methodName || ''}
              helperText={getErrorByName(schema, 'methodName').message}
              error={getErrorByName(schema, 'methodName').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'methodName', value: event.target.value });
              }}
            />
          </div>
          <div className='dialog-item'>
            <TemplatesLookupsAutocomplete
              idRef='templateCategoriesRef'
              labelValue='template-category'
              selectedValue={selected.templateCategories}
              stateValue={state.templateCategories}
              schema={schema}
              isMultiple
              lookupTypeId={TemplateCategory}
              isSubmitted={isSubmitted}
              stateKey='templateCategories'
              selectedKey='templateCategories'
              onSelectedChanged={onSelectedChanged}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className='dialog-item'>
            <ApplicationServicesAutocomplete
              idRef='applicationServicesRef'
              labelValue='application-service'
              selectedValue={selected.applicationServices}
              stateValue={state.applicationServicesId}
              schema={schema}
              isMultiple
              isSubmitted={isSubmitted}
              stateKey='applicationServicesId'
              selectedKey='applicationServices'
              onSelectedChanged={onSelectedChanged}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className='dialog-item'>
            <RadiosGroupComponent
              idRef='templateTypeRef'
              data={Object.values(TemplatesTypesEnum)}
              value={state.templateTypeId}
              labelValue='template-type'
              labelInput='value'
              valueInput='key'
              parentTranslationPath={parentTranslationPath}
              translationPathForData={translationPath}
              translationPath={translationPath}
              onSelectedRadioChanged={(event, newValue) => {
                setState({ id: 'templateTypeId', value: +newValue });
                setState({ id: 'templateFileId', value: '' });
                setState({ id: 'templateFileName', value: '' });
                setState({ id: 'templateText', value: '' });
              }}
            />
          </div>
          {state.templateTypeId === TemplatesTypesEnum.SMS.key && (
            <SMSTemplateComponent
              state={state}
              schema={schema}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {state.templateTypeId === TemplatesTypesEnum.Whatsapp.key && (
            <WhatsappTemplateComponent
              state={state}
              schema={schema}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {state.templateTypeId === TemplatesTypesEnum.Email.key && (
            <EmailTemplateComponent
              state={state}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
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

TemplatesManagementDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TemplatesManagementDialog.defaultProps = {
  activeItem: null,
};
