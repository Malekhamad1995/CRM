import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Grid,
} from '@material-ui/core';
import { PostTeamServices } from '../../../../../../Services/Team';
import { showSuccess } from '../../../../../../Helper';

export const AddTeamTreeDialog = (props) => {
  const { t } = useTranslation('TeamView');
  const [teamName, setteamName] = React.useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await PostTeamServices({
      teamsName: teamName,
      businessGroupsId: parseInt(props.businessGroupsid),
    });
    props.close() || setteamName('');
    props.reloadData();
    showSuccess(t('AddTeamDialog.NotificationAddTeam'));
  };

  return (
    <Dialog
      className='add-team-dialog-wrapper'
      open={props.open}
      onClose={props.close}
      aria-labelledby='form-dialog-title'
    >
      <form noValidate onSubmit={handleSave}>
        <DialogTitle id='form-dialog-title'>
          {t('AddTeamDialog.BusinessGroupin')}
          {' '}
          {props.name}
        </DialogTitle>
        <DialogContent>
          <Grid container className='input-wrapper'>
            <Grid item xs={12} className='mb-3'>
              <label className='label-wrapper'>{t('AddTeamDialog.TeamName')}</label>
              <div className='text-field-wrapper'>
                <TextField
                  className='inputs theme-solid  theme-form-builder'
                  id='name'
                  value={teamName}
                  onChange={(e) => setteamName(e.target.value)}
                  fullWidth
                  size='small'
                  variant='outlined'
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close || setteamName('')} className='btns theme-solid bg-cancel'>
            {t('AddTeamDialog.Cancel')}
          </Button>
          <Button
            disabled={teamName === ''}
            onClick={handleSave}
            variant='contained'
            className='btns theme-solid'
          >
            {t('AddTeamDialog.Add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
