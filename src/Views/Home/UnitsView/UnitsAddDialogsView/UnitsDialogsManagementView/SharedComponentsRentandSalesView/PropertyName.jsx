import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { getProperties } from '../../../../../../Services';

export const PropertyName = ({
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
  const searchTimer = useRef(null);
  const PropertiesAPI = useCallback(async (value) => {
    setisLoading(true);
    const results = await getProperties({ pageIndex: 0, pageSize: 100, search: value });
    setres(results.result);
    setisLoading(false);
  }, []);
  useEffect(() => {
    PropertiesAPI();
  }, [PropertiesAPI]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      PropertiesAPI(value);
    }, 700);
  };
  return (
    <div>
      <AutocompleteComponent
        idRef='PropertyNameRef'
        labelValue='PropertyName'
        labelClasses={labelClasses}
        multiple={false}
        data={res || []}
        displayLabel={(option) => t(`${option.property.property_name || ''}`)}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}selectProperty`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        onInputKeyUp={(e) => searchHandler(e)}
        isLoading={isLoading}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue(
            newValue && {
              id: +newValue.propertyId,
              name: newValue.property.property_name,
            }
          );
        }}
      />
    </div>
  );
};
PropertyName.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
};
