import React, { useState  , useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  ButtonBase,
} from '@material-ui/core';
import { Spinner, Inputs } from '../../../../../../Components';

const translationPath = 'UnitsView:utilities.OwnerDetailsDialog.';
export const OwnerDetailsDialog = ({ isOpen, onClose, ownerDetails }) => {

  const { t } = useTranslation('UnitsView');
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState({
    name: '',
    mobile: '',
    email: '',
    country: '',
    city: '',
    nationality: '' , 
    contactType :'' ,
    language:'' , 
    contactClass:''

  });

  useEffect(() => {
    if (ownerDetails) {
      setContact({
        name: (ownerDetails.first_name ?  ownerDetails.first_name + ' ' + ownerDetails.last_name : ownerDetails.company_name) || '',
        mobile: ( ownerDetails.landline_number && ownerDetails.landline_number.phone) || (ownerDetails.mobile && ownerDetails.mobile.phone) || '' ,
        email: (ownerDetails.email_address && ownerDetails.email_address.email ) || (ownerDetails.general_email && ownerDetails.general_email.email) ||''  , 
        country: (ownerDetails.country && ownerDetails.country.lookupItemName) || ''  ,
        city: (ownerDetails.city &&  ownerDetails.city.lookupItemName ) || '' ,
        nationality: (ownerDetails.nationality && ownerDetails.nationality.lookupItemName)|| (ownerDetails.company_nationality && ownerDetails.company_nationality.lookupItemName) || '' , 
        contactType:ownerDetails.contactTypeId  === 1 ? 'Individual' :'Corporate' , 
        language:(ownerDetails && ownerDetails.language &&  ownerDetails.language.lookupItemName ) || '', 
        contactClass :(ownerDetails.contact_class && ownerDetails.contact_class.lookupItemName  ) || (ownerDetails.company_class && ownerDetails.company_class.lookupItemName  )
      })

    }

  }, [ownerDetails]);


  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => {
          onClose();
        }}
        disableBackdropClick
        className='activities-management-dialog-wrapper'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t(`${translationPath}ownerDeatils`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper'>
            <Spinner isActive={isLoading} isAbsolute />
            <div className='dialog-content-item'>
              <Inputs
                idRef='contactTypeRef'
                labelValue='contactType'
                 isDisabled
                value={contact.contactType}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='nameRef'
                labelValue='name'
                 isDisabled
                value={contact.name}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='mobileRef'
                labelValue='mobile'
                isDisabled
                value={contact.mobile}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='emailRef'
                labelValue='email'
                isDisabled
                value={contact.email}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='countryRef'
                labelValue='country'
                isDisabled
                value={contact.country}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='cityRef'
                labelValue='city'
                isDisabled
                value={contact.city}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='nationalityRef'
                labelValue='nationality'
                isDisabled
                value={contact.nationality}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='languageRef'
                labelValue='language'
                isDisabled
                value={contact.language}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                idRef='contactClassRef'
                labelValue='contactClass'
                isDisabled
                value={contact.contactClass}
                parentTranslationPath={translationPath}
                translationPath={translationPath}
              />
            </div>

          </div>
        </DialogContent>
        <DialogActions>
          <div className='form-builder-wrapper'>
            <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
              <div className='MuiGrid-root-right'>
                <ButtonBase
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns'
                  onClick={() => {
                    onClose();
                  }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}cancel`)}
                    </span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>

              </div>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

OwnerDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ownerDetails: PropTypes.instanceOf(Object).isRequired,
};
