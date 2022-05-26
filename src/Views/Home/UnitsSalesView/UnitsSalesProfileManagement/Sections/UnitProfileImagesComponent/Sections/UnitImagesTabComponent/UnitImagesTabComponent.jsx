import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../../Enums';
import { ImagesGalleryAlbumsCardComponent } from '../../../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { UnitsSalesProfileManagementDialog } from '../../../../Common/UnitsSalesProfileManagementDialog/UnitsSalesProfileManagementDialog';
import { GetAllUnitImagesCategoryByUnitId } from '../../../../../../../../Services';
import { GetParams } from '../../../../../../../../Helper';
import { Spinner } from '../../../../../../../../Components';
import { UnitImageCategory } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const UnitImagesTabComponent = ({
  parentTranslationPath,
  translationPath,
  propertyId,
  uploader,
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
    const response = await GetAllUnitImagesCategoryByUnitId(+GetParams('id'));
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
      <div className='LocationImagesTabComponent'>
        <div className={result && result.length > 0 ? 'Add-with-data' : 'Add'}>
          <Button className='Add-new' onClick={() => onAddNewclick()}>
            <span className='mdi mdi-plus c-white' />
            <span className='add-buttton'>{t(`${translationPath}AddNew`)}</span>
          </Button>
        </div>
      </div>
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
      {(isOpenManagementDialog && uploader) || hideIcon ? (
        <UnitsSalesProfileManagementDialog
          ImageCategoryLookup={UnitImageCategory}
          updateData={GetAllUnitImages}
          propertyId={propertyId}
          setIsdata={setIsdata}
          unit={UnitProfileImagesCardActionEnum.Show}
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
          }}
          onSave={() => {
            setActiveItem(null);
            setIsOpenManagementDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      ) : null}
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
