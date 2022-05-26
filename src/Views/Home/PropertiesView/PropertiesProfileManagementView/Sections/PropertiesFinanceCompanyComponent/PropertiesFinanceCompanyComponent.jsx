import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Tables, Spinner, PermissionsComponent } from '../../../../../../Components';
import { AddFinanceCompanyDialog } from './AddFinanceCompanyDialog/AddFinanceCompanyDialog';
import { TableActions } from '../../../../../../Enums';
import { GetAllCompanyFinancesByPropertyId } from '../../../../../../Services';
import { GetParams } from '../../../../../../Helper';
import { CompanyFinanceDeleteDialog } from './CompanyFinanceDeleteDialog/CompanyFinanceDeleteDialog';
import { PropertiesPermissionsCRM, PropertyManagementListPermissions } from '../../../../../../Permissions';

export const PropertiesFinanceCompanyComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [openAddDialog, setopenAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [activeCompanyItem, setActiveCompanyItem] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 1,
  });
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];

  useEffect(() => {
    setPropertyId(+GetParams('id'));
    if (pathName === 'Properties-CRM/property-profile-edit')
      setIsPropertyManagementView(false);
    else
      setIsPropertyManagementView(true);
  }, [pathName]);

  const getCompanyFinanceById = useCallback(async () => {
    setLoading(true);
    if (propertyId) {
      const result = await GetAllCompanyFinancesByPropertyId(
        filter.pageIndex,
        filter.pageSize,
        propertyId
      );
      if (!(result && result.status && result.status !== 200)) setResponse(result);
      else setResponse({});
    }
    setLoading(false);
  }, [filter, propertyId]);

  useEffect(() => {
    getCompanyFinanceById();
  }, [getCompanyFinanceById]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const openDialog = useCallback(() => {
    setopenAddDialog(true);
  }, []);

  const tableActionClicked = useCallback(async (actionEnum, item) => {
    setActiveCompanyItem(item);
    if (actionEnum === TableActions.deleteText.key) setIsOpenConfirm(true);
  }, []);

  // Properties-CRM/property-profile-edit

  return (
    <div className='associated-contacts-wrapper childs-wrapper properties-finance-wrapper'>
      <Spinner isActive={loading} />
      <div className='title-section'>
        <span>{t(`${translationPath}Finance`)}</span>
      </div>
      <div className='w-100 px-2'>
        <div className='d-flex mb-2 w-100 filter-wrapper'>
          {isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={Object.values(PropertyManagementListPermissions)}
              permissionsId={PropertyManagementListPermissions.AddNewCompanyFinance.permissionsId}
            >
              <ButtonBase className='btns theme-solid' onClick={openDialog}>
                <span className='mdi mdi-plus' />
                <span>{t(`${translationPath}AddNew`)}</span>
              </ButtonBase>
            </PermissionsComponent>
          )}
          {!isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={Object.values(PropertiesPermissionsCRM)}
              permissionsId={PropertiesPermissionsCRM.AddFinanceCompanyForPropertry.permissionsId}
            >
              <ButtonBase className='btns theme-solid' onClick={openDialog}>
                <span className='mdi mdi-plus' />
                <span>{t(`${translationPath}AddNew`)}</span>
              </ButtonBase>
            </PermissionsComponent>
          )}

        </div>
        <Tables
          data={response ? response.result : []}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}SNo`),
              input: 'companyFinanceId',
            },
            {
              id: 2,
              label: t(`${translationPath}Finance-Company`),
              input: 'companyName',
            },
            {
              id: 3,
              label: t(`${translationPath}Term-of-Loan`),
              input: 'termOfLoanYears',
            },
            {
              id: 4,
              label: t(`${translationPath}Interest-Rate`),
              input: 'interestRate',
            },
            {
              id: 5,
              label: t(`${translationPath}Remarks`),
              input: 'remarks',
            },
          ]}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          defaultActions={[
            // {
            //   enum: TableActions.openFile.key,
            //   isDisabled: false,
            //   externalComponent: null,
            // },
            // {
            //   enum: TableActions.downloadText.key,
            //   isDisabled: false,
            //   externalComponent: null,
            // },
            {
              enum: TableActions.deleteText.key,
              isDisabled: false,
              externalComponent: null,
            },
          ]}
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          activePage={filter.pageIndex}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response ? response.totalCount : 0}
        />
      </div>
      <AddFinanceCompanyDialog
        t={t}
        open={openAddDialog}
        propertyId={propertyId}
        translationPath={translationPath}
        reloadData={getCompanyFinanceById}
        close={setopenAddDialog}
      />
      <CompanyFinanceDeleteDialog
        t={t}
        activeUserItem={activeCompanyItem}
        isOpen={isOpenConfirm}
        translationPath={translationPath}
        isOpenChanged={() => {
          setIsOpenConfirm(false);
          setActiveCompanyItem(null);
        }}
        reloadData={() => {
          setFilter((item) => ({ ...item, pageIndex: 0 }));
          setActiveCompanyItem(null);
          setIsOpenConfirm(false);
        }}
      />
    </div>
  );
};
