import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';
import { getErrorByName } from '../../../../../../Helper';

export const GalleryFilterLookupsAutocomplete = ({
  lookupParentId,
  lookupTypeId,
  stateValue,
  idRef,
  inputPlaceholder,
  onStateChanged,
  isWithLookupParentId,
  stateKey,
  schema,
  isSubmitted,
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
      else onStateChanged(null);
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
      inputPlaceholder={inputPlaceholder}
      autoComplete={"new-password"}
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

GalleryFilterLookupsAutocomplete.propTypes = {
  stateValue: PropTypes.number,
  lookupParentId: PropTypes.number,
  lookupTypeId: PropTypes.number.isRequired,
  idRef: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isWithLookupParentId: PropTypes.bool,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
GalleryFilterLookupsAutocomplete.defaultProps = {
  stateValue: null,
  lookupParentId: undefined,
  isWithLookupParentId: false,
};
