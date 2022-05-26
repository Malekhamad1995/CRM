import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../../../../Components';
import { AgentRotationRangeTypeEnum } from '../../../../../../Enums';


export const RotationDetalisCardsComponent = ({
  parentTranslationPath,
  translationPath,
  rotationCriteria,
  loading,
}) => {
  const [rangePrice, setRangePrice] = useState(null);
  const [rangeSize, setRangeSize] = useState(null);
  const [bathroomsRange, setBathroomsRange] = useState(null);
  const [bedroomsRange, setBedroomsRange] = useState(null);


  useEffect(() => {
    const price = rotationCriteria && rotationCriteria.rotationSchemeRanges
      && rotationCriteria.rotationSchemeRanges.length > 0
      && rotationCriteria.rotationSchemeRanges.find((r) => r.agentRotationRangeTypeId === AgentRotationRangeTypeEnum.PriceRange.key);
    setRangePrice(price);

    const size = rotationCriteria && rotationCriteria.rotationSchemeRanges
      && rotationCriteria.rotationSchemeRanges.length > 0
      && rotationCriteria.rotationSchemeRanges.find((r) => r.agentRotationRangeTypeId === AgentRotationRangeTypeEnum.Size.key);
    setRangeSize(size);

    const bathrooms = rotationCriteria && rotationCriteria.rotationSchemeRanges
      && rotationCriteria.rotationSchemeRanges.length > 0
      && rotationCriteria.rotationSchemeRanges.find((r) => r.agentRotationRangeTypeId === AgentRotationRangeTypeEnum.Bathroom.key);
    setBathroomsRange(bathrooms);

    const bedrooms = rotationCriteria && rotationCriteria.rotationSchemeRanges
      && rotationCriteria.rotationSchemeRanges.length > 0
      && rotationCriteria.rotationSchemeRanges.find((r) => r.agentRotationRangeTypeId === AgentRotationRangeTypeEnum.Bedroom.key);
    setBedroomsRange(bedrooms);
  }, [rotationCriteria]);

  const { t } = useTranslation(parentTranslationPath);
  const repeated = (list, filed) =>
    list &&
    list.map((item, index) => (
      <span>
        {' '}
        {item[filed]}
        {' '}
        {list.length - 1 != index && <span> , </span>}
      </span>
    ));

  const priceRangesRepeated = (list) =>
    list &&
    list.map((item, index) => (
      <div>
        <span>
          {' '}
          {t(`${translationPath}From`)}
          {' '}
          :
          {' '}
          {item.startValue}
          {' '}
        </span>
        <span>
          {' '}
          {t(`${translationPath}To`)}
          {' '}
          :
          {' '}
          {item.endValue}
          {' '}
        </span>
        {list.length - 1 != index && <span> , </span>}
      </div>
    ));

  const RangesValues = (value) =>
    value && (
    <div>
      <span>
        {' '}
        {t(`${translationPath}From`)}
        {' '}
        :
        {' '}
        {value.startValue || 0}
        {' '}
      </span>
      <span>
        {' '}
        {t(`${translationPath}To`)}
        {' '}
        :
        {' '}
        {value.endValue || 0}
        {' '}
      </span>
    </div>
  );

  return (
    <div className='rotationDetalis-cards-wrapper childs-wrapper'>
      <Spinner isActive={loading} isAbsolute />
      <div className='card'>
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}rotation-label`)}</span>
          <span className='column2'>
            {rotationCriteria && rotationCriteria.label}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}mediaName_`)}</span>
          <span className='column2'>
            {(rotationCriteria && rotationCriteria.medias && repeated(rotationCriteria.medias.filter((w) => w.mediaId), 'mediaName')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}mediaDetails_`)}</span>
          <span className='column2'>
            {(rotationCriteria && rotationCriteria.medias && repeated(rotationCriteria.medias.filter((w) => w.mediaDetailsId), 'mediaDetails')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}leadClass`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.leadClasses, 'lookupItemName')) ||
              '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}lead-preferred-language`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.languages, 'lookupItemName')) || '---'}
          </span>
        </div>
        <hr />

        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}country`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.countries, 'lookupItemName')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}city`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.cities, 'lookupItemName')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}district`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.districts, 'lookupItemName')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}community`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.communities, 'lookupItemName')) ||
              '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}subCommunity`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.subCommunities, 'lookupItemName')) ||
              '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}property`)}</span>
          <span className='column2'>
            {(rotationCriteria && rotationCriteria.properties && rotationCriteria.properties.length > 0 && repeated(rotationCriteria.properties, 'propertyName')) ||
              '---'}
          </span>
        </div>
        <hr />

        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}developer`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.developers, 'developerName')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}unitType`)}</span>
          <span className='column2'>
            {(rotationCriteria && repeated(rotationCriteria.unitTypes, 'lookupItemName')) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}priceRange`)}</span>
          <span className='column2'>
            {(rangePrice && RangesValues(rangePrice)) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}bedrooms`)}</span>
          <span className='column2'>
            {(bedroomsRange && RangesValues(bedroomsRange)) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}bathrooms`)}</span>
          <span className='column2'>
            {(bathroomsRange && RangesValues(bathroomsRange)) || '---'}
          </span>
        </div>
        <hr />
        <div className='section-item section-item-responsive'>
          <span className='column1'>{t(`${translationPath}areaPriceRange`)}</span>
          <span className='column2'>
            {(rangeSize && RangesValues(rangeSize)) || '---'}
          </span>
        </div>
        <hr />
      </div>
    </div>
  );
};

const convertJsonValueShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
  PropTypes.string,
]);

RotationDetalisCardsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  rotationCriteria: PropTypes.objectOf(convertJsonValueShape).isRequired,
  loading: PropTypes.bool.isRequired,
};
