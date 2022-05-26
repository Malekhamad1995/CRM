import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow } from '@material-ui/core';
import moment from 'moment';
import { TableFilterOperatorsEnum, TableFilterTypesEnum } from '../../../../Enums';
import { TableFilterDataPickerComponent, TableFilterTextInputComponent } from './Controls';

export const TableFilterComponent = ({
  tableFilterClassWrapper,
  filterValues,
  onFilterValuesChanged,
  filterData,
  textInputPlaceholder,
  parentTranslationPath,
  translationPath,
  FilterDisabledButton,
   isWithCheckboxColumn
}) => {
  const getFilterByTypeHandler = useCallback(
    (row, index) => {
      if (row.filterType === TableFilterTypesEnum.datePicker.key) {
        return (
          <TableFilterDataPickerComponent
            idRef={`filterControlRef${index + 1}`}
            filterKey={row.key}
            displayPath={row.displayPath}
            filterValues={filterValues}
            onFilterValuesChanged={onFilterValuesChanged}
            maxDate={row.maxDate}
            minDate={row.minDate}
            operators={row.operators || TableFilterTypesEnum.datePicker.defaultOperators}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        );
      }
      if (row.filterType === TableFilterTypesEnum.textInput.key) {
        return (
          <TableFilterTextInputComponent
            idRef={`filterControlRef${index + 1}`}
            filterKey={row.key}
            displayPath={row.displayPath}
            filterValues={filterValues}
            onFilterValuesChanged={onFilterValuesChanged}
            inputPlaceholder={textInputPlaceholder}
            textInputType={row.textInputType}
            textInputMax={row.textInputMax}
            FilterDisabledButton={FilterDisabledButton}
            textInputMin={row.textInputMin}
            operators={row.operators || TableFilterTypesEnum.textInput.defaultOperators}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        );
      }
      return null;
    },
    [
      filterValues,
      onFilterValuesChanged,
      parentTranslationPath,
      textInputPlaceholder,
      translationPath,
    ]
  );

  return (
    (filterData && (
      <TableRow tabIndex={-1} className={`table-filter-row-wrapper ${tableFilterClassWrapper}`}>
        {/* {isWithCheckboxColumn ?
          <TableCell /> : null} */}
        {filterData.map((item, index) => (
          <TableCell colSpan={item.colSpan} key={`filterCell${index + 1}`}>
            {!item.isHiddenFilter &&
              ((item.component && item.component(item, index)) ||
                getFilterByTypeHandler(item, index))}
          </TableCell>
        ))}
      </TableRow>
    )) ||
    null
  );
};

TableFilterComponent.propTypes = {
  tableFilterClassWrapper: PropTypes.string,
  isWithCheckboxColumn: PropTypes.bool,
  filterValues: PropTypes.instanceOf(Object),
  onFilterValuesChanged: PropTypes.func,
  filterData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      colSpan: PropTypes.number,
      isHiddenFilter: PropTypes.bool,
      component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
      filterType: PropTypes.oneOf(Object.values(TableFilterTypesEnum).map((item) => item.key)),
      maxDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
      minDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
      textInputType: PropTypes.oneOf(['number', 'string']),
      textInputMax: PropTypes.number,
      textInputMin: PropTypes.number,
      displayPath: PropTypes.string,
      operators: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.oneOf(Object.values(TableFilterOperatorsEnum).map((item) => item.key)),
          isDisabled: PropTypes.bool,
        })
      ),
    })
  ),
  textInputPlaceholder: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  FilterDisabledButton: PropTypes.bool,
};
TableFilterComponent.defaultProps = {
  tableFilterClassWrapper: '',
  filterData: undefined,
  FilterDisabledButton: undefined,
  filterValues: undefined,
  onFilterValuesChanged: undefined,
  textInputPlaceholder: 'search',
  parentTranslationPath: 'Shared',
  translationPath: '',
  isWithCheckboxColumn: false,
};
