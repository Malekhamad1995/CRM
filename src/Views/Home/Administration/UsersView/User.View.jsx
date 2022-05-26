/* eslint-disable brace-style */
import React, {
  useEffect, useCallback, useState, useRef
} from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useTitle } from '../../../../Hooks';
import { Inputs } from '../../../../Components/Controls';
import {
  NoDataFoundComponent,
  NoSearchResultComponent,
  PaginationComponent,
  Spinner,
  ViewTypes,
  PermissionsComponent
} from '../../../../Components';
import {
  AdvanceSearchUser,
  UserCardsComponent,
  UserDeleteDialog,
  UserCancelDialog,
  UserListView,
} from './UserUtilties';
import { ViewTypesEnum, ActionsEnum, TableActions } from '../../../../Enums';
import { ActiveOrganizationUser, OrganizationUserSearch } from '../../../../Services/userServices';
import {
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  GlobalHistory,
  bottomBoxComponentUpdate,
} from '../../../../Helper/Middleware.Helper';
import { showError, showSuccess } from '../../../../Helper';
import { UserLoginPermissions } from '../../../../Permissions';
import { getIsAllowedPermission } from '../../../../Helper/Permissions.Helper';

import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';

const translationPath = 'Users.';

const UserView = () => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const dispatch = useDispatch();
  const [viewTypes, setViewTypes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setisFirstLoad] = useState(true);
  const [users, setUsers] = useState({ result: [], totalCount: 0 });
  const [activeUserItem, setActiveUserItem] = useState(null);
  const [usersTableFilter, setUsersTableFilter] = useState(null);
  const { t } = useTranslation('UsersView');
  useTitle(t('Users.users'));
  const [sortBy, setSortBy] = useState(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    name: null,
    userStatusId: 0,
    userName: null,
    phoneNumber: null,
    email: null,
    filterBy: null,
    orderBy: null
  });
  const searchTimer = useRef(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenDeactive, setIsOpenDeactive] = useState(false);
  // const [isOpenRole, setIsOpenRole] = useState(false);
  // const [isOpenManagement, setIsOpenManagement] = useState(false);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const getUsers = useCallback(async (f) => {
    setIsLoading(true);
    if (getIsAllowedPermission(
      Object.values(UserLoginPermissions),
      loginResponse,
      UserLoginPermissions.ViewUsers.permissionsId
    )) {
      const localFilterDto = f || filter || {};
      if (usersTableFilter) {
        Object.values(usersTableFilter)
          .map((item) => {
            if (localFilterDto[item.displayPath]) {
              //localFilterDto.push(localFilterDto[item.displayPath]);
              localFilterDto[item.displayPath] = item.value;
            }
            else {
              localFilterDto[item.displayPath] = item.value;
            }
            return undefined;
          });
      }
      const res = await OrganizationUserSearch({ ...filter, pageIndex: filter.pageIndex + 1, ...localFilterDto });
      if (res && res.totalCount === 0) setisFirstLoad(false);

      if (filter.pageIndex === 0 || viewTypes === ViewTypesEnum.tableView.key) setUsers(res);
      else {
        setUsers({
          result: res.result,
          totalCount: res.totalCount,
        });
      }
    }
    setIsLoading(false);
  }, [usersTableFilter, filter, loginResponse, viewTypes]);
  const itemsPerPageChanged = useCallback((event, newItemsPerPage) => {
    setFilter((items) => ({ ...items, pageIndex: 0, pageSize: newItemsPerPage.props.value }));
  }, []);
  const addNewUser = () => {
    GlobalHistory.push('/home/Users/add');
  };
  const activateUser = useCallback(
    async (id) => {
      setIsLoading(true);
      const res = await ActiveOrganizationUser(id);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t(`${translationPath}user-activated-successfully`));
        setFilter((item) => ({ ...item, pageIndex: 0 }));
        setActiveUserItem(null);
      } else showError(t(`${translationPath}user-activate-failed`));
      setIsLoading(false);
    },
    [t]
  );

  // const DactivateUser = useCallback(
  //   async (id) => {
  //     setIsLoading(true);
  //     const res = await DeActivedUser(id);
  //     if (!(res && res.status && res.status !== 200)) {
  //       showSuccess(t(`${translationPath}user-Deactivated-successfully`));
  //       setFilter((item) => ({ ...item, pageIndex: 0 }));
  //       setActiveUserItem(null);
  //     } else showError(t(`${translationPath}user-Deactivate-failed`));
  //     setIsLoading(false);
  //   },
  // );

  const onSearchChanged = useCallback((searchDto) => {
    setFilter(()=>{})
    setFilter((items) => ({
      ...items,
      ...searchDto,
      pageIndex: 0,
      userTypeId: searchDto.userTypeId || null,
    }));
  }, []);

  const advancedSearchClicked = useCallback(() => {
    sideMenuComponentUpdate(<AdvanceSearchUser onSearchChanged={onSearchChanged} />);
    sideMenuIsOpenUpdate(true);
  }, [onSearchChanged]);
  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((items) => ({ ...items, name: value, pageIndex: 0 }));
    }, 700);
  };
  const onTypeChanged = (activeType) => {
    localStorage.setItem('UserViewType', JSON.stringify(activeType));
    setViewTypes(activeType);
    setFilter((item) => ({ ...item, pageIndex: 0 }));
  };

  const actionClicked = useCallback(
    (actionEnum, item) => async (event) => {
      event.stopPropagation();
      setActiveUserItem(item);
      localStorage.setItem('activeUserItem', JSON.stringify(item));
      if (actionEnum === ActionsEnum.delete.key || actionEnum === TableActions.delete.key)
        setIsOpenConfirm(true);
      else if (actionEnum === ActionsEnum.edit.key || actionEnum === TableActions.edit.key) {
        dispatch(ActiveItemActions.activeItemRequest(item));
        GlobalHistory.push(`/home/Users/edit?id=${item.id}`);
      }
      // else if (actionEnum === ActionsEnum.add.key || actionEnum === TableActions.add.key)
      //   setIsOpenRole(true);
      else if (actionEnum === ActionsEnum.check.key || actionEnum === TableActions.check.key)
        activateUser(item.id);
      else if ((actionEnum === ActionsEnum.close.key || actionEnum === TableActions.close.key))
        setIsOpenDeactive(true);
    },
    [activateUser]
  );
  const activePageChanged = useCallback((e, newPage) => {
    setFilter((item) => ({ ...item, pageIndex: newPage }));
  }, []);
  // const onLoadMoreHandler = useCallback(() => {
  //   setFilter((item) => ({ ...item, pageIndex: item.pageIndex + 1 }));
  // }, []);
  useEffect(() => {
    if (filter)
    getUsers(filter);
  }, [getUsers]);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );

  const onFilterValuesChanged = (newValue) => {
    setUsersTableFilter(newValue);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  // useEffect(() => {
  //   const data = localStorage.getItem('UserViewType');
  //   if (data === null)
  //   {
  //     localStorage.setItem('UserViewType', JSON.stringify(ViewTypesEnum.cards.key));
  //     setViewTypes(ViewTypesEnum.cards.key);
  //   } else
  //     setViewTypes(JSON.parse(data));
  // }, [onTypeChanged]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={users && users.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  useEffect(() => {
    if (sortBy)
      setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <>
      <div className='view-wrapper'>
        <Spinner isActive={isLoading} />
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(UserLoginPermissions)}
                permissionsId={UserLoginPermissions.AddNewUser.permissionsId}
              >
                <Button className='btns theme-solid' onClick={addNewUser}>
                  <span className='mdi mdi-plus' />
                  {t('Users.add-new-user')}
                </Button>
              </PermissionsComponent>
            </div>
            <div className='section px-2'>
              <div className='d-flex-column p-relative'>
                <div className='advance-search-btn'>
                  <PermissionsComponent
                    permissionsList={Object.values(UserLoginPermissions)}
                    permissionsId={UserLoginPermissions.ViewUsers.permissionsId}
                  >
                    <Button className='btns theme-transparent' onClick={advancedSearchClicked}>
                      <span className='mdi mdi-text-box-search-outline' />
                      <span>{t('Users.advance-search')}</span>
                    </Button>
                  </PermissionsComponent>
                </div>
                <PermissionsComponent
                  permissionsList={Object.values(UserLoginPermissions)}
                  permissionsId={UserLoginPermissions.ViewUsers.permissionsId}
                >
                  <Inputs
                    idRef='usersSearchRef'
                    variant='outlined'
                    fieldClasses='inputs theme-solid'
                    label={t('Users.filter')}
                    beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    onKeyUp={searchHandler}
                    inputPlaceholder={t('Users.search-users')}
                  />
                </PermissionsComponent>
              </div>
              <div>
                <PermissionsComponent
                  permissionsList={Object.values(UserLoginPermissions)}
                  permissionsId={UserLoginPermissions.ViewUsers.permissionsId}
                >
                  <ViewTypes
                    onTypeChanged={onTypeChanged}
                    initialActiveType={viewTypes}
                    activeTypes={[ViewTypesEnum.cards.key, ViewTypesEnum.tableView.key]}
                    className='mb-3'
                  />
                </PermissionsComponent>
              </div>
            </div>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(UserLoginPermissions)}
          permissionsId={UserLoginPermissions.ViewUsers.permissionsId}
        >
          <NoDataFoundComponent />
          {/* {users && users.totalCount === 0 && !isFirstLoad && <NoSearchResultComponent />} */}
        </PermissionsComponent>
        <PermissionsComponent
          permissionsList={Object.values(UserLoginPermissions)}
          permissionsId={UserLoginPermissions.ViewUsers.permissionsId}
        >
          {viewTypes === ViewTypesEnum.tableView.key && (
            <UserListView
              data={users}
              actionClicked={(actionEnum, item, focusedRow, event) =>
                actionClicked(actionEnum, item)(event)}
              activePageChanged={activePageChanged}
              itemsPerPageChanged={itemsPerPageChanged}
              filter={filter}
              setSortBy={setSortBy}
              onFilterValuesChanged={onFilterValuesChanged}
            />
          )}
        </PermissionsComponent>
        <PermissionsComponent
          permissionsList={Object.values(UserLoginPermissions)}
          permissionsId={UserLoginPermissions.ViewUsers.permissionsId}
        >

          {viewTypes !== ViewTypesEnum.tableView.key && (
            <UserCardsComponent
              data={users}
              // onLoadMore={onLoadMoreHandler}
              // isLoading={isLoading}
              actionClicked={actionClicked}
              translationPath={translationPath}
            />
          )}
        </PermissionsComponent>
      </div>
      {/* {isOpenManagement && (
        <UserManagementDialog
          activeUserItem={activeUserItem}
          isOpen={isOpenManagement}
          isOpenChanged={() => {
            setIsOpenManagement(false);
            setActiveUserItem(null);
          }}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setActiveUserItem(null);
            setIsOpenManagement(false);
          }}
        />
      )} */}
      {activeUserItem && (
        <>
          {/* <AssignRoleDialog
            activeUserItem={activeUserItem}
            isOpen={isOpenRole}
            isOpenChanged={() => {
              setIsOpenRole(false);
              setActiveUserItem(null);
            }}
            reloadData={() => {
              setFilter((item) => ({ ...item, pageIndex: 0 }));
              setActiveUserItem(null);
              setIsOpenRole(false);
            }}
          /> */}
          <UserDeleteDialog
            activeUserItem={activeUserItem}
            isOpen={isOpenConfirm}
            isOpenChanged={() => {
              setIsOpenConfirm(false);
              setActiveUserItem(null);
            }}
            reloadData={() => {
              setFilter((item) => ({ ...item, pageIndex: 0 }));
              setActiveUserItem(null);
              setIsOpenConfirm(false);
            }}
          />
          <UserCancelDialog
            activeUserItem={activeUserItem}
            isOpen={isOpenDeactive}
            isOpenChanged={() => {
              setIsOpenDeactive(false);
              setActiveUserItem(null);
            }}
            reloadData={() => {
              setFilter((item) => ({ ...item, pageIndex: 0 }));
              setActiveUserItem(null);
              setIsOpenDeactive(false);
            }}
          />
        </>
      )}
    </>
  );
};
export { UserView };
