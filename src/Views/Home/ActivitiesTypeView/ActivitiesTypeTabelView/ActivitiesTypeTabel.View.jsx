import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { search } from 'core-js/fn/symbol';
import {
  DialogComponent, PaginationComponent, Spinner, Tables
} from '../../../../Components';
import { TableActions } from '../../../../Enums';
import {
  bottomBoxComponentUpdate,
  showError,
  showSuccess, returnPropsByPermissions // , GlobalHistory, showSuccess
} from '../../../../Helper';
import { DialogManagementViewComponent } from '../ActivitiesTypeManagementView/DialogManagementViewComponent/DialogManagementViewComponent';
import {
  DeleteActivityType,
  GetActivityTypeById,
  GetAllActivityTypes,
} from '../../../../Services/ActivitiesTypesServices';
import { ActivitiesRelatedToActivitiesTabelType } from './ActivitiesRelatedToActivitiesTabelType.Enum';
import { ActivityTypePermissions } from '../../../../Permissions';

export const ActivitiesTypeTabelView = ({
   parentTranslationPath, translationPath, reloading, setFilter, filter, setSearchedItem

}) => {
  const { t } = useTranslation(parentTranslationPath);
  const list = [];
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [Data, setData] = useState({});
  const [ISedit, setISedit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  const [response, setresponse] = useState({
    result: [],
    totalCount: 0,
  });

  const GetAllActivityTypesAPI = useCallback(async (sortByAndOrderBy) => {
    setIsLoading(true);
    const requestJson = {
      ...filter,
     pageIndex: filter.pageIndex + 1,
     filterBy: (sortByAndOrderBy && sortByAndOrderBy.filterBy) || (sortBy && sortBy.filterBy),
     orderBy: (sortByAndOrderBy && sortByAndOrderBy.orderBy) || (sortBy && sortBy.orderBy)
    };
    const result = await GetAllActivityTypes({ ...requestJson });
    if (!(result && result.status && result.status !== 200)) {
      setresponse({
        result: (result && result.result) || [],
        totalCount: (result && result.totalCount) || 0,
      });
    } else {
      setresponse({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const GetActivityTypeByIdAPI = useCallback(async (id) => {
    setIsLoading(true);
    const res = await GetActivityTypeById(id);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) setData(res);
    else setData([]);
  }, []);

  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setOpenDialog(true);
      setISedit(true);
      GetActivityTypeByIdAPI(item.activityTypeId);
    } else if (actionEnum === TableActions.delete.key) {
      setOpenDeleteDialog(true);
      setActiveItem(item);
    }
  }, []);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const DeleteHandler = async () => {
    const res = await DeleteActivityType(activeItem.activityTypeId);
    if (!(res && res.status && res.status !== 200)) {
      setIsLoading(true);
      GetAllActivityTypesAPI();
      showSuccess(t(`${translationPath}activity-deleted-successfully`));
    } else showError(t(`${translationPath}activity-delete-failed`));
    setIsLoading(false);
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    if (!reloading)
      GetAllActivityTypesAPI();
  }, [GetAllActivityTypesAPI, reloading, filter]);

  useEffect(() => {
    if (sortBy !== null)
      GetAllActivityTypesAPI(sortBy);
  }, [sortBy]);

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

  const getActionTableWithPermissions = () => {
    // eslint-disable-next-line prefer-const

    if (returnPropsByPermissions(ActivityTypePermissions.EditActivityType.permissionsId)) {
      list.push({
        enum: TableActions.editText.key,
        isDisabled: false,
        externalComponent: null,
      });
    }
    if (returnPropsByPermissions(ActivityTypePermissions.DeleteActivityType.permissionsId)) {
      list.push({
        enum: TableActions.delete.key,
        isDisabled: true,
        externalComponent: null,
      });
    }
    return list;
  };

  const focusedRowChanged = (rowIndex, item) => {
    if (rowIndex !== -1) {
      if (item && item.isStatic === false) {
        list.splice(0, list.length);
        list.push({
          enum: TableActions.delete.key,
          isDisabled: false,
          externalComponent: null,
        },
          {
            enum: TableActions.editText.key,
            isDisabled: false,
            externalComponent: null,
          });
      } else if (item && item.isStatic === true) {
        list.splice(0, list.length);
        list.push({
          enum: TableActions.delete.key,
          isDisabled: true,
          externalComponent: null,
        }, {
          enum: TableActions.editText.key,
          isDisabled: false,
          externalComponent: null,
        });
      }
    }
  };

  return (
    <div className='ActivitiesType-View childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='filter-section-item' />
      <div className='w-100 px-2'>
        <Tables
          data={response.result}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}activity-name`),
              input: 'activityTypeName',
              isSortable: true,

            },
            {
              id: 2,
              label: t(`${translationPath}category`),
              input: 'categoryName',
              isSortable: true,

            },
            {
              id: 3,
              label: t(`${translationPath}RelatedtoWorkOrder`),
              component: (item) => (
                <>
                  {((item && item.relatedTo.findIndex(((data) => (+data.relatedToId === ActivitiesRelatedToActivitiesTabelType.workOrder.key &&
                    <span className='mdi mdi-check-circle-outline  check-true' />)
                  )) === -1 && (<span className='mdi mdi-alpha-x-circle-outline check-false' />) || <span className='mdi mdi-check-circle-outline  check-true' />))}
                </>
              ),
            },
            {
              id: 4,
              label: t(`${translationPath}RelatedtoUnit`),
              component: (item) => (
                <>
                  {((item && item.relatedTo.findIndex(((data) => (+data.relatedToId === ActivitiesRelatedToActivitiesTabelType.unit.key &&
                    <span className='mdi mdi-check-circle-outline  check-true' />)
                  )) === -1 && (<span className='mdi mdi-alpha-x-circle-outline check-false' />) || <span className='mdi mdi-check-circle-outline  check-true' />))}
                </>
              ),
            },
            {
              id: 5,
              label: t(`${translationPath}RelatedtoLead`),
              component: (item) => (
                <>
                  {((item && item.relatedTo.findIndex(((data) => (+data.relatedToId === ActivitiesRelatedToActivitiesTabelType.lead.key &&
                    <span className='mdi mdi-check-circle-outline  check-true' />)
                  )) === -1 && (<span className='mdi mdi-alpha-x-circle-outline check-false' />) || <span className='mdi mdi-check-circle-outline  check-true' />))}
                </>
              ),
            },
            {
              id: 6,
              label: t(`${translationPath}RelatedtoPortfolio`),
              component: (item) => (
                <>
                  {((item && item.relatedTo.findIndex(((data) => (+data.relatedToId === ActivitiesRelatedToActivitiesTabelType.portfolio.key &&
                    <span className='mdi mdi-check-circle-outline  check-true' />)
                  )) === -1 && (<span className='mdi mdi-alpha-x-circle-outline check-false' />) || <span className='mdi mdi-check-circle-outline  check-true' />))}
                </>
              ),
            },
            {
              id: 7,
              label: t(`${translationPath}RelatedtoMaintenanceContract`),
              component: (item) => (
                <>
                  {((item && item.relatedTo.findIndex(((data) => (+data.relatedToId === ActivitiesRelatedToActivitiesTabelType.maintenanceContract.key &&
                    <span className='mdi mdi-check-circle-outline  check-true' />)
                  )) === -1 && (<span className='mdi mdi-alpha-x-circle-outline check-false' />) || <span className='mdi mdi-check-circle-outline  check-true' />))}
                </>
              ),
            },
            {
            id: 8, label: t(`${translationPath}Expired-Period`), input: 'expiredPeriod', isSortable: true
            },
          ]}
          defaultActions={
            getActionTableWithPermissions()

          }
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response.totalCount}
          focusedRowChanged={focusedRowChanged}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          setSortBy={setSortBy}
        />
      </div>
      <DialogComponent
        isOpen={openDialog}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleText='Edit-Activity'
        titleClasses='DialogComponent-ActivitiesType'
        wrapperClasses='wrapperClasses-ActivitiesType'
        maxWidth='md'
        dialogContent={(
          <>
            <DialogManagementViewComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              activeItem={activeItem}
              Data={Data}
              edit={ISedit}
              GetAllActivityTypesAPI={() => GetAllActivityTypesAPI()}
              onCancelClicked={() => {
                setOpenDialog(false);
                setISedit(false);
                setSearchedItem('');
                setFilter((item) => ({ ...item, search: '' }));
              }}
            />
          </>
        )}
      />
      <DialogComponent
        titleText='confirm-message'
        saveText='confirm'
        saveType='button'
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />
            <span>{`${t(`${translationPath}activity-delete-description`)}`}</span>
          </div>
        )}
        saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
        isOpen={OpenDeleteDialog}
        onSaveClicked={() => {
          DeleteHandler();
        }}
        onCloseClicked={() => {
          setOpenDeleteDialog(false);
          setActiveItem(null);
        }}
        onCancelClicked={() => {
          setOpenDeleteDialog(false);
          setActiveItem(null);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

ActivitiesTypeTabelView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  reloading: PropTypes.bool.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  setFilter: PropTypes.func.isRequired,
  setSearchedItem: PropTypes.func.isRequired,

};
