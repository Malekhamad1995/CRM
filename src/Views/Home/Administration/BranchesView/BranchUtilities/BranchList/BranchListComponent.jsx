import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import BranchSlider from '../BranchSlider/BranchSlider';
import { sideMenuIsOpenUpdate, sideMenuComponentUpdate , getIsAllowedPermission } from '../../../../../../Helper';
import { BranchesPermissions } from '../../../../../../Permissions';


const BranchListComponent = ({
  data,
  actionClicked,
  countries,
  cities,
  translationPath,
  parentTranslationPath }) => {

  const { t } = useTranslation(parentTranslationPath) ; 
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [currentActions, setCurrentActions] = useState(() => []);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });


  const getBranchActions = (isActive) => {
    let actionsList = [];
    if(getIsAllowedPermission(Object.values(BranchesPermissions),
     loginResponse,
     BranchesPermissions.UpdateBranch.permissionsId))
    actionsList.push({ enum: TableActions.edit.key, title: (t(`${translationPath}edit`)) });

    if (!isActive && getIsAllowedPermission(
      Object.values(BranchesPermissions),
      loginResponse,
      BranchesPermissions.SetBranchAsActiveOrInactive.permissionsId)) {
      actionsList.push({
        enum: TableActions.check.key, title:
          (t(`${translationPath}active`))
      });
    } else if(isActive && getIsAllowedPermission(
      Object.values(BranchesPermissions),
      loginResponse,
      BranchesPermissions.SetBranchAsActiveOrInactive.permissionsId)) 
      actionsList.push({ enum: TableActions.close.key, title: (t(`${translationPath}close`)) });
    
    return actionsList;
  };

  const DriversSliderClicked = useCallback((item) => {
    sideMenuComponentUpdate(<BranchSlider
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      item={item} />);
    sideMenuIsOpenUpdate(true);
  }, []);

  const focusedRowChanged = (activeRow) => {
    const item = data[activeRow];
    if (!item) return;
    setCurrentActions(getBranchActions(item.isActive));
    DriversSliderClicked(item);
  };

  const branchesMapper = () => {
    data.forEach(item => {
      item['branchCountryName'] = countries[`${item.branchCountryId}`]
      item['branchCityName'] = cities[`${item.branchCityId}`]
      item['statusName'] = item.isActive ? 'Active' : 'Deactivated'
    })
  }

  useEffect(() => {
    branchesMapper();
  }, [data, countries, cities])

  return (
    <div className='w-100 px-3'>
      {(data && data.length && (
        <Tables
          data={(data && data) || []}
          headerData={[
            {
              id: 1,
              isSortable: true,
              label: t(`${translationPath}branch-name`),
              input: 'branchName',
              isDate: false,
            },
            {
              id: 2,
              isSortable: true,
              label: t(`${translationPath}branch-number`),
              input: 'branchNumber',
              isDate: false,
            },
            {
              id: 3,
              isSortable: true,
              label: t(`${translationPath}branch-country`),
              input: 'branchCountryName',
              isDate: false,
            },
            {
              id: 4,
              isSortable: true,
              label: t(`${translationPath}branch-city`),
              input: 'branchCityName',
              isDate: false,
            },
            {
              id: 5,
              isSortable: true,
              label: t(`${translationPath}maximum-number-of-users`),
              input: 'maximumNumberOfUsers',
              isDate: false,
            },
            {
              id: 6,
              isSortable: true,
              label: t(`${translationPath}status`),
              input: 'statusName',
              isDate: false,
            },
          ]}
          activePage={filter.pageIndex}
          totalItems={(data && data.length) || 0}
          itemsPerPage={filter.pageSize}
          focusedRowChanged={focusedRowChanged}
          actionsOptions={{
            actions: currentActions,
            classes: '',
            isDisabled: false,
            onActionClicked: actionClicked,
          }}
        />
      )) || null}
    </div>)

}

export { BranchListComponent };
