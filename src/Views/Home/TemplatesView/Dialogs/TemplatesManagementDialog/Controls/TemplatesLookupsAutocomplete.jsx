import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../Components';
import { getErrorByName } from '../../../../../../Helper';
import { lookupItemsGetId } from '../../../../../../Services';

export const TemplatesLookupsAutocomplete = ({
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
    if (stateValue && selectedValue.length !== stateValue.length && lookups.length > 0) {
      const localState = [];
      const localSelected = [];
      stateValue.map((item) => {
        const lookupIndex = lookups.findIndex(
          (element) => element.lookupItemId === item.categoryId
        );
        if (lookupIndex !== -1) {
          localState.push(item);
          localSelected.push(lookups[lookupIndex]);
        }
        return undefined;
      });
      onSelectedChanged({ id: selectedKey, value: localSelected });
      onStateChanged({ id: stateKey, value: localState });
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
      data={lookups}
      displayLabel={(option) => option.lookupItemName || ''}
      chipsLabel={(option) => option.lookupItemName || ''}
      getOptionSelected={(option) =>
        stateValue.findIndex((item) => item.categoryId === option.lookupItemId) !== -1}
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
          value: (newValue && newValue.map((item) => ({ categoryId: item.lookupItemId }))) || [],
        });
      }}
    />
  );
};

TemplatesLookupsAutocomplete.propTypes = {
  stateValue: PropTypes.instanceOf(Array),
  selectedValue: PropTypes.instanceOf(Object),
  lookupTypeId: PropTypes.number.isRequired,
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
TemplatesLookupsAutocomplete.defaultProps = {
  stateValue: [],
  selectedValue: null,
};
