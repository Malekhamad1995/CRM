import React, { useEffect, useCallback } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  ContactTypeEnum, ActionsEnum, LoadableImageEnum, BranchCard
} from '../../../../../../Enums';

import { LoadableImageComponant } from '../../../../../../Components';
import {
  getDownloadableLink,
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  getIsAllowedPermission , 
} from '../../../../../../Helper';
import BranchSlider from '../BranchSlider/BranchSlider';
import { BranchesPermissions  } from '../../../../../../Permissions';



const BranchCardsComponent = ({ data,
   actionClicked,
   activeitem,
   countries,
   cities,
   translationPath,
   parentTranslationPath }) => {
    
  const {t}= useTranslation(parentTranslationPath) ; 
  const loginResponse = useSelector((state) => state.login.loginResponse);
 
  const getBranchActions = (isBranchActive) => {
    let actionsList = [];

    if(getIsAllowedPermission(Object.values(BranchesPermissions),
     loginResponse,
     BranchesPermissions.UpdateBranch.permissionsId))
          actionsList.push(ActionsEnum.edit);

      if(isBranchActive && getIsAllowedPermission(
        Object.values(BranchesPermissions),
        loginResponse,
        BranchesPermissions.SetBranchAsActiveOrInactive.permissionsId))
           actionsList.push(ActionsEnum.close);
     else if( !isBranchActive && getIsAllowedPermission(Object.values(BranchesPermissions),
     loginResponse,
      BranchesPermissions.SetBranchAsActiveOrInactive.permissionsId))
      actionsList.push(ActionsEnum.check);

    return actionsList ; 
  };

  const DriversSliderClicked = useCallback((item) => {
    sideMenuComponentUpdate(<BranchSlider
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      item={item} />);
    sideMenuIsOpenUpdate(true);
  }, []);

  useEffect(
    () => () => {
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );

  const branchesMapper = ()=>{
    data.forEach(item=>{
      // item['branchCountryName']=countries[`${item.branchCountryId}`]
      // item['branchCityName']=cities[`${item.branchCityId}`]
      item['statusName']=item.isActive?'Active':'Deactivated'
    })
 }

 useEffect(()=>{
   branchesMapper();
 },[data,countries,cities])

  return (
    <div className='branch-card-component-wrapper'>
      {data.map((item, index) => (
        <div className='users-card-wrapper' key={`userCardRef${index + 1}`}>
          <div
            className={`cards-wrapper ${activeitem === index ? 'active' : ''} `}
            onClick={() => {
               DriversSliderClicked(item);
            }}
          >
            <div className='cards-header'> 
              <div>
                <LoadableImageComponant
                  type={LoadableImageEnum.div.key}
                  classes='user-cover-image'
                  alt={t(`${translationPath}branch-image`)}
                  src={
                    (item.branchLogoId && getDownloadableLink(item.branchLogoId)) ||
                    ContactTypeEnum.corporate.defaultImg
                  }
                />
              </div>
              <div className='d-flex-column'>

                <div className='item-wrapper px-2'>

                  <span className='item-header'>{item.branchName || 'N/A'}</span>

                </div>
              </div>

            </div>


            <div className='cards-body'>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className={BranchCard.Number.icon} />
                  <span>
                    {t(`${translationPath}branch-number`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.branchNumber || 'N/A'}</span>
              </div>

              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className={BranchCard.Country.icon} />
                  <span>
                    {t(`${translationPath}country`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{countries[`${item.branchCountryId}`] || 'N/A'}</span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className={BranchCard.City.icon} />
                  <span>
                     {t(`${translationPath}city`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{cities[`${item.branchCityId}`] || 'N/A'}</span>
              </div>
              
              <div className='item-wrapper max-item-wrapper'>
                <span className='item-header header-wrap'>
                  <span className={BranchCard.Users.icon} />
                  <span>
                    {t(`${translationPath}maximum-number-of-users`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.maximumNumberOfUsers || 'N/A'}</span>
              </div>
            </div>

            <div className='item-wrapper actions'>
              {getBranchActions(item.isActive).map((action, actionIndex) => (
                  <Tooltip title={`${action.key}`}>
                    <Button
                      className='btns theme-outline'
                      disabled={action.key === 'delete'}
                      key={`userCardActionsRef${(index + 1) * (actionIndex + 1)}`}
                      onClick={
                        actionClicked(action.key, item, index)
                      }
                    >
                      <span className={action.icon} />
                    </Button>

                  </Tooltip>

                ))}
            </div>
          </div>
          </div>

      ))}
    </div>)

}

export { BranchCardsComponent };
