import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import { ButtonBase, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PopoverComponent } from '../../PopoverComponent/PopoverComponent';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export const DateRangePickerComponent = ({
  ranges,
  onDateChanged,
  minDate,
  maxDate,
  popoverIdRef,
  translationPath,
  displayFormat,
  emptyLabel,
  idRef,
  labelValue,
  labelClasses,
  isDisabled,
  startDateError,
  endDateError,
  helperText,
  isSubmitted,
  onClearClicked,
  isWideOvel,
  parentTranslationPath,
  disabledDates,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [attachedWith, setAttachedWith] = useState(null);
  const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);
  const displayRef = useRef(null);
  const [pickerDirection, setPickerDirection] = useState(null);
  const handleClose = useCallback(() => {
    setAttachedWith(null);
  }, []);
  const openHandler = useCallback(() => {
    if (!isBlurOrChanged) setIsBlurOrChanged(true);
    setAttachedWith(displayRef.current);
  }, [isBlurOrChanged]);
  const getPickerDirection = useCallback(() => {
    if (window.innerWidth <= 991.98 && pickerDirection !== 'vertical')
      setPickerDirection('vertical');
    else if (window.innerWidth > 991.98 && pickerDirection !== 'horizontal')
      setPickerDirection('horizontal');
  }, [pickerDirection]);
  useEffect(() => {
    if (!pickerDirection) getPickerDirection();
  });
  return (
    <div className='date-range-picker-component'>
      {labelValue && (
        <label htmlFor={idRef} className={`${labelClasses}${isDisabled ? ' disabled' : ''}`}>
          {t(`${translationPath}${labelValue}`)}
        </label>
      )}
      <ButtonBase
        id={idRef}
        className={`display-wrapper${
          ((startDateError || endDateError) && (isBlurOrChanged || isSubmitted) && ' has-error') ||
          ''
        }${(isWideOvel && ' wide-ovel') || ''}`}
        disabled={isDisabled}
        ref={displayRef}
        onClick={openHandler}
      >
        <div className='d-inline-flex-center'>
          <span className='description-text'>
            {t(`${translationPath}date`)}
            :
          </span>
        </div>
        <div className='d-inline-flex-center c-secondary fw-bold px-2'>
          {(ranges &&
            ranges.length > 0 &&
            ranges[0] &&
            ranges[0].startDate &&
            ranges[0].endDate && (
              <>
                <span
                  className={
                    (startDateError && (isBlurOrChanged || isSubmitted) && 'start-date-error') ||
                    undefined
                  }
                >
                  {moment(ranges[0].startDate).format(displayFormat)}
                </span>
                <span className='px-1'>-</span>
                <span
                  className={
                    (endDateError && (isBlurOrChanged || isSubmitted) && 'end-date-error') ||
                    undefined
                  }
                >
                  {moment(ranges[0].endDate).format(displayFormat)}
                </span>
              </>
            )) || <span className='description-text'>{t(`${translationPath}${emptyLabel}`)}</span>}
        </div>
        <span className={`c-secondary px-2 mdi mdi-chevron-${(attachedWith && 'up') || 'down'}`} />
        {onClearClicked &&
          ranges &&
          ranges.length > 0 &&
          ranges[0] &&
          ranges[0].startDate &&
          ranges[0].endDate && (
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClearClicked();
              }}
            >
              <span className='mdi mdi-close' />
            </IconButton>
          )}
      </ButtonBase>
      {helperText && (isBlurOrChanged || isSubmitted) && (
        <span className='error-wrapper'>{helperText}</span>
      )}
      <PopoverComponent
        idRef={popoverIdRef}
        handleClose={handleClose}
        attachedWith={attachedWith}
        component={(
          <DateRangePicker
            months={2}
            direction={pickerDirection}
            moveRangeOnFirstSelection={false}
            ranges={ranges}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            onChange={onDateChanged}
          />
        )}
      />
    </div>
  );
};
DateRangePickerComponent.propTypes = {
  parentTranslationPath: PropTypes.string,
  onClearClicked: PropTypes.func,
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.instanceOf(moment),
        PropTypes.string,
      ]),
      endDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.instanceOf(moment),
        PropTypes.string,
      ]),
      key: PropTypes.string,
    })
  ).isRequired,
  onDateChanged: PropTypes.func.isRequired,
  minDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
    PropTypes.string,
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
    PropTypes.string,
  ]),
  disabledDates: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(moment),
      PropTypes.string,
    ])
  ),
  popoverIdRef: PropTypes.string,
  emptyLabel: PropTypes.string,
  translationPath: PropTypes.string,
  displayFormat: PropTypes.string,
  isDisabled: PropTypes.bool,
  idRef: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  helperText: PropTypes.string,
  startDateError: PropTypes.bool,
  endDateError: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isWideOvel: PropTypes.bool,
};
DateRangePickerComponent.defaultProps = {
  onClearClicked: () => {},
  popoverIdRef: 'dateRangePopoverRef',
  translationPath: '',
  parentTranslationPath: '',
  emptyLabel: 'all',
  displayFormat: 'DD/MM/YYYY',
  minDate: undefined,
  maxDate: undefined,
  idRef: 'dateRangePickerRef',
  labelClasses: 'texts-form',
  labelValue: undefined,
  isDisabled: false,
  startDateError: undefined,
  endDateError: undefined,
  helperText: undefined,
  isSubmitted: false,
  isWideOvel: false,
  disabledDates: undefined,
};
