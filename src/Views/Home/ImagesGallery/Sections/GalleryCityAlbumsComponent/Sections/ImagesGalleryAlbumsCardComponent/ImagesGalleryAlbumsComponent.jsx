import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { ActionsEnum, ImagesGalleryFilterEnum } from '../../../../../Enums';
import {
  AlbumsBodyComponent,
  AlbumsFooterComponent,
  AlbumsHeaderComponent,
} from './Presentational';
import { GalleryAlbumDeleteDialog } from './Dialogs';
import { FacebookGalleryComponent } from '../../../../../Components';

export const ImagesGalleryAlbumsComponent = ({
  fromPage,
  data,
  onPageIndexChanged,
  onActiveItemChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  // const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const onFooterActionsClicked = useCallback(
    (key, item) => {
      if (key === ActionsEnum.edit.key && onActiveItemChanged) onActiveItemChanged(item);
      else if (key === ActionsEnum.delete.key) {
        setActiveItem(item);
        setIsOpenDeleteDialog(true);
      }
    },
    [onActiveItemChanged]
  );
  const activeImageHandler = useCallback(
    (item) => () => {
      setActiveImageIndex(0);
      setPreviewImages((item && item.filteredImagesDto && item.filteredImagesDto.result) || []);
    },
    []
  );

  return (
    <div className='images-gallery-albums-wrapper shared-wrapper'>
      {data &&
        data.map((item, index) => (
          <div className='album-card-wrapper' key={`albumCardItemRef${index + 1}`}>
            <div className='cards-wrapper'>
              <div className='header-body-wrapper'>
                <AlbumsHeaderComponent
                  data={item}
                  fromPage={fromPage}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <ButtonBase
                  className='btns-icon theme-solid bg-black-light mx-0'
                  onClick={activeImageHandler(item, index)}
                >
                  <span className='mdi mdi-plus' />
                </ButtonBase>
              </div>
              <div className='cards-body-wrapper'>
                <AlbumsBodyComponent
                
                  data={item}
                  fromPage={fromPage}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className='footer-body-wrapper'>
                <AlbumsFooterComponent
                  data={item}
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
      {isOpenDeleteDialog && (
        <GalleryAlbumDeleteDialog
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

ImagesGalleryAlbumsComponent.propTypes = {
  data: PropTypes.instanceOf(Array),
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key)),
  onActiveItemChanged: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesGalleryAlbumsComponent.defaultProps = {
  data: [],
  fromPage: ImagesGalleryFilterEnum.City.key,
  //   imageInput: 'imagePath',
  //   altInput: 'fileName',
};
