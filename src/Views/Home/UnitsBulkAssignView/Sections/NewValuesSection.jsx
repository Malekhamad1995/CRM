import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConvertJsonV2Component } from '../../../../Components';
import { LookupsRules } from '../../../../Rule';

export const NewValuesSection = ({
  errors,
  formData,
  setFormData,
  unitDetails,
  isSubmitted,
  setUnitDetails,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loadings, setLoadings] = useState([]);
  const onItemChanged = (item, index) => (newValue, itemIndex, itemKey, parentItemKey) => {
    setFormData((elements) => {
      if (parentItemKey) {
        if (itemIndex !== undefined) elements[0][itemIndex][parentItemKey][itemKey] = newValue;
        else elements[0][index][parentItemKey][itemKey] = newValue;
      } else if (itemIndex) elements[0][itemIndex][itemKey] = newValue;
      return [...elements];
    });
  };
  // const onValueChanged = (item) => (newValue, itemIndex) => {
  //   setUnitDetails((items) => {
  //     if ((itemIndex || itemIndex === 0) && itemIndex !== -1)
  //       items[formData.flat().field.id] = newValue;
  //     else items[item.field.id] = newValue;
  //     return { ...items };
  //   });
  // };

  const onValueChanged = (item) => (newValue, itemIndex) => {
    if (newValue !== '') {
      setUnitDetails((items) => {
        if ((itemIndex || itemIndex === 0) && itemIndex !== -1)
          items[formData && formData.flat() && formData.flat().field && formData.flat().field.id] = newValue;
        else items[item.field.id] = newValue;
        return { ...items };
      });
    }
  };
  const onLoadingsChanged = useCallback((value, key) => {
    setLoadings((items) => {
      const itemIndex = items.findIndex((item) => item.key === key);
      if (value) {
        const addItem = {
          key,
          value,
        };
        if (itemIndex !== -1) items[itemIndex] = addItem;
        else items.push(addItem);
      } else if (itemIndex !== -1) items.splice(itemIndex, 1);
      return [...items];
    });
  }, []);
  const lookupInit = useCallback(() => {
    LookupsRules(formData.flat(), unitDetails, onLoadingsChanged);
  }, [formData, onLoadingsChanged, unitDetails]);
  useEffect(() => {
    if (formData && formData.flat() && formData.flat().length > 0) lookupInit();
  }, [formData, lookupInit]);
  return (
    <div>
      <div className='bulk-header-section'>{t(`${translationPath}new-values`)}</div>
      <div className='bulk-sub-header-section'>
        {t(`${translationPath}add-new-value-to-the-following-fields`)}
      </div>
      <div className='bulked-units-section new-value-section mt-3'>
        {formData &&
          formData.length > 0 &&
          formData.flat().length > 0 &&
          formData
            .flat()
            .filter((item) => item)
            .map((item, index) => (
              <div className='mb-3' key={`unitNewValueItemRef${index + 1}`}>
                <ConvertJsonV2Component
                  item={item}
                  isSubmitted={isSubmitted}
                  allItems={formData.flat().filter((element) => element)}
                  key={`unitForms${index + 2}`}
                  allItemsValues={unitDetails}
                  onItemChanged={onItemChanged(item, index)}
                  itemValue={
                    (item && item.field && item.field.id && unitDetails[item.field.id]) || ''
                  }
                  onValueChanged={onValueChanged(item, index)}
                  isLoading={
                    loadings.findIndex(
                      (element) => item && element.key === item.field.id && element.value
                    ) !== -1
                  }
                  onLoadingsChanged={onLoadingsChanged}
                  helperText={
                    (errors.find((element) => item && element.key === item.field.id) &&
                      errors.find((element) => item && element.key === item.field.id).message) ||
                    ''
                  }
                  error={
                    errors.findIndex((element) => item && element.key === item.field.id) !== -1
                  }
                />
              </div>
            ))}
      </div>
    </div>
  );
};
NewValuesSection.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
  setFormData: PropTypes.func.isRequired,
  setUnitDetails: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Array).isRequired,
  formData: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  unitDetails: PropTypes.instanceOf(Object).isRequired,
};
