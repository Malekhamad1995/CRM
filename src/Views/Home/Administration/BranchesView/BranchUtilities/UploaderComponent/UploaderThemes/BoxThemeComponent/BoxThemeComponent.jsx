import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getMimeTypeHandler } from '../../../../../../../../Utils';
import { LoadableImageComponant } from '../../../../../../../../Components/LoadableImageComponant/LoadableImageComponant';
import { LoadableImageEnum, DefaultImagesEnum } from '../../../../../../../../Enums';

export const BoxThemeComponent = ({
  file,
  defaultImage,
  uploadRef,
  isDragOver,
  accept,
  multiple,
  parentTranslationPath,
  translationPathShared,
  dropHereText,
  fileDeleted,
  WithoutDefaultImg,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div className={`box-theme-component-wrapper${(isDragOver && ' drag-over') || ''}`}>
      <div className='dropzone-wrapper'>
        <LoadableImageComponant
          src={
            (file && !WithoutDefaultImg && getMimeTypeHandler(file.fileName).image) ||
            (defaultImage &&
              Object.values(DefaultImagesEnum).find((item) => item.key === defaultImage)
                .defaultImg) ||
            undefined
          }
          classes='box-theme-image'
          alt={t(
            (defaultImage &&
              Object.values(DefaultImagesEnum).find((item) => item.key === defaultImage).alt) ||
              undefined
          )}
          type={LoadableImageEnum.div.key}
        />
        {file && file.status === 'uploading' && (
          <span className='mdi mdi-reload mdi-spin as-overlay-spinner' />
        )}
        <div className='drop-here'>{t(`${translationPathShared}${dropHereText}`)}</div>
        <Button className='btns theme-solid mx-0' onClick={() => uploadRef.current.click()}>
          <span className='mx-3 text-nowrap'>
            {(accept &&
              accept.includes('image') &&
              t(`${translationPathShared}${(multiple && 'browse-images') || 'browse-image'}`)) ||
              t(`${translationPathShared}${(multiple && 'browse-files') || 'browse-file'}`)}
          </span>
        </Button>
        {file && (
          <Button
            className='btns-icon btn-close theme-solid bg-danger'
            onClick={fileDeleted(file, 0)}
          >
            <span className='mdi mdi-close' />
          </Button>
        )}
      </div>
    </div>
  );
};

BoxThemeComponent.propTypes = {
  file: PropTypes.instanceOf(Object),
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  dropHereText: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  WithoutDefaultImg: PropTypes.bool,
  defaultImage: PropTypes.oneOf(Object.values(DefaultImagesEnum).map((item) => item.key))
    .isRequired,
  fileDeleted: PropTypes.func.isRequired,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
};
BoxThemeComponent.defaultProps = {
  file: undefined,
  parentTranslationPath: '',
  WithoutDefaultImg: false,
};
