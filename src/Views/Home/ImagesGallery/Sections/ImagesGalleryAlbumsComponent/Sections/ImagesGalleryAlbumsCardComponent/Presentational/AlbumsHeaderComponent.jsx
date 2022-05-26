import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ImagesGalleryFilterEnum } from '../../../../../../../../Enums';

export const AlbumsHeaderComponent = ({
  fromPage,
  data,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='albums-header-wrapper presentational-wrapper'>
      {fromPage === ImagesGalleryFilterEnum.City.key && (
        <span className='albums-header-title'>
          <span className='title-text'>{t(`${translationPath}city`)}</span>
          <span>:</span>
          <span className='value-text px-1'>{data.cityName || 'N/A'}</span>
        </span>
      )}
      {fromPage === ImagesGalleryFilterEnum.District.key && (
        <span className='albums-header-title'>
          <span className='title-text'>{t(`${translationPath}district`)}</span>
          <span>:</span>
          <span className='value-text px-1'>{data.districtName || 'N/A'}</span>
        </span>
      )}
      {fromPage === ImagesGalleryFilterEnum.Community.key && (
        <span className='albums-header-title'>
          <span className='title-text'>{t(`${translationPath}community`)}</span>
          <span>:</span>
          <span className='value-text px-1'>{data.communityName || 'N/A'}</span>
        </span>
      )}
      {fromPage === ImagesGalleryFilterEnum.Subcommunity.key && (
        <span className='albums-header-title'>
          <span className='title-text'>{t(`${translationPath}sub-community`)}</span>
          <span>:</span>
          <span className='value-text px-1'>{data.subCommunityName || 'N/A'}</span>
        </span>
      )}
    </div>
  );
};

AlbumsHeaderComponent.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key))
    .isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
