/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 Button, DialogTitle, DialogContent, DialogActions, Dialog
} from '@material-ui/core';
import { AutocompleteComponent } from '../../../../../../Components/Controls';
import { showSuccess } from '../../../../../../Helper';
import { GetBusinessGroups, EditTeamServices } from '../../../../../../Services';
import { Spinner } from '../../../../../../Components';
import { Inputs } from '../../../../../../Components/Controls/Inputs/Inputs';

const EditTeamDialog = (props) => {
  const { t } = useTranslation('TeamView');
  const [loading, setloading] = useState(false);
  const [response, setResponse] = useState([]);
  const searchTimer = useRef(null);

  const GetMyGroups = async (pageIndex, PageSize, searchedItem) => {
    const res = await GetBusinessGroups(pageIndex, PageSize, searchedItem);
    if (res) setResponse(res.result);
  };
  const searchHandler = (value) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      GetMyGroups(1, 30, value);
    }, 700);
  };

  return (
    <Dialog
      className='add-team-dialog-wrapper'
      open={props.open}
      onClose={props.close}
      keepMounted
      aria-labelledby='form-dialog-title'
    >
      <Spinner isActive={loading} />
      <DialogTitle className='DialogTitle' id='form-dialog-title'>
        {t('EditTeamDialog.EditTeam')}
        {' '}
      </DialogTitle>
      <DialogContent className='mb-3'>
        <Inputs
          value={props.name}
          idRef='teamName'
          labelValue={t('EditTeamDialog.Team')}
          onInputChanged={(e) => props.setName(e.target.value)}
        />
        {/* <FormControl className='input-wrapper'>
          <label className='label-wrapper'>{t('EditTeamDialog.Team')}</label>
          <div className='text-field-wrapper'>
            <TextField
              id='name'
              fullWidth
              className='inputs theme-solid'
              size='small'
              variant='outlined'
              className='inputs theme-form-builder'
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
            />
          </div>
        </FormControl> */}
        <div htmlFor='lookupTypeName' className='form-name mt-3'>
          {t('EditTeamDialog.BusinessGroup')}
        </div>
        <AutocompleteComponent
          idRef='teamRef'
          inputPlaceholder={t('AddTeamDialog.BusinessGroup')}
          data={response || []}
          multiple={false}
          withoutSearchButton
          getOptionSelected={(option) => props.businessGroupsId === option.businessGroupsId}
          selectedValues={
            props.businessGroupsId &&
            props.response &&
            props.response.find((item) => item.businessGroupsId === props.businessGroupsId)
          }
          displayLabel={(option) => (option.businessGroupsName && option.businessGroupsName) || ''}
          onChange={(e, value) =>
            value && value.businessGroupsId && props.setbusinessGroupsId(value.businessGroupsId)}
          onInputKeyUp={(e) => searchHandler(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button className='btns theme-solid bg-cancel' onClick={props.close}>
          {t('EditTeamDialog.Cancel')}
        </Button>
        <Button
          className='btns theme-solid'
          onClick={async () => {
            setloading(true);
            const result = await EditTeamServices(props.editId, {
              teamsName: props.name,
              businessGroupsId: props.businessGroupsId,
            });
            if (result) {
              props.close();
              props.reloadData();
              showSuccess(t('EditTeamDialog.NotificationEditTeam'));
            }
            setloading(false);
          }}
        >
          {t('EditTeamDialog.Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditTeamDialog;
