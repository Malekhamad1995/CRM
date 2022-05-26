import React, {
 useRef, useState, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Chip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getDownloadableLink } from '../../Helper';
import { uploadFile } from '../../Services';
import { GalleryComponent } from '../GalleryComponent/GalleryComponent';

export const UploaderComponentCircular = ({
  wrapperClasses,
  uploaderClasses,
  dropzoneWrapper,
  counterClasses,
  inputClasses,
  chipClasses,
  parentTranslationPath,
  dropHereClasses,
  labelClasses,
  accept,
  multiple,
  initUploadedFiles,
  chipsDisabled,
  customDeleteButton,
  translationPath,
  translationPathShared,
  uploadedChanged,
  customUploadButton,
  titleText,
  labelValue,
  isDisabled,
  idRef,
  circleDefaultImage,
}) => {
  const uploadRef = useRef(null);
  const [allFiles, setAllFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const uploadHandler = (files) => {
    files.map((item) =>
      uploadFile({ file: item.file })
        .then((response) => {
          multiple && uploadedFiles.push(response);
          const localUploadedFiles = (multiple && uploadedFiles) || [{ ...response }];
          setUploadedFiles(localUploadedFiles);
          uploadedChanged(localUploadedFiles);
          setAllFiles((items) => {
            const fileIndex = items.findIndex((element) => element.id === item.id);
            if (fileIndex !== -1) {
              items[fileIndex].uuid = response.uuid;
              items[fileIndex].status = 'success';
            }
            return [...items];
          });
        })
        .catch(() => {
          setAllFiles((items) => {
            const fileIndex = items.findIndex((element) => element.id === item.id);
            items[fileIndex].status = 'failed';
            return [...items];
          });
        }));
  };
  const dropHandler = (event) => {
    event.preventDefault();
    if (isDisabled) return;
    setIsDragOver(false);
    let filesToUpload = Object.values(event.dataTransfer.files);
    if (accept.includes('image'))
      filesToUpload = filesToUpload.filter((item) => item.type.includes('image'));

    if (filesToUpload.length === 0) return;
    let files = [];
    if (multiple) {
 filesToUpload.map((file) => {
        files.push({
          id: allFiles.length + files.length,
          uuid: null,
          fileName: file.name,
          size: file.size,
          type: file.type,
          file,
          status: 'uploading',
        });
        return undefined;
      });
} else {
 files = [
        {
          id: allFiles.length,
          uuid: null,
          fileName: filesToUpload[0].name,
          size: filesToUpload[0].size,
          type: filesToUpload[0].type,
          file: filesToUpload[0],
          status: 'uploading',
        },
      ];
}
    setAllFiles((items) => (multiple && items.concat(files)) || files);
    uploadHandler(files);
  };
  const fileDeleted = useCallback(
    (item, index) => () => {
      const uploadedFilesIndex = uploadedFiles.findIndex((element) => element.uuid === item.uuid);
      if (uploadedFilesIndex !== -1) {
        const localFiles = [...uploadedFiles];
        localFiles.splice(uploadedFilesIndex, 1);
        uploadedChanged(localFiles);
        setUploadedFiles(localFiles);
      }
      setAllFiles((items) => {
        items.splice(index, 1);
        return [...items];
      });
    },
    [uploadedChanged, uploadedFiles]
  );
  const inputChanged = (event) => {
    if (!event.target.value) return;
    // const filesLength = allFiles.length;
    let files = [];
    if (multiple) {
 Object.values(event.target.files).map((file) => {
        files.push({
          id: allFiles.length + files.length,
          uuid: null,
          fileName: file.name,
          size: file.size,
          type: file.type,
          file,
          status: 'uploading',
        });
        // uploadHandler(file, filesLength + index);
        return undefined;
      });
} else {
 files = [
        {
          id: allFiles.length,
          uuid: null,
          fileName: event.target.files[0].name,
          size: event.target.files[0].size,
          type: event.target.files[0].type,
          file: event.target.files[0],
          status: 'uploading',
        },
      ];
}
    setAllFiles((items) => (multiple && items.concat(files)) || files);
    uploadHandler(files);
    event.target.value = null;
  };
  const chipClicked = useCallback(
    () => () => {
      setIsOpenGallery(true);
    },
    []
  );
  // const onUploadedFilesChanged = useCallback(() => {
  //   if (uploadedChanged) uploadedChanged(uploadedFiles);
  // }, [uploadedChanged, uploadedFiles]);
  // useEffect(() => {
  //   if (uploadedChanged) uploadedChanged(uploadedFiles);
  // }, [uploadedChanged, uploadedFiles]);
  useEffect(() => {
    if (initUploadedFiles && initUploadedFiles.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles(initUploadedFiles);
      setAllFiles(initUploadedFiles);
    }
  }, [initUploadedFiles, uploadedFiles.length]);
  // useEffect(() => {
  //   allFiles.map((item, index) => {
  //     if (item.status === 'pushed' && ) uploadHandler(item.file, index);
  //     return undefined;
  //   });
  // }, [allFiles, uploadHandler]);
  return (
    <div className={`${wrapperClasses} ${circleDefaultImage && ' is-circle'}`}>
      {labelValue && (
        <label htmlFor={idRef} className={`${labelClasses}${isDisabled ? ' disabled' : ''}`}>
          { (`${translationPath}${labelValue}`)}
        </label>
      )}
      <div className={`${uploaderClasses}${(isDragOver && ' drag-over') || ''}`}>
        <input
          ref={uploadRef}
          type='file'
          className={inputClasses}
          multiple={multiple}
          accept={accept}
          onChange={inputChanged}
          disabled={isDisabled}
          id={idRef}
        />
        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (isDisabled) return;
            if (!isDragOver) setIsDragOver(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={dropHandler}
          className={dropzoneWrapper}
          style={
            (circleDefaultImage && {
              backgroundImage: `url(${
                (allFiles.length > 0 && getDownloadableLink(allFiles[0].uuid)) || circleDefaultImage
              })`,
            }) ||
            undefined
          }
        >
          {(allFiles.length === 0 || isDragOver) && (
            <div className={`${dropHereClasses}${(allFiles.length > 0 && ' as-overlay') || ''}`}>
              {t(`${translationPathShared}drop-here`)}
            </div>
          )}
          {!circleDefaultImage &&
            allFiles.map((item, index) => (
              <Chip
                className={chipClasses}
                label={item.fileName}
                key={`${idRef}chip${index + 1}`}
                disabled={chipsDisabled(item, index) || isDisabled}
                onDelete={
                  (customDeleteButton && customDeleteButton) ||
                  (item.status !== 'uploading' && fileDeleted(item, index)) ||
                  undefined
                }
                onClick={chipClicked(item, index)}
                clickable
                avatar={
                  (item.status === 'uploading' && <CircularProgress size='small' />) || undefined
                }
                // deleteIcon={<DoneIcon />}
              />
            ))}
        </div>
        {circleDefaultImage && allFiles.length > 0 && (
          <Button
            className='btns-icon btn-close theme-solid bg-danger'
            onClick={fileDeleted(allFiles[0], 0)}
          >
            <span className='mdi mdi-close' />
          </Button>
        )}
        {(!customUploadButton && (
          <Button
            className={`${
              (!circleDefaultImage && 'btns theme-transparent') || 'btns-icon theme-solid'
            }  mx-0`}
            onClick={() => uploadRef.current.click()}
          >
            {!circleDefaultImage && (
              <span className='mx-3 text-nowrap'>
                {(accept &&
                  accept.includes('image') &&
               (
                t`${translationPathShared}${(multiple && 'browse-images') || 'browse-image'}`
                  )) ||
                  (
                    t`${translationPathShared}${(multiple && 'browse-files') || 'browse-file'}`
                  )}
              </span>
            )}
            {circleDefaultImage && <span className='mdi mdi-upload' />}
          </Button>
        )) ||
          customUploadButton}
      </div>
      {!circleDefaultImage && (
        <span className={counterClasses}>
          {`${uploadedFiles.length} ${
            (accept &&
              accept.includes('image') &&
              (
                t`${translationPathShared}${
                  (uploadedFiles.length > 1 && 'images-uploaded') || 'image-uploaded'
                }`
              )) ||
           (
            t`${translationPathShared}${
                (uploadedFiles.length > 1 && 'files-uploaded') || 'file-uploaded'
              }`
            )
          }`}
        </span>
      )}
      <GalleryComponent
        isOpen={isOpenGallery}
        dataInput=''
        elements={uploadedFiles}
        titleText={titleText}
        onCloseClicked={() => setIsOpenGallery(false)}
        translationPathShared={translationPathShared}
        translationPath={translationPath}
        idRef={`${idRef}Editor`}
      />
    </div>
  );
};
UploaderComponentCircular.propTypes = {
  initUploadedFiles: PropTypes.instanceOf(Array),
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  uploaderClasses: PropTypes.string,
  idRef: PropTypes.string,
  dropzoneWrapper: PropTypes.string,
  inputClasses: PropTypes.string,
  chipClasses: PropTypes.string,
  translationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  accept: PropTypes.string,
  customDeleteButton: PropTypes.func,
  customUploadButton: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  multiple: PropTypes.bool,
  chipsDisabled: PropTypes.func,
  uploadedChanged: PropTypes.func,
  isDisabled: PropTypes.bool,
  circleDefaultImage: PropTypes.string,
};
UploaderComponentCircular.defaultProps = {
  initUploadedFiles: [],
  customDeleteButton: undefined,
  wrapperClasses: 'uploader-wrapper',
  labelClasses: 'texts-form',
  uploaderClasses: 'uploader-container',
  counterClasses: 'counter-text',
  dropzoneWrapper: 'dropzone-wrapper',
  inputClasses: 'file-input',
  chipClasses: 'uploader-chip',
  dropHereClasses: 'drop-here',
  idRef: 'uploaderChipRef',
  translationPath: '',
  translationPathShared: 'Shared:uploaderComponent.',
  accept: 'image/*',
  titleText: undefined,
  labelValue: undefined,
  customUploadButton: undefined,
  multiple: false,
  chipsDisabled: () => false,
  uploadedChanged: undefined,
  isDisabled: false,
  circleDefaultImage: undefined,
};
