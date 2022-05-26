/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { uploadFile } from '../../../../../../Services';

export const UnitUploader = ({
 images, setImages, parentTranslationPath, translationPath
}) => {
  const hiddenFileInput = React.useRef(null);
  const [, setIsLoading] = useState();
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fileChanged = useCallback((event) => {
    if (!event.target.value) return;
    setIsLoading(true);
    const currentList = [];
    Object.values(event.target.files).map(async (image) => {
      const response = await uploadFile({
        file: image,
      });
      currentList.push(response);
      setImages([...images, ...currentList]);
    });
  });
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className='unit-Uploader-wrapper'>
      <div className='Images'>
        <label>{t(`${translationPath}Upload-Images`)}</label>
        <div className='unit-Uploader'>
          <span className='mdi mdi-cloud-upload mdi-36px c-blue'> </span>
          <span className='drop'>{t(`${translationPath}Drag-Drop`)}</span>
          <input
            multiple
            className='inputfile'
            type='file'
            onChange={fileChanged}
            ref={hiddenFileInput}
          />
          <div>
            <Button className='save-btn-wrapper inputButton1' onClick={handleClick}>
              {t(`${translationPath}Browse-Image`)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

UnitUploader.propTypes = {
  images: PropTypes.instanceOf(Array).isRequired,
  setImages: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
