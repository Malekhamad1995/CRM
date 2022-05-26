import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SelectComponet } from '../SelectComponent/SelectComponent';

export const TableColumnsFilterComponent = ({
  columns,
  selectedColumns,
  onSelectedColumnsChanged,
  isLoading,
  idRef,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const seachInChangedHandler = (newValue) => {
    if (onSelectedColumnsChanged) {
      const previousSelectAllIndex = selectedColumns.findIndex((item) => item === -1);
      const currentSelectAllIndex = newValue.findIndex((item) => item === -1);
      if (
        (previousSelectAllIndex === -1 && currentSelectAllIndex !== -1) ||
        (previousSelectAllIndex === -1 &&
          currentSelectAllIndex === -1 &&
          newValue.length === columns.length)
      ) {
        const localSelected = [-1];
        columns.map((item) => localSelected.push(item.key));
        onSelectedColumnsChanged(localSelected);
      } else if (
        previousSelectAllIndex !== -1 &&
        currentSelectAllIndex !== -1 &&
        newValue.length - 1 !== columns.length
      ) {
        const localSelected = [...newValue];
        localSelected.splice(currentSelectAllIndex, 1);
        onSelectedColumnsChanged(localSelected);
      } else if (previousSelectAllIndex !== -1 && currentSelectAllIndex === -1)
        onSelectedColumnsChanged([]);
      else onSelectedColumnsChanged(newValue);
    }
  };
  const getIsChecked = (item) =>
    selectedColumns.findIndex((element) => element === item.key) !== -1;
  return (
    <div className='table-columns-filter-wrapper component-wrapper'>
      <div className='table-columns-filter-autocomplete-wrapper'>
        <SelectComponet
          getIsChecked={getIsChecked}
          singleIndeterminate={
            selectedColumns &&
            selectedColumns.length > 0 &&
            columns.length > 0 &&
            columns.length > selectedColumns.length
          }
          singleChecked={
            selectedColumns &&
            selectedColumns.length > 0 &&
            columns.length === selectedColumns.length - 1
          }
          renderValue={(value) =>
            (value.length > 0 && (
              <span>
                {value.map((option, mapIndex) => {
                  let toReturn = '';
                  const optionIndex = columns.findIndex((element) => element.key === option);
                  if (optionIndex !== -1) {
                    toReturn += t(`${translationPath}${columns[optionIndex].value}`);
                    if (mapIndex < value.length - 1) toReturn += ', ';
                  }
                  return toReturn;
                })}
              </span>
            )) || <span>{t(`${translationPath}filter-columns`)}</span>}
          selectAllItem={(columns && columns.length > 0 && { value: -1, text: 'all' }) || undefined}
          data={columns}
          value={selectedColumns}
          multiple
          isLoading={isLoading}
          isWithCheckAll
          valueInput='key'
          keyLoopBy='key'
          textInput='value'
          onSelectChanged={seachInChangedHandler}
          idRef={idRef}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
        />
      </div>
    </div>
  );
};

TableColumnsFilterComponent.propTypes = {
  columns: PropTypes.instanceOf(Array).isRequired,
  selectedColumns: PropTypes.instanceOf(Array),
  onSelectedColumnsChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  idRef: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TableColumnsFilterComponent.defaultProps = {
  selectedColumns: [],
  onSelectedColumnsChanged: undefined,
  isLoading: false,
  idRef: 'tableFilterColumnsAutocompleteRef',
};
