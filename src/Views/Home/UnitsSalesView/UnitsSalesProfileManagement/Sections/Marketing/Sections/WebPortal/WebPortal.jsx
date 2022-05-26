import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PaginationComponent, Spinner, Tables } from '../../../../../../../../Components';
import { GetAllWebPortals } from '../../../../../../../../Services';
import { bottomBoxComponentUpdate } from '../../../../../../../../Helper';
import { PermissionsComponent } from '../../../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsLeasePermissions, UnitPermissions } from '../../../../../../../../Permissions';

export const WebPortal = ({
  state,
  onStateChanged,
  cancelHandler,
  saveHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  useEffect(() => {
    if (pathName === 'units-property-management/unit-profile-edit')
      setIsPropertyManagementView(true);
    else
      setIsPropertyManagementView(false);
  }, [pathName]);
  const { t } = useTranslation('Shared');
  const [isLoading, setIsLoading] = useState(false);
  const [webPortals, setWebPortals] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const getAllWebPortals = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllWebPortals(filter);
    if (!(res && res.status && res.status !== 200)) {
      setWebPortals({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setWebPortals({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const onSelectClicked = useCallback(
    (row) => {
      const itemIndex = state.marketingWebPortalIds ?
        state.marketingWebPortalIds.findIndex((item) => item === row.marketingWebPortalId) :
        -1;
      if (itemIndex !== -1) state.marketingWebPortalIds.splice(itemIndex, 1);
      else state.marketingWebPortalIds.push(row.marketingWebPortalId);
      onStateChanged({ id: 'marketingWebPortalIds', value: state.marketingWebPortalIds });
    },
    [onStateChanged, state.marketingWebPortalIds]
  );
  const getIsSelected = useCallback(
    (row) =>
      state.marketingWebPortalIds &&
      state.marketingWebPortalIds.findIndex((item) => item === row.marketingWebPortalId) !== -1,
    [state.marketingWebPortalIds]
  );
  const getIsSelectedAll = useCallback(
    () =>
      (state.marketingWebPortalIds &&
        webPortals.result.findIndex(
          (item) => !state.marketingWebPortalIds.includes(item.marketingWebPortalId)
        ) === -1) ||
      false,
    [state.marketingWebPortalIds, webPortals.result]
  );
  const onSelectAllClicked = () => {
    if (!getIsSelectedAll()) {
      webPortals.result.map((item) => {
        if (!getIsSelected(item)) state.marketingWebPortalIds.push(item.marketingWebPortalId);
      });
    } else {
      webPortals.result.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = state.marketingWebPortalIds.findIndex(
            (element) => element === item.marketingWebPortalId
          );
          if (isSelectedIndex !== -1) state.marketingWebPortalIds.splice(isSelectedIndex, 1);
        }
      });
    }
    onStateChanged({ id: 'marketingWebPortalIds', value: state.marketingWebPortalIds });
  };
  useEffect(() => {
    getAllWebPortals();
  }, [getAllWebPortals, filter]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='bottom-box-two-sections'>
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={webPortals.totalCount}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
        <div className='d-flex-v-center flex-wrap'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
            <span>{t('Shared:cancel')}</span>
          </ButtonBase>
          {
            isPropertyManagementView && (
              <PermissionsComponent
                permissionsList={Object.values(UnitPermissions)}
                permissionsId={UnitPermissions.EditUnitMarketingInfo.permissionsId}
              >
                <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
                  <span>{t('Shared:save')}</span>
                </ButtonBase>
              </PermissionsComponent>

            )

          }

          {
            !isPropertyManagementView && (
              <PermissionsComponent
                permissionsList={Object.values(UnitsLeasePermissions)}
                permissionsId={UnitsLeasePermissions.EditUnitMarketingInfo.permissionsId}
              >
                <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
                  <span>{t('Shared:save')}</span>
                </ButtonBase>
              </PermissionsComponent>

            )

          }
        </div>
      </div>
    );
  });
  return (
    <div className='unit-profile-marketing-web-portal-wrapper childs-wrapper bt-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <Tables
        data={webPortals.result || []}
        headerData={[
          {
            id: 1,
            label: 'web-portal',
            input: 'webPortalName',
          },
        ]}
        selectAllOptions={{
          withCheckAll: true,
          selectedRows: state.marketingWebPortalIds,
          getIsSelected,
          disabledRows: [],
          isSelectAll: getIsSelectedAll(),
          onSelectClicked,
          onSelectAllClicked,
        }}
        // actionsOptions={{
        //   // onActionClicked: tableActionClicked,
        // }}
        defaultActions={[]}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        // onPageIndexChanged={onPageIndexChanged}
        // onPageSizeChanged={onPageSizeChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={webPortals.totalCount}
      />
    </div>
  );
};

WebPortal.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
