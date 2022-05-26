/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
 useEffect, useState, useCallback, memo
} from 'react';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import {
 CardsEnum, ActionsEnum, UserAccountTypeEnum, ContactTypeEnum
} from '../../Enums';
import { getDownloadableLink } from '../../Helper';
import { ProgressComponet } from '../Controls';

const CardsComponent = memo(
  ({
    data,
    defaultImg,
    theme,
    isOpenFile,
    translationPath,
    parentTranslationPath,
    contactsOptions,
    detailsContactsOptions,
    onCardClick,
    detailsData,
    getItem,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const getIsScrolled = () => window.scrollY > 35;
    const [isOpen, setIsOpen] = useState({ scrolled: getIsScrolled(), isClicked: false });

    const updateSize = useCallback(() => {
      if (getIsScrolled()) {
        setIsOpen((item) => {
          if (!item.scrolled) return { ...item, scrolled: true };
          return item;
        });
      } else {
        setIsOpen((item) => {
          if (item.scrolled) return { isClicked: false, scrolled: false };
          return item;
        });
      }
    }, []);
    // const useWindowSize = () => {
    // };
    useEffect(() => {
      window.addEventListener('scroll', updateSize);
      return () => window.removeEventListener('scroll', updateSize);
    }, [updateSize]);
    const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;
    const tagClicked = useCallback(() => {
      setIsOpen((item) => ({ ...item, isClicked: !item.isClicked }));
    }, [setIsOpen]);
    const getActionValues = (key) => Object.values(ActionsEnum).find((item) => item.key === key);
    const ThemeContacts = () => (
      <div
        className={`cards-views theme-contacts ${
          !isOpen.scrolled || isOpen.isClicked ? 'is-open' : ''
        }`}
      >
        <div className='img-wrapper'>
          <img
            src={
              (data
                && data[contactsOptions.imageInput]
                && getDownloadableLink(data[contactsOptions.imageInput])) ||
              (contactsOptions.contactTypeInput
                && getDefaultContactImage(data[contactsOptions.contactTypeInput])) ||
              defaultImg
            }
            alt={t(`${translationPath}contact-image`)}
            className={`contact-img ${
              !(
                data
                && data[contactsOptions.imageInput]
                && getDownloadableLink(data[contactsOptions.imageInput])
              ) ?
                'is-default' :
                ''
            }`}
          />
        </div>
        <div className='card-content'>
          <span className='contact-name'>
            {contactsOptions.nameInput ? data[contactsOptions.nameInput] : data}
          </span>
          <div className='actions-wrapper'>
            {contactsOptions.actions.length > 0
              && contactsOptions.actions.map((item) => (
                <Button
                  key={`actions-buttons${item.enum}`}
                  className={getActionValues(item.enum).buttonClasses}
                  onClick={contactsOptions.onActionClicked(item.enum)}
                  disabled={item.isDisabled}
                >
                  <span className={getActionValues(item.enum).icon} />
                </Button>
              ))}
          </div>
        </div>
        {isOpen.scrolled && (
          <div className='tag-wrapper'>
            <Button className='btns-tag' onClick={tagClicked}>
              <span className={`mdi mdi-menu-${!isOpen.isClicked ? 'down' : 'up'}`} />
            </Button>
          </div>
        )}
        {contactsOptions.withCheckbox && (
          <div className='card-checkbox-wrapper'>
            <Checkbox
              className='checkbox-wrapper'
              checkedIcon={<span className='mdi mdi-check' />}
              indeterminateIcon={<span className='mdi mdi-minus' />}
              checked={contactsOptions.isSelectedCard}
              onClick={(event) => {
                event.preventDefault();
                contactsOptions.onCardCheckboxClick();
              }}
            />
          </div>
        )}
      </div>
    );
    const ThemeDetailsContacts = () => (
      <div
        className={`cards-views theme-details-contacts is-selected${
          detailsContactsOptions.isExpanded ? ' is-expanded' : ''
        }${isOpenFile ? ' is-open-file' : ''}${
          theme === CardsEnum.detailsProperties ? ' theme-details-properties' : ''
        }`}
      >
        <div className='card-content'>
          <div className='img-wrapper'>
            <img
              src={
                (data
                  && data[detailsContactsOptions.imageInput]
                  && getDownloadableLink(data[detailsContactsOptions.imageInput])) ||
                (detailsContactsOptions.contactTypeInput
                  && getDefaultContactImage(data[detailsContactsOptions.contactTypeInput])) ||
                defaultImg
              }
              alt={t(`${translationPath}${detailsContactsOptions.imageAlt}`)}
              className={`card-img ${
                !(
                  data
                  && data[detailsContactsOptions.imageInput]
                  && getDownloadableLink(data[detailsContactsOptions.imageInput])
                ) ?
                  'is-default' :
                  ''
              }`}
            />
          </div>
          {detailsContactsOptions.nameInput && (
            <div className='card-name'>
              <span>{data[detailsContactsOptions.nameInput]}</span>
            </div>
          )}
          {detailsContactsOptions.priceInput && (
            <div className='card-price'>
              <span>{data[detailsContactsOptions.priceInput]}</span>
            </div>
          )}
          {detailsContactsOptions.tooltipInput && data[detailsContactsOptions.tooltipInput] && (
            <div className='card-tooltip'>
              <span>{data[detailsContactsOptions.tooltipInput]}</span>
            </div>
          )}
          {detailsContactsOptions.actions && detailsContactsOptions.actions.length > 0 && (
            <div className='actions-wrapper'>
              {detailsContactsOptions.actions.map((item) => (
                <div className='action-item' key={`view-actions-buttons${item.enum}`}>
                  <Button
                    className={getActionValues(item.enum).buttonClasses}
                    onClick={detailsContactsOptions.onActionClicked(item.enum, data)}
                    disabled={item.isDisabled}
                  >
                    <span className={getActionValues(item.enum).icon} />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {detailsData && (
            <div className='card-list-wrapper'>
              {detailsData.map(
                (item, index) =>
                  (detailsContactsOptions.isExpanded ||
                    index < detailsContactsOptions.maxNumberOfItemsOnNotExpanded) && (
                    <React.Fragment key={`card-list-item${index + 1}`}>
                      {getItem && getItem(item, index)}
                      {!getItem && detailsContactsOptions.dataListInputs && (
                        <div className='card-list-item'>
                          {detailsContactsOptions.dataListInputs.iconInput && (
                            <span
                              className={`item-icon ${
                                item[detailsContactsOptions.dataListInputs.iconInput]
                              }`}
                            />
                          )}

                          {detailsContactsOptions.dataListInputs.titleInput
                            && (!detailsContactsOptions.dataListInputs.iconInput || isOpenFile) && (
                              <span className='item-title'>
                                {item[detailsContactsOptions.dataListInputs.titleInput]}
                                :
                                {' '}
                              </span>
                            )}

                          {detailsContactsOptions.dataListInputs.valueInput && (
                            <span className='item-value'>
                              {' '}
                              {item[detailsContactsOptions.dataListInputs.valueInput]}
                            </span>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  )
              )}
            </div>
          )}
          {detailsContactsOptions.sideActions && detailsContactsOptions.sideActions.length > 0 && (
            <div className='side-actions-wrapper'>
              {detailsContactsOptions.sideActions.map((item) => (
                <div className='side-action-item' key={`view-side-actions-buttons${item.enum}`}>
                  <Button
                    className={item.enum && getActionValues(item.enum).buttonClasses}
                    onClick={detailsContactsOptions.onSideActionClicked(item.enum, data)}
                    disabled={item.isDisabled}
                  >
                    <span className={item.enum && getActionValues(item.enum).icon} />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {detailsContactsOptions.tagCurve
            && UserAccountTypeEnum[detailsContactsOptions.tagCurve].curvedImg && (
              <div className='tag-curve-wrapper'>
                <img
                  src={UserAccountTypeEnum[detailsContactsOptions.tagCurve].curvedImg}
                  alt={t(`${translationPath}${detailsContactsOptions.curveImageAlt}`)}
                  className='tag-curve-img'
                />
              </div>
            )}
        </div>
        {(detailsContactsOptions.progressOptions || detailsContactsOptions.dateInput) && (
          <div className='card-footer'>
            {detailsContactsOptions.progressOptions && (
              <ProgressComponet
                value={detailsContactsOptions.progressOptions.value}
                progressText={detailsContactsOptions.progressOptions.progressText}
                inSameLine={detailsContactsOptions.progressOptions.isSameLine}
                themeClasses='theme-gradient'
              />
            )}
            {detailsContactsOptions.dateInput
              && detailsContactsOptions.dateFormat
              && data[detailsContactsOptions.dateInput] && (
                <div className='date-wrapper'>
                  <span className='icons i-calendar-blank' />
                  <span>
                    {moment(data[detailsContactsOptions.dateInput]).format(
                      detailsContactsOptions.dateFormat
                    )}
                  </span>
                </div>
              )}
            {detailsContactsOptions.dateInput && data[detailsContactsOptions.dateInput] && (
              <div className='time-wrapper'>
                <span className='icons i-oclock' />
                <span>{moment(data[detailsContactsOptions.dateInput]).fromNow()}</span>
              </div>
            )}
            {detailsContactsOptions.withCheckbox && (
              <div
                className={`card-checkbox-wrapper${
                  detailsContactsOptions.tagCurve
                  && UserAccountTypeEnum[detailsContactsOptions.tagCurve].curvedImg ?
                    ' trl-15px' :
                    ''
                }`}
              >
                <Checkbox
                  className='checkbox-wrapper'
                  checkedIcon={<span className='mdi mdi-check' />}
                  indeterminateIcon={<span className='mdi mdi-minus' />}
                  checked={detailsContactsOptions.isSelectedCard}
                  onClick={(event) => {
                    event.stopPropagation();
                    detailsContactsOptions.onCardCheckboxClick();
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
    const getThemeComponent = () => {
      if (theme === CardsEnum.contacts) {
        return (
          (onCardClick && (
            <a className='cards-link' onClick={onCardClick}>
              {ThemeContacts()}
            </a>
          )) ||
          ThemeContacts()
        );
      }
      if (theme === CardsEnum.detailsContacts || theme === CardsEnum.detailsProperties) {
        return (
          (onCardClick && (
            <a className='cards-link' onClick={onCardClick}>
              {ThemeDetailsContacts()}
            </a>
          )) ||
          ThemeDetailsContacts()
        );
      }
      return null;
    };
    return getThemeComponent();
  }
);
CardsComponent.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  detailsData: PropTypes.instanceOf(Array),
  getItem: PropTypes.func,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  defaultImg: PropTypes.string,
  onCardClick: PropTypes.func,
  isOpenFile: PropTypes.bool,
  contactsOptions: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        enum: PropTypes.oneOf(Object.values(ActionsEnum).map((item) => item.key)),
        isDisabled: PropTypes.bool,
      })
    ),
    onActionClicked: PropTypes.func,
    imageInput: PropTypes.string,
    nameInput: PropTypes.string,
    contactTypeInput: PropTypes.string,
    withCheckbox: PropTypes.bool,
    isSelectedCard: PropTypes.bool,
    onCardCheckboxClick: PropTypes.func,
  }),
  detailsContactsOptions: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        enum: PropTypes.oneOf(Object.values(ActionsEnum).map((item) => item.key)),
        isDisabled: PropTypes.bool,
      })
    ),
    sideActions: PropTypes.arrayOf(
      PropTypes.shape({
        enum: PropTypes.oneOf(Object.values(ActionsEnum).map((item) => item.key)),
        isDisabled: PropTypes.bool,
      })
    ),
    curveImageAlt: PropTypes.string,
    tagCurve: PropTypes.oneOf(Object.keys(UserAccountTypeEnum)),
    isExpanded: PropTypes.bool,
    maxNumberOfItemsOnNotExpanded: PropTypes.number,
    onActionClicked: PropTypes.func,
    onSideActionClicked: PropTypes.func,
    contactTypeInput: PropTypes.string,
    imageAlt: PropTypes.string,
    imageInput: PropTypes.string,
    nameInput: PropTypes.string,
    dateFormat: PropTypes.string,
    dateInput: PropTypes.string,
    priceInput: PropTypes.string,
    tooltipInput: PropTypes.string,
    dataListInputs: PropTypes.shape({
      iconInput: PropTypes.string,
      titleInput: PropTypes.string,
      valueInput: PropTypes.string,
    }),
    progressOptions: PropTypes.shape({
      progressText: PropTypes.string,
      value: PropTypes.number,
      isSameLine: PropTypes.bool,
    }),
    withCheckbox: PropTypes.bool,
    isSelectedCard: PropTypes.bool,
    onCardCheckboxClick: PropTypes.func,
  }),
  theme: PropTypes.oneOf(Object.keys(CardsEnum)),
};
CardsComponent.defaultProps = {
  detailsData: undefined,
  getItem: undefined,
  translationPath: '',
  parentTranslationPath: '',
  defaultImg: null,
  onCardClick: null,
  isOpenFile: false,
  contactsOptions: {
    actions: [
      { enum: ActionsEnum.phone.key, isDisabled: false },
      { enum: ActionsEnum.email.key, isDisabled: false },
      { enum: ActionsEnum.whatsapp.key, isDisabled: false },
    ],
    onActionClicked: () => {},
    imageInput: null,
    nameInput: null,
    contactTypeInput: null,
    withCheckbox: false,
    isSelectedCard: false,
    onCardCheckboxClick: () => {},
  },
  detailsContactsOptions: {
    actions: [
      { enum: ActionsEnum.account.key, isDisabled: false },
      { enum: ActionsEnum.phone.key, isDisabled: false },
      { enum: ActionsEnum.email.key, isDisabled: false },
      { enum: ActionsEnum.whatsapp.key, isDisabled: false },
    ],
    sideActions: [
      { enum: ActionsEnum.reportView.key, isDisabled: false },
      { enum: ActionsEnum.folder.key, isDisabled: false },
      { enum: ActionsEnum.reportEdit.key, isDisabled: false },
    ],
    curveImageAlt: 'account-type',
    tagCurve: null,
    isExpanded: false,
    maxNumberOfItemsOnNotExpanded: 4,
    onActionClicked: () => {},
    onSideActionClicked: () => {},
    contactTypeInput: null,
    imageAlt: 'contact-image',
    imageInput: null,
    nameInput: null,
    dateFormat: 'DD/MM/YYYY',
    dateInput: null,
    priceInput: null,
    tooltipInput: null,
    dataListInputs: {
      iconInput: null,
      titleInput: null,
      valueInput: null,
    },
    progressOptions: {
      progressText: null,
      value: 0,
      isSameLine: false,
    },
    withCheckbox: false,
    isSelectedCard: false,
    onCardCheckboxClick: () => {},
  },
  theme: CardsEnum.contacts,
};
export { CardsComponent };
