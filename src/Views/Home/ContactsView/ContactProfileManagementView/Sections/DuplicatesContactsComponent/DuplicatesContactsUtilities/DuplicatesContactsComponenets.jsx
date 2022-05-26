import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ActionsEnum, ViewTypesEnum } from '../../../../../../../Enums';
import {
  bottomBoxComponentUpdate,
  GlobalHistory,
  sideMenuComponentUpdate,
  sideMenuIsOpenUpdate,
} from '../../../../../../../Helper';
// import { ContactsPermissions } from '../../../../../../../Permissions';
import { ActiveItemActions } from '../../../../../../../store/ActiveItem/ActiveItemActions';
import { ContactsCardsComponent, ContactsTableComponent } from '../../../../ContactsUtilities';
import { PaginationComponent } from '../../../../../../../Components';

export const DuplicatesContactsComponenets = ({
  filter,
  setFilter,
  activeCard,
  reloadData,
  setActiveTab,
  checkedCards,
  setActiveCard,
  setCheckedCards,
  translationPath,
  checkedCardsIds,
  activeActionType,
  setCheckedCardsIds,
  duplicatesContacts,
  parentTranslationPath,
}) => {
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const dispatch = useDispatch();
  // const loginResponse = useSelector((state) => state.login.loginResponse);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
    setActiveCard(null);
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
    setActiveCard(null);
  };
  const cardCheckboxClicked = useCallback(
    (itemIndex, element) => {
      setCheckedCards((items) => {
        const index = items.findIndex((item) => item.id === element.id);
        if (index !== -1) items.splice(index, 1);
        else items.push(element);
        return [...items];
      });
      setCheckedCardsIds((items) => {
        const index = items.findIndex((item) => item === element.id);
        if (index !== -1) items.splice(index, 1);
        else items.push(element.id);
        return [...items];
      });
    },
    [setCheckedCards, setCheckedCardsIds]
  );
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
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={duplicatesContacts.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );
  return (
    <div className='w-100 px-2'>
      {
        // loginResponse &&
        //   loginResponse.permissions &&
        //   loginResponse.permissions
        //     .map((item) => item.permissionsId
        // === ContactsPermissions.ReadContacts.permissionsId)
        //     .includes(true) &&
        activeActionType === ViewTypesEnum.cards.key && (
          <ContactsCardsComponent
            withCheckbox
            activeCard={activeCard}
            data={duplicatesContacts}
            selectedCards={checkedCards}
            translationPath={translationPath}
            parentTranslationPath='ContactsView'
            onCardCheckboxClick={cardCheckboxClicked}
            onFooterActionsClicked={detailedCardSideActionClicked}
            isCheckBoxDisabled={checkedCardsIds.length === 1}
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
          <ContactsTableComponent
            isOneSelect
            filter={filter}
            setActiveTab={setActiveTab}
            pathName={pathName}
            reloadData={reloadData}
            checkedCards={checkedCards}
            setCheckedCards={setCheckedCards}
            checkedCardsIds={checkedCardsIds}
            onPageSizeChanged={onPageSizeChanged}
            setCheckedCardsIds={setCheckedCardsIds}
            onPageIndexChanged={onPageIndexChanged}
            activeSelectedAction='merge'
            detailsContactsList={duplicatesContacts}
            parentTranslationPath={parentTranslationPath}
            isWithCheckboxColumn
          />
        )
      }
    </div>
  );
};
DuplicatesContactsComponenets.propTypes = {
  setFilter: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setActiveCard: PropTypes.func.isRequired,
  setCheckedCards: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  setCheckedCardsIds: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeCard: PropTypes.instanceOf(Object).isRequired,
  checkedCards: PropTypes.instanceOf(Array).isRequired,
  checkedCardsIds: PropTypes.instanceOf(Array).isRequired,
  activeActionType: PropTypes.instanceOf(Object).isRequired,
  duplicatesContacts: PropTypes.instanceOf(Object).isRequired,
};
