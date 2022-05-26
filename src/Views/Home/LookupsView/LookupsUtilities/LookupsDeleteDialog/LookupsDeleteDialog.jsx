import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

const translationPath = 'DeleteDialog.';

export const LookupsDeleteDialog = (props) => {
  const { t } = useTranslation('LookupsView');
  return (
    <Dialog
      open={props.open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      onClose={() => {
      props.setOpen(false);
    }}
    >
      <form
        noValidate
        onSubmit={(event) => {
        event.preventDefault();
        props.setOpen(false);
        props.onDelete(props.row);
      }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          {t(`${translationPath}DeleteLookupItem`)}
          {' '}
          {props.name}
        </DialogTitle>
        <DialogContent>
          {t(`${translationPath}ConfirmText`)}
          {' '}
          {props.name}
          ?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
            props.setOpen(false);
            props.onCancel();
          }}
            className="btns theme-solid bg-cancel"
          >
            {t(`${translationPath}Cancel`)}
          </Button>
          <Button className="btns theme-solid" type="submit">
            {t(`${translationPath}Delete`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
);
};
