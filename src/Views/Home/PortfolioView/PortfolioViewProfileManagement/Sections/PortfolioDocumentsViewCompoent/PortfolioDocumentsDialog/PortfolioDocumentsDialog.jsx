import React, { useCallback, useEffect, useState } from 'react';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { AutocompleteComponent, UploaderComponent, Inputs } from '../../../../../../../Components';
import {
  GetParams, showError, showSuccess, getErrorByName
} from '../../../../../../../Helper';
import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../../../../Enums';
import { lookupItemsGetId, PropertyManagementDocument } from '../../../../../../../Services';
import { DocumentTitleCategory } from '../../../../../../../Enums/DocumentTitleCategory.Enum';

export const PortfolioDocumentsDialog = ({
  open,
  close,
  reloadData,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState([]);
  const [Categorys, setCategorys] = useState([]);
  const [Title, setTitle] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [state, setState] = useState({
    portfolioId: +GetParams('id'),
    workOrderId: null,
    titleId: '',
    remark: '',
    fileId: '',
    fileName: '',
  });
  const schema = Joi.object({
    fileId: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}file-is-required`,
        'string.empty': t`${translationPath}file-is-required`,
      }),
    titleId: Joi.number()
      .required()
      .messages({
        'number.base': t`${translationPath}title-is-required`,
        'number.empty': t`${translationPath}title-is-required`,
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const lookupGetCategory = useCallback(async () => {
    setLoading(true);
    const result = await lookupItemsGetId({
      lookupTypeId: DocumentTitleCategory.AttachmentCategory.value,
    });
    setCategorys(result);
    setLoading(false);
  }, []);
  const lookupGetTitle = useCallback(async (CategoryID) => {
    setisLoading(true);
    const result = await lookupItemsGetId({
      lookupParentId: CategoryID,
      lookupTypeId: DocumentTitleCategory.AttachmentTitle.value,
    });
    setTitle(result);
    setisLoading(false);
  }, []);
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    setLoading(true);
    if (!state.fileId) {
      if (currentUploadedFiles.length === 0)
        showError(t(`${translationPath}please-select-file-first`));
      else showError(t(`${translationPath}file-upload-in-progress`));
      return;
    }
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }

    const res = await PropertyManagementDocument(state);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}created-successfully`));
      close();
    } else showError(t(`${translationPath}create-failed`));
    close();
    reloadData();
  }, [close, currentUploadedFiles.length, reloadData, schema.error, state, t, translationPath]);
  useEffect(() => {
    lookupGetCategory();
  }, [lookupGetCategory]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='Documents-dialog-wrapper'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t(`${translationPath}${'AddDocuments'}`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper MAX'>
            <div className='dialog-content-item'>
              <UploaderComponent
                labelValue={t('AddDocuments')}
                labelClasses='Requierd-Color'
                accept='*'
                idRef='contactsImportRef'
                uploadedChanged={(files) =>
                  setState({
                    ...state,
                    fileId: (files.length > 0 && files[0].uuid) || null,
                    fileName: (files.length > 0 && files[0].fileName) || null,
                  })}
                allFilesChanged={(files) => setCurrentUploadedFiles(files)}
                defaultImage={DefaultImagesEnum.individual.key}
                uploaderTheme={UploaderThemesEnum.input.key}
              />
            </div>
          </div>
          <div className='dialog-content-wrapper'>
            <div className='dialog-content-item '>
              <AutocompleteComponent
                idRef='CategoryRef'
                labelValue={t('Category')}
                labelClasses='Requierd-Color'
                inputPlaceholder={t('selactCategory')}
                isLoading={Loading}
                data={Categorys && Categorys ? Categorys : []}
                displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                multiple={false}
                withoutSearchButton
                onChange={(e, newValue) => {
                  lookupGetTitle(newValue && newValue.lookupItemId ? newValue.lookupItemId : []);
                }}
              />
            </div>
            <div className='dialog-content-item'>
              <AutocompleteComponent
                idRef='TitleRef'
                isLoading={isLoading}
                labelValue={t('Title')}
                inputPlaceholder={t('selactTitle')}
                data={Title && Title ? Title : []}
                displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                multiple={false}
                withoutSearchButton
                isSubmitted={isSubmitted}
                labelClasses='Requierd-Color'
                helperText={getErrorByName(schema, 'titleId').message}
                error={getErrorByName(schema, 'titleId').error}
                isWithError
                onChange={(e, newValue) => {
                  setState({
                    ...state,
                    titleId: newValue && newValue.lookupItemId ? newValue.lookupItemId : null,
                  });
                }}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='remarkRef'
                labelValue='Remarks'
                value={state.remark || ''}
                isWithError
                multiline
                rows={7}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ ...state, remark: event.target.value });
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonBase
            className='btns theme-solid bg-cancel'
            onClick={() => {
              close();
            }}
          >
            {t(`${translationPath}cancel`)}
          </ButtonBase>
          <ButtonBase
            onClick={() => {
              saveHandler();
            }}
            className='btns theme-solid'
          >
            {t(`${translationPath}SaveDocuments`)}
          </ButtonBase>
        </DialogActions>
      </Dialog>
    </div>
  );
};
PortfolioDocumentsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
