import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { TableColumnsFilterComponent, Tables } from '../../../../../../../../Components';
import {
  ColumnsFilterPagesEnum,
  FormsIdsEnum,
  TableFilterTypesEnum,
} from '../../../../../../../../Enums';
import { GetAllFormFieldsByFormId } from '../../../../../../../../Services';
import { TableColumnsFilterActions } from '../../../../../../../../store/TableColumnsFilter/TableColumnsFilterActions';
import { UnitsSalesTableHeaderData } from '../../../../../../UnitsSalesView/UnitsSalesUtilities/UnitsSalesTableComponent/UnitsSalesTableHeaderData'
import { UnitMapper } from "../../../../../../UnitsView/UnitMapper";

export const LeadUnitsTable = ({
  data,
  filter,
  totalCount,
  onPageIndexChanged,
  onPageSizeChanged,
  parentTranslationPath,
  selectedMatchesIndexes,
  selectedMatchesIds,
  setSelectedMatchesIds,
  setSelectedMatchesIndexes,
}) => {
  const dispatch = useDispatch();
  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const [allFormFields, setAllFormFields] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState(
    UnitsSalesTableHeaderData.filter((item) => item.isDefaultFilterColumn).map(
      (column) => column.id
    )
  );

  const getAllFormFieldsByFormId = useCallback(async () => {
    setTableData(data.map((item) => UnitMapper(item)));

    setIsLoading(true);
    const result = await GetAllFormFieldsByFormId(FormsIdsEnum.units.id);
    if (!((result && result.data && result.data.ErrorId) || !result) && Array.isArray(result))
      setAllFormFields(result);
    else setAllFormFields([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getAllFormFieldsByFormId();
  }, [getAllFormFieldsByFormId]);

  useEffect(() => {
    if (
      tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum.unitsSales.key]
    ) {
      setSelectedTableFilterColumns(
        tableColumnsFilterResponse[ColumnsFilterPagesEnum.unitsSales.key]
      );
    }
  }, [tableColumnsFilterResponse]);

  useEffect(() => {
    setTableColumns([
      ...UnitsSalesTableHeaderData.filter(
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
  }, [allFormFields, tableColumns]);


  const onSelectClicked = useCallback(
    (row, rowIndex) => {

      setSelectedMatchesIds(() => {
        const cardIndex = selectedMatchesIds.findIndex((item) => item === row.id);
        if (cardIndex !== -1) selectedMatchesIds.splice(cardIndex, 1);
        else selectedMatchesIds.push(row.id);
        return [...selectedMatchesIds];
      });
      setSelectedMatchesIndexes(() => {
        const cardIndex = selectedMatchesIndexes.findIndex((item) => item === rowIndex);
        if (cardIndex !== -1) selectedMatchesIndexes.splice(cardIndex, 1);
        else selectedMatchesIndexes.push(rowIndex);
        return [...selectedMatchesIndexes];
      });
    }
  );

  return (
    <div className='w-100 px-3'>
      <TableColumnsFilterComponent
        columns={UnitsSalesTableHeaderData.concat(
          allFormFields.filter(
            (item) =>
              UnitsSalesTableHeaderData.findIndex(
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
          if (localTableColumnsFilterResponse) {
            localTableColumnsFilterResponse[ColumnsFilterPagesEnum.unitsSales.key] = newValue;
          }
          else {
            localTableColumnsFilterResponse = {
              [ColumnsFilterPagesEnum.unitsSales.key]: newValue,
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
        data={tableData}
        headerData={tableColumns}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        defaultActions={[]}
        parentTranslationPath={parentTranslationPath}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        totalItems={totalCount ? totalCount : 0}
        selectAllOptions={{
          selectedRows: selectedMatchesIndexes,
          onSelectClicked,
          disabledRows: [],
        }}
        isSellectAllDisabled
      />
    </div>
  );
};

LeadUnitsTable.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  totalCount: PropTypes.instanceOf(Object).isRequired,
};
