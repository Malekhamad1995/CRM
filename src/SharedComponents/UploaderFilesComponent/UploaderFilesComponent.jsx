import React, {
  useRef, useState, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Fab } from '@material-ui/core';
import { uploadFile } from '../../Services';
import { UploaderThemesEnum, DefaultImagesEnum } from '../../Enums';
import { InputThemeComponent } from '../../Components/UploaderComponent/UploaderThemes/InputThemeComponent/InputThemeComponent';
import { BoxThemeComponent } from './UploaderThemes/BoxThemeComponent/BoxThemeComponent';

import { GalleryComponent } from '../../Components';
import { GalleryShowThemeComponent } from '../../Components/UploaderComponent/UploaderThemes/GalleryShowThemeComponent/GalleryShowThemeComponent';
import { formatSizeUnits } from '../../Helper/formatCommas.Helper';

export const UploaderFilesComponent = ({

  labelWrapper,
  MainTitewrapperClasses,

  wrapperClasses,
  uploaderClasses,
  counterClasses,
  inputClasses,
  labelClasses,
  accept,
  multiple,
  initUploadedFiles,
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
  WithoutDefaultImg,
  uploadedallFiles,
  openGallery,
  // newFileName
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const uploadRef = useRef(null);
  const [allFiles, setAllFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const FormatArry = ['.png', '.jpg', '.svg', '.gif', '.svg', '.exe', '.pdf', '.pdf', '.txt', '.jpg', '.jpeg', '.txt', '.png'];
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpenGallery, setIsOpenGallery] = useState(false);

  const uploadHandler = (files) => {
    files.map((item) => {
      uploadFile({ file: item.file }).then((response) => {
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
        });
    });
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
          ModifiedDate: file.lastModified,
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
          ModifiedDate: event.target.files[0].file.lastModified,
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
      if (localFiles && localFiles.length === 0)
        uploadedallFiles([]);

      setUploadedFiles(localFiles);
      setAllFiles((items) => {
        items.splice(index, 1);
        return [...items];
      });
    },
    [uploadedChanged, uploadedFiles, uploadedallFiles]
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
          date: Date.now(),
          file,
          ModifiedDate: file.lastModified,
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
          ModifiedDate: event.target.files[0].ModifiedDate,
          file: event.target.files[0],
          status: 'uploading',
        },
      ];
    }
    setAllFiles((items) => (multiple && items.concat(files)) || files);
    uploadHandler(files);
    event.target.value = null;
  };

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
  }, [allFilesChanged, openGallery]);

  useEffect(() => {
    uploadedallFiles(allFiles);
  }, [allFiles]);

  return (

    <div className={wrapperClasses}>
      <div className={`label-MainTitewrapper ${MainTitewrapperClasses}`}>
        <div className={`label-wrapper ${labelWrapper}`}>

          File Upload

        </div>
        <div className='border-container'>
          {' '}
          <div className='border' />
        </div>
      </div>
      <div className='Upload-container'>
        <div className='Box-container'>

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
        </div>

        <div className='view-types-wrapper w-100'>

          <div className='tabel-main-conetner'>
            <div className='tabel-conetner'>
              <div className='tabel-co-1'>fileNam</div>
              <div className='tabel-co'>size</div>
              <div className='tabel-co'>type</div>
              <div className='tabel-co'>
                date
              </div>
              <div className='tabel-co'>
                Modified Date
              </div>
              <div className='tabel-co'>
                Deleted
              </div>
            </div>
            <div className='main-uploader-wrapper-tabel'>
              {allFiles.map((item, i) => (
                <div
                  className={`tabel-conetner ${i % 2 === 0 ? 'odd' : 'even'
                    }`}
                  index={i}
                  value={item}
                >
                  <div className='tabel-co-1'>
                    {(item && item.fileName).replace(new RegExp(FormatArry.join('|')), '') ||
                      ''}

                  </div>
                  <div className='tabel-co'>
                    {formatSizeUnits(item && item.size) ||
                      ''}

                  </div>
                  <div className='tabel-co'>
                    {((item && item.type && item.type.replace('image/', '')) ||
                      '')}

                  </div>
                  <div className='tabel-co'>
                    {moment(item && item.date).format('YYYY-MM-DD  HH:mm:ss') ||
                      ''}

                  </div>
                  <div className='tabel-co'>
                    {moment(item && item.ModifiedDate).format('YYYY-MM-DD  HH:mm:ss') ||
                      ''}

                  </div>
                  <div className='Fab-contenar'>
                    <div className='icon2'>
                      <Fab size='small' color='secondary' aria-label='add' onClick={fileDeleted(item, i)}>
                        <span className='mdi mdi-trash-can-outline' />
                      </Fab>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
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
UploaderFilesComponent.propTypes = {

  labelWrapper: PropTypes.string,
  MainTitewrapperClasses: PropTypes.string,

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
UploaderFilesComponent.defaultProps = {
  initUploadedFiles: [],
  wrapperClasses: 'uploader-wrapper',
  labelWrapper: '',
  MainTitewrapperClasses: '',

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
  uploaderTheme: UploaderThemesEnum.box.key,
  multiple: true,
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
