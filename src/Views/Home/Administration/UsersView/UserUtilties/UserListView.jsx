import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tables } from '../../../../../Components';
import { TableActions, TableFilterTypesEnum } from '../../../../../Enums';
import UserSlider from './UserSlider/UserSlider';
import { getIsAllowedPermission } from '../../../../../Helper/Permissions.Helper';
import { sideMenuIsOpenUpdate, sideMenuComponentUpdate } from '../../../../../Helper';
import { UserLoginPermissions } from '../../../../../Permissions';
import { GetUserId } from '../../../../../Services';

const UserListView = ({
  data,
  filter,
  actionClicked,
  translationPath,
  activePageChanged,
  itemsPerPageChanged,
  setSortBy,
  onFilterValuesChanged
}) => {
  const { t } = useTranslation('UsersView');
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [currentActions, setCurrentActions] = useState(() => []);
  const getUserActions = (userStatus) => {
    // eslint-disable-next-line prefer-const
    let actionsList = [];
    if (userStatus === 'Pending') {
      actionsList.push({ enum: TableActions.check.key, title: (t(`${translationPath}Active`)) });
      actionsList.push({ enum: TableActions.close.key, title: `${translationPath}Pending` });
      if (getIsAllowedPermission(
        Object.values(UserLoginPermissions),
        loginResponse,
        UserLoginPermissions.DeleteButtonOnCard.permissionsId
      ))
        actionsList.push({ enum: TableActions.delete.key, title: (`${translationPath}Delete`) });
    } else if (userStatus === 'Canceled') {
      actionsList.push({ enum: TableActions.check.key, title: (`${translationPath}Active`) });
      if (getIsAllowedPermission(
        Object.values(UserLoginPermissions),
        loginResponse,
        UserLoginPermissions.DeleteButtonOnCard.permissionsId
      ))
        actionsList.push({ enum: TableActions.delete.key, title: (`${translationPath}Delete`) });
    } else if (userStatus === 'Active') {
      if (getIsAllowedPermission(
        Object.values(UserLoginPermissions),
        loginResponse,
        UserLoginPermissions.EditButtonInUserRecord.permissionsId
      ))
        actionsList.push({ enum: TableActions.edit.key, title: (`${translationPath}Edit`) });
      actionsList.push({ enum: TableActions.close.key, title: (`${translationPath}Pending`) });
      if (getIsAllowedPermission(
        Object.values(UserLoginPermissions),
        loginResponse,
        UserLoginPermissions.DeleteButtonOnCard.permissionsId
      ))
       actionsList.push({ enum: TableActions.delete.key, title: (`${translationPath}delete`) });
    }
    return actionsList;
  };

  const DriversSliderClicked = useCallback(async(item) => {
    const res = await GetUserId(item.id);
    item.userId = res;
    sideMenuComponentUpdate(<UserSlider item={item} />);
    sideMenuIsOpenUpdate(true);
  }, []);

  const focusedRowChanged = (activeRow) => {
    const item = data.result[activeRow];
    if (!item) return;
    setCurrentActions(getUserActions(item.userStatus));
    DriversSliderClicked(item);
  };

  useEffect(
    () => () => {
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );
  const [userDataHeader] = useState([
    {
      id: 1,
      isSortable: true,
      label: (`${translationPath}Name`),
      input: 'fullName',
      isDate: false,
      displayPath: 'name',
      isHiddenFilter: false
    },
    {
      id: 2,
      isSortable: true,
      label: (`${translationPath}Username`),
      input: 'userName',
      displayPath: 'username',
      isDate: false,
      isHiddenFilter: false
    },
    {
      id: 3,
      isSortable: true,
      label: (`${translationPath}Mobile`),
      input: 'phoneNumber',
      displayPath: 'phoneNumber',
      isDate: false,
      isHiddenFilter: false
    },
    {
      id: 4,
      isSortable: true,
      label: (`${translationPath}Email`),
      displayPath: 'email',
      input: 'email',
      isDate: false,
      isHiddenFilter: false
    },
    {
      id: 5,
      isSortable: true,
      label: (`${translationPath}Status`),
      input: 'userStatus',
      displayPath: 'userStatusId',
      isDate: false,
      isHiddenFilter: false
    },
  ]);
  const [tableFilterData, setTableFilterData] = useState([]);
  useEffect(() => {
    setTableFilterData(
      userDataHeader.map((column) => ({
        key: column.key || column.fieldKey || column.id,
        filterType:
          (TableFilterTypesEnum.textInput.key),
        isHiddenFilter: column.isHiddenFilter,
        textInputType: column.textInputType,
        textInputMax: column.textInputMax,
        textInputMin: column.textInputMin,
        displayPath:
          (column.displayPath),
      }))
    );
  }, [userDataHeader]);
  return (
    <div className='w-100 px-3'>
      <Tables
        headerData={userDataHeader}
        translationPath={translationPath}
        data={(data && data.result)}
        activePage={filter.pageIndex}
        totalItems={(data && data.totalCount) || 0}
        activePageChanged={activePageChanged}
        FilterDisabledButton
        itemsPerPage={filter.pageSize}
        itemsPerPageChanged={itemsPerPageChanged}
        focusedRowChanged={focusedRowChanged}
        actionsOptions={{
          actions: currentActions,
          classes: '',
          isDisabled: false,
          onActionClicked: actionClicked,
        }}
        setSortBy={setSortBy}
        onFilterValuesChanged={onFilterValuesChanged}
        filterData={tableFilterData}
        isWithFilter
      />
    </div>
  );
};
export { UserListView };
UserListView.propTypes = {
  data: PropTypes.shape({
    result: PropTypes.instanceOf(Array),
    totalCount: PropTypes.number,
  }).isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  actionClicked: PropTypes.func.isRequired,
  activePageChanged: PropTypes.func.isRequired,
  itemsPerPageChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string,
  setSortBy: PropTypes.func,
};
UserListView.defaultProps = {
  translationPath: '',
  setSortBy: undefined
};
