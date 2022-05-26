import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  ColumnsFilterPagesEnum,
  FormsIdsEnum,
  TableActions,
  TableFilterTypesEnum,
} from '../../../../../Enums';
import { TableColumnsFilterComponent, Tables } from '../../../../../Components';
import { GetAllFormFieldsByFormId } from '../../../../../Services';
import { PropertiesTableHeaderData } from './PropertiesTableHeaderData';
import { TableColumnsFilterActions } from '../../../../../store/TableColumnsFilter/TableColumnsFilterActions';

export const PropertiesTableComponent = ({
  detailsPropertiesList,
  tableActionClicked,
  onPageIndexChanged,
  onPageSizeChanged,
  filter,
  parentTranslationPath,
  focusedRowChanged,
  propertiesTableFilter,
  onFilterValuesChanged,
}) => {
  const dispatch = useDispatch();
  const [allFormFields, setAllFormFields] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableFilterData, setTableFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState(
    PropertiesTableHeaderData.filter((item) => item.isDefaultFilterColumn).map(
      (column) => column.id
    )
  );
  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const getAllFormFieldsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldsByFormId(FormsIdsEnum.properties.id);
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
      tableColumnsFilterResponse[ColumnsFilterPagesEnum.properties.key]
    ) {
      setSelectedTableFilterColumns(
        tableColumnsFilterResponse[ColumnsFilterPagesEnum.properties.key]
      );
    }
  }, [tableColumnsFilterResponse]);
  useEffect(() => {
    setTableColumns([
      ...PropertiesTableHeaderData.filter(
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
  return (
    <div className='w-100 px-3'>
      <TableColumnsFilterComponent
        columns={PropertiesTableHeaderData.concat(
          allFormFields.filter(
            (item) =>
              PropertiesTableHeaderData.findIndex(
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
            localTableColumnsFilterResponse[ColumnsFilterPagesEnum.properties.key] = newValue;
          else {
            localTableColumnsFilterResponse = {
              [ColumnsFilterPagesEnum.properties.key]: newValue,
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
        data={detailsPropertiesList.result}
        headerData={tableColumns}
        filterValues={propertiesTableFilter}
        onFilterValuesChanged={onFilterValuesChanged}
        filterData={tableFilterData}
        isWithFilter
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        itemsPerPage={filter.pageSize}
        defaultActions={[
          {
            enum: TableActions.openFile.key,
          },
          {
            enum: TableActions.editText.key,
          },
        ]}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        focusedRowChanged={focusedRowChanged}
        totalItems={detailsPropertiesList ? detailsPropertiesList.totalCount : 0}
      />
    </div>
  );
};

PropertiesTableComponent.propTypes = {
  detailsPropertiesList: PropTypes.instanceOf(Object).isRequired,
  tableActionClicked: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  focusedRowChanged: PropTypes.func.isRequired,
  onFilterValuesChanged: PropTypes.func.isRequired,
  propertiesTableFilter: PropTypes.instanceOf(Object),
};
PropertiesTableComponent.defaultProps = {
  propertiesTableFilter: undefined,
};
