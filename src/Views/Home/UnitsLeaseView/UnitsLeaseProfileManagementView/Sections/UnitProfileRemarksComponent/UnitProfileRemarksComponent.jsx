import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import i18next from 'i18next';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import {
  DialogComponent,
  PaginationComponent,
  RadiosGroupComponent,
  Spinner,
} from '../../../../../../Components';
import { UnitAddEditRemarkDialog } from './UnitAddEditRemarkDialog/UnitAddEditRemarkDialog';
import { bottomBoxComponentUpdate, GetParams, showSuccess } from '../../../../../../Helper';
import { DeleteUnitRemark, GetAllUnitRemarksByUnitId } from '../../../../../../Services';
import { PermissionsComponent } from '../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsLeasePermissions } from '../../../../../../Permissions/Lease/UnitsLeasePermissions';
import { UnitPermissions } from '../../../../../../Permissions/PropertyManagement';

export const UnitProfileRemarksComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [agentsFilterType, setAgentsFilterType] = useState(3);
  const [open, setopen] = React.useState(false);
  const [RemarksID, setRemarksID] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setopenDialog] = React.useState(false);
  const [response, setresponse] = useState([]);
  const [totalCount, settotalCount] = useState('');
  const [IsEdit, setIsEdit] = React.useState(false);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const isPropertyManagementView = (pathName === 'units-property-management/unit-profile-edit');
  const onAgentsFilterTypeChangedHandler = (event, newValue) => {
    if (+newValue === 1) setFilter({ ...filter, isAgent: true });
    else if (+newValue === 2) setFilter({ ...filter, isAgent: false });
    else setFilter({ ...filter, isAgent: null });

    setAgentsFilterType(+newValue);
  };
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 1,
    isAgent: null,
  });
  const GetAllUnitRemarksByUnitAPI = useCallback(
    async (UnitId, pageIndex, pageSize, isAgent) => {
      setIsLoading(true);
      const result = await GetAllUnitRemarksByUnitId(UnitId, pageIndex, pageSize, isAgent);
      if (!(result && result.status && result.status !== 200)) {
        setresponse(result.result);
        settotalCount(result.totalCount);
      }
      setIsLoading(false);
    },
    [response]
  );

  const openDialogdlete = useCallback(() => {
    setopenDialog(true);
  }, []);

  const DeleteRemarkAPI = useCallback(async (Id) => {
    await DeleteUnitRemark(Id);
    showSuccess(t(`${translationPath}SuccessDeleteRemark`));
    setopenDialog(false);
    ReloadData();
  }, []);

  const ReloadData = () => {
    const UnitID = GetParams('id');
    GetAllUnitRemarksByUnitAPI(UnitID, filter.pageIndex, filter.pageSize, filter.isAgent);
  };

  useEffect(() => {
    const UnitId = GetParams('id');
    if (UnitId !== null)
      GetAllUnitRemarksByUnitAPI(UnitId, filter.pageIndex, filter.pageSize, filter.isAgent);
  }, [filter]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={totalCount}
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

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  return (
    <div className='unit-profile-remarks-wrapper childs-wrapper'>
      <div className='title-section'>
        <span>{t(`${translationPath}remarks`)}</span>
      </div>
      <RadiosGroupComponent
        idRef='remarkForRef'
        data={[
          {
            key: 3,
            value: 'all',
          },
          {
            key: 1,
            value: 'listing-agents',
          },
          {
            key: 2,
            value: 'all-agents',
          },
        ]}
        value={agentsFilterType}
        labelValue='remark-for'
        labelInput='value'
        valueInput='key'
        themeClass='theme-line'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        translationPathForData={translationPath}
        onSelectedRadioChanged={onAgentsFilterTypeChangedHandler}
      />
      <div className='mb-2'>
        {!isPropertyManagementView && (
          <PermissionsComponent
            permissionsList={Object.values(UnitsLeasePermissions)}
            permissionsId={UnitsLeasePermissions.AddNewRemarksForUnit.permissionsId}
          >
            <ButtonBase
              className='btns theme-solid'
              onClick={() => {
                setopen(true);
                setIsEdit(false);
              }}
            >
              <span className='mdi mdi-plus' />
              <span>{t(`${translationPath}add-new`)}</span>
            </ButtonBase>
          </PermissionsComponent>
        )}

        {isPropertyManagementView && (
          <PermissionsComponent
            permissionsList={Object.values(UnitPermissions)}
            permissionsId={UnitPermissions.AddNewRemarksForUnit.permissionsId}
          >
            <ButtonBase
              className='btns theme-solid'
              onClick={() => {
                setopen(true);
                setIsEdit(false);
              }}
            >
              <span className='mdi mdi-plus' />
              <span>{t(`${translationPath}add-new`)}</span>
            </ButtonBase>
          </PermissionsComponent>
        )}

      </div>
      <div className='remarks-items-wrapper'>
        <Spinner isActive={isLoading} isAbsolute />
        {response &&
          response.map((item, index) => (
            <div className='remarks-item-wrapper'>
              <div className='item-section'>
                <div className='mb-1'>
                  <span className='fw-simi-bold fz-15px'>
                    {t(`${translationPath}title`)}
                    :
                    {' '}
                    {item.title}
                  </span>
                </div>
                <div>
                  <span>{item.remark}</span>
                </div>
              </div>
              <div className='item-section'>
                <div>
                  <div className='mb-1'>
                    <span className='fw-simi-bold fz-15px'>{t(`${translationPath}posted-by`)}</span>
                  </div>
                  <div>
                    <span>{t(`${translationPath}Posted`)}</span>
                  </div>
                </div>
                <div>
                  <div className='d-flex-center mb-1'>
                    <span className='mdi mdi-calendar' />
                    <span className='d-inline-flex-v-center flex-wrap'>
                      <span className='px-2'>
                        <span className='fw-simi-bold fz-15px px-2'>
                          {' '}
                          {t(`${translationPath}created`)}
                        </span>
                        :
                        {' '}
                        {item.usersNotifyName}
                      </span>
                      <span>
                        {moment(item.createdOn).locale(i18next.language).format('DD/MM/YYYY')}
                      </span>
                    </span>
                  </div>
                  <div className='d-flex-v-center-h-between w-100'>
                    <PermissionsComponent
                      permissionsList={!isPropertyManagementView ? Object.values(UnitsLeasePermissions) : Object.values(UnitPermissions)}
                      permissionsId={!isPropertyManagementView ? UnitsLeasePermissions.UpdateRemarksInUnit.permissionsId : UnitPermissions.EditRemarksInUnit.permissionsId}
                    >
                      <ButtonBase
                        className='btns theme-transparent c-gray-primary'
                        onClick={() => {
                          setIsEdit(true);
                          setopen(true);
                          setRemarksID(item);
                        }}
                      >
                        <span className='mdi mdi-mdi mdi-lead-pencil' />
                        <span className='px-2'>{t(`${translationPath}Edit`)}</span>
                      </ButtonBase>
                    </PermissionsComponent>
                    <PermissionsComponent
                      permissionsList={!isPropertyManagementView ? Object.values(UnitsLeasePermissions) : Object.values(UnitPermissions)}
                      permissionsId={!isPropertyManagementView ? UnitsLeasePermissions.DeleteRemarksInUnit.permissionsId : UnitPermissions.DeleteRemarksInUnit.permissionsId}
                    >
                      <ButtonBase
                        className='btns theme-transparent c-gray-primary'
                        onClick={() => {
                          openDialogdlete();
                          setRemarksID(item);
                        }}
                      >
                        <span className='mdi mdi-trash-can-outline' />
                        <span className='px-2'>{t(`${translationPath}delete`)}</span>
                      </ButtonBase>
                    </PermissionsComponent>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {open && (
        <UnitAddEditRemarkDialog
          open={open}
          IsEdit={IsEdit}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          close={() => {
            setopen(false);
            setIsEdit(false);
          }}
          RemarksID={RemarksID}
          reloadData={() => {
            ReloadData();
            setIsEdit(false);
          }}
        />
      )}
      <DialogComponent
        isOpen={openDialog}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleText='Dleteremark'
        saveText='confirm'
        maxWidth='sm'
        dialogContent={(
          <div>
            <span>{t(`${translationPath}MassageDleteremark`) + RemarksID.title}</span>

            <div className='d-flex-v-center-h-end flex-wrap mt-3'>
              <Button
                className='MuiButtonBase-root MuiButton-root MuiButton-text MuiButtonBase-root btns theme-transparent mb-2'
                type='button'
                onClick={() => setopenDialog(false)}
              >
                <span className='MuiButton-label'>
                  <span className='mx-2'>
                    {t(`${translationPath}Cancel`)}
                  </span>

                  <span className='MuiTouchRipple-root' />
                </span>
                <span className='MuiTouchRipple-root' />
              </Button>
              <Button
                className='MuiButtonBase-root btns theme-solid mb-2'
                type='button'
                onClick={(e) => {
            e.preventDefault();
            DeleteRemarkAPI(RemarksID.unitRemarkId);
            ReloadData();
          }}
              >
                <span className='MuiButton-label'>
                  <span className='mx-2'>
                    {t(`${translationPath}confirm`)}
                  </span>
                </span>
                <span className='MuiTouchRipple-root' />
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

UnitProfileRemarksComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
