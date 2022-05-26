import React from 'react';
import PropTypes from 'prop-types';
import { UploaderComponent } from '../../../../../../../Components';
import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../../../../Enums';
import { TokenTableComponent } from '../TokenTableComponent/TokenTableComponent';

export const EmailTemplateComponent = ({
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => (
  <div className='email-template-wrapper childs-wrapper'>
    <div className='w-100 mb-3'>
      <UploaderComponent
        idRef='emailUploadRef'
        isOpenGallery
        accept='*'
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        labelValue='upload-file'
        multiple={false}
        uploaderTheme={UploaderThemesEnum.box.key}
        defaultImage={DefaultImagesEnum.upload.key}
        initUploadedFiles={
          (state.templateFileId && [
            {
              uuid: state.templateFileId,
              fileName: state.templateFileName,
            },
          ]) ||
          []
        }
        uploadedChanged={(files) => {
          onStateChanged({
            id: 'edit',
            value: {
              ...state,
              templateFileId: (files.length > 0 && files[0].uuid) || null,
              templateFileName: (files.length > 0 && files[0].fileName) || null,
            },
          });
        }}
      />
    </div>
    <TokenTableComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  </div>
);

EmailTemplateComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
