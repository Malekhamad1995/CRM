import React, { memo } from 'react';
import { DatePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Badge, ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';

const Calendar = memo((props) => (
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale='en'>
    <div className={`calendars${props.hideHeader ? ' hide-header' : ''} ${props.wrapperClasses}`}>
      {props.isInputPicker && (
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format={props.format}
          margin='normal'
          id='date-picker-inline'
          label='Date picker inline'
          value={props.selectedDate}
          onChange={props.selectedDateChanged}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      )}
      <DatePicker
        autoOk
        orientation='portrait'
        variant='static'
        openTo='date'
        // disableFuture
        value={props.selectedDate}
        onChange={props.selectedDateChanged}
        // disabled
        // labelFunc={(date) => (date ? date.format('YYYY-MM-DD') : '')}
        // dateForm="YYYY-MM-DD"
        renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
          const currentMonth = moment(day).format();
          props.onMonthChange(currentMonth);
          const isSelected =
            isInCurrentMonth && props.events.selectedDays.includes(dayComponent.props.children);
          if (
            props.withNumber &&
            props.events.selectedDays.findIndex((el) => `${el}` === moment(day).format('D')) !==
              -1 &&
            props.activities.findIndex(
              (el) => moment(el.date).format('M') === moment(day).format('M')
            ) !== -1
          ) {
            return (
              <Badge
                color='secondary'
                overlap='circle'
                badgeContent={
                  props.events.selectedDays.filter((el) => `${el}` === moment(day).format('D'))
                    .length
                }
              >
                {dayComponent}
              </Badge>
            );
          }
          if (
            props.fullCalendar &&
            props.events.selectedDays.findIndex((el) => `${el}` === moment(day).format('D')) !==
              -1 &&
            props.activities.findIndex(
              (el) => moment(el.date).format('M') === moment(day).format('M')
            ) !== -1
          ) {
            return (
              <div className='full-calendar-item'>
                {props.activities.map(
                  (item) =>
                    moment(item.date).format('D') === moment(day).format('D') && (
                      <ButtonBase
                        onClick={() => props.onActivitySelect(item.activity)}
                        className='activity-item'
                      >
                        <div className='activity-item-subject'>
                          <div className='activity-item-badge' />
                          {item.subject}
                        </div>
                        <div className='activity-item-hour'>{item.hour}</div>
                      </ButtonBase>
                    )
                )}
                <span className='activity-date'>{dayComponent}</span>
              </div>
            );
          }
          if (!isSelected) return <span>{dayComponent}</span>;
          if (props.onlyColorChanged) return <span className='have-events'>{dayComponent}</span>;
          return <span>{dayComponent}</span>;
        }}
      />
    </div>
  </MuiPickersUtilsProvider>
));
Calendar.propTypes = {
  selectedDate: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedDateChanged: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool,
  withNumber: PropTypes.bool,
  fullCalendar: PropTypes.bool,
  onActivitySelect: PropTypes.func,
  onMonthChange: PropTypes.func,
  activities: PropTypes.instanceOf(Array),
  onlyColorChanged: PropTypes.bool,
  events: PropTypes.objectOf(PropTypes.any),
  format: PropTypes.string,
  isInputPicker: PropTypes.bool,
  wrapperClasses: PropTypes.string,
};
Calendar.defaultProps = {
  hideHeader: true,
  withNumber: false,
  fullCalendar: false,
  onMonthChange: () => {},
  activities: [],
  onActivitySelect: undefined,
  onlyColorChanged: true,
  events: {
    selectedDays: [],
  },
  format: '',
  isInputPicker: false,
  wrapperClasses: '',
};
export { Calendar };
