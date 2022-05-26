import React from 'react';
import {
 Button, DialogTitle, DialogActions, Dialog
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { showSuccess } from '../../../../../../Helper';
import { DeleteViews } from '../../../../../../Services/UsersDataViewingServices';

const DeleteDialog = (props) => {
  const { t } = useTranslation('UserDataView');
  const handleDeleteButton = async () => {
    await DeleteViews(props.deletedId);
    props.close();
    props.reloadData();
    showSuccess(
      t('DeleteDialog.NotificationDeleteGroup')
    );
  };
  return (
    <Dialog
      open={props.open}
      aria-labelledby="form-dialog-title"
      className="Dialogteam"
    >
      <DialogTitle id="form-dialog-title">
        {t('DeleteDialog.DeleteText')}
        {' '}
        {props.name}
        ?
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={() => props.close()}
          className="btns theme-solid bg-cancel"
          color="primary"
        >
          {t(
            'DeleteDialog.Cancel'
          )}
        </Button>
        <Button
          variant="contained"
          className="btns theme-solid"
          onClick={handleDeleteButton}
        >
          {t(
            'DeleteDialog.Confirm'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { DeleteDialog };
