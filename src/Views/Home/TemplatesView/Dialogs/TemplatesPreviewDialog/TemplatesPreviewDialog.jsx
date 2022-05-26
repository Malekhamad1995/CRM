import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogComponent, Inputs, LoadableImageComponant } from '../../../../../Components';
import { getMimeTypeHandler } from '../../../../../Utils';
import { getDownloadableLink } from '../../../../../Helper';
import { TemplatesTypesEnum } from '../../../../../Enums';

export const TemplatesPreviewDialog = ({
  activeItem,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  maintitleText
}) => {
  const iframeRef = useRef(null);
  const [fileRead, setFileRead] = useState(null);
  useEffect(() => {
    if (activeItem.templateFileName && /\.txt+$/.test(activeItem.templateFileName)) {
      const txtFile = new XMLHttpRequest();
      txtFile.open('GET', getDownloadableLink(activeItem.templateFileId), true);
      txtFile.onload = () => {
        if (txtFile.readyState === 4)
          if (txtFile.status === 200) setFileRead(txtFile.responseText.split('\n'));
      };
      txtFile.send(null);
    } else if (activeItem.templateFileName && /\.html+$/.test(activeItem.templateFileName)) {
      const txtFile = new XMLHttpRequest();
      txtFile.open('GET', getDownloadableLink(activeItem.templateFileId), true);
      // const blob = new Blob([getDownloadableLink(activeItem.templateFileId)]);
      // oFReader.readAsBinaryString(blob);
      // oFReader.onload = (oFREvent) => {

      //   setFileRead(oFREvent.target.result);
      // };
      txtFile.onload = () => {
        if (txtFile.readyState === 4)
          if (txtFile.status === 200) iframeRef.current.innerHTML = txtFile.response;
      };
      txtFile.send(null);
    }
  }, [activeItem.templateFileId, activeItem.templateFileName]);
  return (
    <DialogComponent
      titleText={maintitleText}
      dialogContent={(
        <div className='templates-preview-dialog'>
          {((!activeItem.templateFileId || !activeItem.templateFileName) && (
            <Inputs
              idRef='templateSMSRef'
              labelValue={
                (activeItem.templateTypeId === TemplatesTypesEnum.SMS.key && 'sms-text') ||
                'whatsapp-text'
              }
              value={activeItem.templateText || ''}
              multiline
              rows={6}
              isDisabled
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )) ||
            (getMimeTypeHandler(activeItem.templateFileName).isImage && (
              <div className='template-image-wrapper'>
                <LoadableImageComponant
                  classes='template-image'
                  alt={activeItem.templateFileName}
                  src={getDownloadableLink(activeItem.templateFileId)}
                />
              </div>
            )) ||
            (/\.txt+$/.test(activeItem.templateFileName) && (
              <Inputs
                idRef='fileTextRef'
                labelValue='file-text'
                value={fileRead || ''}
                multiline
                rows={6}
                isDisabled
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            )) ||
            (/\.html+$/.test(activeItem.templateFileName) && (
              <div className='template-iframe-wrapper' ref={iframeRef} />
            )) || (
              <iframe
                title={activeItem.templateFileName}
                width='100%'
                height='100%'
                src={`https://docs.google.com/gview?url=${getDownloadableLink(
                  activeItem.templateFileId
                )}&embedded=true`}
                style={{ minHeight: 500 }}
              />
            ) || (
              <div className='template-iframe-wrapper' ref={iframeRef}>
                {/* <object
                  data={getDownloadableLink(activeItem.templateFileId)}
                  type='application/pdf'
                  width='750px'
                  height='750px'
                >
                </object> */}
                {/* <iframe
                  src={fileRead}
                  width='100%'
                  height='100%'
                  title={activeItem.templateFileName}
                  frameBorder='0'
                  marginWidth='0'
                  marginHeight='0'
                  scrolling='no'
                  allowFullScreen
                /> */}
                {/* <object
                  data={fileRead}
                  aria-label={activeItem.templateFileName}
                  width='100%'
                  height='100%'
                /> */}
                {/* <object
                  //   data={fileRead}
                  title={activeItem.templateFileName}
                  aria-label={activeItem.templateFileName}
                  //   type='text/plain'
                  //   src={fileRead}
                  className='template-iframe'
                  height='100%'
                  width='100%'
                >
                  {fileRead}
                </object> */}
              </div>
            )}
        </div>
      )}
      saveType='button'
      isOpen={isOpen}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

TemplatesPreviewDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  maintitleText: PropTypes.string,
};
TemplatesPreviewDialog.defaultProps = {
  activeItem: null,
  maintitleText: 'preview-template',
};
