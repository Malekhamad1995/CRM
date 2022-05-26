import React, { forwardRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Transition = forwardRef((props, ref) => (
  <Slide direction='down' ref={ref} {...props} />
));
Transition.displayName = 'DialogComponent';
export const DeleteDialogComponent = ({
  isOpen,
  wrapperClasses,
  titleClasses,
  contentClasses,
  footerClasses,
  closeClasses,
  nextPreviousWrapperClasses,
  previousClasses,
  nextClasses,
  saveCancelWrapperClasses,
  cancelWrapperClasses,
  cancelClasses,
  saveWrapperClasses,
  saveClasses,
  titleTextClasses,
  titleText,
  saveText,
  cancelText,
  closeIsDisabled,
  previousIsDisabled,
  nextIsDisabled,
  cancelIsDisabled,
  saveIsDisabled,
  dialogTitle,
  dialogContent,
  dialogActions,
  onCloseClicked,
  onNextClicked,
  onPreviousClicked,
  onCancelClicked,
  onSaveClicked,
  onSaveAndContinueClicked,
  onSubmit,
  translationPath,
  parentTranslationPath,
  translationPathShared,
  maxWidth,
  saveType,
  nextType,
  cancelType,
  previousType,
  disableBackdropClick,
  SmothMove
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <Dialog
      className={`dialog-wrapper ${wrapperClasses}`}
      onClose={onCloseClicked || onCancelClicked}
      open={isOpen}
      disableBackdropClick={disableBackdropClick}
      maxWidth={maxWidth}
      TransitionComponent={(SmothMove && Transition) || undefined}
      transitionDuration={(SmothMove && 700) || undefined}
    >
      <form className='w-100' noValidate onSubmit={onSubmit}>
        <DialogTitle className={`dialog-title-wrapper ${titleClasses}`}>
          {(!dialogTitle && (
            <>
              <span className={`dialog-title-text ${titleTextClasses}`}>
                {t(`${translationPath}${titleText}`)}
              </span>
              {onCloseClicked && (
                <Button
                  className={`close-btn-wrapper ${closeClasses}`}
                  onClick={onCloseClicked}
                  disabled={closeIsDisabled}
                >
                  <span className='mdi mdi-close' />
                </Button>
              )}
            </>
          )) ||
            dialogTitle}
        </DialogTitle>
        <DialogContent className={`dialog-content-wrapper ${contentClasses}`}>
          {dialogContent || undefined}
        </DialogContent>
        <DialogActions className={`dialog-footer-wrapper ${footerClasses}`}>
          {dialogActions ||
            ((onNextClicked || onPreviousClicked) && (
              <div className={`next-previous-wrapper ${nextPreviousWrapperClasses}`}>
                {(onPreviousClicked || previousType === 'submit') && (
                  <Button
                    className={previousClasses}
                    type={previousType}
                    onClick={onPreviousClicked}
                    disabled={previousIsDisabled}
                  >
                    <span>{t(`${translationPathShared}back`)}</span>
                  </Button>
                )}
                {(onNextClicked || nextType === 'submit') && (
                  <Button
                    className={nextClasses}
                    type={nextType}
                    onClick={onNextClicked}
                    disabled={nextIsDisabled}
                  >
                    <span>{t(`${translationPathShared}next`)}</span>
                  </Button>
                )}
              </div>
            ))}
          {dialogActions ||
            ((onCancelClicked || onSaveClicked) && (
              <div className={`save-cancel-wrapper ${saveCancelWrapperClasses}`}>
                {(onCancelClicked || cancelType === 'submit') && (
                  <div className={`cancel-wrapper ${cancelWrapperClasses}`}>
                    <Button
                      className={`cancel-btn-wrapper ${cancelClasses}`}
                      type={cancelType}
                      onClick={onCancelClicked}
                      disabled={cancelIsDisabled}
                    >
                      <span>
                        {t(
                          `${(cancelText === 'cancel' && translationPathShared) || translationPath
                          }${cancelText}`
                        )}
                      </span>
                    </Button>
                  </div>
                )}

                {(onSaveAndContinueClicked) && (
                  <div className={`save-wrapper ${saveWrapperClasses}`}>
                    <Button
                      className={`save-btn-wrapper ${cancelClasses}`}
                      type={saveType}
                      onClick={() => onSaveAndContinueClicked(true)}
                      disabled={saveIsDisabled}
                    >
                      <span>
                        {t(
                          `${translationPath}save and Continue`
                        )}
                      </span>
                    </Button>
                  </div>
                )}
                {(onSaveClicked || saveType === 'submit') && (
                  <div className={`save-wrapper ${saveWrapperClasses}`}>
                    <Button
                      className={`save-btn-wrapper ${saveClasses}`}
                      type={saveType}
                      onClick={onSaveClicked}
                      disabled={saveIsDisabled}
                    >
                      <span>
                        {t(
                          `${(saveText === 'save' && translationPathShared) || translationPath
                          }${saveText}`
                        )}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </DialogActions>
      </form>
    </Dialog>
  );
};

DeleteDialogComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  wrapperClasses: PropTypes.string,
  titleClasses: PropTypes.string,
  contentClasses: PropTypes.string,
  footerClasses: PropTypes.string,
  closeClasses: PropTypes.string,
  nextPreviousWrapperClasses: PropTypes.string,
  previousClasses: PropTypes.string,
  nextClasses: PropTypes.string,
  cancelWrapperClasses: PropTypes.string,
  cancelClasses: PropTypes.string,
  saveWrapperClasses: PropTypes.string,
  saveCancelWrapperClasses: PropTypes.string,
  saveClasses: PropTypes.string,
  titleTextClasses: PropTypes.string,
  titleText: PropTypes.string,
  saveText: PropTypes.string,
  cancelText: PropTypes.string,
  closeIsDisabled: PropTypes.bool,
  previousIsDisabled: PropTypes.bool,
  nextIsDisabled: PropTypes.bool,
  cancelIsDisabled: PropTypes.bool,
  saveIsDisabled: PropTypes.bool,
  dialogTitle: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  dialogContent: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  dialogActions: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  onCloseClicked: PropTypes.func,
  onNextClicked: PropTypes.func,
  onPreviousClicked: PropTypes.func,
  onCancelClicked: PropTypes.func,
  onSaveClicked: PropTypes.func,
  onSubmit: PropTypes.func,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  maxWidth: PropTypes.string,
  saveType: PropTypes.string,
  cancelType: PropTypes.string,
  nextType: PropTypes.string,
  previousType: PropTypes.string,
  SmothMove: PropTypes.bool,
  disableBackdropClick: PropTypes.bool
};
DeleteDialogComponent.defaultProps = {
  wrapperClasses: '',
  titleClasses: '',
  contentClasses: '',
  footerClasses: '',
  closeClasses: 'btns-icon theme-solid bg-danger mx-2 mb-2',
  nextPreviousWrapperClasses: 'd-flex-v-center-h-between flex-wrap p-2',
  saveCancelWrapperClasses: 'd-flex-v-center-h-end flex-wrap p-2',
  previousClasses: 'btns theme-outline',
  nextClasses: 'btns theme-solid bg-secondary',
  cancelWrapperClasses: 'd-inline-flex-center',
  cancelClasses: 'btns theme-transparent c-primary',
  saveWrapperClasses: 'd-inline-flex-center',
  saveClasses: 'btns theme-solid bg-primary',
  titleTextClasses: '',
  titleText: undefined,
  saveText: 'save',
  cancelText: 'cancel',
  closeIsDisabled: false,
  previousIsDisabled: false,
  nextIsDisabled: false,
  cancelIsDisabled: false,
  saveIsDisabled: false,
  dialogTitle: undefined,
  dialogContent: undefined,
  dialogActions: undefined,
  onCloseClicked: undefined,
  onNextClicked: undefined,
  onPreviousClicked: undefined,
  onCancelClicked: undefined,
  onSaveClicked: undefined,
  onSubmit: undefined,
  disableBackdropClick: false,
  SmothMove: undefined,
  translationPath: '',
  parentTranslationPath: '',
  translationPathShared: 'Shared:',
  maxWidth: 'md',
  saveType: 'submit',
  cancelType: undefined,
  nextType: undefined,
  previousType: undefined,
};
