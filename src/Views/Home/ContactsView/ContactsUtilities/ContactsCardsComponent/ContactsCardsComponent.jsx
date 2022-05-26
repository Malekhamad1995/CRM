/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { ButtonBase, Tooltip } from '@material-ui/core';
import moment from 'moment-timezone';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  PopoverComponent,
  ProgressComponet,
} from '../../../../../Components';
import {
  ActionsEnum,
  ContactTypeEnum,
  LoadableImageEnum,
  UserAccountTypeEnum,
  ContactPreferenceEnum,
} from '../../../../../Enums';
import { getDownloadableLink, showinfo } from '../../../../../Helper';

export const ContactsCardsComponent = ({
  data,
  activeCard,
  isExpanded,
  onCardClicked,
  onFooterActionsClicked,
  parentTranslationPath,
  translationPath,
  notExpandedMax,
  withCheckbox,
  onCardCheckboxClick,
  selectedDetailsContactItem,
  onActionClicked,
  isCheckBoxDisabled,
  selectedCards,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [actionsAttachedWith, setActionsMenuAttachedWith] = useState(null);
  const [Activeitem, setActiveitem] = useState(null);
  const textArea = useRef(null);

  const getDefaultContactImage = useCallback(
    (contactType) => ContactTypeEnum[contactType] && ContactTypeEnum[contactType].defaultImg,
    []
  );
  const getIsSelectedCard = useCallback(
    (row) => selectedCards && selectedCards.findIndex((item) => item.id === row.id) !== -1,
    [selectedCards]
  );
  const handleClose = useCallback(() => {
    setActionsMenuAttachedWith(null);
  }, []);
  const menuOpenHandler = useCallback((event, index) => {
    setActiveitem(index);
    event.stopPropagation();
    event.preventDefault();
    setActionsMenuAttachedWith(event.currentTarget);
  }, []);

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
    <div className='contacts-cards-wrapper childs-wrapper'>
      {data.result &&
        data.result.map((item, index) => (
          <div
            className={`contacts-card-wrapper${isExpanded ? ' is-expanded' : ''}${(((activeCard && activeCard.id === item.id) ||
              (selectedDetailsContactItem && selectedDetailsContactItem.id === item.id)) &&
              ' is-open') ||
              ''
              }`}
            key={`contactsCardItemRef${index + 1}`}
          >
            {withCheckbox && (
              <div className='card-checkbox-wrapper'>
                <CheckboxesComponent
                  idRef={`contactsCheckboxItemRef${index + 1}`}
                  singleChecked={getIsSelectedCard(item)}
                  onSelectedCheckboxChanged={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onCardCheckboxClick(index, item);
                  }}
                  isDisabled={
                    (isCheckBoxDisabled && !getIsSelectedCard(item)) ||
                    (selectedCards &&
                      selectedCards[0] &&
                      selectedCards[0].userTypeId !== item.userTypeId)
                  }
                />
              </div>
            )}
            <a onClick={onCardClicked && onCardClicked(item, index)} className='cards-wrapper'>
              {item.accountType && UserAccountTypeEnum[item.accountType].curvedImg && (
                <Tooltip
                  title={t(`${translationPath}${UserAccountTypeEnum[item.accountType].value}`)}
                  placement='top-end'
                >
                  <div className='tag-curve-wrapper'>
                    <img
                      src={UserAccountTypeEnum[item.accountType].curvedImg}
                      alt={t(`${translationPath}account-type`)}
                      className='tag-curve-img'
                    />
                  </div>
                </Tooltip>
              )}
              <div className='cards-body-wrapper'>
                <div className='card-body-section'>
                  <div className='merge-wrapper'>
                    <LoadableImageComponant
                      classes='cover-image'
                      type={LoadableImageEnum.div.key}
                      alt={t(`${translationPath}contact-image`)}
                      src={
                        (item.imagePath && getDownloadableLink(item.imagePath)) ||
                        getDefaultContactImage(item.type)
                      }
                    />
                    {item.contactIds && (
                      <Tooltip title={t(`${translationPath}merged`)}>
                        <div className='merged-contact'>
                          <span className='mdi mdi-arrow-collapse-all' />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  {item.contactPreference && onActionClicked && (
                    <div className='actions-wrapper'>
                      {item.contactPreference.findIndex(
                        (el) => ContactPreferenceEnum.call.key === el.lookupItemId
                      ) !== -1 && (
                      <ButtonBase
                        className={ActionsEnum.phoneSolid.buttonClasses}
                        onClick={onActionClicked(ActionsEnum.phoneSolid.key, item)}
                      >
                        <span className={ActionsEnum.phoneSolid.icon} />
                      </ButtonBase>
                        )}
                      {item.contactPreference.findIndex(
                        (el) => ContactPreferenceEnum.sms.key === el.lookupItemId
                      ) !== -1 && (
                      <ButtonBase
                        className={ActionsEnum.smsSolid.buttonClasses}
                        onClick={onActionClicked(ActionsEnum.smsSolid.key, item)}
                      >
                        <span className={ActionsEnum.smsSolid.icon} />
                      </ButtonBase>
                        )}
                      {item.contactPreference.findIndex(
                        (el) => ContactPreferenceEnum.email.key === el.lookupItemId
                      ) !== -1 && (
                      <ButtonBase
                        className={ActionsEnum.emailSolid.buttonClasses}
                        onClick={onActionClicked(ActionsEnum.emailSolid.key, item)}
                      >
                        <span className={ActionsEnum.emailSolid.icon} />
                      </ButtonBase>
                        )}
                      {item.contactPreference.length < 4 &&
                        item.contactPreference.findIndex(
                          (el) => ContactPreferenceEnum.whatsapp.key === el.lookupItemId
                        ) !== -1 && (
                          <ButtonBase
                            className={ActionsEnum.whatsappSolid.buttonClasses}
                            onClick={onActionClicked(ActionsEnum.whatsappSolid.key, item)}
                          >
                            <span className={ActionsEnum.whatsappSolid.icon} />
                          </ButtonBase>
                        )}
                      {item.contactPreference.length > 3 && (
                        <>
                          <ButtonBase
                            className={ActionsEnum.dotsHorizontal.buttonClasses}
                            onClick={(event) => menuOpenHandler(event, index)}
                          >
                            <span className={ActionsEnum.dotsHorizontal.icon} />
                          </ButtonBase>
                          {Activeitem === index && (
                            <PopoverComponent
                              idRef={`actionsMenuRef${index + 1}`}
                              handleClose={handleClose}
                              attachedWith={actionsAttachedWith}
                              popoverClasses='popover-contact-prefernces'
                              component={(
                                <div key={`divMenuRef${index + 1}`}>
                                  {item.contactPreference &&
                                    item.contactPreference.findIndex(
                                      (el) => ContactPreferenceEnum.whatsapp.key === el.lookupItemId
                                    ) !== -1 && (
                                      <ButtonBase className='w-100' onClick={onActionClicked(ActionsEnum.whatsappSolid.key, item)}>
                                        <ButtonBase
                                          className={ActionsEnum.whatsappSolid.buttonClasses}
                                        >
                                          <span className={ActionsEnum.whatsappSolid.icon} />
                                        </ButtonBase>
                                        <span>
                                          {' '}
                                          {t(`${translationPath}whatsapp`)}
                                        </span>
                                      </ButtonBase>
                                    )}
                                </div>
                              )}
                            />
                          ) ||
                            ''}
                        </>
                      )}

                    </div>
                  )}
                  {/* {item.actions
                    .filter((filterItem, filterIndex) => filterIndex < 2)
                    .map((actionItem) => (
                      <div className='action-item' key={`view-actions-buttons${actionItem.enum}`}>
                        <ButtonBase
                          className={getActionValues(actionItem.enum).buttonClasses}
                          onClick={onActionClicked(actionItem.enum, data)}
                          disabled={actionItem.isDisabled}>
                          <span className={getActionValues(actionItem.enum).icon} />
                        </ButtonBase>
                      </div>
                    ))} */}
                </div>
                <div className={`card-body-section${isExpanded ? ' is-expanded' : ''}`}>
                  <div className='body-title-wrapper'>
                    <span className='body-title'>{item.name}</span>
                    <div className='hedar-card'>
                      <div className='created-on'>
                        <span className='details-icon mdi mdi-calendar mdi-16px' />
                        <span>
                          <span className='details-text'>
                            {t(`${translationPath}created`)}
                            :
                          </span>
                          <span className='px-1'>
                            {(item.creationDate &&
                              moment(item.creationDate)
                                .locale(i18next.language)
                                .format('DD/MM/YYYY')) ||
                              'N/A'}
                          </span>
                        </span>
                      </div>
                      <div className='contact-id-wrapper'>
                        <span className='idName'>
                          {t(`${translationPath}id`)}
                        </span>
                        {' '}
                        :
                        <div className='contact-id'>
                          <span className='itemid'>
                            {item.id}
                          </span>
                          <textarea readOnly aria-disabled value={item.id} ref={textArea} />
                        </div>
                        <Tooltip title={t(`${translationPath}copy`)}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              copyTextToClipboard(item.id);
                            }}
                            className='mdi mdi-content-copy'
                          />
                        </Tooltip>
                      </div>
                    </div>
                    {item.leadTypes && item.leadTypes.length > 0 && (
                      <div className='type-wrapper'>
                        {item.leadTypes.map((w, subIndex) => (
                          <div
                            key={`leadTypesRef${subIndex + 1}`}
                            className={`type-item ${w.toLowerCase()}`}
                          >
                            {t(`${translationPath}${w.toLowerCase()}`)}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.relationship && (
                      <div className='w-100'>
                        <span>{t(`${translationPath}${item.relationship}`)}</span>
                      </div>
                    )}
                  </div>
                  {item.details
                    .filter(
                      (filterItem, filterIndex) =>
                        (!isExpanded && filterIndex < notExpandedMax) || isExpanded
                    )
                    .map((subItem, subIndex) => (
                      <div
                        key={`contactsCardItemRef${subIndex + 1}`}
                        className='details-item-wrapper'
                      >
                        {/* <span className={`details-icon ${subItem.iconClasses}`} /> */}
                        <span className='details-item details-item-flex'>
                          <span className='details-text contacts-text-wrap'>
                            {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                            {t(`${translationPath}${subItem.title || ''}`)}
                            {(subItem && subItem.title) ? ' :' : ''}
                          </span>
                          <span className='px-1 contacts-card-text' title={subItem.value}>
                            {subItem.value}
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className='cards-progress-wrapper'>
                <ProgressComponet
                  value={item.progress}
                  progressText={`${item.progress}%`}
                  themeClasses='theme-gradient'
                />
              </div>
              <div className='cards-footer-wrapper'>
                <ButtonBase
                  className='btns theme-transparent w-50 mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.folder.key, item, index)}
                >
                  <span className='mdi mdi-folder-outline' />
                  <span className='px-1'>{t('open-file')}</span>
                </ButtonBase>
                <ButtonBase
                  className='btns theme-transparent w-50 mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.reportEdit.key, item, index)}
                >
                  <span className='mdi mdi-pencil-outline' />
                  <span className='px-1'>{t('edit')}</span>
                  <Tooltip title={moment(item.updateDate).format('DD/MM/YYYY HH:mm A') || 'N/A'}>
                    <span className='edit-power-icon mdi mdi-clock-time-four-outline c-warning mdi-16px' />
                  </Tooltip>
                </ButtonBase>
              </div>
            </a>
          </div>
        ))}
    </div>
  );
};

ContactsCardsComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  activeCard: PropTypes.instanceOf(Object),
  selectedDetailsContactItem: PropTypes.instanceOf(Object),
  isExpanded: PropTypes.bool,
  withCheckbox: PropTypes.bool,
  onCardClicked: PropTypes.func,
  onActionClicked: PropTypes.func,
  onCardCheckboxClick: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  notExpandedMax: PropTypes.number,
  isCheckBoxDisabled: PropTypes.bool,
  selectedCards: PropTypes.instanceOf(Array),
};
ContactsCardsComponent.defaultProps = {
  notExpandedMax: 6,
  isExpanded: false,
  withCheckbox: false,
  onCardClicked: undefined,
  onActionClicked: undefined,
  selectedDetailsContactItem: undefined,
  activeCard: undefined,
  isCheckBoxDisabled: false,
  selectedCards: undefined,
};
