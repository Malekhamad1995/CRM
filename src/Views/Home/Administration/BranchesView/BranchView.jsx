import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../../Hooks';
import { Inputs } from '../../../../Components/Controls';
import {
  Spinner,
  ViewTypes,
  PermissionsComponent
} from '../../../../Components';
import { BranchCardsComponent, BranchListComponent, BranchDeactiveDialog } from './BranchUtilities';
import { ViewTypesEnum, ActionsEnum, TableActions } from '../../../../Enums';
import {
  GetAllBranches,
  lookupItemsGetId,
  SetBranchAsActiveOrInactive,
} from '../../../../Services';
import { showError, showSuccess } from '../../../../Helper';
import {CityTypeIdEnum} from '../../../../Enums'
import { BranchManagmentDialog } from './BranchUtilities';
import { BranchesPermissions   } from '../../../../Permissions';

const BranchView = () => {
  const [viewTypes, setViewTypes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOpenDeactive, setIsOpenDeactive] = useState(false);
  const [branches, setBranches] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [countriesData, setCountriesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const translationPath = 'Branches.';
  const parentTranslationPath = 'BranchView';
  const { t } = useTranslation(parentTranslationPath);

  useTitle(t(`${translationPath}branches`));

  const actionClicked = useCallback(
    (actionEnum, item) => async (event) => {
      event.stopPropagation();
      setActiveItem(item);

      if (actionEnum === ActionsEnum.edit.key || actionEnum === TableActions.edit.key) {
        setOpenDialog(true);
      }
      else if (actionEnum === ActionsEnum.check.key || actionEnum === TableActions.check.key) {
        activateBranch(item.branchId);
      } else if (actionEnum === ActionsEnum.close.key || actionEnum === TableActions.close.key) {
        setIsOpenDeactive(true);
      }
    }
    );

  const onTypeChanged = (activeType) => {
    setViewTypes(activeType);
  };

  const activateBranch = async (branchId) => {
    setIsLoading(true);
    const res = await SetBranchAsActiveOrInactive({ branchId: branchId });
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}branch-activated-successfully`));
      reloadData();
      setActiveItem(null);
    } else showError(t(`${translationPath}branch-activation-failed`));
    setIsLoading(false);

  };

  const addNewBranch = () => {
    setOpenDialog(true);
  };

  const getAllBranches = async () => {
    setIsLoading(true);
    const res = await GetAllBranches();
    if (!(res && res.status && res.status !== 200)) {
      setBranches(res);
    } else {
      setBranches([]);
    }
    setIsLoading(false);
  };

  const reloadData = useCallback(() => {
    setIsOpenDeactive(false);
    setActiveItem(null);
    getAllBranches();
  });

  useEffect(() => {
    getAllBranches();
  }, []);

  const getCountriesLookups = async () => {
    const res = await lookupItemsGetId({ lookupTypeId: 16 });
    if (!(res && res.status && res.status !== 200)) setCountriesData(res || []);
    else setCountriesData([]);
  };

  const getCitiesLookups = async () => {
    const res = await lookupItemsGetId({ lookupTypeId: CityTypeIdEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setCitiesData(res || []);
    else setCitiesData([]);
  };

  const getCountriesCitiesIdName = () => {
    let countriesObj = {};
    countriesData &&
      countriesData.length &&
      countriesData.forEach((item) => {
        countriesObj[`${item.lookupItemId}`] = item.lookupItemName;
      });
    let citiesObj = {};
    citiesData &&
      citiesData.length &&
      citiesData.forEach((item) => {
        citiesObj[`${item.lookupItemId}`] = item.lookupItemName;
      });

    setCountries(countriesObj);
    setCities(citiesObj);

  };

  useEffect(() => {
    getCountriesLookups();
    getCitiesLookups();
  }, []);

  useEffect(() => {
    getCountriesCitiesIdName();
  }, [countriesData, citiesData]);

  return (
    <>
      <div className='view-wrapper'>
        <Spinner isActive={isLoading} />

        <div className='header-section'>
          <div className='filter-section px-2'>
           
            <div className='section'>
            <PermissionsComponent
                permissionsList={Object.values(BranchesPermissions)}
                permissionsId={BranchesPermissions.AddNewBranch.permissionsId}
            >
              <Button className='btns theme-solid' onClick={addNewBranch}>
                <span className='mdi mdi-plus' />
                {t(`${translationPath}add-new-branch`)}
              </Button>
              </PermissionsComponent>
            </div>
            
            <PermissionsComponent
                permissionsList={Object.values(BranchesPermissions)}
                permissionsId={BranchesPermissions.GetAllBranches.permissionsId}
            >
            <div className='section px-2'>
              <div className='d-flex-column p-relative'>
                <Inputs
                  idRef='usersSearchRef'
                  variant='outlined'
                  fieldClasses='inputs theme-solid'
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                  inputPlaceholder={t(`${translationPath}search-branches`)}
                />
              </div>
              <div>
                <ViewTypes
                  onTypeChanged={onTypeChanged}
                  initialActiveType={viewTypes}
                  activeTypes={[ViewTypesEnum.cards.key, ViewTypesEnum.tableView.key]}
                  className='mb-3'
                />
              </div>
            </div>
            </PermissionsComponent>
          </div>
        </div>
        <PermissionsComponent
                permissionsList={Object.values(BranchesPermissions)}
                permissionsId={BranchesPermissions.GetAllBranches.permissionsId}
        >
        {viewTypes === ViewTypesEnum.tableView.key && (
          <BranchListComponent
            activeItem={activeItem}
            data={branches}
            countries={countries}
            cities={cities}
            actionClicked={(actionEnum, item, focusedRow, event) =>
              actionClicked(actionEnum, item)(event)
            }
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        </PermissionsComponent>
        <PermissionsComponent
                permissionsList={Object.values(BranchesPermissions)}
                permissionsId={BranchesPermissions.GetAllBranches.permissionsId}
        >
        {viewTypes !== ViewTypesEnum.tableView.key && (
          <BranchCardsComponent
            data={branches}
            activeItem={activeItem}
            countries={countries}
            cities={cities}
            actionClicked={actionClicked}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        </PermissionsComponent>

        {openDialog && (
          <BranchManagmentDialog
            activeItem={activeItem}
            open={openDialog}
            onSave={() => {
              setOpenDialog(false);
              setActiveItem(null);
              reloadData()
            }}
            close={() => {
              setOpenDialog(false);
              setActiveItem(null);
            }}
            reloadData={reloadData}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        )}

        {activeItem && (
              <BranchDeactiveDialog
                activeItem={activeItem}
                isOpen={isOpenDeactive}
                isOpenChanged={() => {
                  setIsOpenDeactive(false);
                  setActiveItem(null);
                }}
                reloadData={reloadData}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
        )}
      </div>
    </>
  );
};

export { BranchView };
