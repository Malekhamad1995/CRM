import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckboxesComponent, Inputs, LoadableImageComponant } from '../../../../Components';
import { ContactTypeEnum, LoadableImageEnum } from '../../../../Enums';
import { getDownloadableLink } from '../../../../Helper';

export const BulkSelectedUnitsSection = ({
  unitCards,
  unitStatus,
  bulkedUnits,
  translationPath,
  onUnitCardsChange,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [searchedItemId, setSearchedItemId] = useState('');
  const searchTimer = useRef(null);
  const searchedItemRef = useRef(null);
  const getDefaultUnitImage = useCallback(
    (unitType) => ContactTypeEnum[unitType] && ContactTypeEnum[unitType].defaultImg,
    []
  );
  const cardCheckboxClicked = useCallback(
    (element) => {
      onUnitCardsChange((items) => {
        const index = items.findIndex((item) => item.id === element.id);
        if (index !== -1) {
          items.splice(index, 1);
          setSearchedItemId('');
        } else items.push(element);
        return [...items];
      });
    },
    [onUnitCardsChange]
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
    (item) => {
      if (unitCards.findIndex((el) => el.id === item.id) !== -1) return true;
      return false;
    },
    [unitCards]
  );
  return (
    <div>
      <div className='bulk-header-section'>{t(`${translationPath}selected-units`)}</div>
      <div className='bulk-sub-header-section'>
        {t(`${translationPath}you-can-deselect-unit-before-continue`)}
      </div>
      <div className='mt-2'>
        <Inputs
          idRef='unitsSearchRef'
          inputPlaceholder='search-units'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onKeyUp={(e) => searchHandler(e.target.value)}
          startAdornment={<span className='mdi mdi-magnify mdi-24px c-gray' />}
        />
      </div>
      <div className='bulked-units-section mt-2'>
        {bulkedUnits &&
          bulkedUnits.map((item, index) => (
            <div
              onClick={(event) => {
                event.preventDefault();
                if (unitStatus.success.findIndex((el) => el === item.id) === -1)
                  cardCheckboxClicked(item);
              }}
              ref={
                searchedItemId.length > 0 &&
                item.refNo.toLowerCase().includes(searchedItemId.toLowerCase()) ?
                  searchedItemRef :
                  null
              }
              className={`bulked-unit-item ${
                unitStatus.success.findIndex((el) => el === item.id) !== -1 &&
                'success-bulked-unit-item'
              } 
              ${
                unitStatus.failure.findIndex((el) => el === item.id) !== -1 &&
                'failed-bulked-unit-item'
              }
              mb-3 ${
                searchedItemId.length > 0 &&
                item.refNo.toLowerCase().includes(searchedItemId.toLowerCase()) ?
                  'is-search' :
                  ''
              } `}
              key={`unitsItemRef${index + 1}`}
            >
              <div className='card-checkbox-wrapper'>
                <CheckboxesComponent
                  isDisabled={unitStatus.success.findIndex((el) => el === item.id) !== -1}
                  singleChecked={getIsChecked(item)}
                  idRef={`unitsCheckboxItemRef${index + 3}`}
                />
              </div>
              <div className='body-item-wrapper'>
                <div className='body-image-item'>
                  <LoadableImageComponant
                    classes='cover-image'
                    type={LoadableImageEnum.div.key}
                    alt={t(`${translationPath}unit-image`)}
                    src={
                      (item.allunitImages && getDownloadableLink(item.allunitImages.fileId)) ||
                      getDefaultUnitImage(item.type)
                    }
                  />
                </div>
              </div>
              <div>
                <div className='item-ref-no pl-2 pr-2 mt-1'>{item.refNo}</div>
                <div className='item-name pl-2 pr-2 mt-2'>
                  {t(`${translationPath}id`)}
                  {item.id}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
BulkSelectedUnitsSection.propTypes = {
  onUnitCardsChange: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  unitCards: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  unitStatus: PropTypes.instanceOf(Object).isRequired,
  bulkedUnits: PropTypes.instanceOf(Array).isRequired,
};
