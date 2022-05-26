import React, { useState, useEffect, useCallback } from 'react';
import { CommunityTypeIdEnum } from '../../../../../../../../../../Enums';
import { AutocompleteComponent } from '../../../../../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../../../../../Services/LookupsServices';

export const DistrictComponent = ({
  parentTranslationPath,
  translationPath,
  districtId,
  setDistrictId,
  selected,
  setSelected,
  districtList,
  setCommunityList,
}) => {
  const [isLoadings, setLoadings] = useState(false);
  const [community, setCommunity] = useState([]);

  useEffect(() => {
    setCommunityList(community);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community]);

  const GetCommunity = useCallback(async (districtId) => {
    setLoadings(true);
    const res = await lookupItemsGetId({
      lookupTypeId: CommunityTypeIdEnum.lookupTypeId,
      lookupParentId: districtId,
    });

    if (!(res && res.status && res.status !== 200)) {
      setCommunity(
        res.map((item) => ({
          id: item.lookupItemId,
          name: item.lookupItemName,
        }))
      );
    } else
      setCommunity([]);

    setLoadings(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (districtId && !selected.District && districtList.length > 0) {
      const districtIndex = districtList.findIndex(
        (item) => item.id === districtId
      );
      if (districtIndex !== -1) setSelected(districtList[districtIndex]);
      else setDistrictId(null);
    }
  }, [districtList, districtId, selected.District, setSelected, setDistrictId]);

  return (
    <div>
      <AutocompleteComponent
        idRef='districtRef'
        labelValue='district'
        multiple={false}
        selectedValues={selected.District}
        data={districtList && districtList ? districtList : []}
        displayLabel={(option) => option.name || ''}
        getOptionSelected={(option) => option.id === selected.District.id}
        wrapperClasses='mx-1'
        withoutSearchButton
        onChange={(event, newValue) => {
          setSelected(newValue && newValue);
          setDistrictId(newValue ? newValue.id : '');
          if (newValue && newValue)
            GetCommunity(newValue.id);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};
