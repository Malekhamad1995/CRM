import React, { useCallback, useState } from 'react';
import {
  Button, DialogTitle, DialogContent, DialogActions, Dialog
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { CreateCompanyFinance } from '../../../../../../../Services';
import {
  getErrorByName, GetParams, setloginDialog, showError, showSuccess
} from '../../../../../../../Helper';
import { Inputs, PermissionsComponent } from '../../../../../../../Components';
import { PropertiesPermissionsCRM } from '../../../../../../../Permissions/PropertiesPermissions';

export const AddFinanceCompanyDialog = ({
  open, close, translationPath, t, reloadData
}) => {
  const defaultState = {
    companyName: '',
    termOfLoanYears: '',
    downPaymentPercentage: '',
    interestRate: '',
    remarks: '',
    propertyId: +GetParams('id'),
  };
  const [state, setState] = useState(defaultState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schema = Joi.object({
    companyName: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}company-name-is-required`),
        'string.empty': t(`${translationPath}company-name-is-required`),
      }),
    termOfLoanYears: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}term-of-loan-is-required`),
        'number.empty': t(`${translationPath}term-of-loan-is-required`),
      }),

    downPaymentPercentage: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}down-payment-is-required`),
        'number.empty': t(`${translationPath}down-payment-is-required`),
      }),
    interestRate: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}intrest-rate-is-required`),
        'number.empty': t(`${translationPath}intrest-rate-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,

    })
    .validate(state);

  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setloginDialog(false);
      return;
    }
    const result = await CreateCompanyFinance(state);
    if (!(result && result.status && result.status !== 200)) {
      reloadData();
      close(false);
      setState(defaultState);
      showSuccess(t(`${translationPath}company-finance-updated-successfully`));
    } else showError(t(`${translationPath}company-finance-updated-failed`));
  }, [close, defaultState, reloadData, schema.error, state, t, translationPath]);

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => {
        close(false);
        setIsSubmitted(true);
        setState(defaultState);
      }}
      className='add-new-company-finance'
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          close(false);
        }}
      >
        <DialogTitle>{t(`${translationPath}AddnewFinance`)}</DialogTitle>
        <DialogContent>
          <Inputs
            isRequired
            helperText={getErrorByName(schema, 'companyName').message}
            error={getErrorByName(schema, 'companyName').error}
            isWithError
            isSubmitted={isSubmitted}
            value={state.companyName}
            idRef='activitiesSearchRef'
            labelValue={t(`${translationPath}Companyname`)}
            labelClasses='Requierd-Color'
            onInputChanged={(e) => setState({ ...state, companyName: e.target.value })}
          />
          <Inputs
            isRequired
            helperText={getErrorByName(schema, 'termOfLoanYears').message}
            error={getErrorByName(schema, 'termOfLoanYears').error}
            isWithError
            isSubmitted={isSubmitted}
            value={state.termOfLoanYears}
            type='number'
            min={0}
            idRef='activitiesSearchRef'
            labelValue={t(`${translationPath}Termofloan`)}
            labelClasses='Requierd-Color'
            onInputChanged={(e) => setState({ ...state, termOfLoanYears: +e.target.value })}
          />
          <Inputs
            isRequired
            helperText={getErrorByName(schema, 'downPaymentPercentage').message}
            error={getErrorByName(schema, 'downPaymentPercentage').error}
            isWithError
            type='number'
            min={0}
            isSubmitted={isSubmitted}
            value={state.downPaymentPercentage}
            idRef='activitiesSearchRef'
            labelClasses='Requierd-Color'
            labelValue={t(`${translationPath}DownPayment`)}
            onInputChanged={(e) => setState({ ...state, downPaymentPercentage: +e.target.value })}
          />
          <Inputs
            isRequired
            helperText={getErrorByName(schema, 'interestRate').message}
            error={getErrorByName(schema, 'interestRate').error}
            isWithError
            type='number'
            min={0}
            isSubmitted={isSubmitted}
            value={state.interestRate}
            idRef='activitiesSearchRef'
            labelClasses='Requierd-Color'
            labelValue={t(`${translationPath}Interestrate`)}
            onInputChanged={(e) => setState({ ...state, interestRate: +e.target.value })}
          />
          <Inputs
            value={state.remarks}
            rows={4}
            rowsMax={10}
            multiline
            idRef='activitiesSearchRef'
            labelValue={t(`${translationPath}Remarks`)}
            onInputChanged={(e) => setState({ ...state, remarks: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button className='btns theme-solid bg-cancel' onClick={() => close(false)}>
            {t(`${translationPath}Cancel`)}
          </Button>
          <PermissionsComponent
            permissionsList={Object.values(PropertiesPermissionsCRM)}
            permissionsId={PropertiesPermissionsCRM.AddFinanceCompanyForPropertry.permissionsId}
          >
            <Button onClick={saveHandler} className='btns theme-solid' variant='contained'>
              {t(`${translationPath}AddNew`)}
            </Button>
          </PermissionsComponent>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AddFinanceCompanyDialog.propTypes = {
  translationPath: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
