import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { GlobalHistory } from '../../../Helper';
import { MaintenanceContractsTabelView } from './MaintenanceContractsTabelView/MaintenanceContractsTabelView';
import { Inputs, PermissionsComponent } from '../../../Components';
import { useTitle } from '../../../Hooks';
import { MaintenanceContractsPermissions } from '../../../Permissions/PropertyManagement/MaintenanceContracts.Permissions';

const parentTranslationPath = 'MaintenanceContracts';
const translationPath = '';

export const MaintenanceContractsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [search, setSearch] = useState('');
  const [searchedItem, setSearchedItem] = useState('');
  const searchTimer = useRef(null);
  useTitle(t(`${translationPath}Maintenance-Contracts`));
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value);
    }, 700);
  };
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  return (
    <div className='Maintenance-wrapper view-wrapper'>
      <div className='w-100 px-2'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(MaintenanceContractsPermissions)}
                permissionsId={MaintenanceContractsPermissions.CreateMaintenanceContract.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid'
                  onClick={() => GlobalHistory.push('/home/Maintenance-Contracts/add')}
                >
                  <span className='mdi mdi-plus' />
                  <span>{t(`${translationPath}AddNewMaintenancecontract`)}</span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(MaintenanceContractsPermissions)}
                permissionsId={MaintenanceContractsPermissions.ViewandsearchinPropertyManagementMaintenanceContracts.permissionsId}
              >
                <Inputs
                  value={searchedItem}
                  onKeyUp={searchHandler}
                  idRef='maintenanceContractsRef'
                  label={t(`${translationPath}search-maintenance-contracts`)}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  inputPlaceholder={t(`${translationPath}search-maintenance-contracts-description`)}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </PermissionsComponent>
            </div>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(MaintenanceContractsPermissions)}
          permissionsId={MaintenanceContractsPermissions.ViewandsearchinPropertyManagementMaintenanceContracts.permissionsId}
        >
          <MaintenanceContractsTabelView
            search={search}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </PermissionsComponent>
      </div>
    </div>
  );
};
