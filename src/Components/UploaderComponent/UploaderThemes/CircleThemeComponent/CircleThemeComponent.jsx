import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DefaultImagesEnum } from '../../../../Enums';
import { getDownloadableLink } from '../../../../Helper';

export const CircleThemeComponent = ({
  allFiles,
  defaultImage,
  isDragOver,
  parentTranslationPath,
  translationPathShared,
  fileDeleted,
  uploadRef,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <div className={`circle-theme-component-wrapper${(isDragOver && ' drag-over') || ''}`}>
      <div
        className="dropzone-wrapper"
        style={{
          backgroundImage: `url(${
            (allFiles.length > 0 && getDownloadableLink(allFiles[0].uuid))
            || (defaultImage
              && Object.values(DefaultImagesEnum).find((item) => item.key === defaultImage)
                .defaultImg)
            || undefined
          })`,
        }}
      >
        {(allFiles.length === 0 || isDragOver) && (
          <div className={`drop-here${(allFiles.length > 0 && ' as-overlay') || ''}`}>
            {t(`${translationPathShared}drop-here`)}
          </div>
        )}
      </div>
      {allFiles.length > 0 && (
        <Button
          className="btns-icon btn-close theme-solid bg-danger"
          onClick={fileDeleted(allFiles[0], 0)}
        >
          <span className="mdi mdi-close" />
        </Button>
      )}
      <Button className="btns-icon theme-solid" onClick={() => uploadRef.current.click()}>
        <span className="mdi mdi-upload" />
      </Button>
    </div>
  );
};

CircleThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array).isRequired,
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  defaultImage: PropTypes.oneOf(Object.values(DefaultImagesEnum).map((item) => item.key))
    .isRequired,
  fileDeleted: PropTypes.func.isRequired,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
};
CircleThemeComponent.defaultProps = {
  parentTranslationPath: '',
};
