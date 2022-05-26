import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PaginationComponent, Spinner, Tables, ViewTypes } from '../../../../../../Components';
import { ActionsEnum, TableActions, ViewTypesEnum } from '../../../../../../Enums';
import { UnitsCardsComponent } from '../../../../UnitsView';
import {
  GetAllUnitsByOwnerId,
  GetAllUnitsLeaseByOwnerId,
  GetAllUnitsSaleByOwnerId,
} from '../../../../../../Services';
import { bottomBoxComponentUpdate, GetParams, GlobalHistory } from '../../../../../../Helper';
import { UnitMapper } from '../../../../UnitsView/UnitMapper';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';
// import { ContactTypeEnum } from '../../../../../../Enums/ContactType.Enum';
// import { UnitsOperationTypeEnum } from '../../../../../../Enums/UnitsOperationTypeEnum';

export const ContactProfileUnitsComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeActionType, setActiveActionType] = useState(ViewTypesEnum.cards.key);
  const [unitsDetailes, setUnitsDetailes] = useState({});
  // contactId
    // eslint-disable-next-line no-unused-vars
  const [contactId,
    setContactId] = useState(0);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  const pathName = window.location.pathname
    .split('/home/')[1]
    .split('/view')[0]
    .split('/contact-profile-edit')[0];
  useEffect(() => {
    setContactId(+GetParams('id'));
  }, [setContactId]);

  const getAllUnitsById = useCallback(async () => {
    setIsLoading(true);
    let res = {};
    if (pathName === 'contact-sales')
      res = await GetAllUnitsSaleByOwnerId(filter, +GetParams('id'));
    else if (pathName === 'contact-lease')
      res = await GetAllUnitsLeaseByOwnerId(filter, +GetParams('id'));
    else res = await GetAllUnitsByOwnerId(filter, +GetParams('id'));
    setUnitsDetailes({
      result: ((res && res.result) || []).map((item) => UnitMapper(item)),
      totalCount: (res && res.totalCount) || 0,
    });
    setIsLoading(false);
  }, [filter, pathName]);

  useEffect(() => {
    getAllUnitsById();
  }, [getAllUnitsById]);

  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.openFile.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/units-sales/unit-profile-edit?formType=${item.unitTypeId}&id=${item.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${item.unitTypeId}&id=${item.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/units/unit-profile-edit?formType=${item.unitTypeId}&id=${item.id}`
          );
        }
      } else if (actionEnum === TableActions.editText.key) {
        if (pathName === 'contact-sales')
          GlobalHistory.push(`/home/units-sales/edit?formType=${item.unitTypeId}&id=${item.id}`);
        else if (pathName === 'contact-lease')
          GlobalHistory.push(`/home/units-lease/edit?formType=${item.unitTypeId}&id=${item.id}`);
        else GlobalHistory.push(`/home/units/edit?formType=${item.unitTypeId}&id=${item.id}`);
      }
    },
    [dispatch, pathName]
  );
  const onTypeChanged = useCallback((activeType) => {
    setActiveActionType(activeType);
  }, []);
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      event.stopPropagation();
      const unitOperationType = activeData && activeData.operation_type && activeData.operation_type.lookupItemName;
      const unitOperationTypeList = ['Sale', 'Rent', 'SaleAndRent'];
      if (actionEnum === ActionsEnum.reportEdit.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/units-sales/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/units-lease/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (unitOperationType === unitOperationTypeList[0]) {
          GlobalHistory.push(
            `/home/units-sales/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (unitOperationType === unitOperationTypeList[1]) {
          GlobalHistory.push(
            `/home/units-lease/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (unitOperationType === unitOperationTypeList[2]) {
          GlobalHistory.push(
            `/home/units-lease/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/units/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        }
      } else if (actionEnum === ActionsEnum.folder.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/units-sales/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (unitOperationType === unitOperationTypeList[0]) {
          GlobalHistory.push(
            `/home/units-sales/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (unitOperationType === unitOperationTypeList[1]) {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (unitOperationType === unitOperationTypeList[2]) {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/units/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        }
      }
    },
    [dispatch, pathName]
  );
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={unitsDetailes && unitsDetailes.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  
  const focusedRowChanged = useCallback(() => { }, []);
  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='title-section d-flex-v-center-h-between flex-wrap'>
        <span>{t(`${translationPath}units`)}</span>
        <ViewTypes
          onTypeChanged={onTypeChanged}
          activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
        />
      </div>

      {activeActionType === ViewTypesEnum.tableView.key && (
        <div className='w-100 px-2'>
          <Tables
            data={unitsDetailes.result}
            headerData={[
              { id: 1, label: 'ref-no', input: 'id' },
              { id: 2, label: 'property', input: 'name' },
              {
                id: 3,
                label: 'unit-no',
                input: 'unit_number',
              },
              {
                id: 4,
                label: 'unit-type',
                input: 'unitType',
              },
              {
                id: 5,
                label: 'bedrooms',
                input: 'bedrooms',
              },
            ]}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            actionsOptions={{
              onActionClicked: tableActionClicked,
            }}
            defaultActions={[
              {
                enum: TableActions.openFile.key,
                isDisabled: pathName === 'contacts',
              },
              {
                enum: TableActions.editText.key,
                isDisabled: pathName === 'contacts',
              },
            ]}
            itemsPerPage={filter.pageSize}
            activePage={filter.pageIndex}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            focusedRowChanged={focusedRowChanged}
            totalItems={unitsDetailes && unitsDetailes.totalCount ? unitsDetailes.totalCount : 0}
          />
        </div>
      )}
      {activeActionType === ViewTypesEnum.cards.key && unitsDetailes && unitsDetailes.result && (
        <UnitsCardsComponent
          data={unitsDetailes}
          onFooterActionsClicked={detailedCardSideActionClicked}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

ContactProfileUnitsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
