import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import emptyImage from '../../../../assets/images/defaults/AllReports.png';
import arrowImage from '../../../../assets/images/defaults/arrowPhoto.png';

NoReportSelectionView.propTypes = {
    isShow: PropTypes.bool,
    translationPath: PropTypes.string,
    parentTranslationPath: PropTypes.string
};

function NoReportSelectionView({ isShow, translationPath, parentTranslationPath }) {
    const { t } = useTranslation(parentTranslationPath);
    if (!isShow) return (<></>);
    return (
      <>
        <div className='d-flex px-5'>
          <span className='px-2 d-flex'>
            <div className='px-5'>
              <div className='section arrowImage'>
                <img src={arrowImage} alt='arrowImage' />
              </div>
            </div>
          </span>
        </div>
        <div className='ReportEmptyPage'>
          <span>
            {t(`${translationPath}Empty-page`)}
          </span>
          <img src={emptyImage} alt='emptyImage' />
        </div>
      </>
    );
}

export default NoReportSelectionView;
