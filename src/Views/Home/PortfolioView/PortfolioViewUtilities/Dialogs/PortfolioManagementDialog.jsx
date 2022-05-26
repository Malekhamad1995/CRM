import React, {
 useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import {
 DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  Inputs,
  RadiosGroupComponent,
  UploaderComponent,
} from '../../../../../Components';
import { PostPortfolio, OrganizationUserSearch, GetContacts } from '../../../../../Services';
import { showError, showSuccess } from '../../../../../Helper';
import { getErrorByName } from '../../../../../Helper/Middleware.Helper';
import { Spinner } from '../../../../../Components/SpinnerComponent/Spinner';

export const PortfolioManagementDialog = ({
  parentTranslationPath,
  translationPath,
  open,
  close,
  onSave,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchTimer = useRef(null);
  const [propertyManagers, setPropertyManagers] = useState([]);
  const [workOrders, setQorkOrders] = useState([]);
  const [contactPerson, setContactPerson] = useState([]);

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [state, setState] = useReducer(reducer, {
    portfolioName: '',
    description: '',
    propertyManagersId: '',
    ccWorkOrdersToId: '',
    contactPersonId: '',
    managementFee: 0,
    managementFeePercentage: 0,
    remark: '',
    fileId: null,
    fileName: null,
    isActive: true,
  });

  const schema = Joi.object({
    propertyManagersId: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}propertyManagersId-is-required`,
      }),

      managementFeePercentage: Joi.number()
      .required()
      .min(1)
      .messages({
        'number.base': t`${translationPath}managementFeePercentage-is-required`,
        'number.empty': t`${translationPath}managementFeePercentage-is-required`,
        'number.min': t(`${translationPath}managementFeePercentage-is-required`),
      }),

      ccWorkOrdersToId: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}ccWorkOrdersToId-is-required`),
      }),
      contactPersonId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}contactPersonId-is-required`),
        'number.empty': t(`${translationPath}contactPersonId-is-required`),
      })
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const getAllPropertyManagers = useCallback(async (value) => {
    const res = await OrganizationUserSearch(value);
    if (!(res && res.status && res.status !== 200)) setPropertyManagers(res);
    else setPropertyManagers({});
  }, []);

  const getAllWorkOrders = useCallback(async (value) => {
    const res = await OrganizationUserSearch(value);
    if (!(res && res.status && res.status !== 200)) setQorkOrders(res);
    else setQorkOrders({});
  }, []);

  const getAllContacts = useCallback(async (value) => {
    const res = await GetContacts({ pageIndex: 0, pageSize: 25, search: value , isAdvance:false });
    if (!(res && res.status && res.status !== 200)) setContactPerson(res);
    else setContactPerson({});
  }, []);
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    setIsLoading(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }
    const res = await PostPortfolio(state);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}portfolio-created-successfully`));
      onSave();
    } else showError(t(`${translationPath}portfolio-create-failed`));
  }, [onSave, state, t, translationPath, schema.error]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='portfoilio-management-dialog-wrapper'
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}add-new-portfolio`)}
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <Spinner isActive={isLoading} isAbsolute />
              <div className='dialog-content-item'>
                <Inputs
                  idRef='portfolioNameRef'
                  labelValue='portfolio-name'
                  value={state.portfolioName || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'portfolioName', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  labelClasses='Requierd-Color'
                  idRef='propertyManagersRef'
                  labelValue='property-managerReq'
                  multiple={false}
                  data={(propertyManagers && propertyManagers.result) || []}
                  displayLabel={(option) => option.fullName || ''}
                  renderOption={(option) => option.fullName || ''}
                  withoutSearchButton
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'propertyManagersId').message}
                  error={getErrorByName(schema, 'propertyManagersId').error}
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllPropertyManagers({ pageIndex: 1, pageSize: 25, name: value });
                    }, 700);
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setState({
                      id: 'propertyManagersId',
                      value: (newValue && newValue.id) || null,
                    });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='managementFeeRef'
                  labelValue='management-fees'
                  type='number'
                  min={0}
                  value={state.managementFee || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'managementFee', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='managementFeePercentageRef'
                  labelValue='management-fees-%Req'
                  labelClasses='Requierd-Color'
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'managementFeePercentage').message}
                  error={getErrorByName(schema, 'managementFeePercentage').error}
                  type='number'
                  min={0}
                  value={state.managementFeePercentage || 0}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'managementFeePercentage', value: +event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <DataFileAutocompleteComponent
                  idRef='contactPersonRef'
                  labelValue='contact-personReq'
                  labelClasses='Requierd-Color'
                  multiple={false}
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'contactPersonId').message}
                  error={getErrorByName(schema, 'contactPersonId').error}
                  data={(contactPerson && contactPerson.result) || []}
                  displayLabel={(option) =>
                    option.contact &&
                    option.contact.contact_type_id &&
                    (option.contact.contact_type_id === 2 ?
                      `${option.contact.company_name}` :
                      `${option.contact.first_name} ${option.contact.last_name}` || '')}
                  withoutSearchButton
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllContacts(value);
                    }, 700);
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setState({
                      id: 'contactPersonId',
                      value: (newValue && +newValue.contactsId) || null,
                    });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='workOrdersRef'
                  labelValue='cc-work-orderReq'
                  labelClasses='Requierd-Color'
                  multiple={false}
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'ccWorkOrdersToId').message}
                  error={getErrorByName(schema, 'ccWorkOrdersToId').error}
                  data={(workOrders && workOrders.result) || []}
                  displayLabel={(option) => option.fullName || ''}
                  renderOption={(option) => option.fullName || ''}
                  withoutSearchButton
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllWorkOrders({ name: value });
                    }, 700);
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setState({
                      id: 'ccWorkOrdersToId',
                      value: (newValue && newValue.id) || null,
                    });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='remarksRef'
                  labelValue='remarks'
                  multiline
                  rows={4}
                  value={state.remark || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'remark', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='descriptionRef'
                  labelValue='description'
                  multiline
                  rows={4}
                  value={state.description || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'description', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item is-active'>
                <RadiosGroupComponent
                  idRef='isNegotiableRef'
                  labelValue='is-active'
                  data={[
                    {
                      key: true,
                      value: 'yes',
                    },
                    {
                      key: false,
                      value: 'no',
                    },
                  ]}
                  value={state.isActive || false}
                  parentTranslationPath={parentTranslationPath}
                  translationPathForData={translationPath}
                  translationPath={translationPath}
                  labelInput='value'
                  valueInput='key'
                  onSelectedRadioChanged={(e, newValue) =>
                    setState({ id: 'isActive', value: newValue === 'true' })}
                />
              </div>
              <div className='dialog-content-item'>
                <UploaderComponent
                  isOpenGallery
                  labelClasses='mt-2 ml-2 mr-2'
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  labelValue='upload-logo'
                  idRef='contactsImportRef'
                  uploadedChanged={(files) => {
                    setState({ id: 'fileId', value: files && files[0] && files[0].uuid });
                    setState({ id: 'fileName', value: files && files[0] && files[0].fileName });
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase className='btns theme-solid' onClick={saveHandler}>
              {t(`${translationPath}add-new`)}
            </ButtonBase>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
PortfolioManagementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};
PortfolioManagementDialog.defaultProps = {
  parentTranslationPath: '',
  translationPath: '',
};
