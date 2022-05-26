import React, {
 memo, useState, useCallback, useEffect
} from 'react';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { GlobalHistory } from '../../../../Helper';
import { GetMyActivities } from '../../../../Services';
import { Calendar } from '../../../../Components/CalendarComponent/Calendar';
import { ActivitiesManagementDialog } from '../../ActivitiesView/ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import { Spinner } from '../../../../Components';

const translationPath = 'eventsView.';
export const EventsView = memo(({ isOpen, top, getCurrentNotificationNumber }) => {
  const { t } = useTranslation('HeaderView');
  const [date, setDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [activity, setActivity] = useState(null);
  const [events, setEvents] = useState([]);
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
      if (!result) return;
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
  const calendarHandler = () => GlobalHistory.push('/home/monthly-calendar-view');
  useEffect(() => {
    getMyActivities();
  }, [getMyActivities, currentMonth]);
  const onMonthChange = useCallback((value) => {
    setCurrentMonth(value);
  }, []);
  getCurrentNotificationNumber(events && events.length);
  return (
    <>
      <Collapse
        in={isOpen}
        className='collapses absolute-collapse activity-events-wrapper'
        style={{ top }}
      >
        <div className='cards'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='card-header'>
            <p className='texts-large'>{`${t(`${translationPath}user-notification`)}`}</p>
            <p>{`${events && events.length} ${t(`${translationPath}new`)}`}</p>
          </div>
          <div className='card-content p-0'>
            <Calendar
              selectedDateChanged={(newDate) => setDate(new Date(newDate))}
              selectedDate={date}
              withNumber
              onMonthChange={onMonthChange}
              activities={events}
              events={{ selectedDays: selectedDates }}
              wrapperClasses='transparent-calender'
            />
            {events
              .filter((item) => moment(item.date).format('D') === moment(date).format('D'))
              .map(
                (item, index) =>
                  index < 3 && (
                    <React.Fragment key={`notifications${index + 1}`}>
                      <ButtonBase
                        onClick={() => {
                          setActivity(item.activity);
                          setOpenDialog(true);
                        }}
                        className='btns theme-wide events-button'
                      >
                        <div className='event-item-wrapper'>
                          <div className='event-badge-subject-wrapper'>
                            <div className='events-badge' />
                            <div className='d-inline-flex-column-center-v mr-4 ml-4'>
                              <span className='texts-large mb-2'>{item.subject}</span>
                              <span className='c-gray-light'>
                                {moment(item.date).format('DD/MM/YYYY')}
                              </span>
                            </div>
                          </div>
                          <div className='events-hour-badge'>{item.hour}</div>
                        </div>
                      </ButtonBase>
                    </React.Fragment>
                  )
              )}
            <div className='separator-h mb-3 top-m5px' />
          </div>
          <div className='view-all-wrapper'>
            <ButtonBase className='btns theme-outline' onClick={calendarHandler}>
              <span>{t('notificationsView.view-all')}</span>
            </ButtonBase>
          </div>
        </div>
      </Collapse>
      {openDialog && (
        <ActivitiesManagementDialog
          open={openDialog}
          activeItem={activity && activity}
          onSave={() => {
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
    </>
  );
});
EventsView.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  top: PropTypes.number.isRequired,
};
