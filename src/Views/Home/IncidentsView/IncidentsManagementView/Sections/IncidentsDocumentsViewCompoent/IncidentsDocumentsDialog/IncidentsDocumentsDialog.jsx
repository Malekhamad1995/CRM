import React, { useCallback, useEffect, useState } from 'react';
import {
 DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent, UploaderComponent, Inputs } from '../../../../../../../Components';
import {
 GetParams, GlobalHistory, showError, showSuccess
} from '../../../../../../../Helper';
import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../../../../Enums';
import { GetAllIncidents, incidentDocument, lookupItemsGetId } from '../../../../../../../Services';
import { DocumentTitleCategory } from '../../../../../../../Enums/DocumentTitleCategory.Enum';

export const PortfolioDocumentsDialog = ({
  reloadData,
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState([]);
  const [Categorys, setCategorys] = useState([]);
  const [Title, setTitle] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [IsLoadingIncident, setIsLoadingIncident] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isAdd, setisAdd] = useState(false);
  const [state, setState] = useState({
    titleId: '',
    remark: '',
    fileId: '',
    incidentId: +GetParams('id'),
    fileName: '',
  });
  const [filter] = useState({
    pageSize: 200,
    pageIndex: 0,
  });
  const [Incidents, setIncidents] = useState({
    result: [],
    totalCount: 0,
  });

  const lookupGetCategory = useCallback(async () => {
    setLoading(true);
    {
      const result = await lookupItemsGetId({
        lookupTypeId: DocumentTitleCategory.AttachmentCategory.value,
      });

      setCategorys(result);
    }
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
    if (!state.fileId) {
      if (currentUploadedFiles.length === 0)
        showError(t(`${translationPath}please-select-file-first`));
      else showError(t(`${translationPath}file-upload-in-progress`));
      return;
    }
    if (!state.titleId) {
      if (currentUploadedFiles.length === 0)
        showError(t(`${translationPath}please-select-Category-and-title`));
      else showError(t(`${translationPath}please-select-Category-and-title`));
      return;
    }

    const res = await incidentDocument(state);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}created-successfully`));
      close();
      if (isAdd === true) GlobalHistory.push(`/home/Incidents/edit?id=${state.incidentId}`);
    } else showError(t(`${translationPath}create-failed`));
    close();
    reloadData();
  }, [close, currentUploadedFiles.length, isAdd, reloadData, state, t, translationPath]);

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

  useEffect(() => {
    if (+GetParams('id') === 0) setisAdd(true);
    else setisAdd(false);
  }, []);

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
                accept='*'
                idRef='contactsImportRef'
                labelClasses='Requierd-Color'
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
            {isAdd === true ? (
              <div className='dialog-content-item '>
                <AutocompleteComponent
                  idRef='PortfolioRef'
                  labelValue={t('Portfolio')}
                  isLoading={IsLoadingIncident}
                  inputPlaceholder={t('selactPortfolio')}
                  data={Incidents.result && Incidents.result ? Incidents.result : []}
                  displayLabel={(option) => (option.portfolioName && option.portfolioName) || ''}
                  multiple={false}
                  withoutSearchButton
                  onChange={(e, newValue) => {
                    setState({
                      ...state,
                      incidentId: newValue && newValue.incidentId ? newValue.incidentId : [],
                    });
                  }}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='dialog-content-wrapper'>
            <div className='dialog-content-item '>
              <AutocompleteComponent
                idRef='CategoryRef'
                labelClasses='Requierd-Color'
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
                isLoading={isLoading}
                labelValue={t('Title')}
                labelClasses='Requierd-Color'
                inputPlaceholder={t('selactTitle')}
                data={Title && Title ? Title : []}
                displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                multiple={false}
                withoutSearchButton
                onChange={(e, newValue) => {
                  setState({
                    ...state,
                    titleId: newValue && newValue.lookupItemId ? newValue.lookupItemId : [],
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
                  const { value } = event.target;
                  setState({ ...state, remark: value });
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
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
