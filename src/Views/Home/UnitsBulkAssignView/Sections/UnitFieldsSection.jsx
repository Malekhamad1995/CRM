import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs, CheckboxesComponent } from '../../../../Components';
import { UnitRefNumberformFieldIdEnum } from '../../../../Enums';

export const UnitFieldsSection = ({
  formFields,
  formFieldIds,
  unitDetails,
  setFormFieldIds,
  translationPath,
  setIntUnitDetails,
  setFormFieldsData,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [searchedItemId, setSearchedItemId] = useState('');
  const searchTimer = useRef(null);
  const searchedItemRef = useRef(null);
  const cardCheckboxClicked = useCallback(
    (element) => {
      setFormFieldsData((items) => {
       if(items.filter(f=>f.formFieldId ===element.formFieldId ).length ===0)
        return [...items , element];
       else
       {
         const index = items.findIndex(f=>f.formFieldId ===element.formFieldId);
         items.splice(index,1);
         return [...items ];
       }

      });
      setFormFieldIds((items) => {
        const index = items.findIndex((item) => item.formFieldId === element.formFieldId);
        if (index === -1) items.push(element);
        else {
          items.splice(index, 1);
          setSearchedItemId('');
        }
        return [...items];
      });
      setIntUnitDetails((items) => {
        const index = items.findIndex((item) => item === element.formFieldName);
        if (index === -1) items.push(element.formFieldName);
        else {
          items.splice(index, 1);
          delete unitDetails[element.formFieldName];
        }
        return [...items];
      });
    },
    [setFormFieldIds, setFormFieldsData, setIntUnitDetails, unitDetails]
  );
  const executeScroll = () =>
    searchedItemRef &&
    searchedItemRef.current &&
    searchedItemRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  const searchHandler = (value) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchedItemId(value);
      executeScroll();
    }, 500);
  };
  const getIsChecked = useCallback(
    (item) => formFieldIds.findIndex((el) => el.formFieldId === item.formFieldId) !== -1,
    [formFieldIds]
  );
  return (
    <div>
      <div className='bulk-header-section'>{t(`${translationPath}unit-fields`)}</div>
      <div className='bulk-sub-header-section'>
        {t(`${translationPath}choose-one-of-the-following-fields`)}
      </div>
      <div className='mt-2'>
        <Inputs
          idRef='unitsSearchRef'
          inputPlaceholder='search-fields'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onKeyUp={(e) => searchHandler(e.target.value)}
          startAdornment={<span className='mdi mdi-magnify mdi-24px c-gray' />}
        />
      </div>
      <div className='bulked-units-section mt-3'>
        {formFields &&
          formFields.map(
            (item, index) =>
              item.formFieldId !== UnitRefNumberformFieldIdEnum.formFieldId && (
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    cardCheckboxClicked(item);
                  }}
                  ref={
                    searchedItemId.length > 0 &&
                    item.formFieldTitle.toLowerCase().includes(searchedItemId.toLowerCase()) ?
                      searchedItemRef :
                      null
                  }
                  className={`unit-fields-item mb-3 ${getIsChecked(item) ? 'is-cheked' : ''} ${
                    searchedItemId.length > 0 &&
                    item.formFieldTitle.toLowerCase().includes(searchedItemId.toLowerCase()) ?
                      'is-search' :
                      ''
                  } `}
                  key={`unitsItemRef${index + 1}`}
                >
                  <div
                    className='unit-fields-card-checkbox-wrapper'
                    key={`unitsCheckItemRef${index + 2}`}
                  >
                    <CheckboxesComponent
                      singleChecked={getIsChecked(item)}
                      idRef={`fieldsCheckboxItemRef${index + 3}`}
                    />
                  </div>
                  <div className='item-ref-no pl-2 pr-2 mt-1'>{item.formFieldTitle}</div>
                </div>
              )
          )}
      </div>
    </div>
  );
};
UnitFieldsSection.propTypes = {
  setFormFieldIds: PropTypes.func.isRequired,
  setIntUnitDetails: PropTypes.func.isRequired,
  setFormFieldsData: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  formFields: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  unitDetails: PropTypes.instanceOf(Object).isRequired,
  formFieldIds: PropTypes.instanceOf(Array).isRequired,
};
