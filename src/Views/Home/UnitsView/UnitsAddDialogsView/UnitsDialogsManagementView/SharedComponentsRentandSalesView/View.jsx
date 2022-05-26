import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Lookups from '../../../../../../assets/json/StaticLookupsIds.json';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';

export const View = ({
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
    const results = await lookupItemsGetId({ lookupTypeId: Lookups.UintView });
    setres(results);
    setisLoading(false);
  }, []);
  useEffect(() => {
    UnittypeAPI();
  }, [UnittypeAPI]);
  return (
    <div className='AutocompleteComponentBedrooms'>
      <AutocompleteComponent
        idRef='UnitViewRef'
        labelValue='UnitView'
        chipsLabel={(option) => option.lookupItemName || ''}
        displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
        data={res || []}
        isLoading={isLoading}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}View`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue((newValue && newValue) || '');
        }}
      />
    </div>
  );
};

View.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};
