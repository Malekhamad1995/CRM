import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Spinner, Tables, ViewTypes } from '../../../../../../Components';
import { GetAllAssociatedContact } from '../../../../../../Services';
import {
  ActionsEnum,
  ContactPreferenceEnum,
  ContactRelationshipEnum,
  ContactTypeEnum,
  TableActions,
  UserAccountTypeEnum,
  ViewTypesEnum,
} from '../../../../../../Enums';
import {
  GetParams, GlobalHistory, showError, WhatsAppMessage
} from '../../../../../../Helper';
// import { ContactsPermissions } from '../../../../../../Permissions';
import { ContactsCardsComponent } from '../../../ContactsUtilities';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';
import { ContactsActionDialogsComponent } from '../../../ContactsUtilities/ContactsActionDialogsComponent/ContactsActionDialogsComponent';

export const AssociatedContactsComponent = ({
  parentTranslationPath,
  translationPath,
  setActiveTab,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  // const loginResponse = useSelector((state) => state.login.loginResponse);
  const [isLoading, setIsLoading] = useState(false);
  const defaultPrefernces = [
    {
      enum: TableActions.openFile.key,
    },
    {
      enum: TableActions.editText.key,
      // isDisabled: !loginResponse.permissions
      //   .map((item) => item.permissionsId === ContactsPermissions.UpdateContacts.permissionsId)
      //   .includes(true),
    },
  ];
  const [activePrefernces, setActiveprefernces] = useState(defaultPrefernces);
  const [activeActionType, setActiveActionType] = useState(ViewTypesEnum.cards.key);
  const [isOpenContactsActionDialog, setisOpenContactsActionDialog] = useState(false);
  const [detailedCardAction, setdetailedCardAction] = useState(() => ({
    actionEnum: '',
    item: '',
  }));
  const [associatedContacts, setAssociatedContacts] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const getAccountType = (type) => {
    if (type === 'Normal') return UserAccountTypeEnum.normal.value;
    if (type === 'VIP') return UserAccountTypeEnum.platinum.value;
    if (type === 'VVIP') return UserAccountTypeEnum.gold.value;
    return null;
  };
  const getRelationshipValue = useCallback(
    (item) => {
      const valueIndex = Object.values(ContactRelationshipEnum).findIndex(
        (element) => item === element.key
      );
      if (valueIndex !== -1)
        return t(`${translationPath}${Object.values(ContactRelationshipEnum)[valueIndex].value}`);
      return '';
    },
    [t, translationPath]
  );
  const detailedCardActionClicked = useCallback(
    (actionEnum, item) => (event) => {
      event.stopPropagation();
      setisOpenContactsActionDialog(true);
      setdetailedCardAction({
        actionEnum,
        item,
      });
      if (actionEnum === 'whatsappSolid') {
        const el = document.createElement('a');
        if (item && item.mobile && item.mobile.phone) {
          el.href = WhatsAppMessage(item && item.mobile && item.mobile.phone);
          el.target = 'blank';
          el.click();
        } else
          showError(t(`${translationPath}Failure-Open-WhatsApp`));
      }

      // eslint-disable-next-line no-console
    },
    []
  );

  const getAllAssociatedContact = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllAssociatedContact(+GetParams('id'), filter);
    if (!(res && res.status && res.status !== 200)) {
      setAssociatedContacts({
        result: ((res && res.result) || []).map((item) => {
          const { contact, leadTypes } = item;
          return {
            id: item.contactsId,
            contactPreference: contact.contact_preference && contact.contact_preference,
            imagePath:
              +contact.contact_type_id === 1 ?
                (contact.contact_image && contact.contact_image['Image Upload'] && contact.contact_image['Image Upload'][0] && contact.contact_image['Image Upload'][0].uuid) || null :
                (contact.company_logoimage &&
                  contact.company_logoimage['Company Logo'][0].uuid) ||
                null,
            leadTypes,
            name:
              contact.contact_type_id === 2 ?
                contact.company_name :
                `${contact.first_name} ${contact.last_name}`,
            creationDate: item.createdOn,
            updateDate: item.updateOn,
            contactIds: contact.contactIds,
            type:
              +contact.contact_type_id === 2 ?
                ContactTypeEnum.corporate.value :
                (contact.gender &&
                  contact.gender.lookupItemName === 'Male' &&
                  ContactTypeEnum.man.value) ||
                ContactTypeEnum.woman.value,
            relationship: getRelationshipValue(item.contactRelationshipType),
            userType: (contact.contact_type_id === 2 && 'Corporate') || 'Individual',
            userTypeId: contact.contact_type_id,
            accountType:
              contact.contact_type_id === 2 ?
                contact.company_class && getAccountType(contact.company_class.lookupItemName) :
                contact.contact_class && getAccountType(contact.contact_class.lookupItemName),
            progress:
              typeof contact.data_completed === 'string' && contact.data_completed.includes('%') ?
                +contact.data_completed.substr(0, contact.data_completed.length - 1) :
                +contact.data_completed,
            progressWithPercentage:
              typeof contact.data_completed !== 'string' ?
                `${contact.data_completed}%` :
                contact.data_completed,
            details: [
              {
                title: 'location',
                value:
                  ((contact.country && `${contact.country.lookupItemName}`) || '') +
                  ((contact.city && `, ${contact.city.lookupItemName}`) || '') +
                  ((contact.street && contact.street.value && `, ${contact.street.value} `) ||
                    '') || 'N/A',
              },
              {
                title: 'email',
                value:
                  contact.contact_type_id === 2 ?
                    contact.general_email && contact.general_email.email :
                    (contact.email_address && contact.email_address.email) || 'N/A',
              },
              {
                title: contact.contact_type_id === 2 ? 'landline-number' : 'mobile',
                value:
                  contact.contact_type_id === 2 ?
                    contact.landline_number && contact.landline_number.phone :
                    (contact.mobile && contact.mobile.phone) || 'N/A',
              },
              {
                iconClasses: 'mdi mdi-earth',
                title: 'nationality',
                value:
                  contact.contact_type_id === 2 ?
                    contact.company_nationality && contact.company_nationality.lookupItemName :
                    (contact.nationality && contact.nationality.lookupItemName) || 'N/A',
              },
              (contact.contact_type_id === 2 && {
                title: 'industry',
                value: (contact.industry && contact.industry.lookupItemName) || 'N/A',
              }) || {
                iconClasses: 'mdi mdi-translate',
                title: 'language',
                value: (contact.language && contact.language.lookupItemName) || 'N/A',
              },
              {
                title: contact.contact_type_id === 2 ? 'website' : 'home-phone',
                value:
                  contact.contact_type_id === 2 ?
                    contact.company_website && contact.company_website :
                    (contact.home_phone && contact.home_phone.phone) || 'N/A',
              },
              {
                title: contact.contact_type_id === 2 ? 'company-type' : 'work-company-name',
                value:
                  contact.contact_type_id === 2 ?
                    contact.company_type && contact.company_type.lookupItemName :
                    (contact.work_company_name && contact.work_company_name) || 'N/A',
              },
              {
                title: contact.contact_type_id === 2 ? 'contact-person-mobile' : 'investor',
                value: (contact.investor && contact.investor) || 'N/A',
              },
              {
                title: contact.contact_type_id === 2 ? 'contact-person-email' : 'media-name',
                value: (contact.media_name && contact.media_name.lookupItemName) || 'N/A',
              },
              {
                title: contact.contact_type_id === 2 ? 'contact-person-name' : 'profession',
                value:
                  contact.contact_type_id === 2 ?
                    contact.contacts_person && contact.contacts_person.map((el) => `${el.name}, `) :
                    (contact.profession && contact.profession) || 'N/A',
              },
            ],
          };
        }),
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setAssociatedContacts({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter, getRelationshipValue]);
  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.openFile.key) {
        setActiveTab(0);
        GlobalHistory.push(
          `/home/contacts/contact-profile-edit?formType=${item.userTypeId}&id=${item.id}`
        );
      } else if (actionEnum === TableActions.editText.key)
        GlobalHistory.push(`/home/contacts/edit?formType=${item.userTypeId}&id=${item.id}`);
    },
    [dispatch, setActiveTab]
  );

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/Contacts-CRM/edit?formType=${activeData.userTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        setActiveTab(0);
        GlobalHistory.push(
          `/home/Contacts-CRM/contact-profile-edit?formType=${activeData.userTypeId}&id=${activeData.id}`
        );
      }
    },
    [dispatch, setActiveTab]
  );
  const focusedRowChanged = useCallback(
    (rowIndex, item) => {
      const currentActiveActions = defaultPrefernces;
      if (item.contactPreference && rowIndex > -1) {
        item.contactPreference.map((el) => {
          const index = Object.values(ContactPreferenceEnum).findIndex(
            (subItem) => subItem.key === el.lookupItemId
          );
          if (index !== -1) {
            currentActiveActions.push({
              enum: Object.values(ContactPreferenceEnum)[index].actionEnumKey,
            });
          }
        });
        if (currentActiveActions.length > 5) {
          const whatsAppIndex = currentActiveActions.findIndex(
            (subItem) => subItem.enum === 'whatsappSolid'
          );
          if (whatsAppIndex !== -1) {
            currentActiveActions.splice(whatsAppIndex, 1);
            currentActiveActions.push({
              enum: 'dotsHorizontal',
            });
          }
        }
        setActiveprefernces(currentActiveActions);
      }
    },
    [defaultPrefernces]
  );
  const onTypeChanged = useCallback((activeType) => {
    setActiveActionType(activeType);
  }, []);
  useEffect(() => {
    if (GetParams('id')) getAllAssociatedContact();
  }, [getAllAssociatedContact]);
  return (
    <div className='associated-contacts-wrapper childs-wrapper p-relative'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section d-flex-v-center fj-between pt-2 px-0'>
        <span className='px-2'>{t(`${translationPath}associated-contacts`)}</span>
        <ViewTypes
          onTypeChanged={onTypeChanged}
          activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
        />
      </div>
      <div className='w-100 px-2'>
        {
          // loginResponse &&
          //   loginResponse.permissions &&
          //   loginResponse.permissions
          //     .map((item) => item.permissionsId ===
          // ContactsPermissions.ReadContacts.permissionsId)
          //     .includes(true) &&
          activeActionType === ViewTypesEnum.cards.key && (
            <ContactsCardsComponent
              data={associatedContacts}
              onFooterActionsClicked={detailedCardSideActionClicked}
              onActionClicked={detailedCardActionClicked}
              parentTranslationPath='ContactsView'
              translationPath={translationPath}
            />
          )
        }
        {
          // loginResponse &&
          //   loginResponse.permissions &&
          //   loginResponse.permissions
          //     .map((item) => item.permissionsId ===
          // ContactsPermissions.ReadContacts.permissionsId)
          //     .includes(true) &&
          activeActionType === ViewTypesEnum.tableView.key && (
            <div className='w-100'>
              <Tables
                data={associatedContacts.result}
                headerData={[
                  { id: 1, label: 'name', input: 'name' },
                  { id: 2, label: 'type', input: 'userType' },
                  { id: 3, label: 'relationship', input: 'relationship' },
                  {
                    id: 4,
                    label: 'class',
                    component: (item) =>
                      (item.accountType && UserAccountTypeEnum[item.accountType].tableImg && (
                        <img
                          src={UserAccountTypeEnum[item.accountType].tableImg}
                          alt={t('account-type')}
                        />
                      )) || <span />,
                  },
                  {
                    id: 5,
                    label: 'creation',
                    input: 'creationDate',
                    isDate: true,
                  },
                  { id: 6, label: 'progress', input: 'progressWithPercentage' },
                  {
                    id: 7,
                    label: 'email',
                    component: (item) =>
                      (item.details &&
                        item.details.map((el) => el.title === 'email' && el.value)) || <span />,
                  },
                  {
                    id: 8,
                    label: 'mobile',
                    component: (item) =>
                      (item.details &&
                        item.details.map(
                          (el) =>
                            (el.title === 'mobile' || el.title === 'landline-number') && el.value
                        )) || <span />,
                  },
                  {
                    id: 9,
                    label: 'nationality',
                    component: (item) =>
                      (item.details &&
                        item.details.map((el) => el.title === 'nationality' && el.value)) || (
                        <span />
                      ),
                  },
                  {
                    id: 10,
                    label: 'location',
                    component: (item) =>
                      (item.details &&
                        item.details.map((el) => el.title === 'location' && el.value)) || <span />,
                  },
                ]}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
                actionsOptions={{
                  onActionClicked: tableActionClicked,
                }}
                defaultActions={activePrefernces}
                itemsPerPage={filter.pageSize}
                activePage={filter.pageIndex}
                focusedRowChanged={focusedRowChanged}
                parentTranslationPath={parentTranslationPath}
                totalItems={associatedContacts.totalCount}
              />
            </div>

          )
        }
      </div>
      <ContactsActionDialogsComponent
        isOpen={isOpenContactsActionDialog}
        isOpenChanged={() => setisOpenContactsActionDialog(false)}
        actionEnum={detailedCardAction.actionEnum}
        item={detailedCardAction.item}
        translationPath=''
        parentTranslationPath='ContactsView'
      />
    </div>
  );
};

AssociatedContactsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
