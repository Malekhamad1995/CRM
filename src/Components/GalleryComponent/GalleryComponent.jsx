import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getDownloadableLink } from '../../Helper';
import { getMimeTypeHandler } from '../../Utils';
import './GalleryComponent.scss';

export const GalleryComponent = ({
  elements,
  valueInput,
  fileNameInput,
  keyInput,
  dataInput,
  uuidInput,
  idRef,
  galleryWrapper,
  galleryItemClasses,
  itemBoxClasses,
  imageClasses,
  textClasses,
  isFormBuilderArray,
  getDisplayName,
  getImageItem,
}) => {
  //   const getMimiTypeObj = getMimeTypeHandler();
  const [files, setFiles] = useState(() => (isFormBuilderArray && []) || elements);
  const formBuilderArrayHandler = useCallback(() => {
    const localFiles = Object.entries(elements).reduce((total, item) => {
      if (item[1][valueInput]) {
        Object.entries(item[1][valueInput]).map((subItem) => {
          if (subItem[0] !== 'selected' && subItem[1] !== null) {
            subItem[1].map((subSubItem) => {
              total.push({
                [keyInput]: subItem[0],
                [dataInput]: subSubItem,
              });
              return undefined;
            });
          }
          return undefined;
        });
      }
      return total;
    }, []);
    setFiles(localFiles);
  }, [dataInput, elements, keyInput, valueInput]);

  useEffect(() => {
    if (isFormBuilderArray && typeof elements === 'object' && Object.keys(elements).length > 0)
      formBuilderArrayHandler();
  }, [elements, formBuilderArrayHandler, isFormBuilderArray, valueInput]);
  return (
    <div className={galleryWrapper}>
      {files && files.map((item, index) => {
        const getMimiTypeObj = getMimeTypeHandler(
          (dataInput && item[dataInput][fileNameInput])
            || (fileNameInput && item[fileNameInput])
            || item
        );
        return (
          (getImageItem && getImageItem(item, getMimiTypeObj)) || (
            <a
              className={`${galleryItemClasses}${getMimiTypeObj.isFile ? ' is-file' : ''}`}
              key={`${idRef}${
                (dataInput && uuidInput && item[dataInput][uuidInput])
                || (uuidInput && item[uuidInput])
                || item
              }${index + 1}`}
              href={getDownloadableLink(
                (dataInput && uuidInput && item[dataInput][uuidInput])
                  || (uuidInput && item[uuidInput])
                  || item
              )}
              download
            >
              <div className={itemBoxClasses}>
                <img
                  src={
                    getMimiTypeObj.isImage
                      ? getDownloadableLink(
                          (dataInput && uuidInput && item[dataInput][uuidInput])
                            || (uuidInput && item[uuidInput])
                            || item
                        )
                      : getMimiTypeObj.image
                  }
                  alt={
                    (dataInput && item[dataInput][fileNameInput])
                    || (fileNameInput && item[fileNameInput])
                    || item
                  }
                  className={`${imageClasses}${!getMimiTypeObj.isImage ? ' is-default' : ''}`}
                />
              </div>
              {' '}
              {getDisplayName && getDisplayName(item, getMimiTypeObj)}
              {!getDisplayName && <span className={textClasses}>{item[keyInput]}</span>}
            </a>
          )
        );
      })}
    </div>
  );
};

GalleryComponent.propTypes = {
  elements: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Object)])
    .isRequired,
  valueInput: PropTypes.string,
  uuidInput: PropTypes.string,
  dataInput: PropTypes.string,
  idRef: PropTypes.string,
  keyInput: PropTypes.string,
  fileNameInput: PropTypes.string,
  textClasses: PropTypes.string,
  imageClasses: PropTypes.string,
  itemBoxClasses: PropTypes.string,
  galleryItemClasses: PropTypes.string,
  galleryWrapper: PropTypes.string,
  isFormBuilderArray: PropTypes.bool,
  getDisplayName: PropTypes.func,
  getImageItem: PropTypes.func,
};
GalleryComponent.defaultProps = {
  valueInput: 'value',
  fileNameInput: 'fileName',
  dataInput: 'item',
  uuidInput: 'uuid',
  keyInput: 'key',
  idRef: 'imageRef',
  isFormBuilderArray: false,
  getDisplayName: undefined,
  getImageItem: undefined,
  textClasses: 'gallery-text',
  imageClasses: 'gallery-image',
  itemBoxClasses: 'gallery-item-box',
  galleryItemClasses: 'gallery-item-wrapper',
  galleryWrapper: 'gallery-wrapper',
};

export default GalleryComponent;
