import React, {
  useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  bottomBoxComponentUpdate,
  getErrorByName,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  AutocompleteComponent,
  CheckboxesComponent,
  DataFileAutocompleteComponent,
  DatePickerComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
} from '../../../../../../Components';
import {
  GetContacts,
  lookupItemsGetId,
  CreateOrUpdateReferences,
  GetOwnersKeyAccess,
  GetWorkOrderReference,
  contactsDetailsGet,
} from '../../../../../../Services';
import {
  WorkOrderRequestedby,
  CommunicationMedia,
  Availabletime,
  WeekDay,
} from '../../../../../../assets/json/StaticLookupsIds.json';
import { WorkOrderPPMScheduleVisitsDialog } from './Dialogs';

export const WorkOrderReferenceComponent = ({
  id,
  parentSaveRef,
  isFromDialog,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenPPMScheduleVisitsDialog, setIsOpenPPMScheduleVisitsDialog] = useState(false);
  const searchTimer = useRef(null);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    requestedBy: null,
    communicationMedia: null,
    keyAccess: null,
    contact: null,
    availableTime: null,
  });
  const [state, setState] = useReducer(reducer, {
    requestedById: null,
    communicationMediaId: null,
    ownerKeyAccessId: null,
    contactNo: null,
    isTenantPresent: false,
    availableTimeId: null,
    workOrderReferenceDays: [],
    problemsOrRemarks: null,
    remarks: null,
    workOrderReferencePPMScheduleVisits: [],
    tenantContact: null,
    tenantEmail: null,
    tenantId: null,
    tenantName: null
  });

  const schema = Joi.object({
    requestedById: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}requested-by-is-required`),
        'number.empty': t(`${translationPath}requested-by-is-required`),
        'any.required': t(`${translationPath}requested-by-is-required`),
      }),
    communicationMediaId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}communication-media-is-required`),
        'number.empty': t(`${translationPath}communication-media-is-required`),
        'any.required': t(`${translationPath}communication-media-is-required`),
      }),
    ownerKeyAccessId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}key-access-is-required`),
        'number.empty': t(`${translationPath}key-access-is-required`),
        'any.required': t(`${translationPath}key-access-is-required`),
      }),
    availableTimeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}available-time-is-required`),
        'number.empty': t(`${translationPath}available-time-is-required`),
        'any.required': t(`${translationPath}available-time-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const [requestedBy, setRequestedBy] = useState([]);
  const [communicationMedia, setCommunicationMedia] = useState([]);
  const [keyAccess, setKeyAccess] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [loadings, setLoadings] = useState({
    requestedBy: false,
    communicationMedia: false,
    keyAccess: false,
    contacts: false,
    availableTimes: false,
    availableDays: false,
  });
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const getAllRequestedBy = useCallback(async () => {
    setLoadings((items) => ({ ...items, requestedBy: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: WorkOrderRequestedby,
    });
    if (!(res && res.status && res.status !== 200)) setRequestedBy(res || []);
    else setRequestedBy([]);
    setLoadings((items) => ({ ...items, requestedBy: false }));
  }, []);
  const getAllCommunicationMedia = useCallback(async () => {
    setLoadings((items) => ({ ...items, communicationMedia: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: CommunicationMedia,
    });
    if (!(res && res.status && res.status !== 200)) setCommunicationMedia(res || []);
    else setCommunicationMedia([]);
    setLoadings((items) => ({ ...items, communicationMedia: false }));
  }, []);
  const getAllKeyAccess = useCallback(async () => {
    setLoadings((items) => ({ ...items, keyAccess: true }));
    const res = await GetOwnersKeyAccess();
    if (!(res && res.status && res.status !== 200)) setKeyAccess(res || []);
    else setKeyAccess([]);
    setLoadings((items) => ({ ...items, keyAccess: false }));
  }, []);
  const getAllAvailableTimes = useCallback(async () => {
    setLoadings((items) => ({ ...items, availableTimes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: Availabletime,
    });
    if (!(res && res.status && res.status !== 200)) setAvailableTimes(res || []);
    else setAvailableTimes([]);
    setLoadings((items) => ({ ...items, availableTimes: false }));
  }, []);
  const getAllAvailableDays = useCallback(async () => {
    setLoadings((items) => ({ ...items, availableDays: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: WeekDay,
    });
    if (!(res && res.status && res.status !== 200)) setAvailableDays(res || []);
    else setAvailableDays([]);
    setLoadings((items) => ({ ...items, availableDays: false }));
  }, []);
  const getAllContacts = useCallback(
    async (value) => {
      setLoadings((items) => ({ ...items, contacts: true }));
      const res = await GetContacts({ ...filter, search: value , isAdvance:false });
      if (!(res && res.status && res.status !== 200)) setContacts((res && res.result) || []);
      else setContacts([]);
      setLoadings((items) => ({ ...items, contacts: false }));
    },
    [filter]
  );
  const cancelHandler = () => {
    GlobalHistory.push('/home/work-orders/view');
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res = await CreateOrUpdateReferences({ ...state, workOrderId: id });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (state.workOrderReferenceId)
        showSuccess(t`${translationPath}work-order-reference-updated-successfully`);
      else showSuccess(t`${translationPath}work-order-reference-created-successfully`);
    } else if (state.workOrderReferenceId)
      showError(t(`${translationPath}work-order-reference-update-failed`));
    else showError(t`${translationPath}work-order-reference-create-failed`);
  }, [id, schema, state, t, translationPath]);
  const getContactById = useCallback(async (contactId) => {
    setIsLoading(true);
    const res = await contactsDetailsGet({ id: contactId });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getEditInit = useCallback(async () => {
    if (state.requestedById && !selected.requestedBy && requestedBy.length > 0) {
      const requestedByIndex = requestedBy.findIndex(
        (item) => item.lookupItemId === state.requestedById
      );
      if (requestedByIndex !== -1) {
        selected.requestedBy = requestedBy[requestedByIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
    if (
      state.communicationMediaId &&
      !selected.communicationMedia &&
      communicationMedia.length > 0
    ) {
      const communicationMediaIndex = communicationMedia.findIndex(
        (item) => item.lookupItemId === state.communicationMediaId
      );
      if (communicationMediaIndex !== -1) {
        selected.communicationMedia = communicationMedia[communicationMediaIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
    if (state.ownerKeyAccessId && !selected.keyAccess && keyAccess.length > 0) {
      const keyAccessIndex = keyAccess.findIndex(
        (item) => item.ownerKeyAccessId === state.ownerKeyAccessId
      );
      if (keyAccessIndex !== -1) {
        selected.keyAccess = keyAccess[keyAccessIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
    if (state.contactNo && !selected.contact && contacts.length > 0) {
      const contactIndex = contacts.findIndex((item) => item.contactsId === state.contactNo);
      if (contactIndex !== -1) selected.contact = contacts[contactIndex];
      else if (!isLoading) {
        const res = await getContactById(state.contactNo);
        if (res) {
          selected.contact = res;
          setContacts((items) => {
            items.push(res);
            return [...items];
          });
        } else setState({ id: 'contactNo', value: null });
      }
      setSelected({ id: 'edit', value: selected });
    }
    if (state.availableTimeId && !selected.availableTime && availableTimes.length > 0) {
      const availableTimeIndex = availableTimes.findIndex(
        (item) => item.lookupItemId === state.availableTimeId
      );
      if (availableTimeIndex !== -1) {
        selected.availableTime = availableTimes[availableTimeIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
  }, [availableTimes, communicationMedia, contacts, getContactById, isLoading, keyAccess, requestedBy, selected, state.availableTimeId, state.communicationMediaId, state.contactNo, state.ownerKeyAccessId, state.requestedById]);
  const getWorkOrderReference = useCallback(async () => {
    setIsLoading(true);
    const res = await GetWorkOrderReference({ workOrderId: id });
    if (!(res && res.status && res.status !== 200) && res) setState({ id: 'edit', value: res });
    setIsLoading(false);
  }, [id]);
  useEffect(() => {
    if (id) getWorkOrderReference();
  }, [getWorkOrderReference, id]);
  useEffect(() => {
    if (id) getEditInit();
  }, [id, getEditInit]);
  useEffect(() => {
    getAllRequestedBy();
    getAllCommunicationMedia();
    getAllKeyAccess();
    getAllContacts();
    getAllAvailableTimes();
    getAllAvailableDays();
  }, [
    getAllAvailableTimes,
    getAllCommunicationMedia,
    getAllContacts,
    getAllKeyAccess,
    getAllRequestedBy,
    getAllAvailableDays,
  ]);
  useEffect(() => {
    if (!isFromDialog) {
      bottomBoxComponentUpdate(
        <div className='d-flex-v-center-h-end flex-wrap'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
            <span>{t('Shared:cancel')}</span>
          </ButtonBase>
          <ButtonBase className='btns theme-solid mb-2' disabled={!id} onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </div>
      );
    }
  }, [id, isFromDialog, saveHandler, t]);
  useEffect(() => {
    if (parentSaveRef) parentSaveRef.current = saveHandler;
  }, [parentSaveRef, saveHandler]);
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='work-order-reference-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='work-order-reference-header'>
        <div className='header-item'>
          <span className='title-wrapper'>
            {t(`${translationPath}tenant-name`)}
            <span>:</span>
            {state.tenantId && (
              <ButtonBase
                className='btns theme-transparent'
                onClick={
                  () => {
                    GlobalHistory.push(`/home/Contacts-CRM/contact-profile-edit?formType=1&id=${state.tenantId}`);
                  }
                }
              >
                <span>{t(`${translationPath}open-file`)}</span>
              </ButtonBase>
            )}

          </span>
          <span className='description-wrapper'>{(state && state.tenantName) || ''}</span>
        </div>
        <div className='header-item'>
          <span className='title-wrapper'>
            {t(`${translationPath}tenant-contact`)}
            <span>:</span>
          </span>
          <span className='description-wrapper'>{(state && state.tenantContact) || ''}</span>
        </div>
        <div className='header-item'>
          <span className='title-wrapper'>
            {t(`${translationPath}tenant-email`)}
            <span>:</span>
          </span>
          <span className='description-wrapper'>{(state && state.tenantEmail) || ''}</span>
        </div>

      </div>
      <div className='work-order-reference-body'>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='requestedByIdRef'
            labelValue='requested-by'
            labelClasses='Requierd-Color'
            selectedValues={selected.requestedBy}
            multiple={false}
            data={requestedBy}
            displayLabel={(option) => option.lookupItemName || ''}
            getOptionSelected={(option) => option.lookupItemId === state.requestedById}
            withoutSearchButton
            helperText={getErrorByName(schema, 'requestedById').message}
            error={getErrorByName(schema, 'requestedById').error}
            isWithError
            isLoading={loadings.requestedBy}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'requestedBy', value: newValue });
              setState({
                id: 'requestedById',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='communicationMediaIdRef'
            labelValue='communication-media'
            labelClasses='Requierd-Color'
            selectedValues={selected.communicationMedia}
            multiple={false}
            data={communicationMedia}
            displayLabel={(option) => option.lookupItemName || ''}
            getOptionSelected={(option) => option.lookupItemId === state.communicationMediaId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'communicationMediaId').message}
            error={getErrorByName(schema, 'communicationMediaId').error}
            isWithError
            isLoading={loadings.communicationMedia}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'communicationMedia', value: newValue });
              setState({
                id: 'communicationMediaId',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='keyAccessIdRef'
            labelValue='key-access'
            labelClasses='Requierd-Color'
            selectedValues={selected.keyAccess}
            multiple={false}
            data={keyAccess}
            displayLabel={(option) => option.ownerKeyAccessName || ''}
            getOptionSelected={(option) => option.ownerKeyAccessId === state.ownerKeyAccessId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'ownerKeyAccessId').message}
            error={getErrorByName(schema, 'ownerKeyAccessId').error}
            isWithError
            isLoading={loadings.keyAccess}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'keyAccess', value: newValue });
              setState({
                id: 'ownerKeyAccessId',
                value: (newValue && newValue.ownerKeyAccessId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <DataFileAutocompleteComponent
            idRef='contactIdRef'
            labelValue='contact-name'
            selectedValues={selected.contact}
            multiple={false}
            data={contacts}
            displayLabel={(option) =>
              (option.contact &&
                (option.contact.first_name || option.contact.last_name) &&
                `${option.contact.first_name} ${option.contact.last_name}`) ||
              option.contact.company_name ||
              ''}
            getOptionSelected={(option) => option.contactsId === state.contactNo}
            withoutSearchButton
            helperText={getErrorByName(schema, 'contactNo').message}
            error={getErrorByName(schema, 'contactNo').error}
            isWithError
            isSubmitted={isSubmitted}
            isLoading={loadings.contacts}
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
              setSelected({ id: 'contact', value: newValue });
              setState({
                id: 'contactNo',
                value: (newValue && newValue.contactsId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <RadiosGroupComponent
            idRef='isTenantPresentRef'
            labelValue='is-tenant-present'
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
            value={state.isTenantPresent}
            parentTranslationPath={parentTranslationPath}
            translationPathForData={translationPath}
            translationPath={translationPath}
            labelInput='value'
            valueInput='key'
            onSelectedRadioChanged={(e, newValue) =>
              setState({ id: 'isTenantPresent', value: newValue === 'true' })}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='availableTimeIdRef'
            labelValue='available-time'
            labelClasses='Requierd-Color'
            selectedValues={selected.availableTime}
            multiple={false}
            data={availableTimes}
            displayLabel={(option) => option.lookupItemName || ''}
            getOptionSelected={(option) => option.lookupItemId === state.availableTimeId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'availableTimeId').message}
            error={getErrorByName(schema, 'availableTimeId').error}
            isWithError
            isLoading={loadings.availableTimes}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'availableTime', value: newValue });
              setState({
                id: 'availableTimeId',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <CheckboxesComponent
            idRef='workOrderReferenceDaysRef'
            labelValue='available-days'
            data={availableDays}
            isRow
            onSelectedCheckboxChanged={(item) => {
              const localDayIndex = state.workOrderReferenceDays ?
                state.workOrderReferenceDays.findIndex((element) => element === item.lookupItemId) :
                -1;
              if (localDayIndex !== -1) state.workOrderReferenceDays.splice(localDayIndex, 1);
              else if (state.workOrderReferenceDays)
                state.workOrderReferenceDays.push(item.lookupItemId);
              else state.workOrderReferenceDays = [item.lookupItemId];
              setState({
                id: 'workOrderReferenceDays',
                value: state.workOrderReferenceDays,
              });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            labelInput='lookupItemName'
            checked={(selectedItem) =>
              state.workOrderReferenceDays &&
              selectedItem.lookupItemId &&
              state.workOrderReferenceDays.indexOf(selectedItem.lookupItemId) !== -1}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='problemsOrRemarksRef'
            labelValue='problems-remarks'
            value={state.remarks}
            multiline
            rows={4}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'remarks', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <DatePickerComponent
            idRef='activityDateRef'
            labelValue={`${t(`${translationPath}ppm-schedule-visit`)} (${1})`}
            placeholder='DD/MM/YYYY'
            value={
              (state.workOrderReferencePPMScheduleVisits &&
                state.workOrderReferencePPMScheduleVisits.length > 0 &&
                state.workOrderReferencePPMScheduleVisits[0]) ||
              null
            }
            helperText={getErrorByName(schema, 'activityDate').message}
            error={getErrorByName(schema, 'activityDate').error}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onDateChanged={(newValue) => {
              if (newValue) {
                if (
                  !state.workOrderReferencePPMScheduleVisits ||
                  (state.workOrderReferencePPMScheduleVisits &&
                    state.workOrderReferencePPMScheduleVisits.length === 0)
                )
                  state.workOrderReferencePPMScheduleVisits = [newValue];
                else state.workOrderReferencePPMScheduleVisits.splice(0, 1, newValue);
              } else if (state.workOrderReferencePPMScheduleVisits)
                state.workOrderReferencePPMScheduleVisits.splice(0, 1);

              setState({
                id: 'workOrderReferencePPMScheduleVisits',
                value: state.workOrderReferencePPMScheduleVisits,
              });
            }}
            buttonOptions={{
              className: 'btns-icon theme-outline c-blue-lighter',
              iconClasses:
                state.workOrderReferencePPMScheduleVisits &&
                  state.workOrderReferencePPMScheduleVisits.length > 1 ?
                  'mdi mdi-eye-outline' :
                  'mdi mdi-plus',
              isDisabled: !(
                state.workOrderReferencePPMScheduleVisits &&
                state.workOrderReferencePPMScheduleVisits.length > 0
              ),
              isRequired: false,
              onActionClicked: () => setIsOpenPPMScheduleVisitsDialog(true),
            }}
          />
        </div>
      </div>
      {
        isOpenPPMScheduleVisitsDialog && (
          <WorkOrderPPMScheduleVisitsDialog
            stateWorkOrderPPMScheduleVisits={
              JSON.parse(JSON.stringify(state.workOrderReferencePPMScheduleVisits)) || []
            }
            isOpen={isOpenPPMScheduleVisitsDialog}
            isOpenChanged={() => {
              setIsOpenPPMScheduleVisitsDialog(false);
            }}
            onSave={(savedStateWorkOrderPPMScheduleVisits) => {
              setState({
                id: 'workOrderReferencePPMScheduleVisits',
                value: savedStateWorkOrderPPMScheduleVisits,
              });
              setIsOpenPPMScheduleVisitsDialog(false);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )
      }
    </div>
  );
};

WorkOrderReferenceComponent.propTypes = {
  id: PropTypes.number,
  parentSaveRef: PropTypes.instanceOf(Object),
  isFromDialog: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrderReferenceComponent.defaultProps = {
  id: undefined,
  isFromDialog: false,
  parentSaveRef: undefined,
};
