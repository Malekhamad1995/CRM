import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ImagesGalleryFilterEnum } from '../../../../../../../../Enums';

export const AlbumsBodyComponent = ({
 fromPage, data, parentTranslationPath, translationPath
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='albums-body-wrapper presentational-wrapper'>
      <div className='unit-images-body-item'>
        {(data.categoryName && (
        <span>
          <span className='value-text px-1'>{data.categoryName || 'N/A'}</span>
        </span>
      )
) || '' }

      </div>

      {fromPage ? (
        <div className='albums-body-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}country`)}</span>
            <span>:</span>
            <span className='value-text px-1'>{data.countryName || 'N/A'}</span>
          </span>
        </div>
      ) : null}

      {(fromPage === ImagesGalleryFilterEnum.District.key ||
        fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
        <div className='albums-body-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}city`)}</span>
            <span>:</span>
            <span className='value-text px-1'>{data.cityName || 'N/A'}</span>
          </span>
        </div>
      )}
      {(fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
        <div className='albums-body-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}district`)}</span>
            <span>:</span>
            <span className='value-text px-1'>{data.districtName || 'N/A'}</span>
          </span>
        </div>
      )}
      {fromPage === ImagesGalleryFilterEnum.Subcommunity.key && (
        <div className='albums-body-item'>
          <span>
            <span className='title-text'>{t(`${translationPath}community`)}</span>
            <span>:</span>
            <span className='value-text px-1'>{data.communityName || 'N/A'}</span>
          </span>
        </div>
      )}
      <div className='albums-body-item entered-item'>
        <span>
          <span className='title-text'>{t(`${translationPath}entered-by`)}</span>
          <span>:</span>
          <span className='value-text px-1'>{data.createdBy || 'N/A'}</span>
        </span>
      </div>
    </div>
  );
};

AlbumsBodyComponent.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key))
    .isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
