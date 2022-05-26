import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../../Enums';
import { ImagesGalleryAlbumsCardComponent } from '../../../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { UnitsSalesProfileManagementDialog } from '../../../../Common/UnitsSalesProfileManagementDialog/UnitsSalesProfileManagementDialog';
import { GetAllFloorPlansImagesCategoryByUnitId } from '../../../../../../../../Services';
import { GetParams } from '../../../../../../../../Helper';
import { Spinner } from '../../../../../../../../Components';
import { FlootPlanCategory } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const FloorPlansImagesTabComponent = ({
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
  const GetAllFloorPlansImages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllFloorPlansImagesCategoryByUnitId(+GetParams('id'));
    if (!(response && response.status && response.status !== 200)) {
      setHideIcon(true);
      setIsLoading(true);
      setResult(response || []);
      setIsLoading(false);
    } else {
      setHideIcon(false);
      setResult([]);
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    GetAllFloorPlansImages();
  }, [GetAllFloorPlansImages]);

  const onAddNewclick = useCallback((item) => {
    setActiveItem(item);
    setIsOpenManagementDialog(true);
  });

  return (
    <div className='FloorPlansImagesTabComponent'>
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
          hideIcon={hideIcon}
          isData={isData}
          updateData={GetAllFloorPlansImages}
          WithUnitDetails
          hidePhotosTooltip
          fromUnit={fromUnit}
          ImageCategoryLookup={FlootPlanCategory}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          data={result}
          setdata={setResult}
          Display={UnitProfileImagesCardActionEnum.Show}
        />
      ) : (
        <div className='EmptyPage' />
      )}
      {(isOpenManagementDialog && uploader) || hideIcon ? (
        <UnitsSalesProfileManagementDialog
          updateData={GetAllFloorPlansImages}
          propertyId={propertyId}
          setIsdata={setIsdata}
          ImageCategoryLookup={FlootPlanCategory}
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

FloorPlansImagesTabComponent.propTypes = {
  uploader: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertyId: PropTypes.number.isRequired,
};
