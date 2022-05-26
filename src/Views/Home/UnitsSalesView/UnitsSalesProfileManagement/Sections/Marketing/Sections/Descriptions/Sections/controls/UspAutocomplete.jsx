import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getErrorByName } from '../../../../../../../../../../Helper';
import { AutocompleteComponent } from '../../../../../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../../../../../Services';
import { UspLookupTypeIdEnum } from '../../../../../../../../../../Enums';

export const UspAutocomplete = ({
  state,
  schema,
  onStateChanged,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [usp, setUsp] = useState(null);
  const [usps, setUsps] = useState([]);
  const getAllUsp = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: UspLookupTypeIdEnum.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) setUsps(res || []);
    else setUsps([]);
    setIsLoading(false);
  }, []);
  const onAutocompleteChanged = (event, newValue) => {
    onStateChanged({
      id: 'uspId',
      value: (newValue && newValue.lookupItemId) || null,
    });
  };
  useEffect(() => {
    getAllUsp();
  }, [getAllUsp]);
  useEffect(() => {
    if (state.uspId && usps.length > 0) {
      setUsp((items) => {
        const uspIndex = usps.findIndex((item) => item.lookupItemId === state.uspId);
        if (uspIndex !== -1) items[uspIndex] = usps[uspIndex];
        return [...items];
      });
    }
  }, [state.uspId, usps]);
  return (
    <div className='form-item'>
      <AutocompleteComponent
        idRef='uspIdRef'
        labelValue='usp'
        selectedValues={usp}
        multiple={false}
        data={usps}
        displayLabel={(option) => option.lookupItemName || ''}
        getOptionSelected={(option) => option.lookupItemId === state.uspId}
        withoutSearchButton
        helperText={getErrorByName(schema, 'uspId').message}
        error={getErrorByName(schema, 'uspId').error}
        isWithError
        isLoading={isLoading}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={onAutocompleteChanged}
      />
    </div>
  );
};

UspAutocomplete.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
