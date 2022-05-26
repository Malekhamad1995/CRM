import React, { useCallback, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ContactTypeEnum, ActionsEnum } from '../../../../../Enums';
import { GlobalHistory, showSuccess, sideMenuIsOpenUpdate } from '../../../../../Helper';
import { Calendar, DialogComponent } from '../../../../../Components';
import { archiveLeadsPut } from '../../../../../Services';
import { ArchiveState } from '../../../../../assets/json/StaticValue.json';
import { CloseLeadDailog } from '../../..';
import { Closed } from '../../../../../assets/json/StaticLookupsIds.json';

const translationPath = 'utilities.cardDetailsComponent.';
function CardDetailsComponent({
  activeData, cardDetailsActionClicked, relodedata, onActionClicked
}) {
  const { t } = useTranslation('LeadsView');
  const [schedule, setSchedule] = useState(false);
  const [dataFile, setDataFile] = useState(true);
  const [open, setopen] = React.useState(false);
  const [isOpenclosed, setIsOpenclosed] = useState(false);
  const [hide, sethide] = React.useState(false);
  const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;

  const archiveLeads = useCallback(async () => {
    await archiveLeadsPut(activeData.id);
    showSuccess(t(`${translationPath}Successarchive`));
    setopen(false);
    sideMenuIsOpenUpdate(false);
    relodedata();
  }, []);
  const hideLeadsbbt = useCallback(async () => {
    sethide(true);
  }, []);

  useEffect(() => {
    sethide(false);
  }, [activeData.id]);
  return (
    <div className='leads-card-detaild-wrapper'>
      <div className='archive-bbt'>
        <Button
          onClick={() => setopen(true)}
          className='MuiButtonBase-root MuiButton-root MuiButton-text btns-icon theme-solid mx-2 mb-2'
          title={t(`${translationPath}ArchiveLead`)}
          disabled={ArchiveState}
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
              <img
                src={getDefaultContactImage(activeData.type)}
                className='details-img'
                alt={t(`${translationPath}lead-image`)}
              />
            </div>
            <div className='properety-plan d-flex-center mb-3'>{activeData.name}</div>
            <div className='d-flex-center flex-wrap mb-2'>
              {(activeData && activeData.contact_name && activeData.contact_name.email_address && (
                <Button
                  className={`${ActionsEnum.emailSolid.buttonClasses}  mx-2 mb-2`}
                  onClick={onActionClicked(ActionsEnum.emailSolid.key, activeData)}
                >
                  <span className={ActionsEnum.emailSolid.icon} />
                </Button>
              )) || ''}
              {activeData && activeData.contact_name && activeData.contact_name.mobile && (
                <Button
                  className={`${ActionsEnum.whatsappSolid.buttonClasses}  mx-2 mb-2`}
                  onClick={onActionClicked(ActionsEnum.whatsapp.key, activeData)}
                >
                  <span className={ActionsEnum.whatsappSolid.icon} />
                </Button>
              )}
              {activeData && activeData.contact_name && activeData.contact_name.mobile && (
                <Button
                  className={`${ActionsEnum.smsSolid.buttonClasses}  mx-2 mb-2`}
                  onClick={onActionClicked(ActionsEnum.smsSolid.key, activeData)}
                >
                  <span className={ActionsEnum.smsSolid.icon} />
                </Button>
              )}
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
            </div>
            {dataFile && (
              <div className='px-3 mb-3 slider-data'>
                <div className='items-title mb-3'>
                  {t(`${translationPath}personal-information`)}
                </div>
                {activeData.details &&
                  activeData.details.map((item, index) => (
                    <React.Fragment key={`detailsRef${index + 1}}`}>
                      {item.value && (
                        <div className='mb-3'>
                          <span className='texts gray-primary-bold'>
                            {`${item.title}`}
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
              <div className='slider-data'>
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
                  selectedDateChanged={() => { }}
                  selectedDate={new Date()}
                  events={{ selectedDays: [] }}
                  wrapperClasses='transparent-calender w-100'
                />
                {/* <div className='calender-type px-2'>
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
                </div> */}
              </div>
            )}
          </div>
          <div className='side-menu-actions'>
            <div className='d-flex-center'>
              <Button
                className='btns theme-solid mx-2 mb-2'
                onClick={cardDetailsActionClicked(ActionsEnum.folder.key, activeData)}
              >
                <span className='icons i-folder-white' />
                <span className='mx-2'>{t(`${translationPath}open-file`)}</span>
              </Button>
              <Button
                onClick={() => {
                  GlobalHistory.push(
                    `/home/leads/edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
                  );
                }}
                className='btns mx-2 mb-2'
                disabled={(activeData.status &&
                  activeData.status.lookupItemId === Closed)}
              >
                <span className='mdi mdi-pencil-outline' />
                <span className='mx-2'>{t(`${translationPath}edit`)}</span>
              </Button>
            </div>
            {(hide === false && (
              <div className='d-flex-center'>
                {activeData.status.lookupItemName === 'Open' ? (
                  <Button className='btns mx-2 mb-2' onClick={() => setIsOpenclosed(true)}>
                    <span className='mdi mdi-close-box-multiple-outline' />
                    <span className='mx-2'>{t(`${translationPath}close-lead`)}</span>
                  </Button>
                ) : null}
              </div>
            )) || ''}
          </div>
        </div>
      )}
      <DialogComponent
        isOpen={open}
        onCancelClicked={() => setopen(false)}
        translationPath={translationPath}
        parentTranslationPath='LeadsView'
        onCloseClicked={() => setopen(false)}
        titleText='ArchiveLeads'
        onSubmit={(e) => {
          e.preventDefault();
          archiveLeads();
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}MassageLeadsproperty`)}</span>}
      />
      <DialogComponent
        maxWidth='sm'
        saveType='button'
        saveText='confirm'
        titleText={t(`${translationPath}close-lead-reason`)}
        dialogContent={(
          <div className='my-leads-wrapper'>
            <CloseLeadDailog translationPath={translationPath} close={() => setIsOpenclosed(false)} hidebbt={hideLeadsbbt} reloadData={relodedata} activeData={activeData} />
          </div>
        )}
        onCloseClicked={() => setIsOpenclosed(false)}
        isOpen={isOpenclosed}
      />
    </div>
  );
}

CardDetailsComponent.propTypes = {
  activeData: PropTypes.instanceOf(Object),
  cardDetailsActionClicked: PropTypes.func,
};
CardDetailsComponent.defaultProps = {
  activeData: null,
  cardDetailsActionClicked: () => { },
};

export { CardDetailsComponent };
