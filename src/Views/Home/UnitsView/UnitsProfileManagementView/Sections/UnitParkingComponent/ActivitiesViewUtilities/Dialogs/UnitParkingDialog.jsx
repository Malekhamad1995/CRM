import React, {
  useCallback, useEffect, useReducer, useState
 } from 'react';
 import PropTypes from 'prop-types';
 import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
 } from '@material-ui/core';
 import { useTranslation } from 'react-i18next';
 import Joi from 'joi';
 import {
   AutocompleteComponent,
   Inputs,
   RadiosGroupComponent,
   Spinner,
 } from '../../../../../../../../Components';
 import Lookups from '../../../../../../../../assets/json/StaticLookupsIds.json';
 import {
  getErrorByName, GetParams, showError, showSuccess
 } from '../../../../../../../../Helper';
 import { lookupItemsGetId, UnitParkingAdd, unitParkingId } from '../../../../../../../../Services';

 export const ActivitiesManagementDialog = ({
   activeItem,
   onSave,
   parentTranslationPath,
   translationPath,
   open,
   isedit,
   close,
 }) => {
   const { t } = useTranslation([parentTranslationPath, 'Shared']);
   const [viewType, setViewType] = useState(1);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [parking, setparking] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingSpinner, setisLoadingSpinner] = useState(false);
   const reducer = useCallback((state, action) => {
     if (action.id !== 'edit') return { ...state, [action.id]: action.value };
     return {
       ...action.value,
     };
   }, []);

   const [state, setState] = useReducer(reducer, {
     unitId: +GetParams('id'),
     parkingTypeId: null,
     parkingNumber: null,
     numberOfSpaces: null,
     isPaid: true,
     annualCharge: null,
   });

   const [selected, setSelected] = useReducer(reducer, {
     Allparking: null,
   });

   const schema = Joi.object({
     parkingTypeId: Joi.number()
       .required()
       .messages({
         'number.base': t(`${translationPath}parking-type-is-required`),
         'number.empty': t(`${translationPath}parking-type-is-required`),
       }),
   })
     .options({
       abortEarly: false,
       allowUnknown: true,
     })
     .validate(state);

   const saveHandler = async (event) => {
     event.preventDefault();
     setIsSubmitted(true);
     setisLoadingSpinner(true);
     const res =
       (isedit && activeItem && (await unitParkingId(activeItem.unitParkingId, state))) ||
       (await UnitParkingAdd(state));
     setisLoadingSpinner(false);
     if (!(res && res.status && res.status !== 200)) {
       if (isedit) showSuccess(t`${translationPath}Parking-updated-successfully`);
       else showSuccess(t`${translationPath}Parking-created-successfully`);
       if (onSave) onSave();
     } else if (isedit) showError(t(`${translationPath}Parking-update-failed`));
     else showError(t`${translationPath}Parking-create-failed`);
   };
   const getAllparkingtype = useCallback(async () => {
     setIsLoading(true);
     const res = await lookupItemsGetId({
       lookupTypeId: Lookups.Allparkingtype,
     });
     if (!(res && res.status && res.status !== 200)) setparking(res || []);
     else setparking([]);
     setIsLoading(false);
   }, []);

   useEffect(() => {
     getAllparkingtype();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
     if (isedit) {
       setState({
         id: 'edit',
         value: {
           parkingNumber: activeItem.parkingNumber,
           unitId: activeItem.unitId,
           numberOfSpaces: activeItem.numberOfSpaces,
           isPaid: activeItem.isPaid,
           annualCharge: activeItem.annualCharge,
           parkingTypeId: activeItem.parkingTypeId,
         },
       });
       setViewType(activeItem.isPaid === true ? 1 : 0);
       setSelected({
         id: 'Allparking',
         value: {
           lookupItemId: activeItem.parkingTypeId,
           lookupItemName: activeItem.parkingTypeName,
         },
       });
     }
   }, [activeItem, isedit, parking]);

   const onViewTypeChangedHandler = (event, newValue) => {
     setViewType(+newValue);
     if (+newValue === 1) setState({ id: 'isPaid', value: true });
     else {
       setState({ id: 'isPaid', value: false });
       setState({ id: 'annualCharge', value: 0 });
     }
   };

   return (
     <div>
       <Dialog
         open={open}
         onClose={() => {
           close();
         }}
         className='Parking-management-dialog-wrapper'
       >
         <Spinner isActive={isLoadingSpinner} isAbsolute />
         <form noValidate onSubmit={saveHandler}>
           <DialogTitle id='alert-dialog-slide-title'>
             {t(`${translationPath}${(isedit && 'edit-Parking') || 'Add-new-Parking'}`)}
           </DialogTitle>
           <DialogContent>
             <div className='dialog-content-wrapper'>
               <div className='dialog-content-item'>
                 <AutocompleteComponent
                   idRef='ParkingtypeRef'
                   labelValue='Parkingtype'
                   selectedValues={selected.Allparking}
                   multiple={false}
                   data={parking && parking ? parking : []}
                   displayLabel={(option) => option.lookupItemName || ''}
                   getOptionSelected={(option) => option.lookupItemId === selected.parkingTypeId}
                   withoutSearchButton
                   isLoading={isLoading}
                   helperText={getErrorByName(schema, 'parkingTypeId').message}
                   error={getErrorByName(schema, 'parkingTypeId').error}
                   isWithError
                   isSubmitted={isSubmitted}
                   parentTranslationPath={parentTranslationPath}
                   translationPath={translationPath}
                   onChange={(event, newValue) => {
                     setSelected({ id: 'Allparking', value: newValue });
                     setState({
                       id: 'parkingTypeId',
                       value: (newValue && newValue.lookupItemId) || null,
                     });
                   }}
                 />
               </div>
               <div className='dialog-content-item-parking'>
                 <Inputs
                   idRef='ParkingNoRef'
                   labelValue='Parking-No'
                   value={state.parkingNumber || ''}
                   helperText={getErrorByName(schema, 'ParkingNo').message}
                   error={getErrorByName(schema, 'ParkingNo').error}
                   isWithError
                   isSubmitted={isSubmitted}
                   parentTranslationPath={parentTranslationPath}
                   translationPath={translationPath}
                   onInputChanged={(event) => {
                     setState({ id: 'parkingNumber', value: event.target.value });
                   }}
                 />
               </div>
               <div className='dialog-content-item-parking'>
                 <Inputs
                   idRef='numberOfSpacesRef'
                   labelValue='numberOfSpaces'
                   value={state.numberOfSpaces || ''}
                   helperText={getErrorByName(schema, 'numberOfSpaces').message}
                   error={getErrorByName(schema, 'numberOfSpaces').error}
                   isWithError
                   type='number'
                   isSubmitted={isSubmitted}
                   parentTranslationPath={parentTranslationPath}
                   translationPath={translationPath}
                   onInputChanged={(event) => {
                     setState({ id: 'numberOfSpaces', value: +event.target.value });
                   }}
                 />
               </div>
               <div className='dialog-content-item-parking'>
                 <div className='d-flex'>
                   <RadiosGroupComponent
                     idRef='viewDataRef'
                     data={[
                       { value: 1, label: t(`${translationPath}Paid`) },
                       { value: 0, label: t(`${translationPath}Unpaid`) },
                     ]}
                     value={viewType}
                     labelValue='Paidorunpaid'
                     labelInput='label'
                     valueInput='value'
                     type='number'
                     themeClass='theme-line'
                     parentTranslationPath={parentTranslationPath}
                     translationPath={translationPath}
                     translationPathForData={translationPath}
                     onSelectedRadioChanged={onViewTypeChangedHandler}
                   />
                 </div>
               </div>
               <div className='dialog-content-item-parking'>
                 <Inputs
                   idRef='ChargesRef'
                   labelValue='Chargesperannum(AED)'
                   value={state.annualCharge || ''}
                   helperText={getErrorByName(schema, 'Charges').message}
                   error={getErrorByName(schema, 'Charges').error}
                   isWithError
                   isDisabled={viewType !== 1}
                   isSubmitted={isSubmitted}
                   parentTranslationPath={parentTranslationPath}
                   translationPath={translationPath}
                   endAdornment={<span className='px-2'>{t(`${translationPath}AED`)}</span>}
                   onInputChanged={(event) => {
                     setState({ id: 'annualCharge', value: +event.target.value });
                   }}
                 />
               </div>
             </div>
           </DialogContent>
           <DialogActions>
             <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
               {t(`${translationPath}cancel`)}
             </ButtonBase>
             <ButtonBase className='btns theme-solid' type='submit'>
               {t(`${translationPath}${(isedit && 'edit-parking') || 'add-parking'}`)}
             </ButtonBase>
           </DialogActions>
         </form>
       </Dialog>
     </div>
   );
 };
 ActivitiesManagementDialog.propTypes = {
   activeItem: PropTypes.instanceOf(Object),
   onSave: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   isedit: PropTypes.bool.isRequired,
   close: PropTypes.func.isRequired,
   parentTranslationPath: PropTypes.string,
   translationPath: PropTypes.string,
 };
 ActivitiesManagementDialog.defaultProps = {
   activeItem: null,
   parentTranslationPath: '',
   translationPath: '',
 };
