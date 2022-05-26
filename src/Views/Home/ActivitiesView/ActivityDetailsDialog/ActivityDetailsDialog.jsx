import React, {
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  DatePickerComponent,
  Inputs,
  SwitchComponent,
} from '../../../../Components';

export const ActivityDetailsDialog = ({
  open,
  close,
  parentTranslationPath,
  translationPath,
  activeItem
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        disableBackdropClick
        className='activities-management-dialog-wrapper'
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}${'activity-Details'}`)}
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <div className='dialog-content-item'>
                <Inputs
                  isDisabled
                  idRef='activityTypeNameRef'
                  labelValue='activity-type'
                  value={activeItem.activityTypeName || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  isDisabled
                  idRef='activity-assignRef'
                  labelValue='activity-assign-to'
                  value={activeItem.agentName || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className='dialog-content-item'>
                {activeItem && activeItem.relatedUnitNumberId &&
                  (
                    <Inputs
                      isDisabled
                      idRef='relatedUnitNumberRef'
                      labelValue='related-Unit-Number'
                      value={activeItem.relatedUnitNumber || ''}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}

              </div>
              {activeItem && activeItem.relatedLeadNumberId &&
                (
                  <div className='dialog-content-item'>
                    <Inputs
                      isDisabled
                      idRef='relatedLeadNumberRef'
                      labelValue='related-to-Lead-Number'
                      value={activeItem.relatedLeadNumberId || ''}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />

                  </div>
                )}
              {activeItem && activeItem.relatedWorkOrderId &&
                (
                  <div className='dialog-content-item'>
                    <Inputs
                      isDisabled
                      idRef='relatedWorkOrderRefNumber'
                      labelValue='relatedWorkOrderRefNumber'
                      value={activeItem.relatedWorkOrderRefNumber || ''}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />

                  </div>
                )}
              {activeItem && activeItem.relatedPortfolioId &&
                (
                  <div className='dialog-content-item'>
                    <Inputs
                      isDisabled
                      idRef='relatedPortfolioName'
                      labelValue='relatedPortfolioName'
                      value={activeItem.relatedPortfolioName || ''}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />

                  </div>
                )}
              {activeItem && activeItem.relatedMaintenanceContractId &&
                (
                  <div className='dialog-content-item'>
                    <Inputs
                      isDisabled
                      idRef='relatedMaintenanceContractId'
                      labelValue='relatedMaintenanceContractId'
                      value={activeItem.relatedMaintenanceContractId || ''}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />

                  </div>
                )}

              <div className='dialog-content-item'>
                <DatePickerComponent
                  isDisabled
                  idRef='activityDateRef'
                  labelValue='activity-date'
                  placeholder='DD/MM/YYYY'
                  value={
                    activeItem.activityDate ? activeItem.activityDate : moment().format('YYYY-MM-DDTHH:mm:ss')
                  }
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onDateChanged={(newValue) => {
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <DatePickerComponent
                  idRef='activityTimeRef'
                  labelValue='activity-time'
                  isDisabled
                  isTimePicker
                  value={
                    activeItem.activityDate ?
                      activeItem.activityDate :
                      moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss')
                  }
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}

                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  isDisabled
                  idRef='stageRef'
                  labelValue='stage'
                  value={
                    (activeItem.leadStageName) ||
                    t(`${translationPath}not-contacted`)
                  }
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  isDisabled
                  idRef='subjectRef'
                  labelValue='subject'
                  value={activeItem.subject || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className='dialog-content-item'>
                <SwitchComponent
                  isDisabled
                  idRef='isOpenStatusRef'
                  isChecked={activeItem.isOpen}
                  themeClass='theme-line'
                  labelValue={(activeItem.isOpen && 'open') || 'closed'}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}

                />
              </div>
              <div className='dialog-content-item w-100'>
                <Inputs
                  isDisabled
                  idRef='commentsRef'
                  labelValue='comments'
                  value={activeItem.comments || ''}
                  multiline
                  rows={4}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>

            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
          </DialogActions>
        </form>
      </Dialog>
    </div>

  );
};
ActivityDetailsDialog.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,

};
