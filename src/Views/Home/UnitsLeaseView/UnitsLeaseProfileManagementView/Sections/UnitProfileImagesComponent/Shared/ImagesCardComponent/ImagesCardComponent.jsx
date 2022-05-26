import React, { useCallback, useState } from 'react';
import { ButtonBase } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { ActionsEnum, UnitProfileImagesCardActionEnum } from '../../../../../../../../Enums';
import { CardBodyComponent, CardFooterComponent, CardHeaderComponent } from './Presentational';
import { UnitProfileImagesDeleteDialog, UnitProfileManagementDialog } from './Dialogs';
import { FacebookGalleryComponent } from '../../../../../../../../Components';
import { ImagesGalleryPhotosTooltipComponent } from '../../../../../../ImagesGallery/Sections/ImagesGalleryPhotosComponent/ImagesGalleryPhotosCardComponent';

export const ImagesCardComponent = ({
  fromPage,
  Display,
  data,
  onPageIndexChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  // const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const onFooterActionsClicked = useCallback((key, item) => {
    if (key === ActionsEnum.edit.key) {
      setActiveItem(item);
      setIsOpenManagementDialog(true);
    } else if (key === ActionsEnum.delete.key) {
      setActiveItem(item);
      setIsOpenDeleteDialog(true);
    }
  }, []);

  const activeImageHandler = useCallback(
    (item) => () => {
      setActiveImageIndex(0);
      setPreviewImages((item && item.filteredImagesDto && item.filteredImagesDto.result) || []);
    },
    []
  );

  return (
    <div className='Leasing-images-gallery-card-wrapper shared-wrapper'>
      {data &&
        data.map((item, index) => (
          <div className='Leasing-album-card-wrapper' key={`albumCardItemRef${index + 1}`}>
            <div className='Leasing-cards-wrapper'>
              <div className='Leasing-header-body-wrapper'>
                <CardHeaderComponent
                  data={item}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />

                {Display === UnitProfileImagesCardActionEnum.Show ? (
                  <ButtonBase
                    className='btns-icon theme-solid bg-black-light mx-0'
                    onClick={activeImageHandler(item, index)}
                  >
                    <span className='mdi mdi-plus' />
                  </ButtonBase>
                ) : null}
              </div>
              <div className='cards-body-wrapper'>
                <CardBodyComponent
                  data={item}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className='footer-body-wrapper'>
                <CardFooterComponent
                  data={item}
                  Display={Display}
                  onFooterActionsClicked={onFooterActionsClicked}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            </div>
          </div>
        ))}

      {activeImageIndex !== null && previewImages.length > 0 && (
        <FacebookGalleryComponent
          data={previewImages || []}
          isOpen={(activeImageIndex !== null && previewImages.length > 0 && true) || false}
          activeImageIndex={activeImageIndex}
          imageInput='fileId'
          altInput='fileName'
          titleText='preview-images'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          activeImageTooltipComponent={() =>
            (data && data[0] && (
              <ImagesGalleryPhotosTooltipComponent
                data={data[0]}
                fromPage={fromPage}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            )) ||
            undefined}
          onOpenChanged={() => {
            // setActiveImage(null);
            setActiveImageIndex(null);
          }}
        />
      )}
      {isOpenManagementDialog && (
        <UnitProfileManagementDialog
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            onPageIndexChanged(0);
            setActiveItem(null);
            setIsOpenManagementDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenDeleteDialog && (
        <UnitProfileImagesDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenDeleteDialog}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            onPageIndexChanged(0);
            setActiveItem(null);
            setIsOpenDeleteDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

ImagesCardComponent.propTypes = {
  fromPage: PropTypes.instanceOf(Object),
  Display: PropTypes.instanceOf(UnitProfileImagesCardActionEnum).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesCardComponent.defaultProps = {
  fromPage: '',
};
