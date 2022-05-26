import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ContactTypeEnum, ActionsEnum } from '../../../../../Enums';
import { getDownloadableLink, showSuccess, sideMenuIsOpenUpdate } from '../../../../../Helper';
import { DialogComponent, LoadableImageComponant } from '../../../../../Components';
import { archivePropertyPut } from '../../../../../Services';
import { ArchiveState } from '../../../../../assets/json/StaticValue.json';

const translationPath = 'utilities.cardDetailsComponent.';
function CardDetailsComponent({
  activeData, cardDetailsActionClicked, relodedata
}) {
  const { t } = useTranslation('PropertiesView');
  const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;
  const [open, setopen] = React.useState(false);

  const archiveProperty = useCallback(async () => {
    await archivePropertyPut(activeData.id);
    showSuccess(t(`${translationPath}Successarchive`));
    setopen(false);
    sideMenuIsOpenUpdate(false);
    relodedata();
  }, [activeData.id, relodedata, t]);


  return (
    <div className='properity-card-detaild-wrapper'>
      <div className='archive-bbt'>
        <Button
          onClick={() => setopen(true)}
          disabled={ArchiveState}
          className='MuiButtonBase-root MuiButton-root MuiButton-text btns-icon theme-solid mx-2 mb-2'
          title={t(`${translationPath}ArchiveProperty`)}
        >
          <span className='MuiButton-label'>
            <span className='mdi mdi-inbox-multiple' />
          </span>
          <span className='MuiTouchRipple-root' />
        </Button>
      </div>
      {activeData && (
        <div className='side-menu-wrapper'>
          <div>
            <div className='d-flex-center mb-3'>
              <LoadableImageComponant
                classes='details-img'
                alt={t(`${translationPath}property-image`)}
                src={
                  (activeData.allpropertyImages &&
                    activeData.allpropertyImages[0] &&
                    getDownloadableLink(activeData.allpropertyImages[0].fileId)) ||
                  getDefaultContactImage(activeData.type)
                }
              />
            </div>
            <div className='properety-plan d-flex-center mb-3'>{activeData.name}</div>
            {/* <div className='d-flex-center flex-wrap mb-2'>
              {userActions.map((item, index) => (
                <Button
                  key={`userActions${index + 1}`}
                  className={`${getUserActionValue(item.key).buttonClasses} mx-2 mb-2`}
                >
                  <span className={getUserActionValue(item.key).icon} />
                </Button>
              ))}
            </div> */}
            {/* <div className='d-flex-center mb-3 '>
              <div className='data-schedule-button'>
                <div className={`data-file-button ${dataFile ? 'selected' : ''}`}>
                  <Button
                    onClick={() => {
                      setSchedule(false);
                      setDataFile(true);
                    }}
                    className={`btns ${dataFile ? 'theme-outline' : ''}`}
                  >
                    {t(`${translationPath}data-file`)}
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
                    {t(`${translationPath}schedule`)}
                  </Button>
                </div>
              </div>
            </div> */}
            {/* {dataFile && ( */}
            <div className='details-content-wrapper slider-data'>
              <div className='px-3 mb-3 items-title mb-3'>
                {t(`${translationPath}property-details`)}
              </div>
              {activeData.details &&
                activeData.details.map((item, index) => (
                  <React.Fragment key={`detailsRef${index + 1}}`}>
                    {item.value && item.value !== 'N/A' && (
                      <div className='px-3 mb-3'>
                        <span an className='texts gray-primary-bold'>
                          {`${t(`${translationPath}${item.title}`)}`}
                          :
                        </span>
                        <span className='texts s-gray-primary'>{`  ${item.value}`}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </div>
            {/* )} */}
            {/* {schedule && (
              <div>
                <div className='priority-types mb-3'>
                  <div className='priority-type ml-2 mr-2'>
                    <div className='high-badge ml-2 mr-2' />
                    {t(`${translationPath}high`)}
                  </div>
                  <div className='priority-type ml-2 mr-2'>
                    <div className='medium-badge ml-2 mr-2' />
                    {t(`${translationPath}medium`)}
                  </div>
                  <div className='priority-type ml-2 mr-2'>
                    <div className='low-badge ml-2 mr-2' />
                    {t(`${translationPath}low`)}
                  </div>
                </div>
                <Calendar
                  selectedDateChanged={() => {}}
                  selectedDate={new Date()}
                  events={{ selectedDays: [] }}
                  wrapperClasses='transparent-calender w-100'
                />
                <div className='calender-type px-2'>
                  <div className='calender-type-name'>
                    <div className='low-badge ml-2 mr-2' />
                    <div className='badge-info px-1'>
                      <div className='badge-name'>Meeting with Ahmad</div>
                      <div className='badge-time mt-1'>Today</div>
                    </div>
                  </div>
                  <div className='low-badge-time'>15:00</div>
                </div>
                <div className='pl-4-reversed pr-3-reversed mb-3'>
                  <span className='separator-h d-flex' />
                </div>

                <div className='calender-type px-2'>
                  <div className='calender-type-name'>
                    <div className='medium-badge ml-2 mr-2' />
                    <div className='badge-info px-1'>
                      <div className='badge-name'>Call Ahmad</div>
                      <div className='badge-time mt-1'>Today</div>
                    </div>
                  </div>
                  <div className='medium-badge-time'>18:00</div>
                </div>
                <div className='pl-4-reversed pr-3-reversed mb-3'>
                  <span className='separator-h d-flex' />
                </div>
              </div>
            )} */}
          </div>
          <div className='d-flex-center side-menu-actions'>
            <Button
              className='btns theme-solid mx-2 mb-2'
              onClick={cardDetailsActionClicked(ActionsEnum.folder.key, activeData)}
            >
              <span className='icons i-folder-white' />
              <span className='mx-2'>{t(`${translationPath}open-file`)}</span>
            </Button>
            <Button
              onClick={cardDetailsActionClicked(ActionsEnum.reportEdit.key, activeData)}
              className='btns mx-2 mb-2'
            >
              <span className='mdi mdi-pencil-outline' />
              <span className='mx-2'>{t(`${translationPath}edit`)}</span>
            </Button>
          </div>
        </div>
      )}
      <DialogComponent
        isOpen={open}
        onCancelClicked={() => setopen(false)}
        translationPath={translationPath}
        onCloseClicked={() => setopen(false)}
        parentTranslationPath='PropertiesView'
        titleText='ArchiveProperty'
        onSubmit={(e) => {
          e.preventDefault();
          archiveProperty();
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}MassageArchiveproperty`)}</span>}
      />
    </div>
  );
}

CardDetailsComponent.propTypes = {
  activeData: PropTypes.instanceOf(Object),
  cardDetailsActionClicked: PropTypes.func,
  relodedata: PropTypes.func,
};
CardDetailsComponent.defaultProps = {
  activeData: null,
  relodedata: () => { },
  cardDetailsActionClicked: () => { },
};
export { CardDetailsComponent };
