import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../Services';
import { AutocompleteComponent } from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';

export const RotationManagementLookupsAutocomplete = ({
  lookupTypeId,
  idRef,
  mapedData,
  labelValue,
  value,
  labelClasses,
  onStateChanged,
  parentTranslationPath,
  translationPath,
  validation,
  schema,
  schemaKey,
  isSubmitted,
}) => {
  const [lookups, setLookups] = useState([]);
  const [pageResult, setpageResult] = useState([]);
  const getAllLookups = useCallback(async () => {
    const res = await lookupItemsGetId({
      lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) {
      if (mapedData) {
        const mapped = [];
        res.map((item) => {
          const obj = {};
          obj[mapedData.id] = item.lookupItemId;
          obj[mapedData.name] = item.lookupItemName;
          mapped.push(obj);
        });
        setLookups(mapped || []);
        setpageResult(mapped.slice(0, 100));
      } else setLookups(res || []);
    } else setLookups([]);
  }, [lookupTypeId]);

  useEffect(() => {
    getAllLookups();
  }, [lookupTypeId]);
  return (
    <>
      {validation && (
        <AutocompleteComponent
          labelClasses
          idRef={idRef}
          withLoader
          labelValue={labelValue}
          labelClasses={labelClasses}
          selectedValues={value}
          multiple
          data={pageResult || []}
          onInputChange={(e) => {
            if (e.target.value) {
              const list = lookups
                .filter((w) =>
                  w[mapedData.name].toLowerCase().includes(e.target.value.toLowerCase()))
                .slice(0, 100);
              setpageResult(list);
            }
          }}
          displayLabel={(option) => (option && option[mapedData.name]) || ''}
          chipsLabel={(option) => (option && option[mapedData.name]) || ''}
          filterOptions={(options) => {
            const isFind = (id) => value.findIndex((w) => w[mapedData.id] === id) === -1;
            return options.filter((w) => isFind(w[mapedData.id]));
          }}
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          onChange={(event, newValue) => {
            onStateChanged(newValue || null);
          }}
          isWithError
          isSubmitted={isSubmitted}
          helperText={getErrorByName(schema, schemaKey).message}
          error={getErrorByName(schema, schemaKey).error}
        />
      )}
      {!validation && (
        <AutocompleteComponent
          idRef={idRef}
          withLoader
          labelValue={labelValue}
          selectedValues={value}
          multiple
          data={pageResult || []}
          onInputChange={(e) => {
            if (e.target.value) {
              const list = lookups
                .filter((w) =>
                  w[mapedData.name].toLowerCase().includes(e.target.value.toLowerCase()))
                .slice(0, 100);
              setpageResult(list);
            }
          }}
          displayLabel={(option) => (option && option[mapedData.name]) || ''}
          chipsLabel={(option) => (option && option[mapedData.name]) || ''}
          filterOptions={(options) => {
            const isFind = (id) => value.findIndex((w) => w[mapedData.id] === id) === -1;
            return options.filter((w) => isFind(w[mapedData.id]));
          }}
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          onChange={(event, newValue) => {
            onStateChanged(newValue || null);
          }}
        />
      )}
    </>
  );
};

RotationManagementLookupsAutocomplete.propTypes = {
  lookupParentId: PropTypes.number,
  lookupTypeId: PropTypes.number.isRequired,
  idRef: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isWithLookupParentId: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
RotationManagementLookupsAutocomplete.defaultProps = {
  lookupParentId: undefined,
  isWithLookupParentId: false,
};
