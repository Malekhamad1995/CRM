import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@material-ui/core';
import { LoadableImageComponant } from '../../../../../../Components';
import { GlobalHistory, showinfo } from '../../../../../../Helper';
import { ContactTypeEnum } from '../../../../../../Enums';

export const LandlordsCard = ({ parentTranslationPath, translationPath, data }) => {
  const { t } = useTranslation(parentTranslationPath);
  const textArea = useRef(null);

  const copyTextToClipboard = (itemId) => {
    const context = textArea.current;
    if (itemId && context) {
      context.value = itemId;
      context.select();
      document.execCommand('copy');
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
    } else
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
  };

  const OpenContactfile = (item) => {
    GlobalHistory.push(`/home/Contacts-CRM/contact-profile-edit?formType=${1}&id=${item}`);
  };

  return (
    <div className='CARD-Landlords'>
      {data &&
        data.map((item) => (
          <div className='Card-wrapper'>
            <div className='hedar-Card-wrapper'>
              <div>
                <LoadableImageComponant
                  classes='img-land'
                  alt='img-land'
                  src={
                    ContactTypeEnum.man.defaultImg
                  }
                />
              </div>
              <div className='text-contenar'>
                <div className='contact-name'>
                  {' '}
                  {item.contactName}
                </div>
                <div className='land'>{t(`${translationPath}Landlord`)}</div>
              </div>
            </div>
            <div className='body-card'>
              <div className='ref-led'>
                <span className='text-title-id '>
                  {t(`${translationPath}ContactID`)}
                  {' '}
                  :
                  {' '}
                  {' '}
                  {item.contactId || 'N/A'}
                  {' '}
                </span>
                <textarea readOnly aria-disabled value={item.contactId} ref={textArea} />
                <Tooltip title={t(`${translationPath}copy`)}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      copyTextToClipboard(item.contactId);
                    }}
                    className='mdi mdi-content-copy copyicon'
                  />
                </Tooltip>
              </div>
              <div className='ref'>
                <span className='text-title'>
                  {t(`${translationPath}phoneNumber`)}
                  {' '}
                  :
                  {' '}
                </span>
                {' '}
                {item.phoneNumber || 'N/A'}
              </div>
              <div className='ref'>
                <span className='text-title'>
                  {t(`${translationPath}email`)}
                  {' '}
                  :
                  {' '}
                </span>
                {item.email || 'N/A'}
              </div>
              <div className='ref'>
                <span className='text-title'>
                  {t(`${translationPath}UnitRef`)}
                  {' '}
                  :
                  {' '}
                </span>
                {item.unitRefNo || 'N/A'}
              </div>
            </div>
            <Button
              className='cards-footer-wrapper'
              onClick={() => {
                OpenContactfile(item.contactId);
              }}
            >
              <span className='mdi mdi-folder-outline icon-floder' />
              {' '}
              {t(`${translationPath}OpenContactfile`)}
              {' '}
            </Button>
          </div>
        ))}
    </div>
  );
};

LandlordsCard.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
