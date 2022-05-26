import React from 'react';
import PropTypes from 'prop-types';
import { Chip, Button, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const InputThemeComponent = ({
  allFiles,
  isDragOver,
  parentTranslationPath,
  translationPathShared,
  fileDeleted,
  chipClicked,
  uploadRef,
  multiple,
  accept,
  idRef,
  chipsDisabled,
  isDisabled,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div className={`input-theme-component-wrapper${(isDragOver && ' drag-over') || ''}`}>
      <div className='dropzone-wrapper'>
        {(allFiles.length === 0 || isDragOver) && (
          <div className={`drop-here${(allFiles.length > 0 && ' as-overlay') || ''}`}>
            {t(`${translationPathShared}drop-here`)}
          </div>
        )}
        {allFiles.map((item, index) => (
          <Chip
            className='uploader-chip'
            label={item.fileName}
            key={`${idRef}chip${index + 1}`}
            disabled={chipsDisabled(item, index) || isDisabled}
            onDelete={(item.status !== 'uploading' && fileDeleted(item, index)) || undefined}
            onClick={chipClicked(item, index)}
            clickable
            avatar={(item.status === 'uploading' && <CircularProgress size='small' />) || undefined}
          />
        ))}
      </div>
      <Button className='btns theme-transparent mx-0' onClick={() => uploadRef.current.click()}>
        <span className='mx-3 text-nowrap'>
          {(accept
            && accept.includes('image')
            && t(`${translationPathShared}${(multiple && 'browse-images') || 'browse-image'}`)) ||
            t(`${translationPathShared}${(multiple && 'browse-files') || 'browse-file'}`)}
        </span>
      </Button>
    </div>
  );
};

InputThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array).isRequired,
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  fileDeleted: PropTypes.func.isRequired,
  chipClicked: PropTypes.func.isRequired,
  chipsDisabled: PropTypes.func.isRequired,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  multiple: PropTypes.bool.isRequired,
  accept: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
};
InputThemeComponent.defaultProps = {
  parentTranslationPath: '',
};
