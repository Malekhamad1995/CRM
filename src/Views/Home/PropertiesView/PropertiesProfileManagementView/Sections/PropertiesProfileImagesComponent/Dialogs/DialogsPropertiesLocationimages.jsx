import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Fab } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  DialogComponent,
  LoadableImageComponant,
  PaginationComponent,
  NoSearchResultComponent,
  AutocompleteComponent,
} from '../../../../../../../Components';
import {
  DefaultImagesEnum,
  ImagesGalleryFilterEnum,
  PropertyImagesType,
} from '../../../../../../../Enums';
import { getDownloadableLink, GetParams } from '../../../../../../../Helper';
import { GetAllImagesByTypeId } from '../../../../../../../Services';
import { ImagesGalleryPhotosCardComponent } from '../../../../../ImagesGallery/Sections/ImagesGalleryPhotosComponent/ImagesGalleryPhotosCardComponent';

export const DialogsPropertiesLocationimages = ({
  parentTranslationPath,
  translationPath,
  size,
  data,
  activeItemcard,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [isOpen, setIsOpen] = useState(false);
  const [SelectedAutocomplete, setSelectedAutocomplete] = useState([
    {
      lookupItemId: '',
      lookupItemName: '',
    },
  ]);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const defaultState = {
    categoryId: 0,
    propertyId: +GetParams('id') || null,
    imageType: PropertyImagesType.location,
    files: [],
  };

  const [Selectedvalue, setSelectedvalue] = useState([]);
  const [state, setState] = useState(defaultState);
  const [Images, setImages] = useState();
  const [AutocompleteON, setAutocompleteON] = useState(false);
  const [types, settypes] = useState();
  const GetAllImages = useCallback(async (lookup, filterpageIndex, filterpageSize, typeID) => {
    const res = await GetAllImagesByTypeId({
      pageIndex: filterpageIndex,
      pageSize: filterpageSize,
      lookupItemId: +lookup,
      typeId: typeID || null,
    });
    if (!(res && res.status && res.status !== 200)) setImages(res || []);
    else setImages([]);
  }, []);

  const onClickedDelete = (item) => (event) => {
    event.preventDefault();
    const currentList = Selectedvalue;
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
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const onSelectSaveClicked = () => {
    setState((items) => ({
      ...items,
      files: [...Selectedvalue],
    }));
    setIsOpen(false);
  };
  useEffect(() => {
    if (state.files.length >= 1) size('md');
    else size('sm');
  }, [size, state.files]);
  useEffect(() => {}, [activeItem]);

  useEffect(() => {
    data(state);
  }, [data, state]);

  useEffect(() => {
    if (activeItemcard) {
      setState((items) => ({
        ...items,
        categoryId: +activeItemcard.categoryId,
        propertyId: +GetParams('id') || null,
        imageType: PropertyImagesType.location,
        files: activeItemcard.images.result,
      }));
      setSelectedvalue(activeItemcard.images.result);
      GetAllImages(+activeItemcard.categoryId, filter.pageIndex, filter.pageSize, types);
      setAutocompleteON(true);
      setSelectedAutocomplete({
        lookupItemId: +activeItemcard.categoryId,
        lookupItemName: activeItemcard.categoryName,
      });
    } else GetAllImages(state.categoryId, filter.pageIndex, filter.pageSize, types);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItemcard, filter.pageIndex, filter.pageSize, state.categoryId]);

  return (
    <div className='DialogsPropertiesImage'>
      <div>
        <div className=''>
          <AutocompleteComponent
            idRef='categoryRef'
            labelValue='category'
            selectedValues={SelectedAutocomplete}
            isDisabled={AutocompleteON}
            getOptionSelected={(option) =>
              option.lookupItemId === SelectedAutocomplete.lookupItemId}
            multiple={false}
            data={[
              {
                lookupItemId: activeItem && activeItem.country && activeItem.country.lookupItemId,
                lookupItemName:
                  activeItem && activeItem.country && activeItem.country.lookupItemName,
                typeId: ImagesGalleryFilterEnum.City.key,
              },
              {
                lookupItemId: activeItem && activeItem.city && activeItem.city.lookupItemId,
                lookupItemName: activeItem && activeItem.city && activeItem.city.lookupItemName,
                typeId: ImagesGalleryFilterEnum.City.key,
              },
              {
                lookupItemId: activeItem && activeItem.district && activeItem.district.lookupItemId,
                lookupItemName:
                  activeItem && activeItem.district && activeItem.district.lookupItemName,
                typeId: ImagesGalleryFilterEnum.District.key,
              },
              {
                lookupItemId:
                  activeItem && activeItem.community && activeItem.community.lookupItemId,
                lookupItemName:
                  activeItem && activeItem.community && activeItem.community.lookupItemName,
                typeId: ImagesGalleryFilterEnum.Community.key,
              },
              {
                lookupItemId:
                  activeItem && activeItem.sub_community && activeItem.sub_community.lookupItemId,
                lookupItemName:
                  activeItem && activeItem.sub_community && activeItem.sub_community.lookupItemName,
                typeId: ImagesGalleryFilterEnum.Subcommunity.key,
              },
            ]}
            displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
            withoutSearchButton
            inputPlaceholder={t(`${translationPath}category`)}
            isWithError
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setState((items) => ({
                ...items,
                categoryId: (newValue && +newValue.lookupItemId) || '',
              }));
              setSelectedAutocomplete({
                lookupItemId: newValue && +newValue.lookupItemId,
                lookupItemName: newValue && newValue.lookupItemName,
              });
              if (state.categoryId !== (newValue && +newValue.lookupItemId)) {
                setState((items) => ({
                  ...items,
                  files: [],
                }));
              }
              settypes(newValue && +newValue.typeId);
            }}
          />
        </div>
        <div className='UploaderComponent-wrapered pt-5 '>
          <span className='label-wrapper '>{t(`${translationPath}Import-image`)}</span>
          <div className='Import-Component-wrapered pt-5'>
            <div className='d-flex-center Import-Spinner '>
              <img
                src={DefaultImagesEnum.Uploadmark.defaultImg}
                className='Uploaded-icon'
                alt={t(`${translationPath}image`)}
              />
            </div>
            <div className='d-flex-center'>
              <ButtonBase
                className='btns theme-solid bg-primary'
                disabled={state.categoryId === 0}
                onClick={() => setIsOpen(true)}
              >
                {t(`${translationPath}Import-image`)}
              </ButtonBase>
            </div>
          </div>
        </div>
      </div>
      {state.files.length >= 1 &&
        ((
          <div className='Uploaded-images-wraper'>
            {state &&
              state.files.map((item, Index) => (
                <div className='' key={`unitImagesRef${Index + 1}`}>
                  <div className='Overlay' />
                  <div className='Fab-contenar'>
                    <div className='icon'>
                      <Fab size='small' color='secondary' aria-label='add'>
                        <span
                          className='mdi mdi-trash-can-outline'
                          onClick={onClickedDelete(item)}
                        />
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
      <DialogComponent
        titleText={t(`${translationPath}Import-image`)}
        saveText='save'
        saveType='button'
        maxWidth='lg'
        dialogContent={(
          <div className='DialogsProperties-GalleryPhotosCardComponen'>
            {(Images && Images.totalCount !== 0 && (
              <ImagesGalleryPhotosCardComponent
                data={(Images && Images.result) || []}
                fromPage={2}
                WithCheckbox
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                havaSelectedvalue={Selectedvalue}
                HideFacebookGalleryComponent
                Selectedvalue={(item) => setSelectedvalue(item)}
              />
            )) || <NoSearchResultComponent />}
            {Images && Images.totalCount !== 0 && (
              <div className='pagination-history-wrapper pagination-Images-Gallery-Photos '>
                <PaginationComponent
                  pageIndex={filter.pageIndex}
                  pageSize={filter.pageSize}
                  totalCount={(Images && Images.totalCount) || 0}
                  onPageIndexChanged={onPageIndexChanged}
                  onPageSizeChanged={onPageSizeChanged}
                />
              </div>
            )}
          </div>
        )}
        saveClasses='btns theme-solid  w-100 mx-2 mb-2'
        isOpen={isOpen}
        onSaveClicked={onSelectSaveClicked}
        saveIsDisabled={Images && Images.totalCount === 0}
        onCloseClicked={() => setIsOpen(false)}
        onCancelClicked={() => setIsOpen(false)}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};
DialogsPropertiesLocationimages.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  size: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  activeItemcard: PropTypes.instanceOf(Array).isRequired,
};
