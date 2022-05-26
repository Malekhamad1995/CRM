import React, { useCallback, useState } from 'react';
import { ButtonBase } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import {
  ActionsEnum,
  ImagesGalleryFilterEnum,
  UnitProfileImagesCardActionEnum,
} from '../../../../../../../Enums';
import {
  AlbumsBodyComponent,
  AlbumsFooterComponent,
  AlbumsHeaderComponent,
} from './Presentational';
import { GalleryAlbumDeleteDialog } from './Dialogs';
import { ImagesGalleryPhotosTooltipComponent } from '../../../ImagesGalleryPhotosComponent/ImagesGalleryPhotosCardComponent';
import { FacebookGalleryComponent, Spinner, PermissionsComponent } from '../../../../../../../Components';
import { ImagesGalleryManagementDialog } from '../../../../Dialogs/index';
import { GetAllPropertyImages, GetAllUnitImagesCategoryByUnitId } from '../../../../../../../Services';
import { UnitsSalesProfileManagementDialog } from '../../../../../UnitsSalesView/UnitsSalesProfileManagement/Common/UnitsSalesProfileManagementDialog/UnitsSalesProfileManagementDialog';
import { GetParams } from '../../../../../../../Helper';
import { ImageGalleryPermissions } from '../../../../../../../Permissions';

export const ImagesGalleryAlbumsCardComponent = ({
  hideIcon,
  uploader,
  propertyId,
  Display,
  fromPage,
  data,
  setdata,
  onPageIndexChanged,
  parentTranslationPath,
  translationPath,
  onIconImageClick,
  HideEdit,
  isEdit,
  property,
  EdititemData,
  onClickEdit,
  hidePhotosTooltip,
  ImageCategoryLookup,
  WithUnitDetails,
  updateData
}) => {
  const [body, setBody] = useState({
    propertyId,
    categoryId: data.categoryId,
    pageIndex: 1,
    PageSize: 10,
  });
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [resResult, setResResult] = useState(null);

  const GetAllUnitImagesCategory = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllUnitImagesCategoryByUnitId(+GetParams('id'));
    if (!(response && response.status && response.status !== 200))
      setdata(response);

    setIsLoading(false);
  }, [setdata]);

  const onFooterActionsClicked = useCallback((key, item) => {
    if (key === ActionsEnum.edit.key) {
      setActiveItem(item);
      setIsOpenManagementDialog(true);
      // if (fromUnit)GetAllUnitImagesCategory();
      if (isEdit) {
        setActiveItem(item);
        EdititemData(item);
        onClickEdit();
      } else { setActiveItem(item); setIsOpenManagementDialog(true); }
    } else if (key === ActionsEnum.delete.key) {
      setActiveItem(item);
      setIsOpenDeleteDialog(true);
    }
  });
  const activeImageHandler = useCallback((activeImageList, index, item) => async () => {
    setActiveImageIndex(index);
    if (onIconImageClick) {
      const currentbody = { ...body, categoryId: item.categoryId };
      setBody(currentbody);
      const response = await GetAllPropertyImages(currentbody);
      setResResult(response);
      setPreviewImages(response.result || []);
    } else setPreviewImages(activeImageList || []);
  });
  return (
    <div className='images-gallery-albums-card-wrapper shared-wrapper'>
      <Spinner isActive={isLoading} />
      {data && data ? (
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
                {Display === (UnitProfileImagesCardActionEnum.Hide) && HideEdit ? null : (
                  <PermissionsComponent
                    permissionsList={Object.values(ImageGalleryPermissions)}
                    permissionsId={ImageGalleryPermissions.UpdateAlbum.permissionsId}
                  >
                    <ButtonBase
                      className='btns-icon theme-transparent mx-1'
                      onClick={() => onFooterActionsClicked(ActionsEnum.edit.key, item)}
                    >
                      <span className={`${ActionsEnum.edit.icon} c-black-light`} />
                    </ButtonBase>
                  </PermissionsComponent>
                )}
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
                  hideIcon={hideIcon}
                  Display={Display}
                  data={item}
                  activeImageHandler={activeImageHandler}
                  onFooterActionsClicked={onFooterActionsClicked}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='EmptyPage'> </div>
      )}
      {activeImageIndex !== null && previewImages.length > 0 && resResult !== null && previewImages && (
        <FacebookGalleryComponent
          data={previewImages || []}
          isOpen={(activeImageIndex !== null && previewImages.length > 0 && true) || false}
          activeImageIndex={activeImageIndex}
          imageInput='fileId'
          altInput='fileName'
          titleText='preview-images'
          WithUnitDetails={WithUnitDetails}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          thumbnail={async (currntIndex) => {
            if (
              previewImages.length - 1 === currntIndex &&
              currntIndex + 1 < resResult.totalCount
            ) {
              const currentbody = { ...body, pageIndex: body.pageIndex + 1 };
              setActiveImageIndex((resResult && resResult.totalCount / 2) - 1 || 0);
              setBody(currentbody);
              const response = await GetAllPropertyImages(currentbody);
              setResResult(null);
              setPreviewImages([...previewImages, ...response.result]);
              setActiveImageIndex(([...previewImages, ...response.result].length / 2) - 1 || 0);
              setResResult(response);
            }
}}
          nextHandle={(parent, operation, currntIndex) => async () => {
            parent(operation)();
            if (
              previewImages.length - 1 === currntIndex &&
              currntIndex + 1 < resResult.totalCount
            ) {
              const currentbody = { ...body, pageIndex: body.pageIndex + 1 };
              setActiveImageIndex((resResult && resResult.totalCount / 2) || 0);
              setBody(currentbody);
              const response = await GetAllPropertyImages(currentbody);
              setResResult(null);
              setPreviewImages([...previewImages, ...response.result]);
              setActiveImageIndex([...previewImages, ...response.result].length / 2 || 0);
              setResResult(response);
            }
          }}
          backHandle={(parent, operation) => () => {
            parent(operation)();
          }}
          activeImageTooltipComponent={() =>
            (data && data[0] && !hidePhotosTooltip && (
              <ImagesGalleryPhotosTooltipComponent
                data={data[0]}
                fromPage={fromPage}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            )) ||
            undefined}
          onOpenChanged={() => {
            setActiveImageIndex(null);
            setResResult(null);
            setBody({
              propertyId,
              categoryId: undefined,
              pageIndex: 1,
              PageSize: 10,
            });
          }}
        />
      )}

      {activeImageIndex !== null && previewImages.length > 0 && resResult === null && (
        <FacebookGalleryComponent
          data={previewImages || []}
          isOpen={(activeImageIndex !== null && previewImages.length > 0 && true) || false}
          activeImageIndex={activeImageIndex}
          imageInput='fileId'
          WithUnitDetails={WithUnitDetails}
          updateData={updateData}
          altInput='fileName'
          titleText='preview-images'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          activeImageTooltipComponent={() =>
            (data && data[0] && !hidePhotosTooltip && (
              <ImagesGalleryPhotosTooltipComponent
                data={data[0]}
                fromPage={fromPage}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            )) ||
            undefined}
          onOpenChanged={() => {
            setActiveImageIndex(null);
          }}
        />
      )}
      {(isOpenManagementDialog && uploader) || hideIcon ? (
        <UnitsSalesProfileManagementDialog
          updateData={updateData || GetAllUnitImagesCategory}
          propertyId={propertyId}
          unit={Display}
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          ImageCategoryLookup={ImageCategoryLookup}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
          }}
          onSave={() => {
            onPageIndexChanged(0);
            setActiveItem(null);
            setIsOpenManagementDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      ) : (!property && (
        <ImagesGalleryManagementDialog
          unit={Display}
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          onSave={() => {
            onPageIndexChanged(0);
            setActiveItem(null);
            setIsOpenManagementDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )
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
ImagesGalleryAlbumsCardComponent.propTypes = {
  ImageCategoryLookup: PropTypes.instanceOf(Object).isRequired,
  property: PropTypes.bool,
  setdata: PropTypes.func.isRequired,
  hideIcon: PropTypes.bool,
  onIconImageClick: PropTypes.bool,
  uploader: PropTypes.bool,
  propertyId: PropTypes.number.isRequired,
  Display: PropTypes.instanceOf(UnitProfileImagesCardActionEnum).isRequired,
  data: PropTypes.instanceOf(Array),
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key))
    .isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  HideEdit: PropTypes.bool,
  isEdit: PropTypes.bool,
  EdititemData: PropTypes.instanceOf(Array).isRequired,
  onClickEdit: PropTypes.func,
  updateData: PropTypes.func,
  WithUnitDetails: PropTypes.bool,
  hidePhotosTooltip: PropTypes.bool,
};
ImagesGalleryAlbumsCardComponent.defaultProps = {
  data: [],
  onIconImageClick: false,
  uploader: false,
  hideIcon: false,
  property: false,
  WithUnitDetails: false,
  HideEdit: true,
  isEdit: false,
  hidePhotosTooltip: false,
  updateData: undefined,
  onClickEdit: undefined
};
