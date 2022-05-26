import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  ButtonBase,
} from '@material-ui/core';
import { UploaderComponent, Spinner } from '../../../../../../Components';
import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../../../Enums';
import { importFile } from '../../../../../../Services';
import { showError, showSuccess } from '../../../../../../Helper';

const translationPath = 'UnitsView:utilities.unitsImportDialog.';
export const UnitsImportDialog = ({ isOpen, isOpenChanged }) => {
  const { t } = useTranslation('UnitsView');
  const reducer = (state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    if (action.id === 'edit') {
      return {
        ...action.value,
      };
    }
    return undefined;
  };
  const [state, setState] = useReducer(reducer, {
    fileId: null,
    importProcceseType: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState([]);
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!state.fileId) {
      if (currentUploadedFiles.length === 0)
        showError(t(`${translationPath}please-select-file-first`));
      else showError(t(`${translationPath}file-upload-in-progress`));
      return;
    }
    setIsLoading(true);
    const response = await importFile(state);
    if (response)
      showSuccess(t(`${translationPath}units-file-sent-successfully`));
    else showError(t(`${translationPath}units-file-sending-failed`));
    setIsLoading(false);
    isOpenChanged();
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => {
          isOpenChanged();
        }}
        className='activities-management-dialog-wrapper'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t(`${translationPath}import-units`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper'>
            <Spinner isActive={isLoading} isAbsolute />
            <div className='dialog-content-item w-100'>
              <UploaderComponent
                idRef='unitsImportRef'
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                uploadedChanged={(files) =>
                  setState({
                    id: 'fileId',
                    value: (files && files.length > 0 && files[0].uuid) || null,
                  })}
                allFilesChanged={(files) => setCurrentUploadedFiles(files)}
                defaultImage={DefaultImagesEnum.buildings.key}
                uploaderTheme={UploaderThemesEnum.box.key}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className='form-builder-wrapper'>
            <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
              <div className='MuiGrid-root-left'>
                {state.importProcceseType === 5 && (
                <a
                  href='/files/UnitTemplate.xlsm'
                  download='Unit Template'
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns c-danger'
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}download`)}
                    </span>
                  </span>
                </a>
                  )}
              </div>
              <div className='MuiGrid-root-right'>
                <ButtonBase
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns'
                  onClick={() => {
                      isOpenChanged();
                    }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}cancel`)}
                    </span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>
                <ButtonBase
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns theme-solid bg-primary'
                  onClick={() => onSubmit()}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}import`)}
                    </span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>
              </div>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UnitsImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
};
