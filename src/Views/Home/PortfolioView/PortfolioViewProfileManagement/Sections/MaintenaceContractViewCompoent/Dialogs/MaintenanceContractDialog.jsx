import React, { useEffect, useState } from 'react';
import { DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GetParams, showError, showSuccess } from '../../../../../../../Helper';
import { MaintenanceContract, UpdateMaintenanceContract } from '../../../../../../../Services/MaintenanceContractsServices';
import Joi from 'joi';
import {AddMaintenanContractView} from '../../../../../MaintenanceContractsView/MaintenanceContractManagementView/AddMaintenanContractView/AddMaintenanContractView';
 

export const MaintenanceContractDialog =({

  activeItem,
  reloadData,
  parentTranslationPath,
  translationPath,
  open,
  isEdit,
  close

})=> {

  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [portfolioId , setPortfolioId] = useState(null);
  const [state , setstate] = useState(null);
  const [Loadings , setLoadings] = useState(false) ;
  const [isSubmittedDialog, setIsSubmittedDialog] = useState(false);
 
  
  const schema = Joi.object({

    contactId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}maintenance-company-required`),
        'number.empty': t(`${translationPath}maintenance-company-required`),
      }),
      
      portfolioId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}portfolio-is-required`),
        'number.empty': t(`${translationPath}portfolio-is-required`),
      }),


    propertyId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}property-name-is-required`),
        'number.empty': t(`${translationPath}property-name-is-required`),
      }),

      
      contractDate: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}contract-Date-is-required`),
        'date.empty': t(`${translationPath}contract-Date-is-required`),
      }),

      startDate: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}start-Date-is-required`),
        'date.empty': t(`${translationPath}start-Date-is-required`),
      }),

      endDate: Joi.date().greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.base': t(`${translationPath}endDate-is-required`),
        'date.empty': t(`${translationPath}endDate-is-required`),
        'date.greater':t(`${translationPath}select-end-date-after-start-date`),
      }),

      maintenanceContractServicesIds: Joi.array()
      .required()
      .min(1)
      .messages({
        'array.base': t(`${translationPath}maintenance-Contract-Services-is-required`),
        'array.empty': t(`${translationPath}maintenance-Contract-Services-is-required`),
        'array.min':  t(`${translationPath}should-have-a-minimum-length-of-service-offered`),
       
      }),

      
      amount: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amount-is-required`),
        'number.empty': t(`${translationPath}amount-is-required`),
      }),

      amountPaidBy: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amount-Paid-By-is-required`),
        'number.empty': t(`${translationPath}amount-Paid-By-is-required`),
      }),

      numberOfServices: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}number-Of-Services-is-required`),
        'number.empty': t(`${translationPath}number-Of-Services-is-required`),
      }),

      termOfPayment: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}term-Of-payment-is-required`),
        'number.empty': t(`${translationPath}term-Of-payment-is-required`),
      }),

      status: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}status-is-required`),
        'number.empty': t(`${translationPath}status-is-required`),
      }),

      amountType: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amountType-is-required`),
        'number.empty': t(`${translationPath}amountType-is-required`),
      })
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);


   useEffect(()=>{
    setPortfolioId(+GetParams("id")) ; 

   },[portfolioId]);

   

  const saveHandler = async () => {

   setIsSubmittedDialog(true) ;
   
    if(schema.error)
    {
      
      showError(t('Shared:please-fix-all-errors'));
      setLoadings(false);
      return;
    }
    setLoadings(true);
    const result = isEdit ?
      await UpdateMaintenanceContract(activeItem.maintenanceContractId, state) :
      await MaintenanceContract(state);


    if (!(result &&  result.data))
    { 

       if (isEdit !== true)
       { 

         showSuccess(t(`${translationPath}Addmaintenancecontractsuccessfully`));
       }
      
      else
     { 
       showSuccess(t(`${translationPath}Editmaintenancecontractsuccessfully`));
     }
      close();
      reloadData();
    
    }
    else
    {
      showError(t('Shared:please-fix-all-errors'));
     
    }
    setLoadings(false);
   
     
    
  };

  



  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='activities-Maintenance-Contract-dialog-wrapper'>
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}${(isEdit && 'EditMaintenancecontract') || 'AddMaintenancecontract'}`)}
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <div className='dialog-content-item'>

              {!isEdit && <AddMaintenanContractView   portfolioId={portfolioId} fromOutSide={true} setStates={setstate} reloadData={reloadData} outSideLoading={Loadings}  isSubmittedDialog={isSubmittedDialog} />}
              {isEdit && activeItem && <AddMaintenanContractView portfolioId={portfolioId} fromOutSide={true} editMaintenanceContract={activeItem} setStates={setstate} outSideLoading={Loadings}   reloadData={reloadData} isSubmittedDialog={isSubmittedDialog}  />}

              </div>
              </div>     
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase className='btns theme-solid'
              onClick={() =>saveHandler()}
             >
              {t(`${translationPath}${(isEdit && 'EditMaintenancecontract') || 'SaveMaintenancecontract'}`)}
            </ButtonBase>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );




    
    }

