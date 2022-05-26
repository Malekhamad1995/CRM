import React, { useState, useEffect, useCallback } from 'react';
import { SalutationEnum } from '../../../../../../../../../../Enums';
import { SelectComponet } from '../../../../../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../../../../../Services/LookupsServices';

export const TitleComponent = ({
  parentTranslationPath,
  translationPath,
  setSalutationId,
  salutationId,
  selected,
  setSelected,
  isSubmitted,
  helperText,
  error,
  setIsInValidSalutation,
  isInValidSalutation,
  labelClasses
}) => {
  // const { t } = useTranslation([parentTranslationPath, 'Shared']);
    // eslint-disable-next-line no-unused-vars
  const [loadings,
    setLoadings] = useState(false);
  const [salutations, setSalutations] = useState([]);

  const GetSalutations = useCallback(async () => {
    setLoadings(true);
    const res = await lookupItemsGetId({
      lookupTypeId: SalutationEnum.lookupTypeId,
    });

    if (!(res && res.status && res.status !== 200)) {
      setSalutations(
        res.map((item) => ({
          id: item.lookupItemId,
          name: item.lookupItemName,
        }))
      );
    } else
      setSalutations([]);

    setLoadings(false);
  }, []);

  useEffect(() => {
    GetSalutations('');
  }, [GetSalutations]);

  useEffect(() => {
    if (salutationId && !selected.Title && salutations.length > 0) {
      const salutationIndex = salutations.findIndex(
        (item) => item.id === salutationId
      );
      if (salutationIndex !== -1) setSelected(salutations[salutationIndex]);
      else setSalutationId(null);
    }
  }, [salutations, salutationId, selected.Title, setSelected, setSalutationId]);

  return (
    <div>
      <SelectComponet
        value={salutationId}
        emptyItem={{ value: 0, text: 'select-salutation', isDisabled: false }}
        // themeClass={isInValidSalutation ? "invalid" : "theme-default"}
        // menuClasses={isInValidSalutation ? "invalid" : "theme-default"}
        defaultValue={[]}
        data={salutations && salutations.length > 0 ? salutations : []}
        labelValue='salutation'
        labelClasses={labelClasses}
        idRef='salutationRef'
        valueInput='id'
        textInput='name'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onSelectChanged={(event, newValue) => {
          setSelected(newValue && newValue);
          if (event)
            setIsInValidSalutation(false);
          else
            setIsInValidSalutation(true);

          setSalutationId(event || '');
        }}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
      />
    </div>
  );
};
