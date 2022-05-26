import React, {
  useCallback, useEffect, useState, useReducer
} from 'react';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import Joi from 'joi';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent, UploaderComponent, Inputs } from '../../../../../../../Components';
import {
  GetParams, showError, showSuccess, getErrorByName
} from '../../../../../../../Helper';
import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../../../../Enums';
import { GetAllIncidents, incidentDocument, lookupItemsGetId } from '../../../../../../../Services';
import { DocumentTitleCategory } from '../../../../../../../Enums/DocumentTitleCategory.Enum';

export const AssetsDocumentsDialog = ({
  reloadData,
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [Categorys, setCategorys] = useState([]);
  const [Title, setTitle] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [IsLoadingIncident, setIsLoadingIncident] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const defaultState = {
    titleId: '',
    remark: '',
    fileId: '',
    assetId: +GetParams('id'),
    fileName: '',
  };
  const [state, setState] = useReducer(reducer, defaultState);
  const schema = Joi.object({
    titleId: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}imageName-is-required`,
        'string.empty': t`${translationPath}imageName-is-required`,
      }),

    fileId: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}imageId-is-required`,
        'string.empty': t`${translationPath}imageId-is-required`,
      }),
    fileName: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}fileName-is-required`,
        'string.empty': t`${translationPath}imageId-is-required`,
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const [filter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [Incidents, setIncidents] = useState({
    result: [],
    totalCount: 0,
  });

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
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setLoading(false);
      return;
    }
    const res = await incidentDocument(state);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}created-successfully`));
      close();
      reloadData();
    } else showError(t(`${translationPath}create-failed`));
  }, [close, reloadData, schema.error, state, t, translationPath]);

  useEffect(() => {
    lookupGetCategory();
  }, [lookupGetCategory]);

  const GetAllIncidentsAPi = useCallback(async () => {
    setIsLoadingIncident(true);
    const res = await GetAllIncidents(filter);
    if (!(res && res.status && res.status !== 200)) {
      setIncidents({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setIncidents({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoadingIncident(false);
  }, [filter]);

  useEffect(() => {
    GetAllIncidentsAPi();
  }, [GetAllIncidentsAPi]);

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
                uploadedChanged={(files) => {
                  setState({
                    id: 'fileId',
                    value: (files.length > 0 && files[0].uuid) || null,
                  });
                  setState({
                    id: 'fileName',
                    value: (files.length > 0 && files[0].fileName) || null,
                  });
                }}
                defaultImage={DefaultImagesEnum.individual.key}
                uploaderTheme={UploaderThemesEnum.input.key}
              />
            </div>
            <div className='dialog-content-item '>
              <AutocompleteComponent
                idRef='PortfolioRef'
                labelClasses='Requierd-Color'
                labelValue={t('Portfolio')}
                isLoading={IsLoadingIncident}
                inputPlaceholder={t('selactPortfolio')}
                data={Incidents.result && Incidents.result ? Incidents.result : []}
                displayLabel={(option) => (option.portfolioName && option.portfolioName) || ''}
                multiple={false}
                withoutSearchButton
                onChange={(e, newValue) => {
                  setState({
                    id: 'fileId',
                    value: (newValue && newValue.incidentId) || null,
                  });
                }}
                isWithError
                isSubmitted={isSubmitted}
                helperText={
                  getErrorByName(schema, 'fileId').message
                }
                error={getErrorByName(schema, 'fileId').error}
              />
            </div>
          </div>
          <div className='dialog-content-wrapper'>
            <div className='dialog-content-item '>
              <AutocompleteComponent
                idRef='CategoryRef'
                labelValue={t('Category')}
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
                labelClasses='Requierd-Color'
                isLoading={isLoading}
                labelValue={t('Title')}
                inputPlaceholder={t('selactTitle')}
                data={Title && Title ? Title : []}
                displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                multiple={false}
                withoutSearchButton
                onChange={(e, newValue) => {
                  setState({
                    id: 'titleId',
                    value: (newValue && newValue.lookupItemId) || null,
                  });
                }}
                isWithError
                isSubmitted={isSubmitted}
                helperText={
                  getErrorByName(schema, 'titleId').message
                }
                error={getErrorByName(schema, 'titleId').error}
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
                  setState({
                    id: 'remark',
                    value: event.target.value || null,
                  });
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

AssetsDocumentsDialog.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
