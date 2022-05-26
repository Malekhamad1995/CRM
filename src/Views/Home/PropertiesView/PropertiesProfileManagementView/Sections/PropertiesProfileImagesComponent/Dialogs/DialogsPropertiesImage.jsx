import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Fab } from '@material-ui/core';
import {
  AutocompleteComponent,
  LoadableImageComponant,
  UploaderComponent,
} from '../../../../../../../Components';
import { UploaderThemesEnum, PropertyImagesType } from '../../../../../../../Enums';
import { getDownloadableLink, GetParams } from '../../../../../../../Helper';
import { GetAllPropertyImages, lookupItemsGetId } from '../../../../../../../Services';

export const DialogsPropertiesImage = ({
  parentTranslationPath,
  translationPath,
  size,
  data,
  activeItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(parentTranslationPath);
  const [Reasons, setReasons] = useState([]);
  const defaultState = {
    categoryId: null,
    propertyId: +GetParams('id') || null,
    imageType: PropertyImagesType.Image,
    files: [],
  };

  const [state, setState] = useState(defaultState);
  useEffect(() => {
    if (state && state.files && state.files.length >= 1) size('md');
    else size('sm');
  }, [size, state, state.files]);
  const [selected, setselected] = useState({ lookupItemName: '', lookupItemId: '' });
  const getAllTitle = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: 1266,
    });
    if (!(res && res.status && res.status !== 200)) setReasons(res || []);
    else setReasons([]);
    setIsLoading(false);
  }, []);

  const onClickedDelete = (item) => (event) => {
    event.preventDefault();
    const currentList = state.files;
    const index = currentList.findIndex((w) => w.fileId === item.fileId);
    if (index === -1) {
      setState((items) => ({
        ...items,
        files: [...currentList, item] || [],
      }));
    } else {
      currentList.splice(index, 1);
      setState((items) => ({
        ...items,
        files: [...currentList] || [],
      }));
    }
  };

  const getAllImageHandler = useCallback(
    async (category) => {
      const res = await GetAllPropertyImages({
        categoryId: category,
        propertyId: +GetParams('id'),
        pageIndex: 1,
        PageSize: 50,
      });
      if (!(res && res.status && res.status !== 200)) {
        setState((items) => ({
          ...items,
          files: res && res.result,
        }));
      } else {
        setState((items) => ({
          ...items,
          files: activeItem.images.result,
        }));
      }
    },
    [activeItem]
  );

  useEffect(() => {
    getAllTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    data(state);
  }, [data, state]);

  useEffect(() => {
    if (activeItem) getAllImageHandler(activeItem.categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

  useEffect(() => {
    if (activeItem) {
      getAllImageHandler(activeItem.categoryId);
      setState((items) => ({
        ...items,
        categoryId: activeItem.categoryId,
        propertyId: +GetParams('id') || null,
        imageType: PropertyImagesType.Image,
      }));
      setselected((items) => ({
        ...items,
        lookupItemName: activeItem.categoryName,
        lookupItemId: activeItem.categoryId,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

  return (
    <div className='DialogsPropertiesImage'>
      <div
        className={
          state && state.files && state.files.length >= 1 ? 'inter-wraper' : 'inter-wraper-empty'
        }
      >
        <div className=''>
          <AutocompleteComponent
            idRef='TitleRef'
            labelValue='Title'
            isLoading={isLoading}
            selectedValues={selected || []}
            getOptionSelected={(option) => option.lookupItemId === selected.lookupItemId}
            multiple={false}
            data={Reasons || []}
            displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
            withoutSearchButton
            isWithError
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setState((items) => ({
                ...items,
                categoryId: newValue && +newValue.lookupItemId,
              }));
              setselected({
                lookupItemName: newValue && newValue.lookupItemName,
                lookupItemId: newValue && +newValue.lookupItemId,
              });
            }}
          />
        </div>
        <div className='UploaderComponent-wrapered pt-2'>
          <span className='label-wrapper '>{t(`${translationPath}upload-image`)}</span>
          <UploaderComponent
            idRef='profileImgRef'
            uploaderTheme={UploaderThemesEnum.box.key}
            defaultImage='Uploadmark'
            multiple
            WithoutDefaultImg
            dropHereText='Drag-and-drop-here-or-browse-File'
            initUploadedFiles={
              (state &&
                state.files &&
                state.files.length > 0 &&
                state.files.map((item) => ({
                  uuid: item.fileId,
                  fileName: item.fileName,
                }))) ||
              []
            }
            uploadedChanged={(files) =>
              setState((items) => ({
                ...items,
                files:
                  (files &&
                    files.map((item) => ({
                      fileId: item.uuid,
                      fileName: item.fileName,
                    }))) ||
                  [],
              }))}
          />
        </div>
      </div>
      {state &&
        state.files &&
        state.files.length >= 1 &&
        ((
          <div className='Uploaded-images-wraper'>
            {state &&
              state.files.map((item, Index) => (
                <div className='' key={`UploadedImagesRef${Index + 1}`}>
                  <div className='Overlay' />
                  <div className='Fab-contenar'>
                    <div className='icon'>
                      <Fab
                        size='small'
                        color='secondary'
                        aria-label='Delete'
                        onClick={onClickedDelete(item)}
                      >
                        <span className='mdi mdi-trash-can-outline' />
                      </Fab>
                    </div>
                  </div>
                  <LoadableImageComponant
                    classes='details-img'
                    alt={t(`${translationPath}user-image`)}
                    src={item.fileId && getDownloadableLink(item.fileId)}
                  />
                </div>
              ))}
          </div>
        ) ||
          null)}
    </div>
  );
};

DialogsPropertiesImage.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  size: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  activeItem: PropTypes.instanceOf(Array).isRequired,
};
