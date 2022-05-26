import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GetMyActivities } from '../../../Services';
import { Calendar, Spinner } from '../../../Components';
import { ActivitiesManagementDialog } from '../ActivitiesView/ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';

const parentTranslationPath = 'MonthlyCalendarView';
const translationPath = '';

export const MonthlyCalendarView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [activity, setActivity] = useState(null);
  // selectedDate
  const [, setSelectedDate] = useState(new Date());
  const getMyActivities = useCallback(async () => {
    setIsLoading(true);
    const startDate = moment(
      new Date(new Date(currentMonth).getFullYear(), new Date(currentMonth).getMonth() - 1, 1)
    ).format();
    const endDate = moment(
      new Date(new Date(currentMonth).getFullYear(), new Date(currentMonth).getMonth() - 1 + 1, 0)
    ).format();
    const result = await GetMyActivities(startDate, endDate);
    if (!((result && result.data && result.data.ErrorId) || !result)) {
      const newEvents = [];
      const dates = [];
      if (result && result[0]) {
        result.map((item) => {
          dates.push(+moment(item.activityDate).format('D'));
          newEvents.push({
            hour: moment(item.activityDate).format('hh:mm'),
            date: item.activityDate,
            subject: item.subject,
            activity: item,
          });
        });
      }
      setSelectedDates(dates);
      setEvents(newEvents);
    }
    setIsLoading(false);
  }, [currentMonth]);
  useEffect(() => {
    getMyActivities();
  }, [getMyActivities, currentMonth]);
  const dateChangeHandler = (newDate) => setSelectedDate(new Date(newDate));
  const onActivitySelect = useCallback((item) => {
    setOpenDialog(true);
    setActivity(item);
  }, []);
  const onMonthChange = useCallback((value) => {
    setCurrentMonth(value);
  }, []);
  return (
    <div className='monthly-calendar-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='event-calender'>
        <div className='add-new-wrapper'>
          <ButtonBase className='btns theme-solid px-3' onClick={() => setOpenDialog(true)}>
            <span className='mdi mdi-plus' />
            {t(`${translationPath}add-new`)}
          </ButtonBase>
        </div>
        <Calendar
          fullCalendar
          onMonthChange={onMonthChange}
          activities={events}
          onActivitySelect={onActivitySelect}
          wrapperClasses='full-callender w-100'
          selectedDateChanged={dateChangeHandler}
          events={{ selectedDays: selectedDates }}
        />
      </div>
      {openDialog && (
        <ActivitiesManagementDialog
          open={openDialog}
          activeItem={activity && activity}
          onSave={() => {
            getMyActivities();
            setOpenDialog(false);
            setActivity(null);
          }}
          close={() => {
            setOpenDialog(false);
            setActivity(null);
          }}
          parentTranslationPath='ActivitiesView'
        />
      )}
    </div>
  );
};
