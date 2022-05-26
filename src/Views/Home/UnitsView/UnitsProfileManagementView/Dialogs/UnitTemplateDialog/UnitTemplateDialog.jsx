import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { DialogComponent, Spinner } from '../../../../../../Components';
import { DownloadHtmlTemplate } from '../../../../../../Services';
import { getDownloadableLink, showError } from '../../../../../../Helper';
import HeaderPSIAssetsTemplet from '../../../../../../assets/images/defaults/HeaderPSIAssetsTemplet.jpg';
import FooterPSIAssetsTemplet from '../../../../../../assets/images/defaults/FooterPSIAssetsTemplet.jpg';
import PSIHeaderTemplet from '../../../../../../assets/images/defaults/PSIHeader.png';
import PSIFooterTemplet from '../../../../../../assets/images/defaults/PSIFooter.png';

export const UnitTemplateDialog = ({
  templateId,
  unitId,
  templateName,
  isOpen,
  isOpenChanged,
  emailClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [headerFooter, setHeaderFooter] = useState({
    imageHeaderId: '',
    imageFooterId: ''
  });
  const [file, setFile] = useState(null);
  const mediaprint = '@media print {footer {position: fixed !important;bottom: 0 !important;}strong, b {font-weight: bold !important;}@page {size:8.27in 11.69in !important;margin: 1cm 1cm 1cm 1cm !important;}}@media print {header {position: fixed !important;top: 0 !important;left: 0 !important;right: 0 !important;text-align:center !important;width: 100% !important;}strong, b {font-weight: bold !important;}@page {size:8.27in 11.69in !important;margin: .5cm !important;}}';
  const [fileUrl, setFileUrl] = useState(null);
  const saveHandler = async () => {
    // event.preventDefault();
    if (emailClicked) emailClicked(file);
    if (isOpenChanged) isOpenChanged();
  };

  const getDownloadTemplate = useCallback(async () => {
    setIsLoading(true);
    const res = await DownloadHtmlTemplate(unitId, templateId);
    if (!((res && res.status && res.status !== 200) || !res)) {
      setFile(res && res.content);
      setHeaderFooter({
        imageHeaderId: res && res.imageHeaderId,
        imageFooterId: res && res.imageFooterId
      });
      const localFile = new File([res.content], `${templateName}.pdf` || 'unit-template-file.pdf', {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(localFile);
      setFileUrl(url);
      const content = document.getElementById('divcontents');
      const pri = document.getElementById('ifmcontentstoprint').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
    } else if (res.data) {
      // const reader = new FileReader();
      // reader.readAsText(res.data);
      // reader.onload = () => {
      //   const result = JSON.parse(reader.result);
      //   showError(
      //     t(
      //       `${translationPath}${
      //         (result &&
      //           result.Message &&
      //           result.Message.substring(
      //             result.Message.lastIndexOf(':') + 1,
      //             result.Message.length
      //           )) ||
      //         'failed-to-get-unit-template'
      //       }`
      //     )
      //   );
      //   if (isOpenChanged) isOpenChanged();
      // };
    } else {
      showError(t(`${translationPath}failed-to-get-unit-template`));
      if (isOpenChanged) isOpenChanged();
    }
    setIsLoading(false);
  }, [isOpenChanged, t, templateId, templateName, translationPath, unitId]);

  useEffect(() => {
    getDownloadTemplate();
  }, [getDownloadTemplate]);

  const printPartOfPage = async () => {
    const pri = document.getElementById('ifmcontentstoprint').contentWindow;
    pri.document.close();
    pri.focus();
    pri.print();
  };
  return (
    <DialogComponent
      titleText='unit-preview-template'
      saveText='email'
      maxWidth='lg'
      dialogContent={(
        <div className='unit-template-wrapper view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='PrintorsavePDF'>
            <ButtonBase
              className='btns theme-outline mb-2 '
              onClick={() => {
                printPartOfPage();
              }}
            >
              <span className='mdi mdi-printer' />
              {t(`${translationPath}Printorsave`)}
              <span className='mdi mdi-file-pdf-box' />
            </ButtonBase>

          </div>
          <div id='divcontents' style={{ display: 'none' }}>
            {headerFooter.imageHeaderId !== null && (
              <header className='header'>
                <img alt='HeaderPSITemplet' src={getDownloadableLink(headerFooter.imageHeaderId) || null} style={{ width: '100%' }} />
              </header>
            )}
            <style>
              {mediaprint}
            </style>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: file }}
            />

            {headerFooter.imageFooterId !== null && (
              <footer>
                <img alt='FooterPSITemplet' src={getDownloadableLink(headerFooter.imageFooterId) || null} style={{ width: '100%' }} />
              </footer>
            )}
          </div>
          <iframe
            id='ifmcontentstoprint'
            title='ifmcontentstoprint'
            style={{ minHeight: 500 }}
            width='100%'
            height='100%'
          />

        </div>
      )}
      isOpen={isOpen}
      onSaveClicked={saveHandler}
      saveType='button'
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

UnitTemplateDialog.propTypes = {
  templateId: PropTypes.number.isRequired,
  unitId: PropTypes.number.isRequired,
  templateName: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  // templateFileChanged: PropTypes.func,
  emailClicked: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
UnitTemplateDialog.defaultProps = {
  templateName: undefined,
  emailClicked: undefined,
};
