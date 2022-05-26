import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TableColumnsFilterComponent, Tables } from '../../../../../Components';
import {
  ContactPreferenceEnum,
  TableActions,
  FormsIdsEnum,
  ColumnsFilterPagesEnum,
  TableFilterTypesEnum,
} from '../../../../../Enums';
import {
 GlobalHistory, GlobalTranslate, showError, WhatsAppMessage
} from '../../../../../Helper';
// import { ContactsPermissions } from '../../../../../Permissions';
import { ActiveItemActions } from '../../../../../store/ActiveItem/ActiveItemActions';
import { ContactsTableHeaderData } from './ContactsTableHeaderData';
import { GetAllFormFieldsByFormId } from '../../../../../Services';
import { TableColumnsFilterActions } from '../../../../../store/TableColumnsFilter/TableColumnsFilterActions';
import { ContactsActionDialogsComponent } from '../ContactsActionDialogsComponent/ContactsActionDialogsComponent';

export const ContactsTableComponent = ({
  filter,
  pathName,
  onRowClick,
  isOneSelect,
  checkedCards,
  setCheckedCards,
  checkedCardsIds,
  onPageSizeChanged,
  setCheckedCardsIds,
  onPageIndexChanged,
  detailsContactsList,
  activeSelectedAction,
  contactTableFilter,
  onFilterValuesChanged,
  parentTranslationPath,
  translationPath,
  setActiveTab,
  isWithCheckboxColumn
}) => {
  const dispatch = useDispatch();
  const [allFormFields, setAllFormFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isOpenContactsActionDialog, setisOpenContactsActionDialog] = useState(false);
  const [tableFilterData, setTableFilterData] = useState([]);
  const [detailedCardAction, setdetailedCardAction] = useState(() => ({
    actionEnum: '',
    item: '',
  }));
  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState(
    ContactsTableHeaderData.filter((item) => item.isDefaultFilterColumn).map((column) => column.id)
  );
  // const loginResponse = useSelector((state) => state.login.loginResponse);
  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const defaultPrefernces = [
    {
      enum: TableActions.openFile.key,
    },
    {
      enum: TableActions.editText.key,
      // isDisabled:
      //   loginResponse &&
      //   loginResponse.permissions &&
      //   (!loginResponse.permissions ||
      //     !loginResponse.permissions
      //       .map((item) => item.permissionsId ===
      // ContactsPermissions.UpdateContacts.permissionsId)
      //       .includes(true)),
    },
  ];
  const [activePrefernces, setActiveprefernces] = useState(defaultPrefernces);
  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      // Contacts-CRM/contact-profile-edit
      event.stopPropagation();
      event.preventDefault();
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.whatsappSolid.key) {
            const el = document.createElement('a');
      if (item && item.mobile && item.mobile.phone) {
        el.href = WhatsAppMessage(item && item.mobile && item.mobile.phone);
        el.target = 'blank';
        el.click();
      } else
        showError(GlobalTranslate.t('Shared:Failure-Open-WhatsApp'));
      } else if (actionEnum === TableActions.openFile.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/contact-sales/contact-profile-edit?formType=${item.userTypeId}&id=${item.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/contact-lease/contact-profile-edit?formType=${item.userTypeId}&id=${item.id}`
          );
        } else if (pathName === 'Contacts-CRM') {
          GlobalHistory.push(
            `/home/Contacts-CRM/contact-profile-edit?formType=${item.userTypeId}&id=${item.id}`
          );
        } else if (pathName === 'Contacts-CRM/contact-profile-edit') {
          setActiveTab(0);
          GlobalHistory.push(
            `/home/Contacts-CRM/contact-profile-edit?formType=${item.userTypeId}&id=${item.id}`
          );
        }
      } else if (actionEnum === TableActions.editText.key) {
        if (pathName === 'contact-sales')
          GlobalHistory.push(`/home/contact-sales/edit?formType=${item.userTypeId}&id=${item.id}`);
        else if (pathName === 'contact-lease')
          GlobalHistory.push(`/home/contact-lease/edit?formType=${item.userTypeId}&id=${item.id}`);
        else if (pathName === 'Contacts-CRM')
          GlobalHistory.push(`/home/Contacts-CRM/edit?formType=${item.userTypeId}&id=${item.id}`);
        else if (pathName === 'Contacts-CRM/contact-profile-edit') {
          GlobalHistory.push(
            `/home/Contacts-CRM/edit?formType=${item.userTypeId}&id=${item.id}`
          );
        }
      } else if (actionEnum === TableActions.smsSolid.key || TableActions.emailSolid.key) {
        setdetailedCardAction({
          actionEnum,
          item,
        });
        setisOpenContactsActionDialog(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, pathName]
  );
  const getIsSelected = useCallback(
    (row) => checkedCards && checkedCards.findIndex((item) => item.id === row.id) !== -1,
    [checkedCards]
  );
  const getIsDisabled = useCallback(
    (row) =>
      (isOneSelect && checkedCardsIds && checkedCardsIds.length === 1 && !getIsSelected(row)) ||
      (checkedCardsIds && checkedCardsIds.length > 1 && !getIsSelected(row)) ||
      (checkedCards && checkedCards[0] && checkedCards[0].userTypeId !== row.userTypeId),
    [checkedCards, checkedCardsIds, getIsSelected, isOneSelect]
  );
  const onSelectClicked = useCallback(
    (row) => {
      const itemIndex = checkedCardsIds ? checkedCardsIds.findIndex((item) => item === row.id) : -1;
      if (itemIndex !== -1) {
        checkedCardsIds.splice(itemIndex, 1);
        setCheckedCards((items) => {
          const elementIndex = items.findIndex((item) => item.id === row.id);
          if (elementIndex !== -1) items.splice(elementIndex, 1);
          return [...items];
        });
      } else {
        checkedCardsIds.push(row.id);
        setCheckedCards((items) => {
          items.push(row);
          return [...items];
        });
      }
      setCheckedCardsIds(checkedCardsIds);
    },
    [checkedCardsIds, setCheckedCards, setCheckedCardsIds]
  );
  const focusedRowChanged = useCallback(
    (rowIndex, item) => {
      if (rowIndex !== -1 && onRowClick) onRowClick(item, rowIndex);
      const currentActiveActions = defaultPrefernces;
      if (item && item.contactPreference) {
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
      }
      // if (currentActiveActions.length > 5) {
      //   const whatsAppIndex = currentActiveActions.findIndex(
      //     (subItem) => subItem.enum === 'phoneSolid'
      //   );
      //   if (whatsAppIndex !== -1) {
      //     currentActiveActions.splice(whatsAppIndex, 1);
      //     currentActiveActions.push({
      //       enum: 'dotsHorizontal',
      //     });
      //   }
      // }
      setActiveprefernces(currentActiveActions);
    },
    [defaultPrefernces, onRowClick]
  );
  const getAllFormFieldsByFormId = useCallback(async () => {
    setIsLoading(true);
    Promise.all([
      await GetAllFormFieldsByFormId(FormsIdsEnum.contactsIndividual.id),
      await GetAllFormFieldsByFormId(FormsIdsEnum.contactsCorporate.id),
    ])
      .then((result) => {
        if (Array.isArray(result[0]) && Array.isArray(result[1])) {
          const concantinateFields = result[0]
            .concat(result[1])
            .filter(
              (field, index, array) =>
                array.findIndex((element) => element.formFieldKey === field.formFieldKey) === index
            );
            const list = concantinateFields.filter(e => e.formFieldName !== 'mobile')
          setAllFormFields(list);
        } else setAllFormFields([]);
        setIsLoading(false);
      })
      .catch(() => {
        setAllFormFields([]);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    getAllFormFieldsByFormId();
  }, [getAllFormFieldsByFormId]);
  useEffect(() => {
    if (
      tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum.contacts.key]
    ) {
      setSelectedTableFilterColumns(
        tableColumnsFilterResponse[ColumnsFilterPagesEnum.contacts.key]
      );
    }
  }, [tableColumnsFilterResponse]);
  useEffect(() => {
    setTableColumns([
      ...ContactsTableHeaderData.filter(
        (item) => selectedTableFilterColumns.findIndex((element) => element === item.id) !== -1
      ),
      ...allFormFields
        .filter(
          (item) =>
            selectedTableFilterColumns.findIndex((element) => element === item.formFieldId) !== -1
        )
        .map((field) => ({
          id: field.formFieldId || null,
          key: field.formFieldKey || null,
          isDate: field.uiWidgetType === 'alt-date' || false,
          label: (field.formFieldTitle && field.formFieldTitle.replace('*', '')) || '',
          input: field.displayPath || '',
        })),
    ]);
  }, [allFormFields, selectedTableFilterColumns]);
  useEffect(() => {
    setTableFilterData(
      tableColumns.map((column) => ({
        key: column.key || column.fieldKey || column.id,
        filterType:
          (column.isDate && TableFilterTypesEnum.datePicker.key) ||
          TableFilterTypesEnum.textInput.key,
        isHiddenFilter: column.isHiddenFilter,
        textInputType: column.textInputType,
        textInputMax: column.textInputMax,
        textInputMin: column.textInputMin,
        displayPath:
          (column.key && column.input) ||
          (column.fieldKey &&
            allFormFields &&
            allFormFields.findIndex((item) => item.formFieldKey === column.fieldKey) !== -1 &&
            allFormFields.find((item) => item.formFieldKey === column.fieldKey).displayPath) ||
          undefined,
      }))
    );
  }, [allFormFields, tableColumns]);

  return (
    <div className='w-100 px-3'>
      <TableColumnsFilterComponent
        columns={ContactsTableHeaderData.concat(
          allFormFields.filter(
            (item) =>
              ContactsTableHeaderData.findIndex(
                (element) => element.fieldKey === item.formFieldKey
              ) === -1
          )
        ).map((item) => ({
          key: item.formFieldId || item.id,
          value: (item.formFieldTitle && item.formFieldTitle.replace('*', '')) || item.label,
        }))}
        isLoading={isLoading}
        selectedColumns={selectedTableFilterColumns}
        onSelectedColumnsChanged={(newValue) => {
          setSelectedTableFilterColumns(newValue);
          let localTableColumnsFilterResponse = tableColumnsFilterResponse;
          if (localTableColumnsFilterResponse)
            localTableColumnsFilterResponse[ColumnsFilterPagesEnum.contacts.key] = newValue;
          else {
            localTableColumnsFilterResponse = {
              [ColumnsFilterPagesEnum.contacts.key]: newValue,
            };
          }
          dispatch(
            TableColumnsFilterActions.TableColumnsFilterRequest(localTableColumnsFilterResponse)
          );
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath=''
      />
      <Tables
        isWithCheckboxColumn={isWithCheckboxColumn}
        data={detailsContactsList.result}
        isSellectAllDisabled
        selectAllOptions={
          (activeSelectedAction === 'merge' && {
            selectedRows: checkedCardsIds,
            getIsSelected,
            disabledRows: [],
            getIsDisabled,
            onSelectClicked,
          }) ||
          undefined
        }
        headerData={tableColumns}
        defaultActions={activePrefernces}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        focusedRowChanged={focusedRowChanged}
        totalItems={detailsContactsList ? detailsContactsList.totalCount : 0}
        filterValues={contactTableFilter}
        onFilterValuesChanged={onFilterValuesChanged}
        filterData={tableFilterData}
        isWithFilter
        externalPopoverComponent={(
          <ButtonBase
            className={TableActions.whatsappSolid.buttonClasses}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <span className={TableActions.whatsappSolid.icon} />
          </ButtonBase>
        )}
      />
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
ContactsTableComponent.propTypes = {
  onRowClick: PropTypes.func,
  isWithCheckboxColumn: PropTypes.bool,
  isOneSelect: PropTypes.bool,
  pathName: PropTypes.string.isRequired,
  setCheckedCards: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  setCheckedCardsIds: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onFilterValuesChanged: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  checkedCards: PropTypes.instanceOf(Object).isRequired,
  checkedCardsIds: PropTypes.instanceOf(Object).isRequired,
  detailsContactsList: PropTypes.instanceOf(Object).isRequired,
  activeSelectedAction: PropTypes.instanceOf(Object).isRequired,
  contactTableFilter: PropTypes.instanceOf(Object),
  setActiveTab: PropTypes.func.isRequired,
};
ContactsTableComponent.defaultProps = {
  onRowClick: undefined,
  isWithCheckboxColumn: false,
  contactTableFilter: undefined,
  isOneSelect: false,
};
