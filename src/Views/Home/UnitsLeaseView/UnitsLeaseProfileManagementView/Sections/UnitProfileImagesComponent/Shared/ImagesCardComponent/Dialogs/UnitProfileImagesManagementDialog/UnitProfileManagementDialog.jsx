import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import {
  DialogComponent,
  Spinner,
  UploaderComponent,
} from '../../../../../../../../../../Components';
import { UnitImageCategory } from '../../../../../../../../../../assets/json/StaticLookupsIds.json';
import { showError, showSuccess } from '../../../../../../../../../../Helper';
import {
  DefaultImagesEnum,
  ImagesGalleryFilterEnum,
  UploaderThemesEnum,
} from '../../../../../../../../../../Enums';
import { CreateAlbum, UpdateAlbum } from '../../../../../../../../../../Services';
import { GalleryManagementLookupsAutocomplete } from '../../../../../../../../ImagesGallery/Dialogs/ImagesGalleryManagementDialog/Controls';

export const UnitProfileManagementDialog = ({
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
    categoryId: null,
  };
  const [state, setState] = useReducer(reducer, {
    ...locationDefault,
    albumImages: [],
  });
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const schema = Joi.object({
    categoryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}category-is-required`),
        'number.empty': t(`${translationPath}category-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    const toSaveState = {
      imageGalleryType: fromPage,
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
          `${translationPath}${
            (res &&
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

  const getEditInit = useCallback(async () => {
    setState({
      id: 'edit',
      value: {
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
          <div className='dialog-item'>
            <GalleryManagementLookupsAutocomplete
              idRef='categoryIdRef'
              labelValue='Category'
              stateValue={state.categoryId}
              lookupTypeId={UnitImageCategory}
              schema={schema}
              isSubmitted={isSubmitted}
              stateKey='categoryId'
              onStateChanged={(newValue) => {
                const localNewValue = {
                  id: 'edit',
                  value: {
                    ...state,
                    ...locationDefault,
                    categoryId: newValue,
                  },
                };
                onStateChanged(localNewValue);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
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
              defaultImage={DefaultImagesEnum.upload.key}
              uploaderTheme={UploaderThemesEnum.box.key}
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

UnitProfileManagementDialog.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key)),
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
UnitProfileManagementDialog.defaultProps = {
  fromPage: ImagesGalleryFilterEnum.City.key,
  activeItem: null,
};
