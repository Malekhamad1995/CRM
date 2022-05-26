import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { GetAllActivitiesByLeadId } from '../../../../Services';
import { ContactTypeEnum, ActionsEnum } from '../../../../Enums';
import { Spinner } from '../../../../Components';
import { ContactsActionDialogsComponent } from '../../ContactsView/ContactsUtilities/ContactsActionDialogsComponent/ContactsActionDialogsComponent';

export const MyReferralsCardDetailsComponent = ({
  activeData,
  translationPath,
  setOpenConfirmDialog,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [schedule, setSchedule] = useState(false);
  const [dataFile, setDataFile] = useState(true);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenContactsActionDialog, setisOpenContactsActionDialog] = useState(false);
  const [detailedCardAction, setdetailedCardAction] = useState(() => ({
    actionEnum: '',
    item: '',
  }));
  const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;
  const [userActions] = useState(() => [
    ActionsEnum.phoneSolid,
    ActionsEnum.emailSolid,
    ActionsEnum.whatsappSolid,
  ]);
  const getUserActionValue = (key) => Object.values(ActionsEnum).find((item) => item.key === key);
  const getAllActivitiesByLeadId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllActivitiesByLeadId(activeData.id, { pageIndex: 0, pageSize: 25 });
    if (!(result && result.status && result.status !== 200)) setActivities(result.result);
    else setActivities([]);
    setIsLoading(false);
  }, [activeData.id]);
  useEffect(() => {
    getAllActivitiesByLeadId();
  }, [getAllActivitiesByLeadId]);
  const detailedCardActionClicked = useCallback(
    (actionEnum, item) => (event) => {
      event.stopPropagation();
      setisOpenContactsActionDialog(true);
      setdetailedCardAction({
        actionEnum,
        item,
      });
    },
    []
  );
  return (
    <div className='leads-card-detaild-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      {activeData && (
        <div className='side-menu-wrapper'>
          <div>
            <div className='d-flex-center mb-3'>
              <img
                src={getDefaultContactImage(activeData.type)}
                className='details-img'
                alt={t(`${translationPath}lead-image`)}
              />
            </div>
            <div className='properety-plan d-flex-center mb-3'>{activeData.name}</div>
            <div className='d-flex-center flex-wrap mb-2'>
              {userActions.map((item, index) => (
                <Button
                  key={`userActions${index + 1}`}
                  className={`${getUserActionValue(item.key).buttonClasses} mx-2 mb-2`}
                  onClick={detailedCardActionClicked(ActionsEnum.emailSolid.key, activeData)}
                >
                  <span className={getUserActionValue(item.key).icon} />
                </Button>
              ))}
            </div>
            <div className='d-flex-center mb-3 '>
              <div className='data-schedule-button'>
                <div className={`data-file-button ${dataFile ? 'selected' : ''}`}>
                  <Button
                    onClick={() => {
                      setSchedule(false);
                      setDataFile(true);
                    }}
                    className={`btns ${dataFile ? 'theme-outline' : ''}`}
                  >
                    {t(`${translationPath}details`)}
                  </Button>
                </div>
                <div className={`schedule-button ${schedule ? 'selected' : ''}`}>
                  <Button
                    onClick={() => {
                      setSchedule(true);
                      setDataFile(false);
                    }}
                    className={`btns ${schedule ? 'theme-outline' : ''}`}
                  >
                    {t(`${translationPath}activities`)}
                  </Button>
                </div>
              </div>
            </div>
            {dataFile && (
              <div className='px-3 mb-3 slider-data is-referral'>
                <div className='items-title mb-3'>
                  {t(`${translationPath}personal-information`)}
                </div>
                {activeData.details &&
                  activeData.details.map((item, index) => (
                    <React.Fragment key={`detailsRef${index + 1}}`}>
                      {item.value && (
                        <div className='mb-3'>
                          <span className='texts gray-primary-bold'>
                            {t(`${translationPath}${item.title}`)}
                            :
                          </span>
                          <span className='texts s-gray-primary'>{`  ${item.value}`}</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            )}
            {schedule && (
              <div className='px-3 mb-3 slider-data is-referral'>
                {activities &&
                  activities.map((item, index) => (
                    <React.Fragment key={`detailsRef${index + 1}}`}>
                      <div className={`${index % 2 === 0 ? 'is-gray' : ''}`}>
                        <div className='items-title mb-2 mt-3'>
                          {t(`${translationPath}activity-id`)}
                          :
                          {`  ${item.activityId}`}
                        </div>
                        <div className='mb-2'>
                          <span className='texts gray-primary-bold'>
                            {t(`${translationPath}activity-type`)}
                            :
                          </span>
                          <span className='texts s-gray-primary'>
                            {`  ${item.activityType && item.activityType.activityTypeName}`}
                          </span>
                        </div>
                        <div className='mb-2'>
                          <span className='texts gray-primary-bold'>
                            {t(`${translationPath}activity-date`)}
                            :
                          </span>
                          <span className='texts s-gray-primary'>
                            {`  ${
                              item.activityDate && moment(item.activityDate).format('MM/DD/YYYY')
                            }`}
                          </span>
                        </div>
                        <div className='mb-2'>
                          <span className='texts gray-primary-bold'>
                            {t(`${translationPath}activity-time`)}
                            :
                          </span>
                          <span className='texts s-gray-primary'>
                            {`  ${
                              item.activityDate && moment(item.activityDate).format('hh:mm A')
                            }`}
                          </span>
                        </div>
                        <div className='mb-2'>
                          <span className='texts gray-primary-bold'>
                            {t(`${translationPath}status`)}
                            :
                          </span>
                          <span className='texts s-gray-primary'>
                            {`  ${
                              item.isOpen ?
                                t(`${translationPath}open`) :
                                t(`${translationPath}closed`)
                            }`}
                          </span>
                        </div>
                        <div className='mb-2'>
                          <span className='texts gray-primary-bold'>
                            {t(`${translationPath}remarks`)}
                            :
                          </span>
                          <span className='texts s-gray-primary'>
                            {`  ${item.comments && item.comments}`}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            )}
          </div>
          <div className='side-menu-actions'>
            <div className='d-flex-center'>
              <Button
                className='btns theme-solid mx-2 mb-2'
                onClick={() => setOpenConfirmDialog(true)}
              >
                <span className='icons i-folder-white' />
                <span className='mx-2'>{t(`${translationPath}update-activity`)}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      <ContactsActionDialogsComponent
        item={detailedCardAction.item}
        translationPath=''
        parentTranslationPath='ContactsView'
        isOpen={isOpenContactsActionDialog}
        actionEnum={detailedCardAction.actionEnum}
        isOpenChanged={() => setisOpenContactsActionDialog(false)}
      />
    </div>
  );
};
MyReferralsCardDetailsComponent.propTypes = {
  activeData: PropTypes.instanceOf(Object),
  translationPath: PropTypes.string.isRequired,
  setOpenConfirmDialog: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
MyReferralsCardDetailsComponent.defaultProps = {
  activeData: null,
};
