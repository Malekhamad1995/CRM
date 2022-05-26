import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../../Enums';
import { GetAllPropertyImagesCategoryByPropertyId } from '../../../../../../../../Services';
import { ImagesGalleryAlbumsCardComponent } from '../../../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { Spinner } from '../../../../../../../../Components';
import { UnitImageCategory } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const PropertyImagesTabComponent = ({
  parentTranslationPath,
  translationPath,
  propertyId,
}) => {
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const GetAllPropertyImagesCategory = useCallback(async () => {
    const response = await GetAllPropertyImagesCategoryByPropertyId(propertyId);
    setIsLoading(true);
    setResult(response);
    setIsLoading(false);
  }, [propertyId]);

  useEffect(() => {
    GetAllPropertyImagesCategory();
  }, [GetAllPropertyImagesCategory]);
  return (
    <div className='PropertyImagesTabComponent'>
      <Spinner isActive={isLoading} />
      {result && result.length > 0 ? (
        <ImagesGalleryAlbumsCardComponent
          hidePhotosTooltip
          onIconImageClick
          hideIcon
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          data={result}
          WithUnitDetails
          ImageCategoryLookup={UnitImageCategory}
          isData
          fromUnit
          setdata={setResult}
          Display={UnitProfileImagesCardActionEnum.Hide}
          propertyId={propertyId}
        />
      ) : (
        <div className='EmptyPage' />
      )}
    </div>
  );
};
PropertyImagesTabComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertyId: PropTypes.number.isRequired,
};
