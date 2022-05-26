import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Spinner, Tables } from '../../../../../Components';
import { TableActions, LeadsClassTypesEnum } from '../../../../../Enums';
import { GlobalHistory, returnPropsByPermissions } from '../../../../../Helper';
import { GetRotationSchemeByIdServices } from '../../../../../Services/RotaionSchemaService/RotationSchemaService';
import { RotationCriteriaDialog } from '../Dialogs/RotationCriteriaDialog/RotationCriteriaDialog';
import { DeleteRotationCriteriaDialog } from '../Dialogs/DeleteRotationCriteriaDialog/DeleteRotationCriteriaDialog';
import { RotationSchemaPermissions } from '../../../../../Permissions';
import { ActiveItemActions } from '../../../../../store/ActiveItem/ActiveItemActions';

export const RotationSchemaTabelView = ({
  parentTranslationPath,
  translationPath,
  filter,
  data,
  isLoading,
  onPageSizeChanged,
  onPageIndexChanged,
  reloadData,
  setSortBy
}) => {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(null);
  const [rotationEdit, setRotationEdit] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const tableActionClicked = useCallback((actionEnum, item) => {
    setActiveItem(item);
    if (actionEnum === TableActions.manageAgents.key)
      GlobalHistory.push(`/home/rotation-criteria/manage?id=${item.rotationSchemeId}`);
    if (actionEnum === TableActions.editIconAndLabel.key)
      setOpenEditDialog(true);

    if (actionEnum === TableActions.deleteIconAndLabel.key)
      setOpenDeleteDialog(true);
    if (actionEnum === TableActions.viewSchemaTabelView.key) {
      dispatch(ActiveItemActions.activeItemRequest(item));
      GlobalHistory.push(`/home/rotation-criteria/View-details?id=${item.rotationSchemeId}`);
    }
  }, []);

  const { t } = useTranslation([parentTranslationPath, 'Shared']);

  const leadTypeComp = (item) => (
    <div>
      {item && item.leadType === LeadsClassTypesEnum.tenant.value && (
        <div className='leadType tenant'>{t(`${translationPath}Tenant`)}</div>
      )}
      {item && item.leadType === LeadsClassTypesEnum.seller.value && (
        <div className='leadType seller'>{t(`${translationPath}Seller`)}</div>
      )}
      {item && item.leadType === LeadsClassTypesEnum.buyer.value && (
        <div className='leadType buyer'>{t(`${translationPath}Buyer`)}</div>
      )}
      {item && item.leadType === LeadsClassTypesEnum.landlord.value && (
        <div className='leadType landlorb'>
          <span>{t(`${translationPath}Landlorb`)}</span>
        </div>
      )}
    </div>
  );
  const repeated = (list, filed) => list && list.map((item, index) => (
    <span>
      {' '}
      {item[filed]}
      {' '}
      {list.length - 1 != index &&
        <span> , </span>}
    </span>
  ));

  const priceRangesRepeated = (list) => list && list.map((item, index) => (
    <div>
      <span>
        {' '}
        {t(`${translationPath}From`)}
        {' '}
        :
        {' '}
        {item.startValue}
        {' '}
      </span>
      <span>
        {' '}
        {t(`${translationPath}To`)}
        {' '}
        :
        {' '}
        {item.endValue}
        {' '}
      </span>
      {list.length - 1 != index && <span> , </span>}
    </div>
  ));

  const GetRotationCriteria = useCallback(async () => {
    const res = await GetRotationSchemeByIdServices(activeItem && activeItem.rotationSchemeId);
    if (!(res && res.status && res.status !== 200))
      setRotationEdit(res);
  }, [activeItem]);
  const getTableActionsWithPermissions = () => {
    // eslint-disable-next-line prefer-const
    let list = [];
    list.push({
      enum: TableActions.viewSchemaTabelView.key,
      title: t(`${translationPath}Shared:view`),
    });
    if (returnPropsByPermissions(RotationSchemaPermissions.ViewRotationSchemaAssignNewAgent.permissionsId)) {
      list.push({
        enum: TableActions.manageAgents.key,
        title: t(`${translationPath}Shared:manage-agents`),
      });
    }
    if (returnPropsByPermissions(RotationSchemaPermissions.EditRotations.permissionsId)) {
      list.push({
        enum: TableActions.editIconAndLabel.key,
        title: t(`${translationPath}Shared:edit`),
      });
    }
    if (returnPropsByPermissions(RotationSchemaPermissions.DeleteRotations.permissionsId)) {
      list.push({
        enum: TableActions.deleteIconAndLabel.key,
        title: t(`${translationPath}Shared:delete`),
      });
    }
    return list;
  };

  useEffect(() => {
    if (activeItem)
      GetRotationCriteria();

    setRotationEdit(null);
  }, [activeItem]);

  return (
    <div className='RotationSchemaTabelView '>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='filter-section-item' />
      <div className='w-100 px-2'>
        <Tables
          data={(data && data.result) || []}
          headerData={[
            {
              id: 1,
              isSortable: true,
              input: 'label',
              label: t(`${translationPath}label`),
              component: (item) => (
                <div>
                  {item && item.label}
                </div>
              ),
            },
            {
              id: 2,
              label: t(`${translationPath}agents`),
              component: (item) => (
                <span
                  className='c-primary'
                >
                  {(item && item.numberOfAgents) || 0}
                </span>
              ),
            },
            {
              id: 3,
              label: t(`${translationPath}language`),
              component: (item) => repeated(item.languages, 'lookupItemName'),
            },
            {
              id: 4,
              label: t(`${translationPath}country`),
              component: (item) => repeated(item.countries, 'lookupItemName'),
            },
            {
              id: 5,
              label: t(`${translationPath}city`),
              component: (item) => repeated(item.cities, 'lookupItemName'),
            },
            {
              id: 6,
              label: t(`${translationPath}district`),
              component: (item) => repeated(item.districts, 'lookupItemName'),
            },
            {
              id: 7,
              label: t(`${translationPath}community`),
              component: (item) => repeated(item.communities, 'lookupItemName'),
            },
            {
              id: 8,
              label: t(`${translationPath}subCommunity`),
              component: (item) => repeated(item.subCommunities, 'lookupItemName'),
            },
            {
              id: 9,
              label: t(`${translationPath}developer`),
              component: (item) => repeated(item.developers, 'developerName')
            },
            {
              id: 10,
              label: t(`${translationPath}unitType`),
              component: (item) => repeated(item.unitTypes, 'lookupItemName'),
            },
            {
              id: 11,
              label: t(`${translationPath}priceRange`),
              component: (item) => priceRangesRepeated(item.priceRanges)
            },
          ]}
          defaultActions={
            getTableActionsWithPermissions()
          }
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          setSortBy={setSortBy}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          totalItems={(data && data.totalCount) || 0}
        />
      </div>
      {openEditDialog && (
        <RotationCriteriaDialog
          rotationEdit={rotationEdit}
          open={openEditDialog}
          close={() => {
            setOpenEditDialog(false);
            const currentActive = {};
            setActiveItem(currentActive);
          }}
          onSave={() => {
            reloadData();
            const currentActive = {};
            setActiveItem(currentActive);
          }}
          setRotationEdit={setRotationEdit}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {openDeleteDialog && (
        <DeleteRotationCriteriaDialog
          rotationCriteria={activeItem}
          open={openDeleteDialog}
          close={() => {
            setOpenDeleteDialog(false);
            const currentActive = {};
            setActiveItem(currentActive);
          }}
          onSave={() => {
            setOpenDeleteDialog(false);
            reloadData();
            const currentActive = {};
            setActiveItem(currentActive);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}

    </div>
  );
};
const convertJsonValueShape = PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.number]);

RotationSchemaTabelView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  filter: PropTypes.number.isRequired,
  data: PropTypes.objectOf(convertJsonValueShape).isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  reloadData: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired,
};
