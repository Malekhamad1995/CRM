
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';

export const ActivityReportDialogFooter = ({
  parentTranslationPath,
  translationPath,
  close,
  onSave,
  ableContinueReport
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div className='form-builder-wrapper'>
      <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
        <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
          <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
            <div className='cancel-wrapper d-inline-flex-center'>
              <ButtonBase
                className='MuiButtonBase-root MuiButtonBase-root MuiButton-root MuiButton-text btns c-danger'
                tabIndex='0'
                onClick={() => close()}
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}cancel`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </ButtonBase>
            </div>
            <div className='save-wrapper d-inline-flex-center'>
              <ButtonBase
                className='MuiButtonBase-root MuiButton-root MuiButton-text save-btn-wrapper btns theme-solid bg-primary w-100 mx-2 mb-2'
                tabIndex='0'
                disabled={ableContinueReport}
                onClick={() => {
                  onSave();
                }}
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}continue`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </ButtonBase>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ActivityReportDialogFooter.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
