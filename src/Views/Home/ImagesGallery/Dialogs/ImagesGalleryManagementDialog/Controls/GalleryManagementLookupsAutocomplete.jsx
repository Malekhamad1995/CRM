import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../Services';
import { getErrorByName } from '../../../../../../Helper';
import { AutocompleteComponent } from '../../../../../../Components';

export const GalleryManagementLookupsAutocomplete = ({
  lookupParentId,
  lookupTypeId,
  stateValue,
  idRef,
  labelValue,
  onStateChanged,
  stateKey,
  schema,
  isSubmitted,
  isDisabled,
  isWithLookupParentId,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [lookups, setLookups] = useState([]);
  const getAllLookups = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupParentId,
      lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) setLookups(res || []);
    else setLookups([]);
    setIsLoading(false);
  }, [lookupParentId, lookupTypeId]);
  const getEditInit = useCallback(() => {
    if (stateValue && !selectedValue && lookups.length > 0) {
      const lookupIndex = lookups.findIndex((item) => item.lookupItemId === stateValue);
      if (lookupIndex !== -1) setSelectedValue(lookups[lookupIndex]);
    }
  }, [stateValue, selectedValue, lookups, onStateChanged]);
  useEffect(() => {
    if (stateValue) getEditInit();
  }, [stateValue, getEditInit]);
  useEffect(() => {
    if (!stateValue && selectedValue) setSelectedValue(null);
  }, [selectedValue, stateValue]);
  useEffect(() => {
    if ((isWithLookupParentId && lookupParentId) || !isWithLookupParentId) getAllLookups();
    else setLookups([]);
  }, [getAllLookups, isWithLookupParentId, lookupParentId]);
  return (
    <AutocompleteComponent
      idRef={idRef}
      labelValue={labelValue}
      selectedValues={selectedValue}
      multiple={false}
      data={lookups}
      displayLabel={(option) => option.lookupItemName || ''}
      getOptionSelected={(option) =>
        selectedValue && option.lookupItemId === selectedValue.lookupItemId}
      withoutSearchButton
      helperText={getErrorByName(schema, stateKey).message}
      error={getErrorByName(schema, stateKey).error}
      isWithError
      isDisabled={isDisabled}
      isLoading={isLoading}
      isSubmitted={isSubmitted}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChange={(event, newValue) => {
        setSelectedValue(newValue);
        onStateChanged((newValue && newValue.lookupItemId) || null);
      }}
    />
  );
};

GalleryManagementLookupsAutocomplete.propTypes = {
  stateValue: PropTypes.number,
  lookupParentId: PropTypes.number,
  lookupTypeId: PropTypes.number.isRequired,
  idRef: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isWithLookupParentId: PropTypes.bool,
  isDisabled: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
GalleryManagementLookupsAutocomplete.defaultProps = {
  stateValue: null,
  lookupParentId: undefined,
  isWithLookupParentId: false,
  isDisabled: false,
};
