import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { DialogComponent, Spinner, UploaderComponent } from '../../../../../Components';
import { showError, showSuccess } from '../../../../../Helper';
import {
  ImagesGalleryFilterEnum,
  UploaderThemesEnum,
  UnitProfileImagesCardActionEnum,
} from '../../../../../Enums';
import { ImageGalleryLookupsComponent } from './Presentational';
import { CreateAlbum, UpdateAlbum } from '../../../../../Services';

export const ImagesGalleryManagementDialog = ({
  unit,
  fromPage,
  activeItem,
  onSave,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const locationDefault = {
    countryId: null,
    cityId: null,
    districtId: null,
    communityId: null,
    subCommunityId: null,
  };
  const [state, setState] = useReducer(reducer, {
    ...locationDefault,
    albumImages: [],
  });
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const schema = Joi.object({
    countryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}country-is-required`),
        'number.empty': t(`${translationPath}country-is-required`),
      }),
    cityId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}city-is-required`),
        'number.empty': t(`${translationPath}city-is-required`),
      }),
    districtId:
      ((fromPage === ImagesGalleryFilterEnum.District.key ||
        fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) &&
        Joi.number()
          .required()
          .messages({
            'number.base': t(`${translationPath}district-is-required`),
            'number.empty': t(`${translationPath}district-is-required`),
          })) ||
      Joi.any(),
    communityId:
      ((fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) &&
        Joi.number()
          .required()
          .messages({
            'number.base': t(`${translationPath}community-is-required`),
            'number.empty': t(`${translationPath}community-is-required`),
          })) ||
      Joi.any(),
    subCommunityId:
      (fromPage === ImagesGalleryFilterEnum.Subcommunity.key &&
        Joi.number()
          .required()
          .messages({
            'number.base': t(`${translationPath}sub-community-is-required`),
            'number.empty': t(`${translationPath}sub-community-is-required`),
          })) ||
      Joi.any(),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getLookupItemIdByPage = () => {
    if (fromPage && fromPage === ImagesGalleryFilterEnum.District.key) return state.districtId;
    if (fromPage && fromPage === ImagesGalleryFilterEnum.Community.key) return state.communityId;
    if (fromPage && fromPage === ImagesGalleryFilterEnum.Subcommunity.key)
      return state.subCommunityId;
    return state.cityId;
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const toSaveState = {
      imageGalleryType: fromPage,
      lookupItemId: getLookupItemIdByPage(),
      albumImages: state.albumImages,
    };
    const res =
      (activeItem && (await UpdateAlbum(activeItem.albumId, toSaveState))) ||
      (await CreateAlbum(toSaveState));
    setIsLoading(false);
    if (!(res && res.data && res.data.ErrorId)) {
      if (activeItem) showSuccess(t(`${translationPath}photo-updated-successfully`));
      else showSuccess(t(`${translationPath}photo-created-successfully`));
      onSave();
    } else if (activeItem) showError(t(`${translationPath}photo-update-failed`));
    else {
      showError(
        t(
          `${translationPath}${(res &&
            res.data &&
            res.data.Message &&
            res.data.Message.substring(
              res.data.Message.lastIndexOf(':') + 1,
              res.data.Message.length
            )) ||
          'photo-create-failed'
          }`
        )
      );
    }
  };
  // const getLookupItem = useCallback(async (lookupTypeId,lookupParentId,) => {
  //   setIsLoading(true);
  //   const res = await lookupItemsGet({
  //     lookupParentId,
  //     lookupTypeId,
  //   });
  //   setIsLoading(false);
  //   if (!(res && res.status && res.status !== 200)) return res || null;
  //   return null;
  // }, [lookupParentId, lookupTypeId]);
  const getEditInit = useCallback(async () => {
    setState({
      id: 'edit',
      value: {
        countryId: activeItem.countryId || null,
        cityId: activeItem.cityId || null,
        districtId: activeItem.districtId || null,
        communityId: activeItem.communityId || null,
        subCommunityId: activeItem.subCommunityId || null,
        albumImages: (activeItem.filteredImagesDto && activeItem.filteredImagesDto.result) || [],
      },
    });
  }, [activeItem]);
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-photo') || 'add-new-photo'}
      saveText='save'
      dialogContent={(
        <div className='image-gallery-management-dialog view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <ImageGalleryLookupsComponent
            unit={unit}
            fromPage={fromPage}
            isDisabled={(activeItem && true) || false}
            state={state}
            schema={schema}
            isSubmitted={isSubmitted}
            onStateChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <div className='w-100 mb-3'>
            <UploaderComponent
              idRef='galleryPhotosUploaderRef'
              labelValue='upload-image'
              multiple
              accept='image/*'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              viewUploadedFilesCount
              initUploadedFiles={
                (state.albumImages &&
                  state.albumImages.length > 0 &&
                  state.albumImages.map((item) => ({
                    uuid: item.fileId,
                    fileName: item.fileName,
                  }))) ||
                []
              }
              uploadedChanged={(files) =>
                setState({
                  id: 'albumImages',
                  value:
                    (files &&
                      files.map((item) => ({
                        fileId: item.uuid,
                        fileName: item.fileName,
                      }))) ||
                    [],
                })}
              uploaderTheme={UploaderThemesEnum.GalleryShow.key}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ImagesGalleryManagementDialog.propTypes = {
  unit: PropTypes.oneOf(Object.values(UnitProfileImagesCardActionEnum)),
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key)),
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesGalleryManagementDialog.defaultProps = {
  unit: UnitProfileImagesCardActionEnum.Hide,
  fromPage: ImagesGalleryFilterEnum.City.key,
  activeItem: null,
};
