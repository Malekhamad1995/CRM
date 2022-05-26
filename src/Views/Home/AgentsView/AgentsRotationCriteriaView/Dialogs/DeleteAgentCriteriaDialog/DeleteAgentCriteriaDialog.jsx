import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

export const DeleteAgentCriteriaDialog = ({
  parentTranslationPath,
  translationPath,
  setOpen,
  onDelete,
  onCancel,
  item,
  open,
  name,
}) => {
  const { t } = useTranslation('Agents');
  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      onClose={() => {
        setOpen(false);
      }}
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(false);
          onDelete(item);
        }}
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t('Delete-Criteria')}
          {' '}
          {name}
        </DialogTitle>
        <DialogContent>
          {t(`${translationPath}ConfirmText`)}
          ?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onCancel();
            }}
            className='btns theme-solid bg-cancel'
          >
            {t(`${translationPath}Cancel`)}
          </Button>
          <Button className='btns theme-solid' type='submit'>
            {t(`${translationPath}Delete`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
