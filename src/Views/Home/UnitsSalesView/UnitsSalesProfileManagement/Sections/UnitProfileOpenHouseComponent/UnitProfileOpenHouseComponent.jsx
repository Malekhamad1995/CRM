import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { UnitProfileOpenHouseCardComponent } from './UnitProfileOpenHouseCardComponent/UnitProfileOpenHouseCardComponent';
import {
  DialogComponent,
  PaginationComponent,
  PermissionsComponent,
  Spinner,
} from '../../../../../../Components';
import { DeleteOpenHouse, GetAllUnitOpenHouses } from '../../../../../../Services';
import { AddOpenhouseDialog } from './AddOpenhouseDialog/AddOpenhouseDialog';
import { bottomBoxComponentUpdate, GetParams, showSuccess } from '../../../../../../Helper';
import { UnitsSalesPermissions } from '../../../../../../Permissions';

export const UnitProfileOpenHouseComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 1,
  });
  const [response, setresponse] = useState([]);
  const [openAddDialog, setopenAddDialog] = useState(false);
  const [open, setopen] = React.useState(false);
  const [OpenHouses, setOpenHouses] = React.useState('');
  const [UnitId, setUnitId] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [IsEdit, setIsEdit] = React.useState(false);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 1, pageSize }));
  };

  const GetAllUnitOpenHousesAPI = useCallback(async (UnitId, pageIndex, pageSize) => {
    setIsLoading(true);
    const result = await GetAllUnitOpenHouses(UnitId, pageIndex, pageSize);
    if (!(result && result.status && result.status !== 200))
      setresponse(result);

    setIsLoading(false);
  }, []);

  const openDialog = useCallback(() => {
    setIsEdit(false);
    setopenAddDialog(true);
  }, []);

  useEffect(() => {
    const UnitId = GetParams('id');
    if (UnitId !== null) GetAllUnitOpenHousesAPI(UnitId, filter.pageIndex, filter.pageSize);
    setUnitId(UnitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const DeleteOpenHouseAPI = useCallback(async (unitOpenHouseId) => {
    setIsLoading(true);
    await DeleteOpenHouse(unitOpenHouseId);
    setIsLoading(false);
    const UnitIdd = GetParams('id');
    if (UnitId !== null) GetAllUnitOpenHousesAPI(UnitIdd, filter.pageIndex, filter.pageSize);
    showSuccess(t(`${translationPath}SuccessDeleteOpenHouse`));
    setopen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={response.totalCount}
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

  return (
    <div className='unit-profile-open-house-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section'>
        <span>{t(`${translationPath}open-house`)}</span>
      </div>
      <div className='mb-2'>
        <PermissionsComponent
          permissionsList={Object.values(UnitsSalesPermissions)}
          permissionsId={UnitsSalesPermissions.AddNewOpenHouseForUnit.permissionsId}
        >
          <ButtonBase className='btns theme-solid' onClick={openDialog}>
            <span className='mdi mdi-plus' />
            <span>{t(`${translationPath}add-new`)}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
      <div className='UnitProfileOpenHouseseaction'>
        {response &&
          response.result &&
          response.result.map((item) => (
            <UnitProfileOpenHouseCardComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              data={item}
              setid={(data) => {
                setOpenHouses(data);
                setopen(true);
              }}
              edithouse={(data) => {
                setOpenHouses(data);
                setIsEdit(true);
                setopenAddDialog(true);
              }}
            />
          ))}
      </div>
      {openAddDialog && (
        <AddOpenhouseDialog
          open={openAddDialog}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          UnitId={UnitId}
          IsEdit={IsEdit}
          OpenHouses={OpenHouses}
          close={setopenAddDialog}
          reloadData={() => GetAllUnitOpenHousesAPI(UnitId, filter.pageIndex, filter.pageSize)}
        />
      )}
      <DialogComponent
        saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
        isOpen={open}
        saveText='confirm'
        saveType='submit'
        onCancelClicked={() => setopen(false)}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleText='DleteOpenHouse'
        onSubmit={(e) => {
          e.preventDefault();
          DeleteOpenHouseAPI(OpenHouses.unitOpenHouseId);
        }}
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <Spinner isActive={isLoading} />
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />
            <span>
              {' '}
              <span>
                {t(`${translationPath}MassageDleteOpenHouse`) + OpenHouses.unitOpenHouseLocation}
              </span>
            </span>
          </div>
        )}
      />
    </div>
  );
};
