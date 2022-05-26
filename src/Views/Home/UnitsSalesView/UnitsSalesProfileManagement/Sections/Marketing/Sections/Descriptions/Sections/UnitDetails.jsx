import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { formatCommas } from '../../../../../../../../../Helper/formatCommas.Helper';

export const UnitDetails = ({ activeItem, parentTranslationPath, translationPath }) => {
  const { t } = useTranslation([parentTranslationPath]);
  return (
    <div className='marketing-documentation-unit-details-wrapper presentational-wrapper'>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}unit-details`)}</span>
      </div>
      <div className='box-wrapper'>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}property`)}</span>
          <span>:</span>
          <span className='px-1'>{(activeItem && activeItem.name) || 'N/A'}</span>
        </div>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}bedrooms`)}</span>
          <span>:</span>
          <span className='px-1'>
            {(activeItem && activeItem.unitItem && activeItem.unitItem.bedrooms) || 'N/A'}
          </span>
        </div>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}floor-number`)}</span>
          <span>:</span>
          <span className='px-1'>
            {(activeItem && activeItem.unitItem && activeItem.unitItem.floor_number) || 'N/A'}
          </span>
        </div>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}builtup-area-SQFT`)}</span>
          <span>:</span>
          <span className='px-1'>
            {(activeItem && activeItem.unitItem && activeItem.unitItem.builtup_area_sqft) || 'N/A'}
          </span>
        </div>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}price`)}</span>
          <span>:</span>
          <span className='px-1'>{(activeItem && formatCommas(activeItem.price)) || 'N/A'}</span>
        </div>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}unit-type`)}</span>
          <span>:</span>
          <span className='px-1'>{(activeItem && activeItem.unitType) || 'N/A'}</span>
        </div>
        <div className='box-item-wrapper'>
          <span>{t(`${translationPath}views`)}</span>
          <span>:</span>
          <span className='px-1'>
            {(activeItem &&
              activeItem.secondary_view &&
              `${activeItem.secondary_view.lookupItemName}`) ||
              'N/A'}
            {' '}
          </span>
          <span className='px-1'>
            {activeItem &&
              activeItem.primary_view &&
              activeItem.primary_view.map((item) => (
                <span className='px-1'>
                  <span className='px-1'>
                    ,
                  </span>
                  {item.lookupItemName}

                </span>
))}
          </span>
        </div>
      </div>
    </div>
  );
};

UnitDetails.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
UnitDetails.defaultProps = {
  activeItem: undefined,
};
