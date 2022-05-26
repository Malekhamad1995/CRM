/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import {
 Grid, Button, DialogTitle, DialogContent, DialogActions, Dialog
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  PostBusinessGroups,
  GetBusinessGroups,
  EditBusinessGroup,
} from '../../../../../../Services/BusinessGroupsServices';
import { AutocompleteComponent, Inputs } from '../../../../../../Components/Controls';
import { showSuccess } from '../../../../../../Helper';

const AddDialog = (props) => {
  const { t } = useTranslation('BusinessGroupsView');
  const [teamName, setteamName] = React.useState('');
  const [parentId, setParentId] = React.useState('');
  const [response, setResponse] = React.useState({});
  const searchTimer = useRef(null);

  const GetMyGroups = async (pageIndex, PageSize, searchedItem) => {
    const res = await GetBusinessGroups(pageIndex, PageSize, searchedItem);
    if (res) setResponse(res);
  };

  const handleChangeInputValue = (e, newValue) => {
    if (newValue && newValue.businessGroupsId) {
      if (props.isEdit) {
        props.setGroupParentId(newValue.businessGroupsId);
        props.setGroupParent(newValue.businessGroupsName);
      } else setParentId(newValue.businessGroupsId);

      if (props.isTree && !props.isEdit) {
        props.setGroupId(newValue.businessGroupsId);
        props.setGroupName(newValue.businessGroupsName);
      }
    } else setParentId('');
  };
  const handleCancelButton = () => {
    setParentId('');
    props.setTreeGroup(false);
    props.close() || setteamName('');
    props.setIsEdit(false);
  };
  const handleAddButton = async () => {
    if (props.isTree && !props.isEdit) {
      await PostBusinessGroups({
        businessGroupsName: teamName,
        businessGroupsParentId: parseInt(props.groupId),
      });
    }
    if (props.isEdit) {
      await EditBusinessGroup(props.groupId, {
        businessGroupsName: props.groupName,
        businessGroupsParentId: parseInt(props.groupParentId),
      });
    }
    if (!props.isTree && !props.isEdit) {
      await PostBusinessGroups({
        businessGroupsName: teamName,
        businessGroupsParentId: parseInt(parentId),
      });
    }
    if (props.isTree) props.treeReload();
    else props.reloadData();
    props.setIsEdit(false);
    props.close() || setteamName('');
    setParentId('');
    showSuccess(t('AddDialog.NotificationAddGroup'));
  };

  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      GetMyGroups(1, 30, value);
    }, 700);
  };

  return (
    <Dialog open={props.open} keepMounted>
      <form
        className='AddDialog'
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          props.setOpen(false);
        }}
      >
        <DialogTitle className='DialogTitle'>
          {props.isEdit ? t('EditDialog.EditBusinessGroup') : t('AddDialog.AddBusinessGroup')}
        </DialogTitle>
        <DialogContent>
          <Grid container justify='center'>
            <Grid item xs={12} className='mb-3'>
              <Inputs
                value={props.isEdit ? props.groupName : teamName}
                idRef='groupName'
                labelValue={t('AddDialog.BusinessGroups')}
                onInputChanged={(e) =>
                  (props.isEdit ? props.setGroupName(e.target.value) : setteamName(e.target.value))}
              />
              {/* <FormControl className='input-wrapper'>
                <label className='label-wrapper'>{t('AddDialog.BusinessGroups')}</label>
                <div className='text-field-wrapper'>
                  <TextField
                    fullWidth
                    className='inputs theme-solid'
                    size='small'
                    variant='outlined'
                    value={props.isEdit ? props.groupName : teamName}
                    onChange={(e) => {
                      props.isEdit
                        ? props.setGroupName(e.target.value)
                        : setteamName(e.target.value);
                    }}
                  />
                </div>
              </FormControl> */}
            </Grid>
            <Grid item xs={12}>
              <div className='form-name'>{t('AddDialog.BusinessGroupParent')}</div>
              <AutocompleteComponent
                idRef='teamRef'
                inputPlaceholder={t('AddDialog.BusinessGroupParent')}
                data={
                  response && response.result && response.result.businessGroupsParentId !== null ?
                    response.result :
                    []
                }
                multiple={false}
                withoutSearchButton
                getOptionSelected={(option) =>
                  (props.isEdit ?
                    props.groupParentId === option.businessGroupsId :
                    props.groupId === option.businessGroupsId)}
                selectedValues={
                  props.groupParentId &&
                  props.groupId &&
                  props.response.result.find((item) =>
                    (props.isEdit ?
                      item.businessGroupsId === props.groupParentId :
                      item.businessGroupsId === props.groupId))
                }
                displayLabel={(option) =>
                  (option.businessGroupsName && option.businessGroupsName) || ''}
                onChange={handleChangeInputValue}
                onInputKeyUp={(e) => searchHandler(e)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelButton}
            color='primary'
            className='btns theme-solid bg-cancel'
          >
            {t('AddDialog.Cancel')}
          </Button>
          <Button
            disabled={props.isEdit ? false : teamName === '' ? true : ''}
            onClick={handleAddButton}
            variant='contained'
            color='secondary'
            className='btns theme-solid'
          >
            {props.isEdit ? t('AddDialog.EditBusinessGroup') : t('AddDialog.AddNewGroup')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDialog;
