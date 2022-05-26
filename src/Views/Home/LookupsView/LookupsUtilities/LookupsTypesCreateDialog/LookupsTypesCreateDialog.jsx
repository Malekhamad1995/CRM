import React, { useReducer, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, FormControl
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';

const translationPath = 'CreateLookupTypeDialog.';

export const LookupsTypesCreateDialog = (props) => {
  const { t } = useTranslation('LookupsView');
  const reducer = (state, action) => {
    if (action.reset) return {};

    return { ...state, [action.id]: action.value };
  };
  const [state, setState] = useReducer(reducer, props.item);
  const validate = () =>
    state &&
    state.lookupTypeDescription &&
    state.lookupTypeDescription !== '' &&
    state.lookupTypeName &&
    state.lookupTypeName !== '';

  useEffect(() => {
    if (props.isEdit) {
      for (const lookupTypeId in props.item)
        setState({ id: lookupTypeId, value: props.item[lookupTypeId] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  return (
    <Dialog
      disableBackdropClick
      open={props.open}
      keepMounted
      onClose={() => {
        props.setOpen(false);
        setState({ reset: true });
      }}
      className='add-type-dialog-wrapper'
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          props.setOpen(false);
          props.isEdit ? props.onSave(state) : props.onCreate(state);
          setState({ reset: true });
        }}
      >
        <DialogTitle id='alert-dialog-slide-title'>{t(`${translationPath}LookupType`)}</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} className='mb-3'>
              <FormControl className='input-wrapper'>
                <label className='label-wrapper Requierd-Color'>{t(`${translationPath}LookupName`)}</label>
                <div className='text-field-wrapper lookupsName'>
                  <TextField
                    fullWidth
                    size='small'
                    variant='outlined'
                    required
                    className='inputs  theme-solid theme-form-builder'
                    id='lookupTypeName'
                    value={state && state.lookupTypeName ? state.lookupTypeName : ''}
                    onChange={(e) => setState(e.target)}
                  />
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <label className='label-wrapper Requierd-Color'>{t(`${translationPath}LookupDescription`)}</label>
                <div className='text-field-wrapper'>
                  <TextField
                    fullWidth
                    className='inputs theme-solid'
                    size='small'
                    variant='outlined'
                    id='lookupTypeDescription'
                    required
                    multiline
                    rowsMax={10}
                    rows={4}
                    value={state && state.lookupTypeDescription ? state.lookupTypeDescription : ''}
                    onChange={(e) => setState(e.target)}
                  />
                </div>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.setOpen(false);
              setState({ reset: true });
            }}
            className='btns theme-solid bg-cancel'
          >
            {t(`${translationPath}cancel`)}
          </Button>
          <Button disabled={!validate()} className='btns theme-solid' type='submit'>
            {t(`${translationPath}save`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
