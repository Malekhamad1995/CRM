import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableColumnsFilterComponent, Tables } from '../../../../Components';
import { useDispatch, useSelector } from 'react-redux';
import { TableColumnsFilterActions } from '../../../../store/TableColumnsFilter/TableColumnsFilterActions.jsx';
import { ColumnsFilterPagesEnum } from '../../../../Enums';

function ReportTableView({
  parentTranslationPath,
  translationPath,
  tableSchema,
  tableData,
  onPageIndexChanged,
  onPageSizeChanged,
  filter,
  totalItems,
  activeReport
}) {
  const dispatch = useDispatch();
  const NameOfActiveReport = ColumnsFilterPagesEnum[activeReport] && ColumnsFilterPagesEnum[activeReport].key;
  const allColumnsStored = JSON.parse(localStorage.getItem('TableColumnsFilter'));
  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  useEffect(() => {

    const checkIfColumnExist = Object.getOwnPropertyNames(allColumnsStored || {}).filter((item) => item === NameOfActiveReport);
    if (checkIfColumnExist[0] !== NameOfActiveReport || allColumnsStored == null) {
      setSelectedTableFilterColumns(tableSchema && tableSchema.filter((item) => item.isDefaultFilterColumn).map((column) => column.id));
    }
  }, [tableSchema]);
  useEffect(() => {
    if (
      tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum[activeReport] && ColumnsFilterPagesEnum[activeReport].key]
    ) {
      setSelectedTableFilterColumns(
        tableColumnsFilterResponse[ColumnsFilterPagesEnum[activeReport] && ColumnsFilterPagesEnum[activeReport].key]
      )
    }
  }, [activeReport, tableColumnsFilterResponse, ColumnsFilterPagesEnum]);

  useEffect(() => {
    setTableColumns([
      ...tableSchema.filter(
        (item) => selectedTableFilterColumns.findIndex((element) => element === item.id) !== -1
      )]);
  }, [tableSchema, selectedTableFilterColumns]);
  if (tableSchema && tableSchema.length === 0) return <></>;
  return (
    <div className='ReportsTable px-2'>
      <div className='filter-section-item' />
      <div className='w-100 px-2'>
        <TableColumnsFilterComponent
          columns={tableSchema.map((item) => ({
            key: item.formFieldId || item.id,
            value: (item.formFieldTitle && item.formFieldTitle.replace('*', '')) || item.label
          }))}
          selectedColumns={selectedTableFilterColumns}
          onSelectedColumnsChanged={(newValue) => {
            setSelectedTableFilterColumns(newValue);
            let localTableColumnsFilterResponse = tableColumnsFilterResponse;
            if (localTableColumnsFilterResponse)
              localTableColumnsFilterResponse[ColumnsFilterPagesEnum[activeReport] && ColumnsFilterPagesEnum[activeReport].key] = newValue;
            else {
              localTableColumnsFilterResponse = {
                [ColumnsFilterPagesEnum[activeReport] && ColumnsFilterPagesEnum[activeReport].key]: newValue,
              };
            }
            dispatch(
              TableColumnsFilterActions.TableColumnsFilterRequest(localTableColumnsFilterResponse)
            );
          }}
          translationPath=''
        />
        <Tables
          data={tableData}
          headerData={tableColumns && tableColumns.filter((item) => item.label !== 'Over All Count') || tableColumns}
          defaultActions={[]}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          totalItems={totalItems}
          isWithFilter
        />
      </div>
    </div>
  );
}

export default ReportTableView;
ReportTableView.propTypes = {
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  tableSchema: PropTypes.array,
  tableData: PropTypes.array,
  onPageIndexChanged: PropTypes.func,
  onPageSizeChanged: PropTypes.func,
  filter: PropTypes.object,
  totalItems: PropTypes.number,
};
