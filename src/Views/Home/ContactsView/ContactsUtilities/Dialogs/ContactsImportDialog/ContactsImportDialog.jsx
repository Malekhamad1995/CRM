import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
 DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import { UploaderComponent, RadiosGroupComponent, Spinner } from '../../../../../../Components';

import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../../../Enums';
import { importFile } from '../../../../../../Services';
import { showError, showSuccess } from '../../../../../../Helper';

const translationPath = 'ContactsView:utilities.contactsImportDialog.';
export const ContactsImportDialog = ({ isOpen, isOpenChanged }) => {
  const { t } = useTranslation('ContactsView');
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
    importProcceseType: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState([]);

  const onSubmit = async () => {
    // event.preventDefault();
    if (!state.fileId) {
      if (currentUploadedFiles.length === 0)
        showError(t(`${translationPath}please-select-file-first`));
      else showError(t(`${translationPath}file-upload-in-progress`));
      return;
    }
    setIsLoading(true);
    const response = await importFile(state);
    if (response) showSuccess(t(`${translationPath}contact-file-sent-successfully`));
    else showError(t(`${translationPath}contact-file-sending-failed`));
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
          {t(`${translationPath}import-contacts`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper'>
            <Spinner isActive={isLoading} isAbsolute />
            <div className='dialog-content-item w-100'>
              <UploaderComponent
                idRef='contactsImportRef'
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                uploadedChanged={(files) => {
                  setState({
                    id: 'fileId',
                    value: (files && files.length > 0 && files[0].uuid) || null,
                  });
                }}
                allFilesChanged={(files) => setCurrentUploadedFiles(files)}
                defaultImage={
                  (state.importProcceseType === 1 && DefaultImagesEnum.individual.key) ||
                  DefaultImagesEnum.corporate.key
                }
                uploaderTheme={UploaderThemesEnum.box.key}
              />
            </div>
            <div className='dialog-content-item w-100'>
              <RadiosGroupComponent
                idRef='contactTypeRadioGroupRef'
                name='contactTypeRadioGroup'
                ariaLabel='contacts-type'
                data={[
                  { id: 1, name: 'individual' },
                  { id: 6, name: 'corporate' },
                ]}
                labelValue='contacts-type'
                valueInput='id'
                labelInput='name'
                translationPathForData={translationPath}
                translationPath={translationPath}
                value={state.importProcceseType}
                onSelectedRadioChanged={(event) =>
                  setState({
                    id: 'importProcceseType',
                    value: +event.target.value,
                  })}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className='form-builder-wrapper'>
            <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
              <div className='MuiGrid-root-left'>
                {state.importProcceseType === 1 && (
                  <a
                    href='/files/IndividualContact.xlsx'
                    download='Individual Contact'
                    className='MuiButtonBase-root MuiButton-root MuiButton-text btns c-danger'
                  >
                    <span className='MuiButton-label'>
                      <span className='mx-2'>{t(`${translationPath}download`)}</span>
                    </span>
                  </a>
                )}
                {state.importProcceseType === 6 && (
                  <a
                    href='/files/CompanyContact.xlsx'
                    download='Company Contact'
                    className='MuiButtonBase-root MuiButton-root MuiButton-text btns c-danger'
                  >
                    <span className='MuiButton-label'>
                      <span className='mx-2'>{t(`${translationPath}download`)}</span>
                    </span>
                  </a>
                )}
              </div>
              <div className='MuiGrid-root-right'>
                <ButtonBase
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns'
                  tabindex='0'
                  onClick={() => {
                    isOpenChanged();
                  }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>{t(`${translationPath}cancel`)}</span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>
                <ButtonBase
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns theme-solid bg-primary'
                  onClick={() => onSubmit()}
                  tabindex='0'
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>{t(`${translationPath}import`)}</span>
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

ContactsImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
};
