import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const ImportDetailsComponent = ({ activeItem, translationPath }) => {
  const { t } = useTranslation('ImportDetailsView');
  return (
    <div className='import-details-component-wrapper c-black-light px-2'>
      <div className='d-flex-column-center px-2 mb-3'>
        <span>{t(`${translationPath}excel-row-number`)}</span>
        <span className='fw-bold mb-2'>{activeItem.fileRow}</span>
        <span className='separator-h s-gray-lightest' />
      </div>
      <div>
        <div className='d-flex-v-center'>
          {(activeItem.isValid && <span className='mdi mdi-check mdi-24px icon-circle px-2' />) || (
            <span className='mdi mdi-message-alert mdi-flip-h mdi-36px c-danger px-2' />
          )}
          <span className='d-inline-flex-column-center-v'>
            <span>
              {t(`${translationPath}${(activeItem.isValid && 'success') || 'failed-reasons'}`)}
              :
              {' '}
            </span>
            <span>
              {t(
                `${translationPath}${
                  (activeItem.isValid && 'ready-for-import') || ''
                  // (activeItem.reason &&
                  //   activeItem.reason.length > 0 &&
                  //   activeItem.reason[0])
                }`
              )}
            </span>
          </span>
        </div>
        <div className='px-2 pt-2'>
          {activeItem &&
            activeItem.reason &&
            activeItem.reason.map((item, index) => (
              <p key={`errorRef${index + 1}`}>
                {'- '}
                {item}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

ImportDetailsComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  translationPath: PropTypes.string.isRequired,
};
