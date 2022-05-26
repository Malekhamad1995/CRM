import React, { useCallback, useState } from 'react';
import { ButtonBase, Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ContactTypeEnum, ActionsEnum, ContactPreferenceEnum } from '../../../../../Enums';
import { getDownloadableLink, showSuccess, sideMenuIsOpenUpdate } from '../../../../../Helper';
// import { ContactsPermissions } from '../../../../../Permissions';
import {
  Calendar,
  DfmSideMenuInformationComponent,
  DialogComponent,
  LoadableImageComponant,
  Spinner,
} from '../../../../../Components';
import { archivecontactsPut } from '../../../../../Services';
import { ArchiveState } from '../../../../../assets/json/StaticValue.json';

const translationPath = 'utilities.cardDetailsComponent.';
function CardDetailsComponent({
  activeData, cardDetailsActionClicked, relodedata, onActionClicked
}) {
  const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;
  const { t } = useTranslation('ContactsView');
  const [schedule, setSchedule] = useState(false);
  const [dataFile, setDataFile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setopen] = React.useState(false);

  const archiveContacts = useCallback(async () => {
    await archivecontactsPut(activeData.id);
    showSuccess(t(`${translationPath}Successarchive`));
    setopen(false);
    sideMenuIsOpenUpdate(false);
    relodedata();
  }, [activeData.id, relodedata, t]);

  return (
    <div className='contacts-card-detaild-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='archive-bbt'>
        <Button
          onClick={() => setopen(true)}
          disabled={ArchiveState}
          className='MuiButtonBase-root MuiButton-root MuiButton-text btns-icon theme-solid mx-2 mb-2'
          title={t(`${translationPath}Archivecontacts`)}
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
                alt={t(`${translationPath}user-image`)}
                src={
                  (activeData.imagePath && getDownloadableLink(activeData.imagePath)) ||
                  getDefaultContactImage(activeData.type)
                }
              />
            </div>
            <div className='d-flex-center flex-wrap mb-2'>
              {activeData.contactPreference && (
                <div className='actions-wrapper'>
                  {activeData.contactPreference.findIndex(
                    (el) => ContactPreferenceEnum.call.key === el.lookupItemId
                  ) !== -1 && (
                  <ButtonBase
                    className={`${ActionsEnum.phoneSolid.buttonClasses} mx-2 mb-2`}
                    onClick={onActionClicked(ActionsEnum.phoneSolid.key, activeData)}
                  >
                    <span className={ActionsEnum.phoneSolid.icon} />
                  </ButtonBase>
                    )}
                  {activeData.contactPreference.findIndex(
                    (el) => ContactPreferenceEnum.sms.key === el.lookupItemId
                  ) !== -1 && (
                  <ButtonBase
                    className={`${ActionsEnum.smsSolid.buttonClasses} mx-2 mb-2`}
                    onClick={onActionClicked(ActionsEnum.smsSolid.key, activeData)}
                  >
                    <span className={ActionsEnum.smsSolid.icon} />
                  </ButtonBase>
                    )}
                  {activeData.contactPreference.findIndex(
                    (el) => ContactPreferenceEnum.email.key === el.lookupItemId
                  ) !== -1 && (
                  <ButtonBase
                    className={`${ActionsEnum.emailSolid.buttonClasses} mx-2 mb-2`}
                    onClick={onActionClicked(ActionsEnum.emailSolid.key, activeData)}
                  >
                    <span className={ActionsEnum.emailSolid.icon} />
                  </ButtonBase>
                    )}
                  {activeData.contactPreference.findIndex(
                    (el) => ContactPreferenceEnum.whatsapp.key === el.lookupItemId
                  ) !== -1 && (
                  <ButtonBase
                    className={`${ActionsEnum.whatsappSolid.buttonClasses} mx-2 mb-2`}
                    onClick={onActionClicked(ActionsEnum.whatsappSolid.key, activeData)}
                  >
                    <span className={ActionsEnum.whatsappSolid.icon} />
                  </ButtonBase>
                    )}
                </div>
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
            <div className='details-content-wrapper'>
              {dataFile && (
                <div className='px-3 mb-3 slider-data'>
                  <DfmSideMenuInformationComponent
                    activeData={activeData}
                    setIsLoading={setIsLoading}
                    translationPath={translationPath}
                    t={t}
                  />
                </div>
              )}
              {schedule && (
                <div className='schedual-wrapper'>
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
                </div>
              )}
            </div>
            <div className='d-flex-center side-menu-actions'>
              <ButtonBase
                // disabled={
                //   loginResponse &&
                //   !loginResponse.permissions
                //     .map(
                //       (item) =>
                //         item.permissionsId === ContactsPermissions.ReadContacts.permissionsId
                //     )
                //     .includes(true)
                // }
                className='btns theme-solid mx-2 mb-2'
                onClick={cardDetailsActionClicked(ActionsEnum.folder.key, activeData)}
              >
                <span className='icons i-folder-white' />
                <span className='mx-2'>{t(`${translationPath}open-file`)}</span>
              </ButtonBase>
              <ButtonBase
                // disabled={
                //   loginResponse &&
                //   !loginResponse.permissions
                //     .map(
                //       (item) =>
                //         item.permissionsId === ContactsPermissions.CreateContacts.permissionsId
                //     )
                //     .includes(true)
                // }
                onClick={cardDetailsActionClicked(ActionsEnum.reportEdit.key, activeData)}
                className='btns mx-2 mb-2'
              >
                <span className='mdi mdi-pencil-outline' />
                <span className='mx-2'>{t(`${translationPath}edit`)}</span>
              </ButtonBase>
            </div>
          </div>
        </div>
      )}
      <DialogComponent
        isOpen={open}
        onCancelClicked={() => setopen(false)}
        onCloseClicked={() => setopen(false)}
        translationPath={translationPath}
        parentTranslationPath='ContactsView'
        titleText='Archivecontacts'
        onSubmit={(e) => {
          e.preventDefault();
          archiveContacts();
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}MassageArchiveContacts`)}</span>}
      />
    </div>
  );
}

CardDetailsComponent.propTypes = {
  activeData: PropTypes.instanceOf(Object),
  cardDetailsActionClicked: PropTypes.func,
  onActionClicked: PropTypes.func,
  relodedata: PropTypes.func,
};
CardDetailsComponent.defaultProps = {
  activeData: null,
  cardDetailsActionClicked: () => { },
  relodedata: () => { },
  onActionClicked: () => { },
};

export { CardDetailsComponent };
