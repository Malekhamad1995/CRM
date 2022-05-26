import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../../../../../Components';
import { getErrorByName } from '../../../../../../../../../../../Helper';
import { lookupItemsGetId } from '../../../../../../../../../../../Services';

export const ChequeLookupsAutocomplete = ({
  lookupTypeId,
  stateValue,
  selectedValue,
  idRef,
  labelValue,
  schema,
  isSubmitted,
  stateKey,
  selectedKey,
  onStateChanged,
  onSelectedChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
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
      const bankIndex = lookups.findIndex((item) => item.lookupItemId === stateValue);
      if (bankIndex !== -1) onSelectedChanged({ id: selectedKey, value: lookups[bankIndex] });
      else onStateChanged({ id: stateKey, value: null });
    }
  }, [
    stateValue,
    selectedValue,
    lookups,
    onSelectedChanged,
    selectedKey,
    onStateChanged,
    stateKey,
  ]);
  useEffect(() => {
    if (stateValue) getEditInit();
  }, [stateValue, getEditInit]);
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
      getOptionSelected={(option) => option.lookupItemId === stateValue}
      withoutSearchButton
      helperText={getErrorByName(schema, stateKey).message}
      error={getErrorByName(schema, stateKey).error}
      isWithError
      isLoading={isLoading}
      isSubmitted={isSubmitted}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChange={(event, newValue) => {
        onSelectedChanged({ id: selectedKey, value: newValue });
        onStateChanged({
          id: stateKey,
          value: (newValue && newValue.lookupItemId) || null,
        });
      }}
    />
  );
};

ChequeLookupsAutocomplete.propTypes = {
  stateValue: PropTypes.string,
  selectedValue: PropTypes.instanceOf(Object),
  lookupTypeId: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  selectedKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ChequeLookupsAutocomplete.defaultProps = {
  stateValue: null,
  selectedValue: null,
};
