import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import Joi from 'joi';
import moment from 'moment';
import { getErrorByName, showError } from '../../../../../../../../Helper';
import { DatePickerComponent, DialogComponent } from '../../../../../../../../Components';

export const WorkOrderPPMScheduleVisitsDialog = ({
  isOpen,
  isOpenChanged,
  onSave,
  stateWorkOrderPPMScheduleVisits,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [state, setState] = useState([]);
  const schema = Joi.array()
    .items(
      Joi.any()
        .custom((value, helpers) => {
          if (!value) return helpers.error('state.dateNotSet');
          if (value && state.filter((item) => item && moment(item).isSame(value, 'day')).length > 1)
            return helpers.error('state.dateRepeatedValue');
          return value;
        })
        .messages({
          'state.dateNotSet': t(`${translationPath}ppm-schedule-visit-is-required`),
          'state.dateRepeatedValue': t(
            `${translationPath}can-not-select-same-ppm-schedule-visit-more-than-once`
          ),
        })
    )
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const workOrderPPPSceduleVisitsHandler = useCallback(
    (process, index) => () => {
      if (process === 'add') {
        setState((items) => {
          items.splice(index + 1, 0, null);
          return [...items];
        });
      } else {
        setState((items) => {
          items.splice(index, 1);
          return [...items];
        });
      }
    },
    []
  );
  const saveHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    if (onSave) onSave(state);
  };
  useEffect(() => {
    if (isOpen && isFirstLoad) {
      setIsFirstLoad(false);
      if (stateWorkOrderPPMScheduleVisits.length > state) setState(stateWorkOrderPPMScheduleVisits);
    }
  }, [isFirstLoad, isOpen, state, stateWorkOrderPPMScheduleVisits]);
  return (
    <DialogComponent
      titleText='ppm-schedule-visit'
      saveText='save'
      maxWidth='sm'
      dialogContent={(
        <div className='work-achieved-by-management-dialog view-wrapper'>
          {state &&
            state.map((item, index) => (
              <div
                className='w-100 mb-2 d-flex'
                key={`workOrderReferencePPMScheduleVisitsKey${index + 1}`}
              >
                <DatePickerComponent
                  idRef='workOrderReferencePPMScheduleVisitsRef'
                  labelValue={`${t(`${translationPath}ppm-schedule-visit`)} (${index + 1})`}
                  placeholder='DD/MM/YYYY'
                  value={(state.length > index && state[index]) || null}
                  helperText={getErrorByName(schema, index).message}
                  error={getErrorByName(schema, index).error}
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onDateChanged={(newValue) => {
                    setState((items) => {
                      if (items.length === index) items.push(newValue);
                      else items.splice(index, 1, newValue);

                      return [...items];
                    });
                  }}
                />
                {state.length > 1 && (
                  <ButtonBase
                    className='btns-icon theme-solid mx-2 mt-3P5 bg-warning'
                    onClick={workOrderPPPSceduleVisitsHandler('remove', index)}
                  >
                    <span className='mdi mdi-minus' />
                  </ButtonBase>
                )}
                <ButtonBase
                  className='btns-icon theme-solid mx-2 mt-3P5'
                  onClick={workOrderPPPSceduleVisitsHandler('add', index)}
                >
                  <span className='mdi mdi-plus' />
                </ButtonBase>
              </div>
            ))}
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

WorkOrderPPMScheduleVisitsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  stateWorkOrderPPMScheduleVisits: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
