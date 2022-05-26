import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { DialogComponent, Inputs } from '../../../../../../../../../../../Components';
import { getErrorByName, showError } from '../../../../../../../../../../../Helper';

export const OtherLanguages = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [state, setState] = useState({
    titleAr: null,
    descriptionAr: null,
  });
  const schema = Joi.object({
    titleAr: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}marketing-title-is-required`),
        'string.empty': t(`${translationPath}marketing-title-is-required`),
      }),
    descriptionAr: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}marketing-description-is-required`),
        'string.empty': t(`${translationPath}marketing-description-is-required`),
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
    onSave(state);
  };
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-other-languages') || 'add-other-languages'}
      saveText={(activeItem && 'edit-other-languages') || 'add-other-languages'}
      dialogContent={(
        <div className='other-languages-management-dialog view-wrapper'>
          <div className='w-100 px-2 mb-2'>
            <Inputs
              idRef='titleArRef'
              labelValue='marketing-title'
              value={state.titleAr || ''}
              helperText={getErrorByName(schema, 'titleAr').message}
              error={getErrorByName(schema, 'titleAr').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                const { value } = event.target;
                setState((items) => ({ ...items, titleAr: value }));
              }}
            />
          </div>
          <div className='w-100 px-2 mb-3'>
            <Inputs
              idRef='descriptionArRef'
              labelValue='marketing-description'
              value={state.descriptionAr || ''}
              helperText={getErrorByName(schema, 'descriptionAr').message}
              error={getErrorByName(schema, 'descriptionAr').error}
              isWithError
              isSubmitted={isSubmitted}
              multiline
              rows={6}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                const { value } = event.target;
                setState((items) => ({ ...items, descriptionAr: value }));
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

OtherLanguages.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
OtherLanguages.defaultProps = {
  activeItem: null,
};
