import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../Services';
import { getErrorByName } from '../../../../../../../Helper';
import { AutocompleteComponent } from '../../../../../../../Components';

export const ContactProfileDocumentLookupsAutocomplete = ({
  lookupTypeId,
  stateValue,
  idRef,
  labelValue,
  schema,
  isSubmitted,
  stateKey,
  onStateChanged,
  parentTranslationPath,
  translationPath,
  isDisabled
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [lookups, setLookups] = useState([]);
  const getAllLookups = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) setLookups(res || []);
    else setLookups([]);
    setIsLoading(false);
  }, [lookupTypeId]);
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
    getAllLookups();
  }, [getAllLookups]);
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
      isLoading={isLoading}
      isSubmitted={isSubmitted}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChange={(event, newValue) => {
        setSelectedValue(newValue);
        onStateChanged({
          id: stateKey,
          value: (newValue && newValue.lookupItemId) || null,
        });
      }}
      isDisabled={isDisabled}
    />
  );
};

ContactProfileDocumentLookupsAutocomplete.propTypes = {
  stateValue: PropTypes.string,
  lookupTypeId: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isDisabled:PropTypes.bool,
};
ContactProfileDocumentLookupsAutocomplete.defaultProps = {
  stateValue: null,
};
