import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'InvoicesView';
const translationPath = '';

export const InvoicesTransaction = ({
  open,
  close,
  activeItem,

}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='activities-management-dialog-wrapper'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t(`${translationPath}Invoices-transaction`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper'>
            <div className='d-flex-column-center'>
              <span className='mdi mdi-close-octagon c-danger mdi-48px' />
              <span>
                <span>{`${t('this-Invoice-status-is-unpaid-cant-be-transact')} ${((activeItem && activeItem) || '')}`}</span>
              </span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
            {t(`${translationPath}cancel`)}
          </ButtonBase>
        </DialogActions>

      </Dialog>
    </div>
  );
};

InvoicesTransaction.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
InvoicesTransaction.defaultProps = {
  activeItem: null,
};
