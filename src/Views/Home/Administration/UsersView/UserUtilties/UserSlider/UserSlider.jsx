import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import moment from 'moment';
import { getDownloadableLink, showinfo } from '../../../../../../Helper';
import { LoadableImageComponant } from '../../../../../../Components';
import { ContactTypeEnum, LoadableImageEnum } from '../../../../../../Enums';
import { Tooltip } from '@material-ui/core';

const translationPath = 'Users.';

const UserSlider = ({ item, index }) => {
  const { t } = useTranslation('UsersView');
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

  return (
    <div className='sliderUser'>
      <div className='users-card-component-wrapper'>
        <div className='users-card-wrapper' key={`userCardRef${index + 1}`}>
          <div className='cards-wrapper'>
            <div className='cards-header'>
              <div>
                <LoadableImageComponant
                  type={LoadableImageEnum.div.key}
                  classes='user-cover-image'
                  alt={t(`${translationPath}user-image`)}
                  src={
                    ((item && item.profileImg) && getDownloadableLink(item && item.profileImg)) ||
                    ContactTypeEnum.man.defaultImg
                  }
                />
              </div>
              <div className='d-flex-column'>
                <div className='px-2 item-wrapper name-wrapper'>
                  {item.userId &&
                    <div className='copyId textcard'>
                      <div className='user-id'>
                        <span className='itemid'>
                          {t(`${translationPath}ID`)}{" : "} {item && item.userId}
                        </span>
                        <textarea readOnly aria-disabled value={item && item.userId} ref={textArea} />
                      </div>

                      <Tooltip title={t(`${translationPath}copy`)}>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            copyTextToClipboard(item && item.userId);
                          }}
                          className='mdi mdi-content-copy'
                        />
                      </Tooltip>
                    </div>}
                  <span className='item-header'>{item && item.fullName}</span>
                </div>
                <div className='item-wrapper'>
                  <span className='item-header px-2 textcard'>
                    {t(`${translationPath}Username`)}
                    :
                  </span>
                  <span className='item-body'>{item && item.userName}</span>
                </div>
                {item.userTypes && item.userTypes.length > 0 && (
                  <div className='item-wrapper'>
                    <span className='item-body c-secondary'>
                      {item.userTypes
                        && item.userTypes.map((subItem, subIndex) => (
                          <span key={`userRolesRef${(subIndex + 1) * (index + 1)}`}>
                            {subItem && subItem.rolesName}
                            {subIndex < (item && item.userTypes.length - 1) && (
                              <span className='pr-1'>,</span>
                            )}
                          </span>
                        ))}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='cards-body'>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-phone px-2 icon' />
                </span>
                <span className='item-body'>
                  {item && item.phoneNumber || t(`${translationPath}N/A`)}
                  {' '}
                </span>
              </div>
              <div className='item-wrapper flex-nowrap'>
                <div className='texts-truncate d-flex'>
                  <span className='item-header'>
                    <span className='mdi mdi-email-outline px-2 icon' />
                  </span>
                  <span
                    className='item-body texts-truncate d-inline-block'
                    title={item && item.email || t(`${translationPath}N/A`)}
                  >
                    {item && item.email || t(`${translationPath}N/A`)}
                  </span>
                </div>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-whatsapp px-2 icon' />
                </span>
                <span className='item-body'>
                  {item && item.whatsAppNumber || t(`${translationPath}N/A`)}
                </span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-map-marker px-2 icon' />
                  <span className='textcard'>
                    {t(`${translationPath}Place-of-resldence`)}
                    :
                  </span>
                </span>
                <span className='item-body'>
                  {item && item.nationalityName || t(`${translationPath}N/A`)}
                </span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-calendar-blank px-2 icon' />
                  <span className='textcard'>
                    {t(`${translationPath}register`)}
                    :
                  </span>
                </span>
                <span className='item-body'>
                  {(item.createdOn
                    && moment(item && item.createdOn).locale(i18next.language).format('DD/MM/YYYY')) ||
                    t(`${translationPath}N/A`)}
                </span>
              </div>

              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-account-check px-2 icon' />
                  <span className='textcard'>
                    {' '}
                    {t(`${translationPath}Status`)}
                    :
                  </span>
                </span>
                <span className='item-body'>
                  {item && item.userStatus === 'Active' ?
                    t(`${translationPath}Active`) :
                    (item && item.userStatus === 'Pending' ? t(`${translationPath}Pending`) : t(`${translationPath}Deactive`)) || t(`${translationPath}N/A`)}
                  <span
                    className={item && item.userStatus === 'Active' ? 'state-online ' : 'state-offline '}
                  />
                </span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className='mdi mdi-database px-2 icon'>
                    <span className='textcard'>
                      {t(`${translationPath}data-source`)}
                      :
                    </span>
                    <span className='item-body'>{item && item.dataSource || t(`${translationPath}N/A`)}</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserSlider;
