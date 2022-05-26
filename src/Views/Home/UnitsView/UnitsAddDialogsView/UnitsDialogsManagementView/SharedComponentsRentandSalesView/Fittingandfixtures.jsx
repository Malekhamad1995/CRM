import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';
import Lookups from '../../../../../../assets/json/StaticLookupsIds.json';

export const Fittingandfixtures = ({
  parentTranslationPath,
  translationPath,
  // value,
  setvalue,
  helperText,
  error,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath || '');
  const [res, setres] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const UnittypeAPI = useCallback(async () => {
    setisLoading(true);
    const results = await lookupItemsGetId({ lookupTypeId: Lookups.FittingAndFixtures });
    setres(results);
    setisLoading(false);
  }, []);
  useEffect(() => {
    UnittypeAPI();
  }, [UnittypeAPI]);
  return (
    <div className='AutocompleteComponentBedrooms'>
      <AutocompleteComponent
        idRef='FittingandfixturesRef'
        labelValue='Fittingandfixtures'
        data={res || []}
        isLoading={isLoading}
        chipsLabel={(option) => option.lookupItemName || ''}
        displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}SelectFittingandfixtures`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue(newValue && newValue);
        }}
      />
    </div>
  );
};

Fittingandfixtures.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};
