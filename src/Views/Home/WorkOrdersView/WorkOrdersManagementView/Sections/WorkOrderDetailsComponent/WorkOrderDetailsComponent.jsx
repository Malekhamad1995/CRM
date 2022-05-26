import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  DatePickerComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
  SwitchComponent,
} from '../../../../../../Components';
import {
  contactsDetailsGet,
  CreateOrUpdateWorkOrder,
  GetAdvanceSearchContacts,
  GetWorkOrderPortfolio,
  GetWorkOrderProperties,
  GetWorkOrderUnits,
  lookupItemsGetId,
  OrganizationUserSearch,
  GetPortfolioById,
  ActiveOrganizationUser,
  propertyDetailsGet,
  unitDetailsGet,
  GetAllAssetsItemsByUnitId,
  GetAllAssetsByCommonArea,
} from '../../../../../../Services';
import {
  bottomBoxComponentUpdate,
  floatHandler,
  getErrorByName,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { WorkOrderAchievedByDialog } from './Dialogs';
import {
  WorkOrderCategory,
  ContractorType,
  WorkOrderPriority,
  ServicesOffered,
  WorkOrderDriver,
  CommonAreas,
} from '../../../../../../assets/json/StaticLookupsIds.json';
import { TableFilterOperatorsEnum } from '../../../../../../Enums';

export const WorkOrderDetailsComponent = ({
  selected,
  state,
  onSelectedChanged,
  onStateChanged,
  isUnit,
  onIsUnitChanged,
  isAssetsBase,
  onIsAssetsBaseChanged,
  schema,
  id,
  reloadData,
  parentSaveRef,
  isFromDialog,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstPropertyLoad, setIsFirstPropertyLoad] = useState(true);
  const [isFirstUnitLoad, setIsFirstUnitLoad] = useState(true);
  const [isOpenAchivedBy, setIsOpenAchivedBy] = useState(false);
  const searchTimer = useRef(null);

  const [loadings, setLoadings] = useState({
    properties: false,
    portfolios: false,
    units: false,
    commonAreas: false,
    workAssignTo: false,
    assets: false,
    workPriorities: false,
    categories: false,
    serviceTypes: false,
    contractorTypes: false,
    drivers: false,
    assignedBy: false,
    assignedTo: false,
    workAchievedBy: false,
  });
  const [portfolios, setPortfolios] = useState([]);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [commonAreas, setCommonAreas] = useState([]);
  const [workAssignTo, setWorkAssignTo] = useState([]);
  const [assets, setAssets] = useState([]);
  const [workPriorities, setWorkPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [contractorTypes, setContractorTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assignedBy, setAssignedBy] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [workAchievedBy, setWorkAchievedBy] = useState([]);
  const [notes, setNotes] = useState(state.note || '');
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const getAllAssignedBy = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, assignedBy: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
      });
      if (!(res && res.status && res.status !== 200)) {
        setAssignedBy(
          (selectedValue &&
            ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
            (res && res.result) ||
            []
        );
      } else setAssignedBy([]);
      setLoadings((items) => ({ ...items, assignedBy: false }));
    },
    [filter]
  );
  const getAllAssignedTo = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, assignedTo: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
      });
      if (!(res && res.status && res.status !== 200)) {
        setAssignedTo(
          (selectedValue &&
            ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
            (res && res.result) ||
            []
        );
      } else setAssignedTo([]);
      setLoadings((items) => ({ ...items, assignedTo: false }));
    },
    [filter]
  );
  const getAllWorkAchievedBy = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, workAchievedBy: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
      });
      if (!(res && res.status && res.status !== 200)) {
        setWorkAchievedBy((items) => {
          if (items.length === 0) {
            items.push(
              (selectedValue &&
                ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
                (res && res.result) ||
                []
            );
          } else {
            items.splice(
              0,
              1,
              (selectedValue &&
                ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
                (res && res.result) ||
                []
            );
          }
          return [...items];
        });
      } else {
        setWorkAchievedBy((items) => {
          if (items.length === 0) items.push([]);
          else items.splice(0, 1, []);
        });
      }
      setLoadings((items) => ({ ...items, workAchievedBy: false }));
    },
    [filter]
  );
  const getAllAssetsByUnitId = useCallback(
    async (unitId) => {
      setLoadings((items) => ({ ...items, assets: true }));
      const res = await GetAllAssetsItemsByUnitId(unitId, filter);
      if (!(res && res.status && res.status !== 200)) setAssets((res && res.result) || []);
      else setAssets([]);
      setLoadings((items) => ({ ...items, assets: false }));
    },
    [filter]
  );
  const getAllAssetsByCommonAreaId = useCallback(async () => {
    setLoadings((items) => ({ ...items, assets: true }));
    const res = await GetAllAssetsByCommonArea({
      portfolioId: state.portfolioId,
      propertyId: state.propertyId,
      commonAreaId: state.commonAreaId,
    });
    if (!(res && res.status && res.status !== 200)) setAssets((res && res.result) || []);
    else setAssets([]);
    setLoadings((items) => ({ ...items, assets: false }));
  }, [state.commonAreaId, state.portfolioId, state.propertyId]);
  useEffect(() => {
    if (state.portfolioId && state.propertyId && state.commonAreaId) getAllAssetsByCommonAreaId();
  }, [getAllAssetsByCommonAreaId, state.commonAreaId, state.portfolioId, state.propertyId]);
  const getAllProperties = useCallback(async (value, portfolioId) => {
    setLoadings((items) => ({ ...items, properties: true }));
    const res = await GetWorkOrderProperties({ portfolioId, search: value });
    if (!(res && res.status && res.status !== 200)) setProperties((res && res) || []);
    else setProperties([]);
    setLoadings((items) => ({ ...items, properties: false }));
  }, []);
  const getAllPortfolios = useCallback(
    async (value) => {
      setLoadings((items) => ({ ...items, portfolios: true }));
      const res = await GetWorkOrderPortfolio({ ...filter, search: value });
      if (!(res && res.status && res.status !== 200)) setPortfolios((res && res.result) || []);
      else setPortfolios([]);
      setLoadings((items) => ({ ...items, portfolios: false }));
    },
    [filter]
  );
  const getAllUnits = useCallback(async (value, portfolioId, propertyId) => {
    setLoadings((items) => ({ ...items, units: true }));
    const res = await GetWorkOrderUnits({ portfolioId, propertyId, search: value });
    if (!(res && res.status && res.status !== 200)) setUnits((res && res) || []);
    else setUnits([]);
    setLoadings((items) => ({ ...items, units: false }));
  }, []);
  const getAllCommonAreas = useCallback(async () => {
    setLoadings((items) => ({ ...items, commonAreas: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: CommonAreas,
    });
    if (!(res && res.status && res.status !== 200)) setCommonAreas(res || []);
    else setCommonAreas([]);
    setLoadings((items) => ({ ...items, commonAreas: false }));
  }, []);
  const getAllWorkAssignTo = useCallback(
    async (value = '') => {
      setLoadings((items) => ({ ...items, workAssignTo: true }));
      const res = await GetAdvanceSearchContacts(filter, {
        criteria: {
          'contact_classifications.lookupItemId': [
            {
              searchType: TableFilterOperatorsEnum.equal.key,
              value: 20724,
            },
          ],
          All: [
            {
              searchType: TableFilterOperatorsEnum.contains.key,
              value,
            },
          ],
        },
      });
      if (!(res && res.status && res.status !== 200)) setWorkAssignTo((res && res.result) || []);
      else setWorkAssignTo([]);
      setLoadings((items) => ({ ...items, workAssignTo: false }));
    },
    [filter]
  );
  const getAllAssets = useCallback(async () => {
    setLoadings((items) => ({ ...items, assets: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: 0,
    });
    if (!(res && res.status && res.status !== 200)) setAssets(res || []);
    else setAssets([]);
    setLoadings((items) => ({ ...items, assets: false }));
  }, []);
  const getAllWorkPriorities = useCallback(async () => {
    setLoadings((items) => ({ ...items, workPriorities: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: WorkOrderPriority,
    });
    if (!(res && res.status && res.status !== 200)) setWorkPriorities(res || []);
    else setWorkPriorities([]);
    setLoadings((items) => ({ ...items, workPriorities: false }));
  }, []);
  const getAllCategories = useCallback(async () => {
    setLoadings((items) => ({ ...items, categories: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: WorkOrderCategory,
    });
    if (!(res && res.status && res.status !== 200)) setCategories(res || []);
    else setCategories([]);
    setLoadings((items) => ({ ...items, categories: false }));
  }, []);
  const getAllServiceTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, serviceTypes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: ServicesOffered,
    });
    if (!(res && res.status && res.status !== 200)) setServiceTypes(res || []);
    else setServiceTypes([]);
    setLoadings((items) => ({ ...items, serviceTypes: false }));
  }, []);
  const getAllContractorTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, contractorTypes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: ContractorType,
    });
    if (!(res && res.status && res.status !== 200)) setContractorTypes(res || []);
    else setContractorTypes([]);
    setLoadings((items) => ({ ...items, contractorTypes: false }));
  }, []);
  const getAllDrivers = useCallback(async () => {
    setLoadings((items) => ({ ...items, drivers: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: WorkOrderDriver,
    });
    if (!(res && res.status && res.status !== 200)) setDrivers(res || []);
    else setDrivers([]);
    setLoadings((items) => ({ ...items, drivers: false }));
  }, []);
  const cancelHandler = () => {
    GlobalHistory.push('/home/work-orders/view');
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (getErrorByName(schema, 'workOrderStatus').error) {
      showError(getErrorByName(schema, 'workOrderStatus').message);
      return;
    }
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const toSaveState = { ...state };
    if (id && toSaveState.workOrderStatus && !toSaveState.workOrderStatus.workOrderId)
      toSaveState.workOrderStatus.workOrderId = id;
    if (toSaveState.assignedById) {
      toSaveState.workOrderUsers.push({
        usersId: toSaveState.assignedById,
        isAchievedBy: false,
        isAssignedBy: true,
        isAssignedTo: false,
      });
    }
    if (toSaveState.assignedToId) {
      toSaveState.workOrderUsers.push({
        usersId: toSaveState.assignedToId,
        isAchievedBy: false,
        isAssignedBy: false,
        isAssignedTo: true,
      });
    }
    const res = await CreateOrUpdateWorkOrder(toSaveState);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (id) showSuccess(t`${translationPath}work-order-details-updated-successfully`);
      else showSuccess(t`${translationPath}work-order-details-created-successfully`);
      if (reloadData) reloadData();
      else cancelHandler();
    } else if (id) showError(t(`${translationPath}work-order-details-update-failed`));
    else showError(t`${translationPath}work-order-details-create-failed`);
  }, [id, reloadData, schema, state, t, translationPath]);

  const getPortfolioById = useCallback(async (portfolioId) => {
    setIsLoading(true);
    const res = await GetPortfolioById(portfolioId);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getPropertyById = useCallback(async (propertyId) => {
    setIsLoading(true);
    const res = await propertyDetailsGet({ id: propertyId });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getUnitById = useCallback(async (unitId) => {
    setIsLoading(true);
    const res = await unitDetailsGet({ id: unitId });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getUserById = useCallback(async (userId) => {
    setIsLoading(true);
    const res = await ActiveOrganizationUser(userId);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getContactById = useCallback(async (contactId) => {
    setIsLoading(true);
    const res = await contactsDetailsGet({ id: contactId });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getEditInit = useCallback(async () => {
    if (state.portfolioId && !selected.portfolio && portfolios.length > 0) {
      const portfolioIndex = portfolios.findIndex((item) => item.portfolioId === state.portfolioId);
      if (portfolioIndex !== -1) selected.portfolio = portfolios[portfolioIndex];
      else if (!isLoading) {
        const res = await getPortfolioById(state.portfolioId);
        if (res) {
          selected.portfolio = res;
          setPortfolios((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'portfolioId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      // if (!loadings.properties) getAllProperties(undefined, state.portfolioId);
    } else if (
      state.propertyId &&
      selected.portfolio &&
      !selected.property &&
      properties.length > 0
    ) {
      const propertyIndex = properties.findIndex((item) => item.propertyId === state.propertyId);
      if (propertyIndex !== -1) selected.property = properties[propertyIndex];
      else if (!isLoading) {
        const res = await getPropertyById(state.propertyId);
        if (res) {
          selected.property = {
            propertyId: res.propertyId,
            propertyName: (res.property && res.property.property_name) || 'N/A',
          };
          setProperties((items) => {
            items.push({
              propertyId: res.propertyId,
              propertyName: (res.property && res.property.property_name) || 'N/A',
            });
            return [...items];
          });
        } else onStateChanged({ id: 'propertyId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    } else if (
      state.unitId &&
      selected.portfolio &&
      selected.property &&
      !selected.unit &&
      units.length > 0
    ) {
      const unitIndex = units.findIndex((item) => item.unitId === state.unitId);
      if (unitIndex !== -1) selected.unit = units[unitIndex];
      else if (!isLoading) {
        const res = await getUnitById(state.unitId);
        if (res) {
          selected.unit = {
            listingAgent:
              (res.unit && res.unit.listing_agent && res.unit.listing_agent.name) || null,
            sizeArea: (res.unit && res.unit.total_area_size_sqft) || null,
            unitId: res.unitId,
            unitReferenceNo: (res.unit && res.unit.unit_ref_no) || null,
          };
          setUnits((items) => {
            items.push({
              listingAgent:
                (res.unit && res.unit.listing_agent && res.unit.listing_agent.name) || null,
              sizeArea: (res.unit && res.unit.total_area_size_sqft) || null,
              unitId: res.unitId,
              unitReferenceNo: (res.unit && res.unit.unit_ref_no) || null,
            });
            return [...items];
          });
        } else onStateChanged({ id: 'unitId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    if (state.commonAreaId && !selected.commonArea && commonAreas.length > 0) {
      const commonAreaIndex = commonAreas.findIndex(
        (item) => item.lookupItemId === state.commonAreaId
      );
      if (commonAreaIndex !== -1) {
        selected.commonArea = commonAreas[commonAreaIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      }
    }
    if (state.workAssignToId && !selected.workAssignTo && workAssignTo.length > 0) {
      const workAssignToIndex = workAssignTo.findIndex(
        (item) => item.contactsId === state.workAssignToId
      );
      if (workAssignToIndex !== -1) selected.workAssignTo = workAssignTo[workAssignToIndex];
      else if (!isLoading) {
        const res = await getContactById(state.workAssignToId);
        if (res) {
          selected.workAssignTo = res;
          setWorkAssignTo((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'workAssignToId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    // todo:- assets get by id on edit
    if (state.workPriorityId && !selected.workPriority && workPriorities.length > 0) {
      const workPriorityIndex = workPriorities.findIndex(
        (item) => item.lookupItemId === state.workPriorityId
      );
      if (workPriorityIndex !== -1) {
        selected.workPriority = workPriorities[workPriorityIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      }
    }
    if (state.categoryId && !selected.category && categories.length > 0) {
      const categoryIndex = categories.findIndex((item) => item.lookupItemId === state.categoryId);
      if (categoryIndex !== -1) {
        selected.category = categories[categoryIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      }
    }
    if (state.serviceTypeId && !selected.serviceType && serviceTypes.length > 0) {
      const serviceTypeIndex = serviceTypes.findIndex(
        (item) => item.lookupItemId === state.serviceTypeId
      );
      if (serviceTypeIndex !== -1) {
        selected.serviceType = serviceTypes[serviceTypeIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      }
    }
    if (state.contractorTypeId && !selected.contractorType && contractorTypes.length > 0) {
      const contractorTypeIndex = contractorTypes.findIndex(
        (item) => item.lookupItemId === state.contractorTypeId
      );
      if (contractorTypeIndex !== -1) {
        selected.contractorType = contractorTypes[contractorTypeIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      }
    }
    if (state.driverId && !selected.driver && drivers.length > 0) {
      const driverIndex = drivers.findIndex((item) => item.lookupItemId === state.driverId);
      if (driverIndex !== -1) {
        selected.driver = drivers[driverIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      }
    }
    if (state.assignedById && !selected.assignedBy && assignedBy.length > 0) {
      const assignedByIndex = assignedBy.findIndex((item) => item.id === state.assignedById);
      if (assignedByIndex !== -1) selected.AssignedBy = assignedBy[assignedByIndex];
      else if (!isLoading) {
        const res = await getUserById(state.assignedById);
        if (res) {
          selected.assignedBy = res;

          setAssignedBy((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'assignedById', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    if (state.assignedToId && !selected.assignedTo && assignedTo.length > 0) {
      const assignedToIndex = assignedTo.findIndex((item) => item.id === state.assignedToId);
      if (assignedToIndex !== -1) selected.AssignedTo = assignedTo[assignedToIndex];
      else if (!isLoading) {
        const res = await getUserById(state.assignedToId);
        if (res) {
          selected.assignedTo = res;

          setAssignedTo((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'assignedToId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    if (
      state.workOrderUsers &&
      state.workOrderUsers.length > 0 &&
      selected.workAchievedBy &&
      selected.workAchievedBy.length < state.workOrderUsers.length &&
      state.workOrderId &&
      workAchievedBy.length > 0
    ) {
      const savedWorkAchievedByList = [...workAchievedBy];
      const savedWorkAchievedBy = [];
      state.workOrderUsers.map(async (item, index) => {
        if (item.usersId) {
          if (!savedWorkAchievedByList[index]) savedWorkAchievedByList.push(workAchievedBy[0]);

          const workAchievedByListIndex = savedWorkAchievedByList[index].findIndex(
            (element) => element.id === item.usersId
          );
          if (workAchievedByListIndex !== -1)
            savedWorkAchievedBy.push(savedWorkAchievedByList[index][workAchievedByListIndex]);
          else if (!isLoading) {
            const res = await getUserById(state.assignedById);
            if (res) {
              savedWorkAchievedBy.push(res);
              savedWorkAchievedByList[index].push(res);
            }
          }
        }
      });
      if (
        savedWorkAchievedBy.length > 0 ||
        workAchievedBy.length !== savedWorkAchievedByList.length
      ) {
        setWorkAchievedBy(savedWorkAchievedByList);
        onSelectedChanged({ id: 'workAchievedBy', value: savedWorkAchievedBy });
      }
    }
  }, [
    assignedBy,
    assignedTo,
    categories,
    commonAreas,
    contractorTypes,
    drivers,
    getContactById,
    getPortfolioById,
    getPropertyById,
    getUnitById,
    getUserById,
    isLoading,
    onSelectedChanged,
    onStateChanged,
    portfolios,
    properties,
    selected,
    serviceTypes,
    state.assignedById,
    state.assignedToId,
    state.categoryId,
    state.commonAreaId,
    state.contractorTypeId,
    state.driverId,
    state.portfolioId,
    state.propertyId,
    state.serviceTypeId,
    state.unitId,
    state.workAssignToId,
    state.workOrderId,
    state.workOrderUsers,
    state.workPriorityId,
    units,
    workAchievedBy,
    workAssignTo,
    workPriorities,
  ]);
  useEffect(() => {
    getAllPortfolios();
    getAllCommonAreas();
    getAllWorkAssignTo();
    getAllAssets();
    getAllWorkPriorities();
    getAllCategories();
    getAllServiceTypes();
    getAllContractorTypes();
    getAllDrivers();
    getAllAssignedBy();
    getAllAssignedTo();
    getAllWorkAchievedBy();
  }, [
    getAllAssets,
    getAllCategories,
    getAllCommonAreas,
    getAllContractorTypes,
    getAllPortfolios,
    getAllServiceTypes,
    getAllWorkAssignTo,
    getAllWorkPriorities,
    getAllDrivers,
    getAllAssignedBy,
    getAllAssignedTo,
    getAllWorkAchievedBy,
  ]);
  useEffect(() => {
    if (id) getEditInit();
  }, [getEditInit, id]);
  useEffect(() => {
    if (id && selected.portfolio && properties.length === 0 && isFirstPropertyLoad) {
      setIsFirstPropertyLoad(false);
      getAllProperties(undefined, selected.portfolio.portfolioId);
    }
  }, [
    getAllProperties,
    id,
    isFirstPropertyLoad,
    properties.length,
    selected.portfolio,
    selected.portfolioId,
  ]);
  useEffect(() => {
    if (
      id &&
      selected.portfolio &&
      selected.property &&
      properties.length > 0 &&
      units.length === 0 &&
      isFirstUnitLoad
    ) {
      setIsFirstUnitLoad(false);
      getAllUnits(undefined, selected.portfolio.portfolioId, selected.property.propertyId);
    }
  }, [
    getAllUnits,
    id,
    isFirstUnitLoad,
    properties.length,
    selected.portfolio,
    selected.portfolioId,
    selected.property,
    selected.propertyId,
    units.length,
  ]);
  useEffect(() => {
    if (!isFromDialog) {
      bottomBoxComponentUpdate(
        <div className='d-flex-v-center-h-end flex-wrap'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
            <span>{t('Shared:cancel')}</span>
          </ButtonBase>
          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </div>
      );
    }
  }, [isFromDialog, saveHandler, t]);
  useEffect(() => {
    if (parentSaveRef) parentSaveRef.current = saveHandler;
  }, [parentSaveRef, saveHandler]);
  useEffect(() => () => {
    bottomBoxComponentUpdate(null);
    if (searchTimer.current) clearTimeout(searchTimer.current);
  });
  return (
    <div className='work-order-details-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='form-item'>
        <AutocompleteComponent
          idRef='portfolioIdRef'
          labelValue='portfolioReq'
          selectedValues={selected.portfolio}
          multiple={false}
          data={portfolios}
          displayLabel={(option) => option.portfolioName || ''}
          renderOption={(option) =>
            ((option.portfolioName || option.propertyManagerName) &&
              `${option.portfolioName} - ${option.propertyManagerName}`) ||
            ''
          }
          getOptionSelected={(option) => option.portfolioId === state.portfolioId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'portfolioId').message}
          error={getErrorByName(schema, 'portfolioId').error}
          isWithError
          isSubmitted={isSubmitted}
          isLoading={loadings.portfolios}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllPortfolios(value);
            }, 700);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({
              id: 'edit',
              value: {
                ...selected,
                portfolio: newValue,
                property: null,
                unit: null,
                commonArea: null,
              },
            });
            onStateChanged({
              id: 'edit',
              value: {
                ...state,
                portfolioId: (newValue && newValue.portfolioId) || null,
                propertyId: null,
                unitId: null,
                commonAreaId: null,
              },
            });
            if (newValue) getAllProperties(undefined, newValue.portfolioId);
            else {
              setProperties([]);
              setUnits([]);
              setCommonAreas([]);
            }
          }}
        />
        {selected && selected.portfolio && (
          <span className='c-gray-dark px-2 mt-2'>
            <span>{t(`${translationPath}portfolio-manager`)}</span>
            <span>:</span>
            <span className='px-1'>{selected.portfolio.propertyManagerName || 'N/A'}</span>
          </span>
        )}
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='propertyIdRef'
          labelValue='propertyReq'
          selectedValues={selected.property}
          multiple={false}
          data={properties}
          displayLabel={(option) => option.propertyName || ''}
          renderOption={(option) => option.propertyName || ''}
          getOptionSelected={(option) => option.propertyId === state.propertyId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'propertyId').message}
          error={getErrorByName(schema, 'propertyId').error}
          isLoading={loadings.properties}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (state.propertyId) {
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllProperties(value, state.portfolioId);
              }, 700);
            }
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({
              id: 'edit',
              value: {
                ...selected,
                property: newValue,
                unit: null,
                commonArea: null,
              },
            });
            onStateChanged({
              id: 'edit',
              value: {
                ...state,
                propertyId: (newValue && newValue.propertyId) || null,
                unitId: null,
                commonAreaId: null,
              },
            });
            if (newValue) {
              getAllUnits(undefined, state.portfolioId, newValue.propertyId);
              getAllCommonAreas();
            } else {
              setUnits([]);
              setCommonAreas([]);
            }
          }}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          idRef='locationRef'
          labelValue='locationReq'
          data={[
            {
              key: true,
              value: 'unit',
            },
            {
              key: false,
              value: 'common-area',
            },
          ]}
          value={isUnit}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) => {
            onSelectedChanged({ id: 'asset', value: null });
            onStateChanged({
              id: 'assetsId',
              value: null,
            });
            if (state.unitId) {
              onStateChanged({ id: 'unitId', value: null });
              onSelectedChanged({ id: 'unit', value: null });
            }
            if (state.commonAreaId) {
              onStateChanged({ id: 'commonAreaId', value: null });
              onSelectedChanged({ id: 'commonArea', value: null });
            }
            if (onIsUnitChanged) onIsUnitChanged(newValue === 'true');
          }}
        />
      </div>
      {isUnit && (
        <div className='form-item'>
          <AutocompleteComponent
            idRef='unitIdRef'
            labelValue='unitReq'
            selectedValues={selected.unit}
            multiple={false}
            data={units}
            displayLabel={(option) => option.unitReferenceNo || 'N/A'}
            renderOption={(option) => option.unitReferenceNo || 'N/A'}
            getOptionSelected={(option) => option.unitId === state.unitId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'unitId').message}
            error={getErrorByName(schema, 'unitId').error}
            isLoading={loadings.units}
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllUnits(value, state.portfolioId, state.propertyId);
              }, 700);
            }}
            isWithError
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={async (event, newValue) => {
              onSelectedChanged({ id: 'unit', value: newValue });
              onStateChanged({
                id: 'unitId',
                value: (newValue && newValue.unitId) || null,
              });
              await getAllAssetsByUnitId(newValue && newValue.unitId);
            }}
          />
          {selected && selected.unit && (
            <span className='c-gray-dark px-2 mt-2'>
              <span>{t(`${translationPath}listing-agent`)}</span>
              <span>:</span>
              <span className='px-1'>{selected.unit.listingAgent || 'N/A'}</span>
            </span>
          )}
        </div>
      )}
      {!isUnit && (
        <div className='form-item'>
          <AutocompleteComponent
            idRef='commonAreaIdRef'
            labelValue='common-area'
            selectedValues={selected.commonArea}
            multiple={false}
            data={commonAreas}
            displayLabel={(option) => option.lookupItemName || ''}
            getOptionSelected={(option) => option.lookupItemId === state.commonAreaId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'commonAreaId').message}
            error={getErrorByName(schema, 'commonAreaId').error}
            isWithError
            isLoading={loadings.commonAreas}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              onSelectedChanged({ id: 'commonArea', value: newValue });
              onStateChanged({
                id: 'commonAreaId',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
      )}
      <div className='form-item'>
        <Inputs
          idRef='otherLocationRef'
          labelValue='other-location'
          inputPlaceholder='other-location-description'
          value={state.otherLocation || ''}
          helperText={getErrorByName(schema, 'otherLocation').message}
          error={getErrorByName(schema, 'otherLocation').error}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'otherLocation', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <DataFileAutocompleteComponent
          idRef='workAssignToRef'
          labelValue='work-assign-toReq'
          selectedValues={selected.workAssignTo}
          multiple={false}
          data={workAssignTo || []}
          displayLabel={(option) =>
            (option.contact &&
              (option.contact.company_name ||
                ((option.contact.first_name || option.contact.last_name) &&
                  `${option.contact.first_name} ${option.contact.last_name}`))) ||
            'N/A'
          }
          getOptionSelected={(option) => option.contactsId === state.workAssignToId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'workAssignToId').message}
          error={getErrorByName(schema, 'workAssignToId').error}
          isWithError
          isLoading={loadings.workAssignTo}
          isSubmitted={isSubmitted}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              // , selected.workAssignTo
              getAllWorkAssignTo(value);
            }, 700);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'workAssignTo', value: newValue });
            onStateChanged({
              id: 'workAssignToId',
              value: (newValue && newValue.contactsId) || null,
            });
          }}
          // buttonOptions={{
          //   className: 'btns-icon theme-outline c-blue-lighter',
          //   iconClasses: (state.workAssignToId && 'mdi mdi-eye-outline') || 'mdi mdi-plus',
          //   // onActionClicked: () => setIsOpenWorkAssign(true),
          // }}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          idRef='assetsBaseRef'
          labelValue='assets-base-description'
          data={[
            {
              key: true,
              value: 'yes',
            },
            {
              key: false,
              value: 'no',
            },
          ]}
          value={isAssetsBase}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) => {
            if (state.assetsId) {
              onStateChanged({ id: 'assetsId', value: null });
              onSelectedChanged({ id: 'asset', value: null });
            }
            if (onIsAssetsBaseChanged) onIsAssetsBaseChanged(newValue === 'true');
          }}
        />
      </div>
      {isAssetsBase && (
        <div className='form-item'>
          <AutocompleteComponent
            idRef='assetsIdRef'
            labelValue='assets'
            selectedValues={selected.asset}
            multiple={false}
            data={assets}
            isDisabled={!state.portfolio && !state.propertyId}
            displayLabel={(option) => option.assetItemName || ''}
            getOptionSelected={(option) => option.assetId === state.assetsId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'assetsId').message}
            error={getErrorByName(schema, 'assetsId').error}
            isWithError
            isLoading={loadings.assets}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              onSelectedChanged({ id: 'asset', value: newValue });
              onStateChanged({
                id: 'assetsId',
                value: (newValue && newValue.assetId) || null,
              });
            }}
          />
        </div>
      )}
      <div className='form-item'>
        <AutocompleteComponent
          idRef='workPriorityIdRef'
          labelValue='work-priorityReq'
          selectedValues={selected.workPriority}
          multiple={false}
          data={workPriorities}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.workPriorityId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'workPriorityId').message}
          error={getErrorByName(schema, 'workPriorityId').error}
          isWithError
          isLoading={loadings.workPriorities}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'workPriority', value: newValue });
            onStateChanged({
              id: 'workPriorityId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='categoryIdRef'
          labelValue='categoryReq'
          selectedValues={selected.category}
          multiple={false}
          data={categories}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.categoryId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'categoryId').message}
          error={getErrorByName(schema, 'categoryId').error}
          isWithError
          isLoading={loadings.categories}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'category', value: newValue });
            onStateChanged({
              id: 'categoryId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='contractorTypeIdRef'
          labelValue='contractor-typeReq'
          selectedValues={selected.contractorType}
          multiple={false}
          data={contractorTypes}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.contractorTypeId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'contractorTypeId').message}
          error={getErrorByName(schema, 'contractorTypeId').error}
          isWithError
          isLoading={loadings.contractorTypes}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'contractorType', value: newValue });
            onStateChanged({
              id: 'contractorTypeId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='serviceTypeIdRef'
          labelValue='service-type'
          selectedValues={selected.serviceType}
          multiple={false}
          data={serviceTypes}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.serviceTypeId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'serviceTypeId').message}
          error={getErrorByName(schema, 'serviceTypeId').error}
          isWithError
          isLoading={loadings.serviceTypes}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'serviceType', value: newValue });
            onStateChanged({
              id: 'serviceTypeId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-title-wrapper'>
        <span className='form-title'>{t(`${translationPath}auto-correspondence`)}</span>
      </div>
      <div className='form-item'>
        <SwitchComponent
          idRef='agentEmailRef'
          isChecked={state.agentEmail}
          labelClasses='px-0'
          themeClass='theme-line'
          labelValue='agent-email-description'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChangeHandler={(event, isChecked) => {
            onStateChanged({
              id: 'agentEmail',
              value: isChecked,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <SwitchComponent
          idRef='agentSMSRef'
          isChecked={state.agentSMS}
          labelClasses='px-0'
          themeClass='theme-line'
          labelValue='agent-sms-description'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChangeHandler={(event, isChecked) => {
            onStateChanged({
              id: 'agentSMS',
              value: isChecked,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <SwitchComponent
          idRef='tenantSMSRef'
          isChecked={state.tenantSMS}
          labelClasses='px-0'
          themeClass='theme-line'
          labelValue='tenant-sms-description'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChangeHandler={(event, isChecked) => {
            onStateChanged({
              id: 'tenantSMS',
              value: isChecked,
            });
          }}
        />
      </div>
      <div className='form-title-wrapper'>
        <span className='form-title'>{t(`${translationPath}custom-fields`)}</span>
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='driverIdRef'
          labelValue='driver-name'
          selectedValues={selected.driver}
          multiple={false}
          data={drivers}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.driverId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'driverId').message}
          error={getErrorByName(schema, 'driverId').error}
          isWithError
          isLoading={loadings.drivers}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'driver', value: newValue });
            onStateChanged({
              id: 'driverId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        {/* <div className='form-item w-50'>
          <DatePickerComponent
            idRef='travelTimeRef'
            labelValue='travel-date'
            placeholder='DD/MM/YYYY'
            value={state.travelTime}
            helperText={getErrorByName(schema, 'travelTime').message}
            error={getErrorByName(schema, 'travelTime').error}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onDateChanged={(newValue) => {
              onStateChanged({ id: 'travelTime', value: newValue });
            }}
          />
        </div> */}
        {/* <div className='form-item w-50'> */}
        <DatePickerComponent
          idRef='travelTimeRef'
          labelValue={t(`${translationPath}travel-time`)}
          placeholder='HH:mm A'
          value={state.travelTime}
          isTimePicker
          helperText={getErrorByName(schema, 'travelTime').message}
          error={getErrorByName(schema, 'travelTime').error}
          isSubmitted={isSubmitted}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'travelTime', value: newValue });
          }}
        />
        {/* </div> */}
      </div>
      <div className='form-item'>
        <Inputs
          idRef='estimatedTimeInMinutesRef'
          labelValue='estimated-time-in-minutes'
          value={state.estimatedTimeInMinutes || ''}
          helperText={getErrorByName(schema, 'estimatedTimeInMinutes').message}
          error={getErrorByName(schema, 'estimatedTimeInMinutes').error}
          isWithError
          isSubmitted={isSubmitted}
          type='number'
          min={0}
          max={999999}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            let value = floatHandler(event.target.value, 3);
            if (value > 999999) value = 999999;
            onStateChanged({ id: 'estimatedTimeInMinutes', value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='unitAreaSizeRef'
          labelValue='unit-area-size-description'
          value={state.unitAreaSize || ''}
          helperText={getErrorByName(schema, 'unitAreaSize').message}
          error={getErrorByName(schema, 'unitAreaSize').error}
          isWithError
          isSubmitted={isSubmitted}
          type='number'
          min={0}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'unitAreaSize', value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='materialsRequiredRef'
          labelValue='materials-required-description'
          value={state.materialsRequired || ''}
          helperText={getErrorByName(schema, 'materialsRequired').message}
          error={getErrorByName(schema, 'materialsRequired').error}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'materialsRequired', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='jobStartingTimeRef'
          labelValue={t(`${translationPath}job-starting-time`)}
          placeholder='HH:mm A'
          value={state.jobStartingTime}
          isTimePicker
          helperText={getErrorByName(schema, 'jobStartingTime').message}
          error={getErrorByName(schema, 'jobStartingTime').error}
          isSubmitted={isSubmitted}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'jobStartingTime', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='jobEndingTimeRef'
          labelValue={t(`${translationPath}job-ending-time`)}
          placeholder='HH:mm A'
          value={state.jobEndingTime}
          isTimePicker
          helperText={getErrorByName(schema, 'jobEndingTime').message}
          error={getErrorByName(schema, 'jobEndingTime').error}
          isSubmitted={isSubmitted}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'jobEndingTime', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='scheduleDateRef'
          labelValue='schedule-date-description'
          placeholder='DD/MM/YYYY'
          value={state.scheduleDate}
          helperText={getErrorByName(schema, 'scheduleDate').message}
          error={getErrorByName(schema, 'scheduleDate').error}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'scheduleDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='assignedByIdRef'
          labelValue='assigned-by'
          selectedValues={selected.assignedBy}
          multiple={false}
          data={assignedBy}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''
          }
          getOptionSelected={(option) => option.id === state.assignedById}
          withoutSearchButton
          helperText={getErrorByName(schema, 'assignedById').message}
          error={getErrorByName(schema, 'assignedById').error}
          isLoading={loadings.assignedBy}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllAssignedBy(value, selected.assignedBy);
            }, 700);
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'assignedBy', value: newValue });
            onStateChanged({
              id: 'assignedById',
              value: (newValue && newValue.id) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='assignedToIdRef'
          labelValue='assigned-to'
          selectedValues={selected.assignedTo}
          multiple={false}
          data={assignedTo}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''
          }
          getOptionSelected={(option) => option.id === state.assignedToId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'assignedToId').message}
          error={getErrorByName(schema, 'assignedToId').error}
          isLoading={loadings.assignedTo}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllAssignedTo(value, selected.assignedTo);
            }, 700);
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'assignedTo', value: newValue });
            onStateChanged({
              id: 'assignedToId',
              value: (newValue && newValue.id) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='workAchievedByRef'
          labelValue={`${t(`${translationPath}achieved-by`)} (${1})`}
          selectedValues={
            (selected.workAchievedBy.length > 0 && selected.workAchievedBy[0]) || null
          }
          multiple={false}
          data={(workAchievedBy && workAchievedBy.length > 0 && workAchievedBy[0]) || []}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''
          }
          getOptionSelected={(option) =>
            state.workOrderUsers &&
            state.workOrderUsers.length > 0 &&
            option.id === state.workOrderUsers[0].usersId
          }
          withoutSearchButton
          helperText={getErrorByName(schema, 'workOrderUsers.0').message}
          error={getErrorByName(schema, 'workOrderUsers.0').error}
          isLoading={loadings.workAchievedBy}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllWorkAchievedBy(
                value,
                (selected.workAchievedBy &&
                  selected.workAchievedBy.length > 0 &&
                  selected.workAchievedBy[0]) ||
                  null
              );
            }, 700);
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            if (newValue) {
              if (
                !selected.workAchievedBy ||
                (selected.workAchievedBy && selected.workAchievedBy.length === 0)
              )
                selected.workAchievedBy = [newValue];
              else selected.workAchievedBy.splice(0, 1, newValue);
              if (
                !state.workOrderUsers ||
                (state.workOrderUsers && state.workOrderUsers.length === 0)
              ) {
                state.workOrderUsers = [
                  {
                    usersId: newValue.id,
                    isAchievedBy: true,
                    isAssignedBy: false,
                    isAssignedTo: false,
                  },
                ];
              } else state.workOrderUsers.splice(0, 1, newValue);
            } else {
              selected.workAchievedBy.splice(0, 1);
              state.workOrderUsers.splice(0, 1, newValue);
            }
            onSelectedChanged({ id: 'workAchievedBy', value: selected.workAchievedBy });
            onStateChanged({
              id: 'workOrderUsers',
              value: state.workOrderUsers,
            });
          }}
          buttonOptions={{
            className: 'btns-icon theme-outline c-blue-lighter',
            iconClasses:
              state.workOrderUsers && state.workOrderUsers.length > 1
                ? 'mdi mdi-eye-outline'
                : 'mdi mdi-plus',
            isDisabled: !(state.workOrderUsers && state.workOrderUsers.length > 0),
            isRequired: false,
            onActionClicked: () => setIsOpenAchivedBy(true),
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='noteRef'
          labelValue='notes'
          value={notes}
          helperText={getErrorByName(schema, 'note').message}
          error={getErrorByName(schema, 'note').error}
          isWithError
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputBlur={(event) => {
            if (searchTimer.current) {
              clearTimeout(searchTimer.current);
              onStateChanged({ id: 'note', value: event.target.value });
            }
          }}
          onInputChanged={(event) => {
            setNotes(event.target.value);
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              onStateChanged({ id: 'note', value: notes });
            }, 700);
          }}
        />
      </div>
      {isOpenAchivedBy && (
        <WorkOrderAchievedByDialog
          stateWorkOrderUsers={JSON.parse(JSON.stringify(state.workOrderUsers)) || []}
          selectedWorkAchievedBy={JSON.parse(JSON.stringify(selected.workAchievedBy)) || []}
          workAchievedByList={JSON.parse(JSON.stringify(workAchievedBy)) || []}
          isOpen={isOpenAchivedBy}
          isOpenChanged={() => {
            setIsOpenAchivedBy(false);
          }}
          isFromDialog={isFromDialog}
          onSave={(savedWorkOrderUsers, savedWorkAchievedBy, savedWorkAchievedByList) => {
            setWorkAchievedBy(savedWorkAchievedByList);
            onSelectedChanged({ id: 'workAchievedBy', value: savedWorkAchievedBy });
            onStateChanged({
              id: 'workOrderUsers',
              value: savedWorkOrderUsers,
            });
            setIsOpenAchivedBy(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

WorkOrderDetailsComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isUnit: PropTypes.bool.isRequired,
  onIsUnitChanged: PropTypes.func.isRequired,
  isAssetsBase: PropTypes.bool.isRequired,
  onIsAssetsBaseChanged: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  id: PropTypes.number,
  reloadData: PropTypes.func,
  parentSaveRef: PropTypes.instanceOf(Object),
  isFromDialog: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

WorkOrderDetailsComponent.defaultProps = {
  id: undefined,
  reloadData: undefined,
  isFromDialog: false,
  parentSaveRef: undefined,
};
