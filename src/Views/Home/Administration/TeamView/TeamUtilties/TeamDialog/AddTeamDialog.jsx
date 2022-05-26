/* eslint-disable no-unused-expressions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
 Button, DialogTitle, DialogContent, DialogActions, Dialog, Grid
} from '@material-ui/core';
import { AutocompleteComponent } from '../../../../../../Components/Controls';
import { showSuccess } from '../../../../../../Helper';
import { GetBusinessGroups } from '../../../../../../Services/BusinessGroupsServices';
import { PostTeamServices, EditTeamServices } from '../../../../../../Services/Team';
import { Inputs } from '../../../../../../Components/Controls/Inputs/Inputs';

const AddTeamDialog = (props) => {
  const { t } = useTranslation('TeamView');
  const [teamName, setteamName] = React.useState('');
  const [parentId, setParentId] = React.useState('');
  const [response, setResponse] = React.useState({});
  const searchTimer = useRef(null);

  const GetMyGroups = async (pageIndex, PageSize, searchedItem) => {
    const res = await GetBusinessGroups(pageIndex, PageSize, searchedItem);
    if (res) setResponse(res);
  };

  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      GetMyGroups(1, 30, value);
    }, 700);
  };

  return (
    <Dialog open={props.open} keepMounted className='add-team-dialog-wrapper'>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          props.setOpen(false);
        }}
      >
        <DialogTitle className='DialogTitle'>
          {props.isEdit ? t('EditTeamDialog.EditTeam') : t('AddTeamDialog.AddTeam')}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} className='mb-3'>
              <Inputs
                value={props.isEdit ? props.groupName : teamName}
                idRef='teamName'
                labelValue={t('EditTeamDialog.Team')}
                onInputChanged={(e) => {
                  props.isEdit ? props.setGroupName(e.target.value) : setteamName(e.target.value);
                }}
              />
              {/* <FormControl className='input-wrapper'>
                <label className='label-wrapper'>{t('EditTeamDialog.Team')}</label>
                <div className='text-field-wrapper'>
                  <TextField
                    value={props.isEdit ? props.groupName : teamName}
                    fullWidth
                    className='inputs theme-solid'
                    size='small'
                    variant='outlined'
                    onChange={(e) => {
                      props.isEdit
                        ? props.setGroupName(e.target.value)
                        : setteamName(e.target.value);
                    }}
                  />
                </div>
              </FormControl> */}
            </Grid>
            <Grid item xs={12} className='mb-3'>
              <AutocompleteComponent
                idRef='nationalityRef'
                labelValue={t('AddTeamDialog.BusinessGroup')}
                inputPlaceholder={t('AddTeamDialog.BusinessGroup')}
                data={response && response.result ? response.result : []}
                displayLabel={(option) =>
                  (option.businessGroupsName && option.businessGroupsName) || ''}
                multiple={false}
                withoutSearchButton
                onChange={(e, newValue) => {
                  if (newValue && newValue.businessGroupsId) {
                    if (props.isEdit) {
                      props.setGroupParentId(newValue.businessGroupsId);
                      props.setGroupParent(newValue.businessGroupsName);
                    } else setParentId(newValue.businessGroupsId);
                  } else setParentId('');
                }}
                onInputKeyUp={(e) => searchHandler(e)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            className='btns theme-solid bg-cancel'
            onClick={() => {
              props.setTreeGroup(false);
              props.close() || setteamName('');
              props.setIsEdit(false);
            }}
          >
            {t('AddTeamDialog.Cancel')}
          </Button>
          <Button
            disabled={props.isEdit ? false : !!(teamName === '' || parentId === '')}
            className='btns theme-solid'
            onClick={async () => {
              if (props.isEdit) {
                await EditTeamServices(props.teamId, {
                  teamsName: props.groupName,
                  businessGroupsId: +props.groupParentId,
                });
              }
              if (!props.isEdit) {
                await PostTeamServices({
                  teamsName: teamName,
                  businessGroupsId: +parentId,
                });
              }
              props.setTreeGroup(false);
              props.setIsEdit(false);
              props.close() || setteamName('');
              props.reloadData();
              props.reloadDatalist();
              showSuccess(t('AddTeamDialog.NotificationAddTeam'));
            }}
            variant='contained'
          >
            {props.isEdit ? t('EditTeamDialog.EditTeam') : t('AddTeamDialog.Add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTeamDialog;
