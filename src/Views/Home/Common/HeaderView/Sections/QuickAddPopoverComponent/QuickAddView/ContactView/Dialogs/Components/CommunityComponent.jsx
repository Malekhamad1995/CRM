import React, { useEffect } from 'react';
import { AutocompleteComponent } from '../../../../../../../../../../Components';

export const CommunityComponent = ({
  parentTranslationPath,
  translationPath,
  communityId,
  setCommunityId,
  selected,
  setSelected,
  communityList,
}) => {
  useEffect(() => {
    if (communityId && !selected.Community && communityList.length > 0) {
      const communityIndex = communityList.findIndex(
        (item) => item.id === communityId
      );

      if (communityIndex !== -1) setSelected(communityList[communityIndex]);
      else setCommunityId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId, selected.Community, setSelected, setCommunityId]);

  return (
    <div>
      <AutocompleteComponent
        idRef='communityRef'
        labelValue='community'
        selectedValues={selected.Community}
        data={communityList && communityList ? communityList : []}
        displayLabel={(option) => option.name || ''}
        getOptionSelected={(option) => option.id === selected.Community.id}
        multiple={false}
        withoutSearchButton
        onChange={(event, newValue) => {
          setSelected(newValue && newValue);
          setCommunityId(newValue ? newValue.id : '');
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};
