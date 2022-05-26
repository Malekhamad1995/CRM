import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../Controls';
import { TableFilterOperatorsComponent } from './TableFilterOperatorsComponent';
import { TableFilterOperatorsEnum, TableFilterTypesEnum } from '../../../../../Enums';
import { floatHandler } from '../../../../../Helper';

export const TableFilterTextInputComponent = ({
  idRef,
  operators,
  filterKey,
  displayPath,
  filterValues,
  onFilterValuesChanged,
  defaultSelectedOperator,
  inputPlaceholder,
  textInputType,
  textInputMax,
  textInputMin,
  parentTranslationPath,
  translationPath,
  FilterDisabledButton
}) => {
  const [filterValue, setFilterValue] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(defaultSelectedOperator);
  const searchTimer = useRef(null);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='table-filter-text-input-wrapper control-wrapper'>
      <Inputs
        value={filterValue}
        idRef={idRef}
        onInputChanged={(e) => {
          let { value } = e.target;
          if (textInputType === 'number') {
            value = floatHandler(value, 3);
            if (value > textInputMax) value = textInputMax;
          }
          setFilterValue(value);
          if (onFilterValuesChanged) {
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              const localFilterValues = (filterValues && { ...filterValues }) || {};
              localFilterValues[filterKey] = {
                value,
                operator: selectedOperator,
                displayPath
              };
              onFilterValuesChanged(localFilterValues);
            }, 700);
          }
        }}
        type={textInputType}
        max={textInputMax}
        min={textInputMin}
        inputPlaceholder={inputPlaceholder}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <TableFilterOperatorsComponent
        operators={operators || TableFilterTypesEnum.textInput.defaultOperators}
        selectedOperator={selectedOperator}
        FilterDisabledButton={FilterDisabledButton}
        onSelectedOperatorChanged={(newValue) => () => {
          setSelectedOperator(newValue);
          if (onFilterValuesChanged && filterValue) {
            const localFilterValues = (filterValues && { ...filterValues }) || {};
            localFilterValues[filterKey] = {
              value: filterValue,
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

TableFilterTextInputComponent.propTypes = {
  idRef: PropTypes.string.isRequired,
  FilterDisabledButton: PropTypes.bool,
  onFilterValuesChanged: PropTypes.func,
  operators: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOf(Object.values(TableFilterOperatorsEnum).map((item) => item.key)),
      isDisabled: PropTypes.bool,
    })
  ),
  filterKey: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number]).isRequired,
  filterValues: PropTypes.instanceOf(Object),
  displayPath: PropTypes.string,
  defaultSelectedOperator: PropTypes.oneOf(
    Object.values(TableFilterOperatorsEnum).map((item) => item.key)
  ),
  inputPlaceholder: PropTypes.string.isRequired,
  textInputType: PropTypes.oneOf(['number', 'string']),
  textInputMax: PropTypes.number,
  textInputMin: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TableFilterTextInputComponent.defaultProps = {
  defaultSelectedOperator: TableFilterTypesEnum.textInput.defaultSelectedOperator,
  textInputType: undefined,
  textInputMax: undefined,
  textInputMin: undefined,
  displayPath: undefined,
  onFilterValuesChanged: undefined,
  operators: undefined,
  filterValues: undefined,
  FilterDisabledButton: undefined,
};
