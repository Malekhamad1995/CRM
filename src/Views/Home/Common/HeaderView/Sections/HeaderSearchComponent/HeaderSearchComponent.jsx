import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent, SelectComponet } from '../../../../../../Components';

export const HeaderSearchComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [searchValue// , setSearchValue
  ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValues, setSearchValues] = useState([]);
  const [selectedSeachIn, setSelectedSeachIn] = useState([1, 2]);
  const [searchInList, // setSearchInList
  ] = useState([
    {
      key: 1,
      value: 'Contacts',
    },
    {
      key: 2,
      value: 'Properties',
    },
    {
      key: 3,
      value: 'Units',
    },
    {
      key: 4,
      value: 'Leads',
    },
  ]);
  const searchTimer = useRef(null);
  const getHeaderSearch = useCallback(async (value) => {
    setIsLoading(true);
    const response = null;
    if (!((response && response.data && response.data.ErrorId) || !response)) setSearchValues([]);
    else setSearchValues([]);

    setIsLoading(false);
  }, []);
  const searchChangeHandler = (event, newValue) => {
  };
  const seachInChangedHandler = (newValue) => {
    setSelectedSeachIn((items) => {
      const previousSelectAllIndex = items.findIndex((item) => item === -1);
      const currentSelectAllIndex = newValue && newValue.findIndex((item) => item === -1);
      if (
        (previousSelectAllIndex === -1 && currentSelectAllIndex !== -1) ||
        (previousSelectAllIndex === -1 &&
          currentSelectAllIndex === -1 &&
          newValue.length === searchInList.length)
      ) {
        const localSelected = [-1];
        searchInList.map((item) => localSelected.push(item.key));
        return localSelected;
      }
      if (
        previousSelectAllIndex !== -1 &&
        currentSelectAllIndex !== -1 &&
        newValue.length - 1 !== searchInList.length
      ) {
        const localSelected = [...newValue];
        localSelected.splice(currentSelectAllIndex, 1);
        return localSelected;
      }
      if (previousSelectAllIndex !== -1 && currentSelectAllIndex === -1) return [];
      return [...newValue];
    });
  };
  const getIsChecked = (item) =>
    selectedSeachIn.findIndex((element) => element === item.key) !== -1;

  return (
    <div className='header-search-wrapper childs-view'>
      <AutocompleteComponent
        idRef='HeaderSearchAutoRef'
        inputPlaceholder='search-anything'
        selectedValues={searchValue}
        multiple={false}
        data={searchValues}
        displayLabel={(option) => option.search}
        getOptionSelected={(option) => option.id === searchValue.searchId}
        withoutSearchButton
        isLoading={isLoading}
        onInputKeyUp={(e) => {
          const { value } = e.target;
          if (searchTimer.current) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            getHeaderSearch(value);
          }, 700);
        }}
        inputStartAdornment={(
          <SelectComponet
            getIsChecked={getIsChecked}
            singleIndeterminate={
              selectedSeachIn &&
              selectedSeachIn.length > 0 &&
              searchInList.length > 0 &&
              searchInList.length > selectedSeachIn.length
            }
            singleChecked={
              selectedSeachIn &&
              selectedSeachIn.length > 0 &&
              searchInList.length === selectedSeachIn.length - 1
            }
            renderValue={(value) =>
              (selectedSeachIn.length > 0 && (
                <span>
                  {value.map((option, mapIndex) => {
                    let toReturn = '';
                    const optionIndex = searchInList.findIndex((element) => element.key === option);
                    if (optionIndex !== -1) {
                      toReturn += searchInList[optionIndex].value;
                      if (mapIndex < value.length - 1) toReturn += ', ';
                    }
                    return toReturn;
                  })}
                </span>
              )) || <span>{t(`${translationPath}search-locations`)}</span>}
            selectAllItem={
              (searchInList && searchInList.length > 0 && { value: -1, text: 'all' }) || undefined
            }
            data={searchInList}
            value={selectedSeachIn}
            multiple
            isWithCheckAll
            valueInput='key'
            keyLoopBy='key'
            textInput='value'
            onSelectChanged={seachInChangedHandler}
            wrapperClasses='over-input-select w-auto'
            idRef='headerSearchRef'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        )}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={searchChangeHandler}
      />
      <ButtonBase className='btns theme-solid header-search-btn'>
        <span className='mdi mdi-magnify' />
        <span className='px-1'>{t(`${translationPath}search`)}</span>
      </ButtonBase>
    </div>
  );
};

HeaderSearchComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
