import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Tables } from '../../../../../../../Components';
import { TableActions, AgentRoleEnum } from '../../../../../../../Enums';
import { GlobalHistory, showError } from '../../../../../../../Helper';
import { ActiveItemActions } from '../../../../../../../store/ActiveItem/ActiveItemActions';
import { ContactProfileLeadsTableData } from './ContactProfileLeadsTableData';
import { Closed } from '../../../../../../../assets/json/StaticLookupsIds.json';

export const ContactProfileLeadsTable = ({
  state,
  filter,
  pathName,
  setFilter,
  onStateChange,
  leadsDetailes,
  setActiveItem,
  isOpenCloseLead,
  translationPath,
  setIsOpenCloseLead,
  parentTranslationPath,
  actionType,
}) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([
    {
      enum: TableActions.openFile.key,
    },
    {
      enum: TableActions.editText.key,
    },
  ]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const onChangeStatusHandler = (item) => (event, isChecked) => {
    if (!isChecked) {
      setActiveItem(item);
      setIsOpenCloseLead(true);
    } else if (isOpenCloseLead) setIsOpenCloseLead(false);
  };
  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemSuccess(item));
      if (actionEnum === TableActions.openFile.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/lead-sales/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/lead-lease/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`
          );
        } else {
          if (item && item.status)
            localStorage.setItem('leadStatus', JSON.stringify(item.status));

          GlobalHistory.push(
            `/home/leads/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`
          );
        }
      } else if (actionEnum === TableActions.editText.key) {
        if (pathName === 'contact-sales')
          GlobalHistory.push(`/home/lead-sales/edit?formType=${item.leadTypeId}&id=${item.id}`);
        else if (pathName === 'contact-lease')
          GlobalHistory.push(`/home/lead-lease/edit?formType=${item.leadTypeId}&id=${item.id}`);
        else GlobalHistory.push(`/home/leads/edit?formType=${item.leadTypeId}&id=${item.id}`);
      }
    },
    [dispatch, pathName]
  );
  const getIsSelectedAll = useCallback(
    () =>
      (state &&
        state.leadIds &&
        leadsDetailes && leadsDetailes.result.findIndex(
          (item) => !state.leadIds.includes(item.id) && item.status !== 'closed'
        ) === -1) ||
      false,
    [leadsDetailes, state]
  );
  const getIsDisabled = useCallback((row) => row.status && row.status.lookupItemName === 'Closed', []);
  // const getIsDisabled = useCallback(
  //   (row) =>
  //     ( row.status === 'open' && !getIsSelected(row)) ||
  //     (checkedCardsIds && checkedCardsIds.length > 1 && !getIsSelected(row)) ||
  //     (checkedCards && checkedCards[0] && checkedCards[0].userTypeId !== row.userTypeId),
  //   [ getIsSelected]
  // );
  const getIsSelected = useCallback(
    (row) => state && state.leadIds.findIndex((item) => item === row.id) !== -1,
    [state]
  );
  const onSelectClicked = useCallback(
    (row) => {
      let frist = row.leadClass;
      if (state.leads.length) {
        frist = state.leads[0].leadClass;
      }
      if (row.leadClass !== frist && actionType !== 'close-leads') {
        showError('Please Select same lead')
        return;
      }
      const itemIndex = state ? state.leadIds.findIndex((item) => item === row.id) : -1;
      if (itemIndex !== -1) state.leadIds.splice(itemIndex, 1);
      else state.leadIds.push(row.id);
      const itemIndex2 = state ? state.leads.findIndex((item) => item.id === row.id) : -1;
      if (itemIndex2 !== -1) state.leads.splice(itemIndex2, 1);
      else state.leads.push(row);
      onStateChange('leadIds', state.leadIds);
      onStateChange('userType', state.leads.length > 0 ? (frist === 'Buyer' ? AgentRoleEnum.SaleAgent.value : AgentRoleEnum.LeaseAgent.value) : null);
      onStateChange('leads', state.leads);
    },
    [onStateChange, state]
  );
  const onSelectAllClicked = () => {
    if (!getIsSelectedAll()) {
      if (leadsDetailes) {
        leadsDetailes.result.map((item) => {
          if (!getIsSelected(item) && item.status !== 'closed') state.leadIds.push(item.id);
        });
      }
    } else if (leadsDetailes) {
      leadsDetailes.result.map((item) => {
        const isSelectedIndex = state.leadIds.findIndex((element) => element === item.id);
        if (isSelectedIndex !== -1) state.leadIds.splice(isSelectedIndex, 1);
      });
    }
    onStateChange('leadIds', state.leadIds);
  };
  const focusedRowChanged = useCallback(
    (rowIndex, item) => {
      if (rowIndex !== -1) {
        if (item.status &&
          item.status.lookupItemId !== Closed) {
          setList([{
            enum: TableActions.openFile.key,
            isDisabled: false,
            externalComponent: null,
          },
          {
            enum: TableActions.editText.key,
            isDisabled: false,
            externalComponent: null,
          }]);
        } else if (item.status &&
          item.status.lookupItemId === Closed) {
          setList([{
            enum: TableActions.openFile.key,
            externalComponent: null,
          },]);
        }
      }
    },
    [list]
  );
  return (
    <div className='w-100 px-2'>
      <Tables
        isSellectAllDisabled
        selectAllOptions={actionType && {
          getIsSelected,
          onSelectClicked,
          disabledRows: [],
          onSelectAllClicked,
          getIsDisabled,
          withCheckAll: true,
        }}
        data={leadsDetailes ? leadsDetailes.result : []}
        headerData={ContactProfileLeadsTableData(
          onChangeStatusHandler,
          parentTranslationPath,
          translationPath
        )}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        defaultActions={list || [
          {
            enum: TableActions.openFile.key,
          },
          {
            enum: TableActions.editText.key,
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked, isDisabled: false
        }}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        focusedRowChanged={focusedRowChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={leadsDetailes && leadsDetailes.totalCount ? leadsDetailes.totalCount : 0}
      />
    </div>
  );
};
ContactProfileLeadsTable.propTypes = {
  pathName: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  isOpenCloseLead: PropTypes.bool.isRequired,
  translationPath: PropTypes.string.isRequired,
  setIsOpenCloseLead: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Array).isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  leadsDetailes: PropTypes.instanceOf(Object).isRequired,
  actionType: PropTypes.string.isRequired,
};
