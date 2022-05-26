import React from 'react';
import {
  Button, DialogTitle, DialogActions, Dialog
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { DeleteBusinessGroup } from '../../../../../../Services/BusinessGroupsServices';
import { showError, showSuccess } from '../../../../../../Helper';

const DeleteDialog = (props) => {
  const { t } = useTranslation('BusinessGroupsView');
  const handleDeleteButton = async () => {
    const res = await DeleteBusinessGroup(props.deletedId);
    if ((res === undefined || res === null)) {
      props.close();
      showError(t('DeleteDialog.DELETE_RELATED_TEAMS_BEFORE_BUSINESS_GROUP'));
    } else {
      props.close();
      props.reloadData();
      showSuccess(t('DeleteDialog.NotificationDeleteGroup'));
    }
  };

  return (
    <Dialog open={props.open} className='delete-group-dialog'>
      <DialogTitle>
        {t('DeleteDialog.DeleteText')}
        {' '}
        {props.name}
        ?
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={() => props.close()}
          color='primary'
          className='btns theme-solid bg-cancel'
        >
          {t('DeleteDialog.Cancel')}
        </Button>
        <Button className='btns theme-solid' onClick={handleDeleteButton} variant='contained'>
          {t('DeleteDialog.Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
