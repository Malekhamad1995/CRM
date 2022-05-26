import React, { useState, useEffect, useCallback } from 'react';
import { DistrictTypeIdEnum } from '../../../../../../../../../../Enums';
import { AutocompleteComponent } from '../../../../../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../../../../../Services/LookupsServices';

export const CityComponent = ({
  parentTranslationPath,
  translationPath,
  cityId,
  setCityId,
  selected,
  setSelected,
  setDistrictList,
  cityList,
}) => {
  // const { t } = useTranslation([parentTranslationPath, 'Shared']);
      // eslint-disable-next-line no-unused-vars
  const [loadings,
    setLoadings] = useState(false);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    setDistrictList(districts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts]);

  const GetDistrict = useCallback(async (cityId) => {
    setLoadings(true);
    const res = await lookupItemsGetId({
      lookupTypeId: DistrictTypeIdEnum.lookupTypeId,
      lookupParentId: cityId,
    });

    if (!(res && res.status && res.status !== 200)) {
      setDistricts(
        res.map((item) => ({
          id: item.lookupItemId,
          name: item.lookupItemName,
        }))
      );
    } else
      setDistricts([]);

    setLoadings(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cityId && !selected.City && cityList.length > 0) {
      const cityIndex = cityList.findIndex((item) => item.id === cityId);

      if (cityIndex !== -1) setSelected(cityList[cityIndex]);
      else setCityId(null);
    }
  }, [cityList, cityId, selected.City, setSelected, setCityId]);

  return (
    <div>
      <AutocompleteComponent
        idRef='cityRef'
        labelValue='city'
        multiple={false}
        selectedValues={selected.City}
        data={cityList && cityList ? cityList : []}
        displayLabel={(option) => option.name || ''}
        getOptionSelected={(option) => option.id === selected.City.id}
        withoutSearchButton
        onChange={(event, newValue) => {
          setSelected(newValue && newValue);
          setCityId(newValue ? newValue.id : '');
          if (newValue && newValue)
            GetDistrict(newValue.id);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};
