import React, { useEffect, useCallback, useState } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  ContactTypeEnum, ActionsEnum, LoadableImageEnum,
} from '../../../../../../Enums';
import { LoadableImageComponant } from '../../../../../../Components';
import {
  getDownloadableLink,
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  returnPropsByPermissions,
  returnPropsByPermissions2
} from '../../../../../../Helper';
// import { useEventListener } from '../../../../../../Hooks';
import UserSlider from '../UserSlider/UserSlider';
import { UserLoginPermissions } from '../../../../../../Permissions';
import { getIsAllowedPermission } from '../../../../../../Helper/Permissions.Helper';
import { GetUserId } from '../../../../../../Services';

export function UserCardsComponent({
  data,
  // page,
  // rowsPerPage,
  // onLoadMore,
  // isLoading,
  actionClicked,
}) {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const { t } = useTranslation('UsersView');
  const translationPath = 'UsersManagementView.';
  const [activeitem, setactiveitem] = useState(null);
  const getTableActionsByPermissions = () => {
    // eslint-disable-next-line prefer-const
    let list = [];
    if (returnPropsByPermissions2(UserLoginPermissions.EditButtonInUserRecord.permissionsId, UserLoginPermissions.DeleteButtonOnCard.permissionsId)) {
      list.push(
        ActionsEnum.edit,
        ActionsEnum.delete,
      );
      return list;
    }
    if (returnPropsByPermissions(UserLoginPermissions.EditButtonInUserRecord.permissionsId)) {
      list.push(
        ActionsEnum.edit
      );
      return list;
    }
    if (returnPropsByPermissions(UserLoginPermissions.DeleteButtonOnCard.permissionsId)) {
      list.push(
        ActionsEnum.delete
      );
      return list;
    }
    return list;
  };
  const getUserActions = (userStatus) => {
    // eslint-disable-next-line prefer-const
    let actionsList = [];
    // eslint-disable-next-line prefer-const
    const editPermission = getIsAllowedPermission(
      Object.values(UserLoginPermissions),
      loginResponse,
      UserLoginPermissions.EditButtonInUserRecord.permissionsId
    );
    const deletePermission = getIsAllowedPermission(
      Object.values(UserLoginPermissions),
      loginResponse,
      UserLoginPermissions.DeleteButtonOnCard.permissionsId
    );
    if (userStatus === 'Pending') {
      actionsList.push(ActionsEnum.check);
      actionsList.push(ActionsEnum.close);
      if (deletePermission)
        actionsList.push(ActionsEnum.delete);
    } else if (userStatus === 'Canceled') {
      actionsList.push(ActionsEnum.check);
      if (deletePermission)
        actionsList.push(ActionsEnum.delete);
    } else if (userStatus === 'Active') {
      if (editPermission)
        actionsList.push(ActionsEnum.edit);
      actionsList.push(ActionsEnum.close);
      if (deletePermission)
        actionsList.push(ActionsEnum.delete);
    }

    return (actionsList || getTableActionsByPermissions);
  };

  // ActionsEnum.add,

  // const onScrollHandler = useCallback(() => {
  //   if (
  //     data &&
  //     data.result &&
  //     document.documentElement.scrollTop + window.innerHeight >=
  //       document.documentElement.scrollHeight - 5 &&
  //     data.result.length < data.totalCount &&
  //     isLoading !== true
  //   )
  //     onLoadMore();
  // }, [data, isLoading, onLoadMore]);
  // useEventListener('scroll', onScrollHandler);
  // useEffect(() => {
  //   if (
  //     data &&
  //     data.result &&
  //     data.result.length < data.totalCount &&
  //     document.body.scrollHeight <= document.body.clientHeight &&
  //     isLoading !== true
  //   )
  //     onScrollHandler();
  // }, [data, isLoading, onScrollHandler]);

  const DriversSliderClicked = useCallback(async(item) => {
    const res = await GetUserId(item.id);
    item.userId = res;
    sideMenuComponentUpdate(<UserSlider item={item} />);
    sideMenuIsOpenUpdate(true);
  }, []);

  useEffect(
    () => () => {
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );


  return (
    <div className='users-card-component-wrapper'>
      {data.result.map((item, index) => (
        <div className='users-card-wrapper' key={`userCardRef${index + 1}`}>
          <div
            className={`cards-wrapper ${activeitem === index ? 'active' : ''} `}
            onClick={() => { DriversSliderClicked(item); setactiveitem(index); }}
          >
            <div className='cards-header'>
              <div>
                <LoadableImageComponant
                  type={LoadableImageEnum.div.key}
                  classes='user-cover-image'
                  alt={t(`${translationPath}user-image`)}
                  src={
                    (item.profileImg && getDownloadableLink(item.profileImg)) ||
                    ContactTypeEnum.man.defaultImg
                  }
                />
              </div>
              <div className='d-flex-column'>
                <div className='item-wrapper px-2'>
                  <span className='item-header'>{item.fullName}</span>
                </div>
                <div className='item-wrapper'>
                  <span className='item-header px-2'>
                    {t(`${translationPath}Username`)}
                    :
                  </span>
                  <span className='item-body'>{item.userName}</span>
                </div>
                <div className='item-userTypes'>
                  {item.userTypes && item.userTypes.length > 0 && (
                    <div className='item-wrapper'>
                      <span className='item-body c-secondary'>
                        {item.userTypes &&
                          item.userTypes.map((subItem, subIndex) => (
                            <span key={`userRolesRef${(subIndex + 1) * (index + 1)}`}>
                              {subItem.rolesName}
                              {subIndex < item.userTypes.length - 1 && (
                                <span className='pr-1'>,</span>
                              )}
                            </span>
                          ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='cards-body'>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-phone px-2' />
                  <span>
                    {t(`${translationPath}Mobile`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.phoneNumber}</span>
              </div>
              <div className='item-wrapper flex-nowrap'>
                <div className='texts-truncate d-flex'>
                  <span className='item-header'>
                    <span className='mdi mdi-email-outline px-2' />
                    <span>
                      {t(`${translationPath}Email`)}
                      {' '}
                      :
                    </span>
                  </span>
                  <span
                    className='item-body texts-truncate d-inline-block'
                    title={item.email || 'N/A'}
                  >
                    {item.email || 'N/A'}
                  </span>
                </div>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-whatsapp px-2' />
                  <span>
                    {' '}
                    {t(`${translationPath}whatsapp`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.whatsAppNumber || 'N/A'}</span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-map-marker px-2' />
                  <span>
                    {' '}
                    {t(`${translationPath}nationality`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.nationalityName || 'N/A'}</span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-calendar-blank px-2' />
                  <span>
                    {t(`${translationPath}register`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>
                  {(item.createdOn &&
                    moment(item.createdOn).locale(i18next.language).format('DD/MM/YYYY')) ||
                    'N/A'}
                </span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-account-check px-2' />
                  <span>
                    {t(`${translationPath}Status`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.userStatus || 'N/A'}</span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-database px-2 icon' />

                  <span>
                    {t(`${translationPath}data-source`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.dataSource || 'N/A'}</span>
              </div>
              <div className='item-wrapper mb-3'>
                <span className='item-header'>
                  <span className='mdi mdi-domain px-2 icon' />

                  <span>
                    {t(`${translationPath}branch`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.branch || 'N/A'}</span>
              </div>
            </div>
            <div className='item-wrapper actions'>
              {getUserActions(item.userStatus).map((action, actionIndex) => (
                <Tooltip title={t(`${translationPath}${action.key}`)}>
                  <Button
                    className='btns theme-outline'
                    disabled={action.key === 'delete'}
                    key={`userCardActionsRef${(index + 1) * (actionIndex + 1)}`}
                    onClick={actionClicked(action.key, item, index)}
                  >
                    <span className={action.icon} />
                  </Button>

                </Tooltip>

              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
