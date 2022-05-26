import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePickerComponent } from '../../../../Controls';
import { TableFilterOperatorsEnum, TableFilterTypesEnum } from '../../../../../Enums';
import { TableFilterOperatorsComponent } from './TableFilterOperatorsComponent';

export const TableFilterDataPickerComponent = ({
  idRef,
  maxDate,
  minDate,
  operators,
  filterKey,
  displayPath,
  filterValues,
  onFilterValuesChanged,
  defaultSelectedOperator,
  placeholder,
  parentTranslationPath,
  translationPath,
}) => {
  const [filterDate, setFilterDate] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(defaultSelectedOperator);
  return (
    <div className='table-filter-data-picker-wrapper control-wrapper'>
      <DatePickerComponent
        idRef={idRef}
        placeholder={placeholder}
        value={filterDate}
        format='YYYY/MM/DD'
        maxDate={maxDate}
        minDate={minDate}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDateChanged={(newValue) => {
          setFilterDate(newValue);
          if (onFilterValuesChanged) {
            const localFilterValues = (filterValues && { ...filterValues }) || {};
            localFilterValues[filterKey] = {
              value: (newValue && moment(newValue).format('YYYY-MM-DD')) || null,
              operator: selectedOperator,
              displayPath
            };
            onFilterValuesChanged(localFilterValues);
          }
        }}
      />
      {/* <DateRangePickerComponent
        onClearClicked={() => setDateFilter(dateRangeDefault)}
        ranges={[dateFilter]}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDateChanged={(selectedDate) =>
                        setDateFilter({
                          startDate: selectedDate.selection && selectedDate.selection.startDate,
                          endDate: selectedDate.selection && selectedDate.selection.endDate,
                          key: 'selection',
                        })}
      /> */}
      <TableFilterOperatorsComponent
        operators={operators || TableFilterTypesEnum.datePicker.defaultOperators}
        selectedOperator={selectedOperator}
        onSelectedOperatorChanged={(newValue) => () => {
          setSelectedOperator(newValue);
          if (onFilterValuesChanged && filterDate) {
            const localFilterValues = (filterValues && { ...filterValues }) || {};
            localFilterValues[filterKey] = {
              value: (filterDate && moment(filterDate).format('YYYY-MM-DD')) || null,
              operator: newValue,
              displayPath
            };
            onFilterValuesChanged(localFilterValues);
          }
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

TableFilterDataPickerComponent.propTypes = {
  idRef: PropTypes.string.isRequired,
  filterKey: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number]).isRequired,
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  filterValues: PropTypes.instanceOf(Object),
  displayPath: PropTypes.string,
  onFilterValuesChanged: PropTypes.func,
  operators: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOf(Object.values(TableFilterOperatorsEnum).map((item) => item.key)),
      isDisabled: PropTypes.bool,
    })
  ),
  defaultSelectedOperator: PropTypes.oneOf(
    Object.values(TableFilterOperatorsEnum).map((item) => item.key)
  ),
  placeholder: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TableFilterDataPickerComponent.defaultProps = {
  defaultSelectedOperator: TableFilterTypesEnum.datePicker.defaultSelectedOperator,
  maxDate: undefined,
  minDate: undefined,
  displayPath: undefined,
  onFilterValuesChanged: undefined,
  placeholder: 'YYYY/MM/DD',
  filterValues: undefined,
  operators: undefined,
};
