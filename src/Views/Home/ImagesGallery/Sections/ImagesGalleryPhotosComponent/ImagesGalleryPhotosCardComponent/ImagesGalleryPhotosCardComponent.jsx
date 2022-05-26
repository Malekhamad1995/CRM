import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ImagesGalleryFilterEnum, DefaultImagesEnum } from '../../../../../../Enums';
import { getDownloadableLink } from '../../../../../../Helper';
import {
  LoadableImageComponant,
  FacebookGalleryComponent,
  MasonryComponent,
  CheckboxesComponent,
} from '../../../../../../Components';
import { ImagesGalleryPhotosTooltipComponent } from './Presentational';

export const ImagesGalleryPhotosCardComponent = ({
  fromPage,
  data,
  imageInput,
  altInput,
  parentTranslationPath,
  translationPath,
  WithCheckbox,
  Selectedvalue,
  havaSelectedvalue,
  HideFacebookGalleryComponent
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [Listofcheck, setListofcheck] = useState([]);
  const dataReturn = (dataItem, columnPath) => {
    if (!dataItem) return '';
    if (!columnPath) return (typeof dataItem !== 'object' && dataItem) || '';
    if (!columnPath.includes('.')) return dataItem[columnPath];
    let a = dataItem;
    columnPath.split('.').map((item) => {
      if (a) a = a[item];
      return item;
    });
    return a;
  };
  const activeImageHandler = useCallback(
    (image, index) => () => {
      setActiveImageIndex(index);
      setActiveImage(image);
    },
    []
  );
  useEffect(() => {
    setLoadedImages([]);
  }, [data]);

  const onSelectedCheckboxClicked = useCallback(
    (item) => (event) => {
      event.preventDefault();
      const currentList = Listofcheck;
      const index = currentList.findIndex((w) => w.fileId === item.fileId);
      if (index === -1) setListofcheck([...currentList, item]);
      else {
        currentList.splice(index, 1);
        setListofcheck([...currentList]);
      }
    },
    [Listofcheck]
  );
  useEffect(() => {
    if (havaSelectedvalue && havaSelectedvalue.length >= 1)
     setListofcheck(havaSelectedvalue);
   }, [havaSelectedvalue]);

  useEffect(() => {
    if (WithCheckbox) Selectedvalue(Listofcheck);
  }, [WithCheckbox, Listofcheck, Selectedvalue]);

  return (
    (data && (
      <div className='images-gallery-photos-card-wrapper shared-wrapper'>
        <MasonryComponent
          customMonitor={data}
          secondCustomMonitor={loadedImages}
          itemClassName='images-gallery-photos-item-wrapper'
          executeDelay={270}
        >
          {data.map((item, index) => (
            <div
              className='images-gallery-photos-item-wrapper'
              key={`imagesGalleryPhotosRef${index + 1}`}
            >
              {WithCheckbox && (
                <div className='Checkbox-wraper'>
                  <CheckboxesComponent
                    idRef={`propertiesCheckboxItemRef${index + 1}`}
                    singleChecked={
                      Listofcheck && Listofcheck.findIndex((w) => w.fileId === item.fileId) !== -1
                    }
                    onSelectedCheckboxClicked={onSelectedCheckboxClicked(item)}
                  />
                </div>
              )}
              <ButtonBase
                onClick={activeImageHandler(item, index)}
                className={`images-gallery-photos-item${
                  (activeImage &&
                    dataReturn(activeImage, imageInput) === dataReturn(item, imageInput) &&
                    ' active-image') ||
                  ''
                }`}
              >
                <LoadableImageComponant
                  classes='images-gallery-photos-image'
                  alt={dataReturn(item, altInput) || t(`${translationPath}location-image`)}
                  // && getDownloadableLink(dataReturn(item, imageInput))
                  onFinishLoading={() =>
                    setLoadedImages((items) => {
                      items.push(index);
                      return [...items];
                    })}
                  src={
                    (dataReturn(item, imageInput) &&
                      getDownloadableLink(dataReturn(item, imageInput))) ||
                    DefaultImagesEnum.buildings.defaultImg
                  }
                />
                <div className='images-gallery-tooltip-wrapper'>
                  <ImagesGalleryPhotosTooltipComponent
                    fromPage={fromPage}
                    data={item}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                </div>
              </ButtonBase>
            </div>
          ))}
        </MasonryComponent>
        {activeImageIndex !== null && activeImage && true && !HideFacebookGalleryComponent && (
          <FacebookGalleryComponent
            data={data || []}
            isOpen={(activeImageIndex !== null && activeImage && true) || false}
            activeImageIndex={activeImageIndex}
            imageInput={imageInput}
            altInput={altInput}
            titleText='preview-images'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            activeImageTooltipComponent={(imageIndex) =>
              (data && data[imageIndex] && (
                <ImagesGalleryPhotosTooltipComponent
                  data={data[imageIndex]}
                  fromPage={fromPage}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )) ||
              undefined}
            onOpenChanged={() => {
              setActiveImage(null);
              setActiveImageIndex(null);
            }}
          />
        )}
      </div>
    )) ||
    null
  );
};
ImagesGalleryPhotosCardComponent.propTypes = {
  data: PropTypes.instanceOf(Array),
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key)),
  imageInput: PropTypes.string,
  altInput: PropTypes.string,
  Selectedvalue: PropTypes.instanceOf(Array),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesGalleryPhotosCardComponent.defaultProps = {
  data: [],
  fromPage: ImagesGalleryFilterEnum.City.key,
  imageInput: 'fileId',
  altInput: 'fileName',
  WithCheckbox: false,
  HideFacebookGalleryComponent: false,
};
