import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../../Enums';
import { ImagesGalleryAlbumsCardComponent } from '../../../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { UnitsSalesProfileManagementDialog } from '../../../../Common/UnitsSalesProfileManagementDialog/UnitsSalesProfileManagementDialog';
import { GetAllGeneralImagesCategoryByUnitId } from '../../../../../../../../Services';
import { GetParams } from '../../../../../../../../Helper';
import { Spinner } from '../../../../../../../../Components';
import { GenralImageCategory } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const GeneralImagesTabComponent = ({
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
  const GetAllGeneralImages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllGeneralImagesCategoryByUnitId(+GetParams('id'));
    if (!(response && response.status && response.status !== 200)) setResult(response || []);
    else setResult([]);
    setHideIcon(true);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    GetAllGeneralImages();
  }, [GetAllGeneralImages]);

  const onAddNewclick = useCallback((item) => {
    setActiveItem(item);
    setIsOpenManagementDialog(true);
  });

  return (
    <div className='GeneralImagesTabComponent'>
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
          hidePhotosTooltip
          ImageCategoryLookup={GenralImageCategory}
          hideIcon={hideIcon}
          updateData={GetAllGeneralImages}
          WithUnitDetails
          isData={isData}
          fromUnit={fromUnit}
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
          ImageCategoryLookup={GenralImageCategory}
          updateData={() => GetAllGeneralImages()}
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

GeneralImagesTabComponent.propTypes = {
  uploader: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertyId: PropTypes.number.isRequired,
};
