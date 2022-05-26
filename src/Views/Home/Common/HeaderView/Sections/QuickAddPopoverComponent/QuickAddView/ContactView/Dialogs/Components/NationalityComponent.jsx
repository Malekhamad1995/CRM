import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NationalityEnum } from '../../../../../../../../../../Enums';
import { lookupItemsGetId } from '../../../../../../../../../../Services/LookupsServices';
import {
  AutocompleteComponent,
} from '../../../../../../../../../../Components';

export const NationalityComponent = ({
  parentTranslationPath,
  translationPath,
  nationalityId,
  setNationalityId,
  selected,
  setSelected,
  isSubmitted,
  helperText,
  error,
  // isLoading,
  setIsLoading,
  labelClasses
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [nationalities, setNationalities] = useState([]);

  const GetNationalities = useCallback(async () => {
    setIsLoading(true);

    const res = await lookupItemsGetId({
      lookupTypeId: NationalityEnum.lookupTypeId,
    });

    if (!(res && res.status && res.status !== 200)) {
      setNationalities(
        res.map((item) => ({
          id: item.lookupItemId,
          name: item.lookupItemName,
          code: item.lookupItemCode,
        }))
      );
    } else
      setNationalities([]);

    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    GetNationalities('');
  }, [GetNationalities]);

  useEffect(() => {
    if (nationalityId && !selected.Nationality && nationalities.length > 0) {
      const nationalityIndex = nationalities.findIndex(
        (item) => item.id === nationalityId
      );

      if (nationalityIndex !== -1) setSelected(nationalities[nationalityIndex]);
      else setNationalityId(null);
    }
  }, [
    nationalities,
    nationalityId,
    selected.Nationality,
    setSelected,
    setNationalityId,
  ]);

  return (
    <div>
      <AutocompleteComponent
        labelClasses={labelClasses}
        idRef='nationalityRef'
        labelValue={t(`${translationPath}Nationality`)}
        selectedValues={(selected && selected.Nationality) || []}
        value={nationalityId}
        data={nationalities && nationalities.length > 0 ? nationalities : []}
        displayLabel={(option) => (option.name && option.name) || ''}
        getOptionSelected={(option) => option.id === (selected && selected.Nationality && selected.Nationality.id)}
        multiple={false}
        withoutSearchButton
        onChange={(event, newValue) => {
          setSelected(newValue && newValue);
          setNationalityId(newValue && newValue ? newValue.id : '');
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isWithError
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
      />
    </div>
  );
};
