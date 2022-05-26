import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { ActivityHistoryTable } from './ActivityHistoryTable';
import { Spinner } from '../../../../Components';

export const ActivityHistory = ({
  open,
  close,
  data,
  parentTranslationPath,
  translationPath,
  isLoading

}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth='lg'
        onClose={() => {
          close();
        }}
        disableBackdropClick
      >
        <Spinner isLoading={isLoading} isAbsolute />
        <DialogTitle id='alert-dialog-slide-title'>
          <span>{t(`${translationPath}activity-history`)}</span>
        </DialogTitle>
        <DialogContent className=''>
          <ActivityHistoryTable
            data={(data)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </DialogContent>
        <DialogActions>
          <div className='form-builder-wrapper'>
            <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
              <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
                <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
                  <div className='cancel-wrapper d-inline-flex-center'>
                    <ButtonBase
                      className='MuiButtonBase-root MuiButton-root MuiButton-text cancel-btn-wrapper btns theme-transparent c-primary'
                      tabIndex='0'
                      onClick={() => close()}
                    >
                      <span className='MuiButton-label'>
                        <span>{t(`${translationPath}cancel`)}</span>
                      </span>
                      <span className='MuiTouchRipple-root' />
                    </ButtonBase>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
ActivityHistory.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  isLoading: PropTypes.bool.isRequired,
};
