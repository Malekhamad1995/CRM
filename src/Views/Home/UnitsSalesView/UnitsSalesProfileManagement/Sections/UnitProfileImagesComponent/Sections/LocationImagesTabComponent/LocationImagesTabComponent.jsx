import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { GetAllPropertyImageLocationCategoryByPropertyId } from '../../../../../../../../Services';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../../Enums';
import { ImagesGalleryAlbumsCardComponent } from '../../../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { Spinner } from '../../../../../../../../Components';

export const LocationImagesTabComponent = ({
  parentTranslationPath,
  translationPath,
  propertyId,
}) => {
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const GetAllLocationImages = useCallback(async () => {
    const response = await GetAllPropertyImageLocationCategoryByPropertyId(propertyId);
    setIsLoading(true);
    setResult(response);
    setIsLoading(false);
  }, [propertyId]);
  useEffect(() => {
    GetAllLocationImages();
  }, [GetAllLocationImages]);

  return (
    <div className='LocationImagesTabComponent'>
      <Spinner isActive={isLoading} />
      {result && result.length > 0 ? (
        <ImagesGalleryAlbumsCardComponent
          hidePhotosTooltip
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          WithUnitDetails
          data={result.map((element) => {
            var album = {};
            album["categoryId"] = element.categoryId;
            album["categoryName"] = element.categoryName;
            album["createdBy"] = element.createdBy;
            album["images"] = element.image;
            return album;
          })}
          Display={UnitProfileImagesCardActionEnum.Hide}
        />
      ) : (
        <div className='EmptyPage' />
      )}
    </div>
  );
};
LocationImagesTabComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertyId: PropTypes.number.isRequired,
};
