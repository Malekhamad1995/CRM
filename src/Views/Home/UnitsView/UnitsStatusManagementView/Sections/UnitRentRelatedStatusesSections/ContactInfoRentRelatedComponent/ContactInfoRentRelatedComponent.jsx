import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { ButtonBase } from '@material-ui/core';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  Tables,
} from '../../../../../../../Components';
import {
  contactsDetailsGet,
  GetAllLeadsByContactId,
  GetContacts,
} from '../../../../../../../Services';
import { getErrorByName, showError } from '../../../../../../../Helper';
import { ContactsDialog } from '../../../../../FormBuilder/Dialogs/ContactsDialog';
import { CONTACTS, LEADS } from '../../../../../../../config/pagesName';
import { TableActions } from '../../../../../../../Enums';
import './ContactInfoRentRelatedComponent.scss'
export const ContactInfoRentRelatedComponent = ({
  state,
  //   schema,
  //   isSubmitted,
  unitTransactionId,
  selected,
  onSelectedChanged,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isOpenContactDialog, setIsOpenContactDialog] = useState(false);
  const [isOpenLeadDialog, setIsOpenLeadDialog] = useState(false);
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState({
    contact: false,
    lead: false,
  });
  const [localIsSubmitted, setLocalIsSubmitted] = useState(false);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState({
    contact: '',
    lead: '',
  });
  const [localState, setLocalState] = useState({
    contact: null,
    lead: null,
  });
  const [contacts, setContacts] = useState({
    result: [],
    totalCount: 0,
  });
  const [leads, setLeads] = useState({
    result: [],
    totalCount: 0,
  });
  const getContacts = useCallback(async () => {
    setIsLoading((items) => ({ ...items, contact: true }));
    const response = await GetContacts({ ...filter, search: search.contact , isAdvance:false });
    if (!(response && response.status && response.status !== 200)) {
      setContacts({
        result: (response && response.result) || [],
        totalCount: (response && response.totalCount) || 0,
      });
    } else {
      setContacts({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((items) => ({ ...items, contact: false }));
  }, [filter, search.contact]);
  const getLeads = useCallback(async (contactId) => {
    setIsLoading((items) => ({ ...items, lead: true }));
    const response = await GetAllLeadsByContactId({ pageIndex: 0, pageSize: 1000,referredTo: state.agentId }, contactId);
    if (!(response && response.status && response.status !== 200)) {
      setLeads({
        result: (response && response.result) || [],
        totalCount: (response && response.totalCount) || 0,
      });
    } else {
      setLeads({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((items) => ({ ...items, lead: false }));
  }, []);
  const localSchema = Joi.object({
    contact: Joi.object()
      .required()
      .messages({
        'object.base': t(`${translationPath}contact-is-required`),
      }),
    lead: Joi.object()
      .required()
      .messages({
        'object.base': t(`${translationPath}lead-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(localState);
  const searchHandler = (key) => (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch((items) => ({ ...items, [key]: value }));
    }, 700);
  };
  const contactAddHandler = () => {
    localStorage.setItem('current', JSON.stringify({ itemId: CONTACTS }));
    setIsOpenContactDialog(true);
  };
  const leadAddHandler = () => {
    localStorage.setItem('current', JSON.stringify({ itemId: LEADS }));
    setIsOpenLeadDialog(true);
  };
  const deleteContact = useCallback(
    (item, index) => {
      const stateContactsLocal = [...state.contacts];
      const stateContactIndex = stateContactsLocal.findIndex(
        (element) => item.contactId === element.contactId && item.leadId === element.leadId
      );
      if (stateContactIndex !== -1) {
        stateContactsLocal.splice(stateContactIndex, 1);
        onStateChanged({ id: 'contacts', value: stateContactsLocal });
      }
      const localContacts = [...selected.tableContacts];
      localContacts.splice(index, 1);
      if (onSelectedChanged) onSelectedChanged({ id: 'tableContacts', value: localContacts });
    },
    [onSelectedChanged, onStateChanged, selected.tableContacts, state.contacts]
  );
  const tableActionClicked = useCallback(
    (actionEnum, item, index) => {
      if (actionEnum === TableActions.deleteText.key) deleteContact(item, index);
    },
    [deleteContact]
  );
  const submitHandler = (event) => {
    event.preventDefault();
    setLocalIsSubmitted(true);
    if (localSchema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    if (
      selected.tableContacts.findIndex(
        (items) =>
          items.contactId === localState.contact.contactsId &&
          items.leadId === localState.lead.leadId
      ) !== -1
    ) {
      showError(t(`${translationPath}cannot-add-same-contact-and-lead-twice`));
      return;
    }
    const localContacts = [...selected.tableContacts];
    localContacts.push({
      contactId: localState.contact.contactsId,
      leadId: localState.lead.leadId,
      contactName:
        ((localState.contact.contact.first_name || localState.contact.contact.last_name) &&
          `${localState.contact.contact.first_name} ${localState.contact.contact.last_name}`) ||
        localState.contact.contact.company_name ||
        'N/A',
      email:
        (localState.contact.contact.email_address &&
          localState.contact.contact.email_address.email) ||
        localState.contact.contact.company_website ||
        'N/A',
      phone:
        (localState.contact.contact.mobile && localState.contact.contact.mobile.phone) ||
        (localState.contact.contact.landline_number &&
          localState.contact.contact.landline_number.phone) ||
        'N/A',
      ownershipPercentage: 0,
    });
    if (onSelectedChanged) onSelectedChanged({ id: 'tableContacts', value: localContacts });
    onStateChanged({
      id: 'contacts',
      value: [
        ...(state.contacts || []),
        {
          contactId: localState.contact.contactsId,
          leadId: localState.lead.leadId,
          ownershipPercentage: 0,
        },
      ],
    });
    setTimeout(() => {
      setLocalIsSubmitted(false);
    });
    setLocalState({
      contact: null,
      lead: null,
    });
  };
  // const getTotal = () => tableContacts.reduce((total, contact) =>
  // total + contact.ownershipPercentage, 0);

  // const tableContactsInit = useCallback(() => {
  //   // todo: on edit (if there is edit) call each contact
  //   // by id to display its info and add them to table contacts
  //   // same as submit for add contact to list
  // }, []);
  const contactById = useCallback(async (id) => {
    setIsLoading(true);
    const res = await contactsDetailsGet({ id });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const tableContactsInit = useCallback(async () => {
    const contactsDetails = await Promise.all(
      state.contacts.map(async (item) => {
        let contact = contacts.result.find((element) => element.contactsId === item.contactId);
        if (!contact && item.contactId) contact = await contactById(item.contactId);
        return {
          contactId: item.contactId,
          leadId: item.leadId,
          contactName:
            (contact &&
              (contact.contact.first_name || contact.contact.last_name) &&
              `${contact.contact.first_name} ${contact.contact.last_name}`) ||
            (contact && contact.contact.company_name) ||
            'N/A',
          email:
            (contact && contact.contact.email_address && contact.contact.email_address.email) ||
            (contact && contact.contact.company_website) ||
            'N/A',
          phone:
            (contact && contact.contact.mobile && contact.contact.mobile.phone) ||
            (contact && contact.contact.landline_number && contact.contact.landline_number.phone) ||
            'N/A',
          ownershipPercentage: 0,
        };
      })
    );
    if (onSelectedChanged) onSelectedChanged({ id: 'tableContacts', value: contactsDetails });
  }, [contactById, contacts.result, onSelectedChanged, state.contacts]);

  useEffect(() => {
    getContacts();
  }, [getContacts]);
  useEffect(() => {
    if (
      state.contacts &&
      selected.tableContacts &&
      unitTransactionId &&
      state.contacts.length > selected.tableContacts.length &&
      selected.tableContacts.length === 0 &&
      contacts.totalCount > 0
    )
      tableContactsInit();
  }, [
    contacts.totalCount,
    selected.tableContacts,
    state.contacts,
    tableContactsInit,
    unitTransactionId,
  ]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='unit-status-contact-info-wapper childs-wrapper'>
      <form noValidate name='filter-form' onSubmit={submitHandler} className='filter-wrapper'>
        <div className='filter-item'>
          <AutocompleteComponent
            idRef='contactRef'
            labelValue={t(`${translationPath}search-contacts`)}
            selectedValues={localState.contact}
            multiple={false}
            data={contacts.result}
            displayLabel={(option) =>
              (option.contact &&
                (option.contact.first_name || option.contact.last_name) &&
                `${option.contact.first_name} ${option.contact.last_name}`) ||
              option.contact.company_name ||
              ''}
            renderOption={(option) =>
              (option.contact && (
                <div className='d-flex-v-center-h-between w-100 texts-truncate'>
                  {(option.contact.first_name || option.contact.last_name) && (
                    <span className='c-primary px-2'>
                      {`${option.contact.first_name} ${option.contact.last_name}`}
                    </span>
                  )}
                  {option.contact.mobile && option.contact.mobile.phone && (
                    <span className='m-auto px-2'>{option.contact.mobile.phone}</span>
                  )}
                  {option.contact.email_address && option.contact.email_address.email && (
                    <span className='px-2'>{option.contact.email_address.email}</span>
                  )}
                  {option.contact.company_name && (
                    <span className='c-primary px-2'>{option.contact.company_name}</span>
                  )}
                  {option.contact.landline_number && option.contact.landline_number.phone && (
                    <span className='px-2'>{option.contact.landline_number.phone}</span>
                  )}
                  {option.contact.company_website && (
                    <span className='px-2'>{option.contact.company_website}</span>
                  )}
                </div>
              )) ||
              'N/A'}
            withoutSearchButton
            helperText={getErrorByName(localSchema, 'contact').message}
            error={getErrorByName(localSchema, 'contact').error}
            isWithError
            withLoader
            isLoading={isLoading.contact}
            onInputKeyUp={searchHandler('contact')}
            isSubmitted={localIsSubmitted}
            onChange={(event, newValue) => {
              setLocalState((items) => ({ ...items, contact: newValue }));
              if (newValue && newValue.contactsId) getLeads(newValue.contactsId);
              else if (localState.lead || (leads.result && leads.result.length > 0)) {
                setLeads({
                  result: [],
                  totalCount: 0,
                });
                setLocalState((items) => ({ ...items, lead: null }));
              }
            }}
            buttonOptions={{
              className: 'btns-icon theme-solid',
              iconClasses: 'mdi mdi-plus',
              onActionClicked: contactAddHandler,
              isDisabled: localState.contact !== null,
            }}
          />
        </div>
        <div className='filter-item'>
          <DataFileAutocompleteComponent
            idRef='leadRef'
            labelValue={t(`${translationPath}search-leads`)}
            selectedValues={localState.lead}
            multiple={false}
            data={leads.result}
            displayLabel={(option) =>
              (option.lead && option.lead.contact_name && option.lead.contact_name.name) || ''}
            renderFor='lead'
            withoutSearchButton
            helperText={getErrorByName(localSchema, 'lead').message}
            error={getErrorByName(localSchema, 'lead').error}
            isWithError
            withLoader
            isLoading={isLoading.lead}
            onInputKeyUp={searchHandler('lead')}
            isSubmitted={localIsSubmitted}
            onChange={(event, newValue) => {
              setLocalState((items) => ({ ...items, lead: newValue }));
            }}
            buttonOptions={{
              className: 'btns-icon theme-solid',
              iconClasses: 'mdi mdi-plus',
              onActionClicked: leadAddHandler,
              isDisabled: localState.lead !== null,
            }}
          />
        </div>
        <div className='filter-item-base'>
 
 <div>
      <ButtonBase className='btns theme-solid mx-2' disabled>
   <span className='mdi mdi-plus' />
   <span className='px-1'>{t(`${translationPath}add-new-lead`)}</span>
 </ButtonBase>
 </div>
 <div className="buttonbase">
 <ButtonBase type='submit' className='btns theme-solid mx-2'>
   <span className='mdi mdi-plus' />
   <span className='px-1'>{t(`${translationPath}add-to-contact-list`)}</span>
 </ButtonBase>
</div>
</div>
      </form>
      <Tables
        data={selected.tableContacts}
        headerData={[
          {
            id: 1,
            label: 'contact-id',
            input: 'contactId',
          },
          {
            id: 2,
            label: 'contact-name',
            input: 'contactName',
          },
          {
            id: 3,
            label: 'email',
            input: 'email',
          },
          {
            id: 4,
            label: 'phone',
            input: 'phone',
          },
          {
            id: 5,
            label: 'lead-id',
            input: 'leadId',
          },
        ]}
        defaultActions={[
          {
            enum: TableActions.deleteText.key,
          },
          //   {
          //     enum: TableActions.editText.key,
          //   },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={(selected.tableContacts && selected.tableContacts.length) || 0}
      />
      <ContactsDialog
        open={isOpenContactDialog || isOpenLeadDialog}
        onSave={() => {
          if (isOpenContactDialog) {
            setIsOpenContactDialog(false);
            getContacts();
          }
          if (isOpenLeadDialog) {
            setIsOpenLeadDialog(false);
            getLeads();
          }
        }}
        closeDialog={() => {
          setIsOpenLeadDialog(false);
          setIsOpenContactDialog(false);
        }}
      />
    </div>
  );
};

ContactInfoRentRelatedComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  unitTransactionId: PropTypes.number,
  // schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  // isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ContactInfoRentRelatedComponent.defaultProps = {
  unitTransactionId: undefined,
};
