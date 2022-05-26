import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../../../Enums';
import { ImagesGalleryAlbumsCardComponent } from '../../../../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { GetPublishedUnitImages } from '../../../../../../../../../Services';
import { GetParams } from '../../../../../../../../../Helper';
import { Spinner } from '../../../../../../../../../Components';
import { UnitImageCategory } from '../../../../../../../../../assets/json/StaticLookupsIds.json';

export const UnitImagesTabComponent = ({
  parentTranslationPath,
  translationPath,
}) => {
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isData, setIsdata] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hideIcon, setHideIcon] = useState(false);
  const { t } = useTranslation(parentTranslationPath);
  const fromUnit = true;
  const GetAllUnitImages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetPublishedUnitImages(+GetParams('id'));
    if (!(response && response.status && response.status !== 200))
      setResult(response || []);
     else setResult([]);
    setHideIcon(true);

    setIsLoading(false);
  }, []);
  useEffect(() => {
    GetAllUnitImages();
  }, [GetAllUnitImages]);

  const onAddNewclick = useCallback((item) => {
    setActiveItem(item);
    setIsOpenManagementDialog(true);
  });

  return (
    <div className='LocationImagesTabComponent'>
      <Spinner isActive={isLoading} />
      {result && result.length !== 0 ? (
        <ImagesGalleryAlbumsCardComponent
          ImageCategoryLookup={UnitImageCategory}
          hideIcon={hideIcon}
          hidePhotosTooltip
          isData={isData}
          fromUnit={fromUnit}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          data={result}
          WithUnitDetails
          updateData={GetAllUnitImages}
          setdata={setResult}
          Display={UnitProfileImagesCardActionEnum.Show}
        />
      ) : (
        <div className='EmptyPage' />
      )}
    </div>
  );
};

UnitImagesTabComponent.propTypes = {
  uploader: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertyId: PropTypes.number.isRequired,
};
UnitImagesTabComponent.defaultProps = {
  uploader: false,
};
