import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonBase, Fab
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getPublicDownloadableLink } from '../../../../../../../../Helper';
import { DefaultImagesEnum } from '../../../../../../../../Enums';

export const GalleryShowThemeComponent = ({
  allFiles,
  isDragOver,
  parentTranslationPath,
  translationPathShared,
  fileDeleted,
  uploadRef,
  multiple,
  accept,
  idRef,
  Disabledimg,
  isDisabled,
  isOneFile
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div className='GalleryShowThemeComponent'>
      <div className={`uploader-outer-card${(isDragOver && ' drag-over') || ''}`}>
        <div className='d-flex-center'>
          <img
            src={DefaultImagesEnum.Uploadmark.defaultImg}
            className='Uploaded-icon-GalleryShow'
            alt={t(`${translationPathShared}image`)}
          />
        </div>
        <div className='d-flex-center pt-2'>
          {(accept
            && accept.includes('image')
            && t(`${translationPathShared}${(multiple && 'browse-images') || 'browse-image'}`)) ||
            t(`${translationPathShared}${(multiple && 'Drag-and-drop-here-or-browse-File') || 'Drag-and-drop-here-or-browse-File'}`)}

        </div>
        <div className='d-flex-center pt-3'>
          <ButtonBase className='btns theme-solid mx-2' onClick={() => uploadRef.current.click()} disabled={isOneFile&&allFiles&&allFiles.length}>
            <span className='px-1'>{t(`${translationPathShared}browse-image`)}</span>
          </ButtonBase>
        </div>
      </div>

      <div className='Files-uplded'>
        {allFiles.map((item, index) => (
          <div
            className='uploader-card'
            style={{
              backgroundImage: `url(${(getPublicDownloadableLink(item.uuid)) ||
                (DefaultImagesEnum.buildings.key
                  .defaultImg) ||
                undefined
                })`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
            label={item.fileName}
            disabled={Disabledimg(item, index) || isDisabled}
            key={`${idRef}uploader${index + 1}`}

            clickable
          >
            <div className='select-card' />
            <div className='Fab-contenar'>
              <div className='icon'>
                <Fab
                  size='small'
                  color='secondary'
                  aria-label='Delete'
                  onClick={(item.status !== 'uploading' && fileDeleted(item, index)) || undefined}
                >
                  <span className='mdi mdi-trash-can-outline' />
                </Fab>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

GalleryShowThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array).isRequired,
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  fileDeleted: PropTypes.func.isRequired,
  Disabledimg: PropTypes.func.isRequired,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  multiple: PropTypes.bool.isRequired,
  accept: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
};
GalleryShowThemeComponent.defaultProps = {
  parentTranslationPath: '',
};
