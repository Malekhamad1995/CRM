import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, DialogTitle, DialogContent, DialogActions, Dialog, Grid
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import Joi from 'joi';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Inputs, Spinner, UploaderComponent } from '../../../../../../../Components';
import {
  GetParams, showError, showSuccess, getErrorByName
} from '../../../../../../../Helper';
import { AddOpenHouse, UpdateUnitOpenHouse } from '../../../../../../../Services';
import { UploaderThemesEnum } from '../../../../../../../Enums';

export const AddOpenhouseDialog = ({
  open,
  close,
  translationPath,
  parentTranslationPath,
  reloadData,
  UnitId,
  IsEdit,
  OpenHouses,
}) => {
  const defaultState = {
    unitId: UnitId,
    unitOpenHouseLocation: '',
    unitOpenHouseStartTime: new Date(),
    unitOpenHouseEndTime: new Date(),
    imageId: '',
    imageName: '',
  };
  useEffect(() => {
    const UnitId = GetParams('id');
    if (UnitId !== null) setState({ ...state, unitId: UnitId });
  }, []);

  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState(defaultState);
  const schema = Joi.object({
    imageId: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}image-is-required`,
        'string.empty': t`${translationPath}image-is-required`,
      }),

    unitOpenHouseLocation: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}imageName-is-required`,
        'string.empty': t`${translationPath}imageName-is-required`,
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    setIsLoading(true);
    if (!state.imageId) {
      showError(t(`${translationPath}please-browse-image`));
      setIsLoading(false);
      return;
    }
    if (schema.error) {
      showError(t('please-fix-all-errors'));
      setIsLoading(false);
      return;
    }
    if (IsEdit === true) {
      setIsLoading(true);
      await UpdateUnitOpenHouse(OpenHouses.unitOpenHouseId, state);
      setIsLoading(false);
      reloadData();
      close(false);
      showSuccess(t(`${translationPath}edit-successfully`));
    } else {
      setIsLoading(true);
      const result = await AddOpenHouse(state);
      setIsLoading(false);
      if (!(result && result.status && result.status !== 200)) {
        reloadData();
        close(false);
        setState(defaultState);
        showSuccess(t(`${translationPath}add-successfully`));
      } else showError(t(`${translationPath}company-finance-updated-failed`));
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close, defaultState, reloadData, state, t, translationPath]);

  const handleDateChange = (date) => {
    handleStartTimeChange(date);
    handleEndTimeChange(date);
    setState({ ...state, unitOpenHouseStartTime: date });
  };

  const handleStartTimeChange = (date) => {
    let newValue = date;
    if (
      state.unitOpenHouseStartTime &&
      newValue &&
      !moment(state.unitOpenHouseEndTime).isSame(newValue, 'day')
    ) {
      newValue = moment(
        moment(state.unitOpenHouseEndTime).format('YYYY-MM-DD') +
        moment(newValue).format('THH:mm:ssZ')
      );
    }
    setState({ ...state, unitOpenHouseStartTime: newValue });
  };

  const handleEndTimeChange = (date) => {
    let newValue = date;
    if (
      state.unitOpenHouseStartTime &&
      newValue &&
      !moment(state.unitOpenHouseStartTime).isSame(newValue, 'day')
    ) {
      newValue = moment(
        moment(state.unitOpenHouseStartTime).format('YYYY-MM-DD') +
        moment(newValue).format('THH:mm:ssZ')
      );
    }
    setState({ ...state, unitOpenHouseEndTime: newValue });
  };

  useEffect(() => {
    if (IsEdit === true) {
      setState({
        ...state,
        unitOpenHouseLocation: OpenHouses.unitOpenHouseLocation,
        unitId: OpenHouses.unitId,
        unitOpenHouseLocation: OpenHouses.unitOpenHouseLocation,
        unitOpenHouseStartTime: OpenHouses.unitOpenHouseStartTime,
        unitOpenHouseEndTime: OpenHouses.unitOpenHouseEndTime,
        imageId: OpenHouses.imageId,
        imageName: OpenHouses.imageName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IsEdit]);

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => {
        close(false);
        setIsSubmitted(true);
        setState(defaultState);
      }}
      className='add-new-company'
    >
      <Spinner isActive={isLoading} isAbsolute />
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          close(false);
        }}
      >
        <DialogTitle>
          {IsEdit === true ?
            t(`${translationPath}EDITOpenhouse`) :
            t(`${translationPath}AddnewOpenhouse`)}
        </DialogTitle>
        <DialogContent>
          <div className='UploaderComponent-wrapered'>
            <UploaderComponent
              idRef='profileImgRef'
              uploaderTheme={UploaderThemesEnum.box.key}
              initUploadedFiles={
                (state && state.imageId && [{ uuid: state.profileImg, fileName: 'user-image' }]) ||
                []
              }
              uploadedChanged={(files) =>
                setState({
                  ...state,
                  imageId: (files.length > 0 && files[0].uuid) || null,
                  imageName: 'profileImg',
                })}
            />
          </div>
          <Inputs
            isRequired
            value={state.unitOpenHouseLocation}
            idRef='activitiesSearchRef'
            labelValue={t(`${translationPath}Name`)}
            labelClasses='Requierd-Color'
            isSubmitted={isSubmitted}
            helperText={
              getErrorByName(schema, 'unitOpenHouseLocation').message
            }
            isWithError
            error={getErrorByName(schema, 'unitOpenHouseLocation').error}
            onInputChanged={(e) => setState({ ...state, unitOpenHouseLocation: e.target.value })}
          />
          <div className='DatePicker'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin='normal'
                id='date-picker-dialog'
                label={t(`${translationPath}Openon`)}
                format='MM/dd/yyyy'
                value={state.unitOpenHouseStartTime}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <KeyboardTimePicker
                    margin='normal'
                    id='time-picker'
                    label={t(`${translationPath}Start`)}
                    value={state.unitOpenHouseStartTime}
                    onChange={handleStartTimeChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                  {' '}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <KeyboardTimePicker
                    margin='normal'
                    id='time-picker'
                    label={t(`${translationPath}Close`)}
                    value={state.unitOpenHouseEndTime}
                    onChange={handleEndTimeChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button className='btns theme-solid bg-cancel' onClick={() => close(false)}>
            {t(`${translationPath}Cancel`)}
          </Button>
          <Button onClick={saveHandler} className='btns theme-solid' variant='contained'>
            {IsEdit === true ? t(`${translationPath}edit`) : t(`${translationPath}Add`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
