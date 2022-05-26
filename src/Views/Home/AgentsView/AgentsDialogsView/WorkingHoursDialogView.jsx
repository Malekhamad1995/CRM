/* eslint-disable react/prop-types */
import { Button } from '@material-ui/core';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { DatePickerComponent } from '../../../../Components';
import { lookupItemsGetId } from '../../../../Services';
import { getErrorByName } from '../../../../Helper';
import Lookups from '../../../../assets/json/StaticLookupsIds.json';

const parentTranslationPath = 'Agents';
const translationPath = '';
// eslint-disable-next-line no-unused-vars
export const WorkingHoursDialogView = ({ onsave, onCancelClicked, isSubmitted }) => {
  const { t } = useTranslation(parentTranslationPath);
  const defaultState = {
    agentRotationScheduleId: Math.random(),
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
    mediaNameId: null,
    mediaDetailsId: null,
  };
  const [state, setState] = useState(defaultState);
  const schema = Joi.object({
    fromTime: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}from-time-is-required`),
        'date.empty': t(`${translationPath}from-time-is-required`),
      }),
    toTime: Joi.date()
      .greater(Joi.ref('fromTime'))
      .required()
      .messages({
        'date.base': t(`${translationPath}to-time-is-required`),
        'date.empty': t(`${translationPath}to-time-is-required`),
        'date.greater': t(`${translationPath}select-dateTo-after-dateFrom`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,

    })
    .validate(state);

  // eslint-disable-next-line no-unused-vars
  const [MediaDetail,
    setMediaDetail] = useState(defaultState);
      // eslint-disable-next-line no-unused-vars
  const [MediaName,
    setMediaName] = useState(defaultState);
      // eslint-disable-next-line no-unused-vars
  const [loadings,
    setloadings] = useState(false);
      // eslint-disable-next-line no-unused-vars
  const [isreq,

    setisreq] = useState(false);

  const lookupActivityCategory = useCallback(async (lookupid, type) => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: lookupid,
    });
    setloadings(false);
    if (type === 'MediaDetail') setMediaDetail(result);
    else setMediaName(result);
  }, []);

  useEffect(() => {
    lookupActivityCategory(Lookups.MediaDetail, 'MediaDetail');
    lookupActivityCategory(Lookups.MediaName, 'MediaName');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      state.fromTime === null ||
      state.toTime === null
    )
      setisreq(true);
    else setisreq(false);
  }, [state]);

  return (
    <div className='Agents-wrapper view-wrapper'>
      <div className='w-100 px-2'>
        <div className=''>
          <div className='Date-wraper'>
            <div className='Date-div'>
              <DatePickerComponent
                idRef='fromDateRef'
                placeholder='From'
                value={state.fromDate}
                labelValue='date'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onDateChanged={(newValue) => {
                  setState({
                    ...state,
                    fromDate: newValue && newValue,
                  });
                }}
              />
            </div>
            <div className='Date-div labelhide'>
              <DatePickerComponent
                idRef='toDateRef'
                placeholder='To'
                labelValue='null'
                value={state.toDate}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onDateChanged={(newValue) => {
                  setState({
                    ...state,
                    toDate: newValue && newValue,
                  });
                }}
              />
            </div>

            <div className='Date-div'>
              <DatePickerComponent
                idRef='fromTimeDateRef'
                placeholder='From'
                labelValue='time'
                labelClasses='Requierd-Color'
                value={state.fromTime}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isTimePicker
                onDateChanged={(newValue) => {
                  setState({
                    ...state,
                    fromTime: (newValue && moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) || null,
                  });
                }}
                isWithError
                helperText={getErrorByName(schema, 'fromTime').message}
                error={getErrorByName(schema, 'fromTime').error}
                isSubmitted={isSubmitted}
              />
            </div>
            <div className='Date-div labelhide'>
              <DatePickerComponent
                idRef='toTimeRef'
                placeholder='To'
                isTimePicker
                labelValue='null'
                value={state.toTime}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onDateChanged={(newValue) => {
                  setState({
                    ...state,
                    toTime: (newValue && moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) || null,
                  });
                }}
                isWithError
                helperText={getErrorByName(schema, 'toTime').message}
                error={getErrorByName(schema, 'toTime').error}
                isSubmitted={isSubmitted}
              />
            </div>
          </div>
          <div className='select-wraper'>
            {/* <div className='select'>
              <AutocompleteComponent
                idRef='set-of-media-nameRef'
                labelValue='set-of-media-name'
                multiple={false}
                data={MediaName || []}
                displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
                withoutSearchButton
                isLoading={loadings}
                inputPlaceholder={t(`${translationPath}set-of-media-name`)}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setState({
                    ...state,
                    mediaNameId: (newValue && +newValue.lookupItemId) || '',
                    mediaName: (newValue && newValue) || '',
                  });
                }}
              />
            </div> */}
            {/* <div className='select'>
              <AutocompleteComponent
                idRef='set-of-media-typeRef'
                labelValue='set-of-media-type'
                multiple={false}
                isLoading={loadings}
                data={MediaDetail || []}
                displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
                withoutSearchButton
                inputPlaceholder={t(`${translationPath}set-of-media-name`)}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setState({
                    ...state,
                    mediaDetailsId: (newValue && +newValue.lookupItemId) || '',
                    mediaDetails: (newValue && newValue) || '',
                  });
                }}
              />
            </div> */}
          </div>
          <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
            <div className='cancel-wrapper d-inline-flex-center'>
              <Button
                onClick={() => onCancelClicked()}
                className='MuiButtonBase-root MuiButton-root MuiButton-text cancel-btn-wrapper btns theme-transparent c-primary'
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}cancel`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </Button>
            </div>
            <div className='save-wrapper d-inline-flex-center'>
              <Button
                disabled={schema.error}
                onClick={() => onsave(state, schema)}
                className='MuiButtonBase-root MuiButton-root MuiButton-text save-btn-wrapper btns theme-solid w-100 mx-2'
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}Done`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
