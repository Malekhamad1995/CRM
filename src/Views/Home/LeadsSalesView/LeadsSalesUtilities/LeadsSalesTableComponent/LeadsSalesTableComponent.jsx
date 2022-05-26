import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { TableColumnsFilterComponent, Tables } from '../../../../../Components';
import {
  ColumnsFilterPagesEnum,
  FormsIdsEnum,
  TableActions,
  TableFilterTypesEnum,
} from '../../../../../Enums';
import { GetAllFormFieldsByFormId } from '../../../../../Services';
import { TableColumnsFilterActions } from '../../../../../store/TableColumnsFilter/TableColumnsFilterActions';
import { LeadsSalesTableHeaderData } from './LeadsSalesTableHeaderData';

export const LeadsSalesTableComponent = ({
  detailsLeadsList,
  tableActionClicked,
  onPageIndexChanged,
  onPageSizeChanged,
  filter,
  parentTranslationPath,
  focusedRowChanged,
  checkedCardsIds,
  getIsSelected,
  getIsDisabled,
  onSelectClicked,
  activeSelectedAction,
  leadsTableFilter,
  onFilterValuesChanged,
  defaultActions,
  setCheckedCards,
}) => {
  const dispatch = useDispatch();
  const [allFormFields, setAllFormFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableFilterData, setTableFilterData] = useState([]);
  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState(
    LeadsSalesTableHeaderData.filter((item) => item.isDefaultFilterColumn).map(
      (column) => column.id
    )
  );
  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const getAllFormFieldsByFormId = useCallback(async () => {
    setIsLoading(true);
    Promise.all([
      await GetAllFormFieldsByFormId(FormsIdsEnum.leadsOwner.id),
      await GetAllFormFieldsByFormId(FormsIdsEnum.leadsSeeker.id),
    ])
      .then((result) => {
        if (Array.isArray(result[0]) && Array.isArray(result[1])) {
          const concantinateFields = result[0]
            .concat(result[1])
            .filter(
              (field, index, array) =>
                array.findIndex((element) => element.formFieldKey === field.formFieldKey) === index
            );
          setAllFormFields(concantinateFields);
        } else setAllFormFields([]);
        setIsLoading(false);
      })
      .catch(() => {
        setAllFormFields([]);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    getAllFormFieldsByFormId();
  }, [getAllFormFieldsByFormId]);
  useEffect(() => {
    if (
      tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum.leadsSales.key]
    ) {
      setSelectedTableFilterColumns(
        tableColumnsFilterResponse[ColumnsFilterPagesEnum.leadsSales.key]
      );
    }
  }, [tableColumnsFilterResponse]);
  useEffect(() => {
    setTableColumns([
      ...LeadsSalesTableHeaderData.filter(
        (item) => selectedTableFilterColumns.findIndex((element) => element === item.id) !== -1
      ),
      ...allFormFields
        .filter(
          (item) =>
            selectedTableFilterColumns.findIndex((element) => element === item.formFieldId) !== -1
        )
        .map((field) => ({
          id: field.formFieldId,
          key: field.formFieldKey,
          isDate: field.uiWidgetType === 'alt-date',
          label: (field.formFieldTitle && field.formFieldTitle.replace('*', '')) || '',
          input: field.displayPath || undefined,
        })),
    ]);
  }, [allFormFields, selectedTableFilterColumns]);
  useEffect(() => {
    setTableFilterData(
      tableColumns.map((column) => ({
        key: column.key || column.fieldKey || column.id,
        filterType:
          (column.isDate && TableFilterTypesEnum.datePicker.key) ||
          TableFilterTypesEnum.textInput.key,
        isHiddenFilter: column.isHiddenFilter,
        textInputType: column.textInputType,
        textInputMax: column.textInputMax,
        textInputMin: column.textInputMin,
        displayPath:
          (column.key && column.input) ||
          (column.fieldKey &&
            allFormFields &&
            allFormFields.findIndex((item) => item.formFieldKey === column.fieldKey) !== -1 &&
            allFormFields.find((item) => item.formFieldKey === column.fieldKey).displayPath) ||
          undefined,
      }))
    );
  }, [allFormFields, tableColumns]);

  const getIsSelectedAll = useCallback(
    () => {
      const returnSelect = (checkedCardsIds &&
        detailsLeadsList.result.findIndex((item) => !checkedCardsIds.includes(item.id)) === -1) || false;
      return returnSelect;
    });


  const onSelectAllClicked = () => {
    if (activeSelectedAction === 'reassign-leads') return;
    if (!getIsSelectedAll()) {
      if (detailsLeadsList && detailsLeadsList.result)
        setCheckedCards(detailsLeadsList.result);
      detailsLeadsList.result.map((item) => {
        if (!getIsSelected(item)) {
          checkedCardsIds.push(item.id);
        }
      });
    } else {
      setCheckedCards([]);
      detailsLeadsList.result.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = checkedCardsIds.findIndex(
            (element) => element === item.id
          );
          if (isSelectedIndex !== -1) checkedCardsIds.splice(isSelectedIndex, 1);
        }
      });
    }

  };
  return (
    <div className='w-100 px-3'>
      <TableColumnsFilterComponent
        columns={LeadsSalesTableHeaderData.concat(
          allFormFields.filter(
            (item) =>
              LeadsSalesTableHeaderData.findIndex(
                (element) => element.fieldKey === item.formFieldKey
              ) === -1
          )
        ).map((item) => ({
          key: item.formFieldId || item.id,
          value: (item.formFieldTitle && item.formFieldTitle.replace('*', '')) || item.label,
        }))}
        isLoading={isLoading}
        selectedColumns={selectedTableFilterColumns}
        onSelectedColumnsChanged={(newValue) => {
          setSelectedTableFilterColumns(newValue);
          let localTableColumnsFilterResponse = tableColumnsFilterResponse;
          if (localTableColumnsFilterResponse)
            localTableColumnsFilterResponse[ColumnsFilterPagesEnum.leadsSales.key] = newValue;
          else {
            localTableColumnsFilterResponse = {
              [ColumnsFilterPagesEnum.leadsSales.key]: newValue,
            };
          }
          dispatch(
            TableColumnsFilterActions.TableColumnsFilterRequest(localTableColumnsFilterResponse)
          );
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath=''
      />
      <Tables
        data={detailsLeadsList.result}
        selectAllOptions={
          ((activeSelectedAction === 'merge' || activeSelectedAction === 'close-leads' || activeSelectedAction === 'reassign-leads') && {
            selectedRows: checkedCardsIds,
            getIsSelected,
            disabledRows: [],
            getIsDisabled,
            withCheckAll: true,
             onSelectAllClicked,
            isSelectAll: getIsSelectedAll(),
            onSelectClicked,
          }) ||
          undefined
        }
        headerData={tableColumns}
        filterValues={leadsTableFilter}
        onFilterValuesChanged={onFilterValuesChanged}
        filterData={tableFilterData}
        isWithFilter
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        defaultActions={defaultActions || [
          {
            enum: TableActions.openFile.key,
          },
          {
            enum: TableActions.editText.key,
          },
        ]}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        focusedRowChanged={focusedRowChanged}
        totalItems={detailsLeadsList ? detailsLeadsList.totalCount : 0}
      />
    </div>
  );
};

LeadsSalesTableComponent.propTypes = {
  detailsLeadsList: PropTypes.instanceOf(Object).isRequired,
  tableActionClicked: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  focusedRowChanged: PropTypes.func.isRequired,
  checkedCardsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  getIsSelected: PropTypes.func.isRequired,
  getIsDisabled: PropTypes.func.isRequired,
  onSelectClicked: PropTypes.func.isRequired,
  activeSelectedAction: PropTypes.string.isRequired,
  onFilterValuesChanged: PropTypes.func.isRequired,
  leadsTableFilter: PropTypes.instanceOf(Object),
  setCheckedCards: PropTypes.func.isRequired,
};
LeadsSalesTableComponent.defaultProps = {
  leadsTableFilter: undefined,
};
