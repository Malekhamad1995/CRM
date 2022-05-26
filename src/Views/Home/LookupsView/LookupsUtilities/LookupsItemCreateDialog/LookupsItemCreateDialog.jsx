import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogTitle, FormControl
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import { GetLookupItems, lookupTypesGet } from '../../../../../Services';
import { showSuccess } from '../../../../../Helper';

export const LookupsItemCreateDialog = (props) => {
  const { t } = useTranslation('LookupsView');
  const [responseType, setResponseType] = useState([]);
  const [responseItem, setResponseItem] = useState([]);
  let time = setTimeout(() => { }, 300);

  useEffect(() => {
    if (props.item && props.item.lookupItemId) {
      for (const propsrty in props.item)
        props.setState({ id: propsrty, value: props.item[propsrty] });

      if (props.item && props.item.parentLookupItemId) props.setHasParent(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  useEffect(() => {
    if (props.selectedTypeId) {
      props.setState({
        id: 'lookupTypeId',
        value: parseInt(props.selectedTypeId),
      });
    }
  }, [props.selectedTypeId]);

  const loadType = async (pageIndex, pageSize, searchedItem) => {
    setResponseType(await lookupTypesGet({ pageIndex, pageSize, searchedItem }));
  };
  useEffect(() => {
    loadType(1, 20);
  }, [])
  const validate = () =>
    (!props.hasParent && props.state.lookupItemName && props.state.lookupItemName !== '') ||
    (props.hasParent &&
      props.state.lookupItemName &&
      props.state.lookupItemName !== '' &&
      props.state.parentLookupItemId);

  const clearAllFields = () => {
    props.setState({
      id: 'parentLookupTypeName',
      value: '',
    });
    props.setState({
      id: 'parentLookupTypeId',
      value: null,
    });
    props.setState({
      id: 'parentLookupItemName',
      value: '',
    });
    props.setState({
      id: 'parentLookupItemId',
      value: null,
    });
  };
  return (
    <Dialog
      className='lookupItem'
      open={props.open}
      keepMounted
      onClose={() => {
        props.setOpen(false);
      }}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <spinner isActive={props.loading} />
      <DialogTitle id='alert-dialog-slide-title'>
        {t('CreateLookupItemDialog.LookupItem')}
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <FormControl>
              <div className='form-name'>{t('CreateLookupItemDialog.LookupName')}</div>
              <TextField
                fullWidth
                className='inputs theme-solid'
                size='small'
                variant='outlined'
                id='lookupItemName'
                required
                value={props.state && props.state.lookupItemName ? props.state.lookupItemName : ''}
                onChange={(e) => props.setState(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} className='mb-3'>
            <FormControlLabel
              className='form-control-label'
              control={(
                <Checkbox
                  className='checkbox-wrapper'
                  checkedIcon={<span className='mdi mdi-check' />}
                  indeterminateIcon={<span className='mdi mdi-minus' />}
                  checked={props.hasParent}
                  onClick={() => {
                    if (props.hasParent) clearAllFields();
                  }}
                  onChange={async (e) => props.setHasParent(e.target.checked)}
                />
              )}
              label={t('CreateLookupItemDialog.HasParent')}
            />
          </Grid>

          {props.hasParent && (
            <>
              <Grid item xs={12} className='mb-3'>
                <div htmlFor='parentLookupTypeId' className='form-name'>
                  {t('CreateLookupItemDialog.LookupType')}
                </div>
                <Autocomplete
                  fullWidth
                  className='inputs theme-solid'
                  size='small'
                  id='parentLookupTypeId'
                  options={responseType && responseType.result ? responseType.result : []}
                  getOptionLabel={(option) => (option.lookupTypeName ? option.lookupTypeName : '')}
                  inputValue={
                    props.state.parentLookupTypeName ? props.state.parentLookupTypeName : ''
                  }
                  onChange={async (e, v) => {
                    if (v && v.lookupTypeName) {
                      props.setState({
                        id: 'parentLookupTypeName',
                        value: v.lookupTypeName,
                      });
                      props.setState({
                        id: 'parentLookupItemName',
                        value: '',
                      });
                    }
                    setResponseItem(await GetLookupItems(1, 20, v.lookupTypeName));
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      className='inputs theme-solid'
                      size='small'
                      variant='outlined'
                      {...params}
                      onKeyUp={() => {
                        time = setTimeout(() => {
                          setResponseType();
                          loadType(1, 20, '');
                        }, 500);
                      }}
                      onKeyDown={() => {
                        clearTimeout(time);
                      }}
                      onChange={(e) => {
                        props.setState({
                          id: 'parentLookupTypeName',
                          value: e.target.value,
                        });
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} className='mb-3'>
                <div htmlFor='parentLookupItemId' className='form-name'>
                  {t('CreateLookupItemDialog.ParentLookupItem')}
                </div>
                <Autocomplete
                  fullWidth
                  className='inputs theme-solid'
                  size='small'
                  id='parentLookupItemId'
                  options={responseItem && responseItem.result ? responseItem.result : []}
                  getOptionLabel={(option) => (option.lookupItemName ? option.lookupItemName : '')}
                  inputValue={
                    props.state.parentLookupItemName ? props.state.parentLookupItemName : ''
                  }
                  onChange={async (e, v) => {
                    if (v && v.lookupItemId) {
                      props.setState({
                        id: 'parentLookupItemId',
                        value: v.lookupItemId,
                      });
                      props.setState({
                        id: 'parentLookupItemName',
                        value: v.lookupItemName,
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      className='inputs theme-solid theme-form-builder'
                      size='small'
                      variant='outlined'
                      {...params}
                      onChange={(e) => {
                        props.setState({
                          id: 'parentLookupItemName',
                          value: e.target.value,
                        });
                      }}
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.setOpen(false);
            props.setState({ reset: true });
          }}
          className='btns theme-solid bg-cancel'
        >
          {t('CreateLookupItemDialog.Cancel')}
        </Button>
        <Button
          disabled={!validate()}
          className='btns theme-solid'
          onClick={async () => {
            props.isEdit ? await props.onSave(props.state) : await props.onCreate(props.state);
            props.setState({ reset: true });
            props.isEdit ?
              showSuccess(t('CreateLookupItemDialog.UpdateItem')) :
              showSuccess(t('CreateLookupItemDialog.CreateItem'));
            props.setOpen(false);
          }}
        >
          {t('CreateLookupItemDialog.Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
