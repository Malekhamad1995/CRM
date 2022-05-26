import React, {
  useRef, useState, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { uploadFile } from '../../Services';
import { GalleryComponent } from '../GalleryComponent/GalleryComponent';
import { UploaderThemesEnum, DefaultImagesEnum } from '../../Enums';
import { InputThemeComponent } from './UploaderThemes/InputThemeComponent/InputThemeComponent';
import { CircleThemeComponent } from './UploaderThemes/CircleThemeComponent/CircleThemeComponent';
import { BoxThemeComponent } from './UploaderThemes/BoxThemeComponent/BoxThemeComponent';
import { GalleryShowThemeComponent } from './UploaderThemes/GalleryShowThemeComponent/GalleryShowThemeComponent';

export const UploaderComponent = ({
  wrapperClasses,
  uploaderClasses,
  counterClasses,
  inputClasses,
  labelClasses,
  accept,
  multiple,
  initUploadedFiles,
  chipsDisabled,
  Disabledimg,
  translationPath,
  parentTranslationPath,
  translationPathShared,
  uploadedChanged,
  allFilesChanged,
  titleText,
  labelValue,
  isDisabled,
  idRef,
  defaultImage,
  viewUploadedFilesCount,
  dropHereText,
  uploaderTheme,
  chipHandler,
  WithoutDefaultImg,
  openGallery,
 // newFileName
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const uploadRef = useRef(null);
  const [allFiles, setAllFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpenGallery, setIsOpenGallery] = useState(false); 
  const [oneFile , setOneFile] = useState({file:{lastModified:0 ,lastModifiedDate:{} , name:"" , size:0 , type:"" , webkitRelativePath:""}})

  const uploadHandler = (files) => {
    files.map((item) =>{
      uploadFile({ file: item.file }) .then((response) => {
          if (multiple) uploadedFiles.push(response);
          const localUploadedFiles = (multiple && uploadedFiles) || [{ ...response }];
          setUploadedFiles(localUploadedFiles);
          uploadedChanged(localUploadedFiles);
          setUploadedFiles(localUploadedFiles);
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
        })});
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
      const localFiles = [...uploadedFiles];
      localFiles.splice(uploadedFilesIndex, 1);
      setUploadedFiles(localFiles);
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
  const chipClicked = useCallback(() => {
    setIsOpenGallery(true);
  }, []);
  useEffect(() => {
    if (initUploadedFiles && initUploadedFiles.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles(initUploadedFiles);
      setAllFiles(initUploadedFiles);
    }
  }, [initUploadedFiles, uploadedFiles.length]);
  useEffect(() => {
    setIsOpenGallery(false || openGallery);
    if (allFilesChanged) {
      allFilesChanged(allFiles);
      setIsOpenGallery(true);
    }
  }, [allFiles, allFilesChanged]);

  return (
    <div className={wrapperClasses}>
      {labelValue && (
        <label
          htmlFor={idRef}
          className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}
        >
          {t(`${translationPath}${labelValue}`)}
        </label>
      )}
      <input
        ref={uploadRef}
        type='file'
        className={inputClasses}
        multiple={multiple}
        accept={accept}
        onChange={inputChanged}
        disabled={isDisabled}
      />
      <div
        className={uploaderClasses}
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
      >

       {uploaderTheme === UploaderThemesEnum.input.key && (
          <InputThemeComponent
            allFiles={allFiles}
            isDragOver={isDragOver}
            translationPathShared={translationPathShared}
            fileDeleted={fileDeleted}
            chipClicked={chipHandler || chipClicked || undefined}
            uploadRef={uploadRef}
            multiple={multiple}
            accept={accept}
            idRef={idRef}
            chipsDisabled={chipsDisabled}
            isDisabled={isDisabled}
          />
        )}
        {uploaderTheme === UploaderThemesEnum.circle.key && (
          <CircleThemeComponent
            allFiles={allFiles}
            defaultImage={defaultImage}
            isDragOver={isDragOver}
            translationPathShared={translationPathShared}
            fileDeleted={fileDeleted}
            uploadRef={uploadRef}
          />
        )}
        {uploaderTheme === UploaderThemesEnum.box.key && (
          <BoxThemeComponent
            file={(allFiles.length > 0 && allFiles[0]) || undefined}
            defaultImage={defaultImage}
            isDragOver={isDragOver}
            WithoutDefaultImg={WithoutDefaultImg}
            translationPathShared={translationPathShared}
            fileDeleted={fileDeleted}
            uploadRef={uploadRef}
            dropHereText={dropHereText}
            multiple={multiple}
            accept={accept}
          />
        )}
        {uploaderTheme === UploaderThemesEnum.GalleryShow.key && (
          <GalleryShowThemeComponent
            allFiles={allFiles}
            isDragOver={isDragOver}
            translationPathShared={translationPathShared}
            fileDeleted={fileDeleted}
            uploadRef={uploadRef}
            multiple={multiple}
            accept={accept}
            idRef={idRef}
            Disabledimg={Disabledimg}
            isDisabled={isDisabled}
          />
        )}
        {viewUploadedFilesCount && (
          <span className={counterClasses}>
            {`${uploadedFiles.length} ${(accept &&
              accept.includes('image') &&
              t(
                `${translationPathShared}${(uploadedFiles.length > 1 && 'images-uploaded') || 'image-uploaded'
                }`
              )) ||
              t(
                `${translationPathShared}${(uploadedFiles.length > 1 && 'files-uploaded') || 'file-uploaded'
                }`
              )
              }`}
          </span>
        )}
      </div>
      {isOpenGallery && (
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
      )}
    </div>
  );
};
UploaderComponent.propTypes = {
  initUploadedFiles: PropTypes.instanceOf(Array),
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  uploaderClasses: PropTypes.string,
  idRef: PropTypes.string,
  inputClasses: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  accept: PropTypes.string,
  counterClasses: PropTypes.string,
  titleText: PropTypes.string,
  uploaderTheme: PropTypes.oneOf(Object.values(UploaderThemesEnum).map((item) => item.key)),
  multiple: PropTypes.bool,
  chipsDisabled: PropTypes.func,
  Disabledimg: PropTypes.func,
  chipHandler: PropTypes.func,
  uploadedChanged: PropTypes.func,
  allFilesChanged: PropTypes.func,
  isDisabled: PropTypes.bool,
  WithoutDefaultImg: PropTypes.bool,
  viewUploadedFilesCount: PropTypes.bool,
  defaultImage: PropTypes.string,
  dropHereText: PropTypes.string,
};
UploaderComponent.defaultProps = {
  initUploadedFiles: [],
  wrapperClasses: 'uploader-wrapper',
  labelClasses: '',
  uploaderClasses: 'uploader-container',
  counterClasses: 'counter-text',
  inputClasses: 'file-input',
  idRef: 'uploaderChipRef',
  translationPath: '',
  parentTranslationPath: '',
  translationPathShared: 'Shared:uploaderComponent.',
  accept:
    'image/*,application/pdf,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  titleText: undefined,
  chipHandler: undefined,
  labelValue: undefined,
  uploaderTheme: UploaderThemesEnum.input.key,
  multiple: false,
  WithoutDefaultImg: false,
  chipsDisabled: () => false,
  Disabledimg: () => false,
  allFilesChanged: undefined,
  uploadedChanged: undefined,
  isDisabled: false,
  viewUploadedFilesCount: false,
  defaultImage: DefaultImagesEnum.corporate.key,
  dropHereText: 'drop-here',
};
