import React, { useState, useEffect, useCallback } from 'react';
import {
  CityTypeIdEnum,
  NationalityEnum,
} from '../../../../../../../../../../Enums';
import { lookupItemsGetId } from '../../../../../../../../../../Services/LookupsServices';
import { AutocompleteComponent } from '../../../../../../../../../../Components';

export const CountryComponent = ({
  parentTranslationPath,
  translationPath,
  setCountryId,
  countryId,
  selected,
  setSelected,
  setCityList,
}) => {
  // const { t } = useTranslation([parentTranslationPath, 'Shared']);
    // eslint-disable-next-line no-unused-vars
  const [loadings,
    setLoadings] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCityList(cities);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  const GetCountries = useCallback(async () => {
    setLoadings(true);
    const res = await lookupItemsGetId({
      lookupTypeId: NationalityEnum.lookupTypeId,
    });

    if (!(res && res.status && res.status !== 200)) {
      setCountries(
        res.map((item) => ({
          id: item.lookupItemId,
          name: item.lookupItemName,
          code: item.lookupItemCode,
        }))
      );
    } else
      setCountries([]);

    setLoadings(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetCities = useCallback(async (countryId) => {
    setLoadings(true);
    const res = await lookupItemsGetId({
      lookupTypeId: CityTypeIdEnum.lookupTypeId,
      lookupParentId: countryId,
    });

    if (!(res && res.status && res.status !== 200)) {
      setCities(
        res.map((item) => ({
          id: item.lookupItemId,
          name: item.lookupItemName,
        }))
      );
    } else
      setCities([]);

    setLoadings(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    GetCountries('');
  }, [GetCountries]);

  useEffect(() => {
    if (countryId && !selected.Country && countries.length > 0) {
      const countryIndex = countries.findIndex((item) => item.id === countryId);

      if (countryIndex !== -1) setSelected(countries[countryIndex]);
      else setCountryId(null);
    }
  }, [countries, countryId, selected.Country, setSelected, setCountryId]);

  return (
    <div>
      {countries && (
        <AutocompleteComponent
          idRef='countryRef'
          labelValue='Country'
          selectedValues={selected.Country}
          data={countries || []}
          displayLabel={(option) => option.name || ''}
          getOptionSelected={(option) => option.id === selected.Country.id}
          multiple={false}
          withoutSearchButton
          onChange={(event, newValue) => {
            setSelected(newValue && newValue);
            setCountryId(newValue ? newValue.id : '');
            if (newValue && newValue)
              GetCities(newValue.id);
            else {
              setCities(null);
              setSelected(null);
            }
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};
