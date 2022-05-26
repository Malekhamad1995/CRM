import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ImagesGalleryFilterEnum } from '../../../../../../../../Enums';

export const ImagesGalleryPhotosTooltipComponent = ({
  fromPage,
  data,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  return (
    <div className='photo-tooltip-wrapper presentational-wrapper'>
      <div className='photo-tooltip-item'>
        <span>
          <span className='title-text'>{t(`${translationPath}country`)}</span>
          <span className='px-1'>:</span>
          <span className='value-text'>{data.countryName || 'N/A'}</span>
        </span>
      </div>
      <div className='photo-tooltip-item'>
        <span>
          <span className='title-text'>{t(`${translationPath}city`)}</span>
          <span className='px-1'>:</span>
          <span className='value-text'>{data.cityName || 'N/A'}</span>
        </span>
      </div>
      {(fromPage === ImagesGalleryFilterEnum.District.key ||
        fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
        <div className='photo-tooltip-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}district`)}</span>
            <span className='px-1'>:</span>
            <span className='value-text'>{data.districtName || 'N/A'}</span>
          </span>
        </div>
      )}
      {(fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
        <div className='photo-tooltip-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}community`)}</span>
            <span className='px-1'>:</span>
            <span className='value-text'>{data.communityName || 'N/A'}</span>
          </span>
        </div>
      )}
      {fromPage === ImagesGalleryFilterEnum.Subcommunity.key && (
        <div className='photo-tooltip-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}sub-community`)}</span>
            <span className='px-1'>:</span>
            <span className='value-text'>{data.subCommunityName || 'N/A'}</span>
          </span>
        </div>
      )}
    </div>
  );
};

ImagesGalleryPhotosTooltipComponent.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key))
    .isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
