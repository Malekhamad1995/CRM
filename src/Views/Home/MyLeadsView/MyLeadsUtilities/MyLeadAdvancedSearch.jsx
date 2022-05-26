import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../Components';

export const MyLeadAdvancedSearch = ({
  setFilter,
  filterSearchDto,
  setFilterSearchDto,
  searchableFormFields,
}) => {
  const [searchData, setSearchData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const displayedLabel = (option) => `${option.title}: ${searchInputValue}`;
  const disabledOptions = (option) => option.disabledOnSelect;
  const chipsLabel = (option) => `${option.title}: ${option.value}`;
  const inputValueChanged = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
  };
  const searchClicked = async () => {
    if (searchData.length === 0) return;
    setFilterSearchDto(
      searchData.reduce((total, item) => {
        if (total[item.key]) total[item.key].push(item.value);
        else total[item.key] = [item.value];
        return total;
      }, {})
    );
    setFilter((item) => ({ ...item, pageIndex: 0 }));
  };
  const filterOnChange = (event, newValue) => {
    const emptyKeyIndex = newValue.findIndex((item) => !item.value);
    if (!searchInputValue && emptyKeyIndex !== -1) {
      newValue.splice(emptyKeyIndex, 1);
      return;
    }
    if (emptyKeyIndex !== -1) newValue[emptyKeyIndex].value = searchInputValue;
    if (filterSearchDto && Object.keys(filterSearchDto).length > 0 && newValue.length === 0) {
      setFilter((item) => ({ ...item, pageIndex: 0 }));
      setFilterSearchDto(null);
    }
    setSearchData([...newValue]);
  };
  return (
    <div className='section autocomplete-section'>
      <div className='d-flex-column px-2 w-100 p-relative'>
        <div className='w-100 p-relative'>
          <AutocompleteComponent
            data={searchableFormFields.map((item) => ({
              key: item.key,
              title: item.title,
            }))}
            wrapperClasses='autocomplete-with-btn'
            selectedValues={searchData}
            parentTranslationPath='ContactsView'
            displayLabel={displayedLabel}
            disabledOptions={disabledOptions}
            onChange={filterOnChange}
            searchClicked={searchClicked}
            chipsLabel={chipsLabel}
            getOptionSelected={(option) =>
              searchData.findIndex(
                (item) => item.key === option.key && item.value === searchInputValue
              ) !== -1}
            tagValues={searchData}
            inputValue={searchInputValue}
            onInputChange={inputValueChanged}
            inputLabel='filter'
            inputPlaceholder='search'
          />
        </div>
      </div>
    </div>
  );
};
MyLeadAdvancedSearch.propTypes = {
  setFilter: PropTypes.func.isRequired,
  setFilterSearchDto: PropTypes.func.isRequired,
  filterSearchDto: PropTypes.instanceOf(Object).isRequired,
  searchableFormFields: PropTypes.instanceOf(Object).isRequired,
};
