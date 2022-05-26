import React, { useReducer, useState , useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi' ;
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  ButtonBase,
} from '@material-ui/core';
import { showError, showSuccess , getErrorByName } from '../../../../../../Helper';
import { AutocompleteComponent, Inputs } from '../../../../../../Components';
import { lookupItemsGetId  } from '../../../../../../Services' ; 
import { LeadCloseReasonsEnum } from '../../../../../../Enums';

const translationPath = 'LeadsView:utilities.closeleadsDialog.';
export const CloseLeadsDialog = ({ isOpen, onClose, parentTranslationPath , setCloseLeadObj , onSave ,  setIsLoading }) => {
  const { t } = useTranslation('LeadsView');
  // const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [closeLeadReasons , setCloseLeadReasons]  = useState([]);

    
  const reducer = (state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    if (action.id === 'edit') {
      return {
        ...action.value,
      };
    }
    return undefined;
  }


  const [state, setState] = useReducer(reducer, {
    closeReasonId: null,
    remarks: '',
  }); 

  const schema = Joi.object({
      closeReasonId: Joi.number()
      .required()
      .messages({
        'number.empty': t(`${translationPath}name-is-required`),
        'number.base': t(`${translationPath}activity-type-is-required`),
        'number.required': t(`${translationPath}leasing-type-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);


  const getAllCloseReasons = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({lookupTypeId : LeadCloseReasonsEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) {
      setCloseLeadReasons(res);
    } else {
      setCloseLeadReasons([]);
    }
    setIsLoading(false);
  }, []);

  


  const onSubmit = async (event) => {
    setIsSubmitted(true) ; 
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }
    onSave(state) ; 
  };

  useEffect(() => {
    getAllCloseReasons() ;
  }, []); 

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => onClose()}
        className='activities-management-dialog-wrapper'
        disableBackdropClick
        
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t(`${translationPath}close-leads`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper'>
            {/* <Spinner isActive={isLoading} isAbsolute /> */}
            <div className='dialog-content-item w-100'>
              <AutocompleteComponent
                idRef='closeReason'
                labelValue='closeReason'
                multiple={false}
                data={closeLeadReasons || []}
                displayLabel={(option) => ( (option &&  option.lookupItemName) || '' )}
                withoutSearchButton
                helperText={getErrorByName(schema, 'closeReasonId').message}
                error={getErrorByName(schema, 'closeReasonId').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setState({
                    id: 'closeReasonId',
                    value:(newValue && newValue.lookupItemId),
                  })
                 // setCloseLeadObj((item) => ({ ...item, closeReasonId:(newValue &&  newValue.lookupItemId) || null }));
                }}
              />
            </div>
            <div className='dialog-content-item w-100'>
              <Inputs
                idRef='remarksRef'
                labelValue='remarks'
                multiline
                rows={4}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  const { value } = event.target;
                  setState({
                    id: 'remarks',
                    value: value,
                  })
                }}
              />
            </div>

          </div>
        </DialogContent>
        <DialogActions>
      <div className='form-builder-wrapper'>
      <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
        <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
          <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
            <div className='cancel-wrapper d-inline-flex-center'>
              <ButtonBase
                className='MuiButtonBase-root MuiButton-root MuiButton-text cancel-btn-wrapper btns theme-transparent c-primary'
                tabIndex='0'
                onClick={() => onClose()}
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}cancel`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </ButtonBase>
            </div>
            <div className='save-wrapper d-inline-flex-center'>
              <ButtonBase
                className='MuiButtonBase-root MuiButton-root MuiButton-text save-btn-wrapper btns theme-solid bg-primary w-100 mx-2 mb-2'
                tabIndex='0'
                onClick={() => {
                  onSubmit();
                }}
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}save`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </ButtonBase>
            </div>
          </div>
        </div>
      </div>
      </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CloseLeadsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired ,
  onSave: PropTypes.func.isRequired ,
  setIsLoading :PropTypes.func.isRequired , 

};
