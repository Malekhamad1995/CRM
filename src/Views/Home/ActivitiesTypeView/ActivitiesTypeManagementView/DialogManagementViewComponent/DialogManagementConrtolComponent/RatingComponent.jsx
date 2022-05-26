import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { lookupItemsGetId } from '../../../../../../Services';

export const RatingComponent = ({
  parentTranslationPath,
  translationPath,
  helperText,
  setState,
  Data,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [Ratingres, setRatingres] = useState({});
  const [loadings, setloadings] = useState(false);
  const [selected, setSelected] = useState([]);

  const lookupActivityRating = useCallback(async () => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: 1212, // Lookups.,
    });
    setloadings(false);
    setRatingres(result);
  }, []);
  useEffect(() => {
    lookupActivityRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Data) {
      setSelected({
        lookupItemId: (Data && Data.activityRate) || '',
        lookupItemName: (Data && Data.activityRateName) || '',
      });
    }
    setState(Data && Data.activityRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='RatingRef'
        labelValue='Rating'
        selectedValues={selected || []}
        multiple={false}
        data={Ratingres || []}
        labelClasses='Requierd-Color'
        displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
        getOptionSelected={(option) => option.lookupItemId === selected.lookupItemId}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Rating`)}
        isLoading={loadings}
        helperText={helperText}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setState((newValue && +newValue.lookupItemId) || '');
          setSelected({
            lookupItemId: (newValue && +newValue.lookupItemId) || '',
            lookupItemName: (newValue && newValue.lookupItemName) || '',
          });
        }}
      />
    </div>
  );
};
RatingComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};
