/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import i18next from 'i18next';
import { ButtonBase, Tooltip } from '@material-ui/core';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  ProgressComponet,
} from '../../../../../Components';
import { ActionsEnum, ContactTypeEnum, LoadableImageEnum } from '../../../../../Enums';
import { getDownloadableLink } from '../../../../../Helper';

export const PropertiesCardsComponent = ({
  data,
  activeCard,
  isExpanded,
  onCardClicked,
  onFooterActionsClicked,
  parentTranslationPath,
  translationPath,
  notExpandedMax,
  withCheckbox,
  checkedDetailedCards,
  onCardCheckboxClick,
  selectedDetailsPropertyItem,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const getDefaultPropertyImage = useCallback(
    (propertyType) => ContactTypeEnum[propertyType] && ContactTypeEnum[propertyType].defaultImg,
    []
  );
  const getIsSelectedCard = useCallback(
    (itemIndex) => checkedDetailedCards.findIndex((item) => item === itemIndex) !== -1,
    [checkedDetailedCards]
  );

  return (
    <div className='properties-cards-wrapper childs-wrapper'>
      {data.result &&
        data.result.map((item, index) => (
          <div
            className={`properties-card-wrapper${isExpanded ? ' is-expanded' : ''}${
              (((activeCard && activeCard.id === item.id) ||
                (selectedDetailsPropertyItem && selectedDetailsPropertyItem.id === item.id)) &&
                ' is-open') ||
              ''
            }`}
            key={`propertiesCardItemRef${index + 1}`}
          >
            {withCheckbox && (
              <div className='card-checkbox-wrapper'>
                <CheckboxesComponent
                  idRef={`propertiesCheckboxItemRef${index + 1}`}
                  singleChecked={getIsSelectedCard(index)}
                  onSelectedCheckboxClicked={(event) => {
                    event.preventDefault();
                    onCardCheckboxClick(index);
                  }}
                />
              </div>
            )}
            <a onClick={onCardClicked && onCardClicked(item, index)} className='cards-wrapper'>
              <div className='cards-body-wrapper'>
                <div className={`card-body-section${isExpanded ? ' is-expanded' : ''}`}>
                  <div className='properity-card-header'>
                    <LoadableImageComponant
                      classes='cover-image'
                      type={LoadableImageEnum.div.key}
                      alt={t(`${translationPath}property-image`)}
                      src={
                        (item.allpropertyImages &&
                          item.allpropertyImages[0] &&
                          getDownloadableLink(item.allpropertyImages[0].fileId)) ||
                        getDefaultPropertyImage(item.type)
                      }
                    />
                    <LoadableImageComponant
                      classes='cover-image'
                      type={LoadableImageEnum.div.key}
                      alt={t(`${translationPath}property-image`)}
                      src={
                        (item.allpropertyImages &&
                          item.allpropertyImages[1] &&
                          getDownloadableLink(item.allpropertyImages[1].fileId)) ||
                        getDefaultPropertyImage(item.type)
                      }
                    />
                    <LoadableImageComponant
                      classes='cover-image'
                      type={LoadableImageEnum.div.key}
                      alt={t(`${translationPath}property-image`)}
                      src={
                        (item.allpropertyImages &&
                          item.allpropertyImages[2] &&
                          getDownloadableLink(item.allpropertyImages[2].fileId)) ||
                        getDefaultPropertyImage(item.type)
                      }
                    />
                  </div>
                  <div className='body-title-wrapper'>
                    <span className='body-title'>{item.name}</span>
                  </div>
                  <div className='body-item-flex'>
                    <div className='created-on px-2'>
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
                    <span>
                      <span
                        className={`card-tooltip card-badge ${
                          item.propertyStatus && item.propertyStatus.class
                        }`}
                      >
                        <span>
                          {(item.propertyStatus && t(item.propertyStatus.value)) ||
                            item.propertyStatus}
                        </span>
                      </span>
                    </span>
                  </div>
                  {item.details
                    .filter(
                      (filterItem, filterIndex) =>
                        (!isExpanded && filterIndex < notExpandedMax) || isExpanded
                    )
                    .map((subItem, subIndex) => (
                      <div
                        key={`propertiesCardItemRef${subIndex + 1}`}
                        className='details-item-wrapper'
                      >
                        {/* <span className={`details-icon ${subItem.iconClasses}`} /> */}
                        <span className='details-item'>
                          <span className='details-text'>
                            {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                            {t(`${translationPath}${subItem.title}`)}
                            :
                          </span>
                          <span className='px-1'>{subItem.value}</span>
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

PropertiesCardsComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  activeCard: PropTypes.instanceOf(Object),
  selectedDetailsPropertyItem: PropTypes.instanceOf(Object),
  isExpanded: PropTypes.bool.isRequired,
  withCheckbox: PropTypes.bool.isRequired,
  onCardClicked: PropTypes.func.isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  onCardCheckboxClick: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  notExpandedMax: PropTypes.number,
  checkedDetailedCards: PropTypes.arrayOf(PropTypes.number).isRequired,
};
PropertiesCardsComponent.defaultProps = {
  notExpandedMax: 5,
  selectedDetailsPropertyItem: undefined,
  activeCard: undefined,
};
