import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Lookups from '../../../../../../assets/json/StaticLookupsIds.json';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';

export const Unittype = ({
  parentTranslationPath,
  translationPath,
  setvalue,
  helperText,
  error,
  isSubmitted,
  labelClasses
}) => {
  const { t } = useTranslation(parentTranslationPath || '');
  const [res, setres] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const UnittypeAPI = useCallback(async () => {
    setisLoading(true);
    const results = await lookupItemsGetId({ lookupTypeId: Lookups.UintType });
    setres(results);
    setisLoading(false);
  }, []);
  useEffect(() => {
    UnittypeAPI();
  }, [UnittypeAPI]);
  return (
    <div>
      <AutocompleteComponent
        labelClasses={labelClasses}
        idRef='UnittypeRef'
        labelValue='Unittype'
        multiple={false}
        data={res || []}
        displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}selectUnittype`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        isLoading={isLoading}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue((newValue && newValue) || '');
        }}
      />
    </div>
  );
};

Unittype.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
};
