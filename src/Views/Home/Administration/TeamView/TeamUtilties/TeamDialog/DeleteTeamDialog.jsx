import React from 'react';
import {
  Button, DialogTitle, DialogActions, Dialog
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { showSuccess } from '../../../../../../Helper';
import { DeleteTeamServices } from '../../../../../../Services/Team';
import { Spinner } from '../../../../../../Components';

const DeleteTeamDialog = (props) => {
  const { t } = useTranslation('TeamView');
  const [loading, setloading] = React.useState(false);
  return (
    <Dialog className='delete-team-dialog' open={props.open} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        {t('DeleteDialog.Alarm')}
        {'  '}
        {props.name}
      </DialogTitle>
      <DialogActions>
        <Spinner isActive={loading} />
        <Button className='btns theme-solid bg-cancel' onClick={() => props.close()}>
          {t('DeleteDialog.Cancel')}
        </Button>
        <Button
          className='btns theme-solid'
          onClick={async () => {
            setloading(true);
            const res = await DeleteTeamServices(props.deletedId);
            if (!(res && res.status && res.status !== 200))
              showSuccess(t('DeleteDialog.NotificationDeleteTeam'));


            props.close();
            setloading(false);
            props.reloadData();
          }}
          variant='contained'
        >
          {t('DeleteDialog.Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteTeamDialog;
