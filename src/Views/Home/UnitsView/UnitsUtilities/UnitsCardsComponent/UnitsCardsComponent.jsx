/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef } from 'react';
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
import {
  ActionsEnum, ContactTypeEnum, LoadableImageEnum, UnitsOperationTypeEnum
} from '../../../../../Enums';
import { getDownloadableLink, showinfo } from '../../../../../Helper';
import { formatCommas } from '../../../../../Helper/formatCommas.Helper';

export const UnitsCardsComponent = ({
  data,
  activeCard,
  isExpanded,
  onCardClicked,
  onFooterActionsClicked,
  translationPath,
  notExpandedMax,
  withCheckbox,
  checkedDetailedCards,
  onCardCheckboxClick,
  selectedDetailsUnitItem,
}) => {
  const { t } = useTranslation('UnitsView');
  const textArea = useRef(null);
  const getDefaultUnitImage = useCallback(
    (unitType) => ContactTypeEnum[unitType] && ContactTypeEnum[unitType].defaultImg,
    []
  );
  const pathName = window.location.pathname.split('/home/')[1].split('/contact-profile-edit')[0];

  const getIsSelectedCard = useCallback(
    (itemIndex) => checkedDetailedCards.findIndex((item) => item === itemIndex) !== -1,
    [checkedDetailedCards]
  );
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
  const colorPikerset = (item) => {
    if (item.toLowerCase() === 'available')
      return 'c-success-light';
    if (item.toLowerCase() === 'leased')
      return 'c-primary';
    if (item.toLowerCase() === 'reserved-for-sale')
      return 'c-primary';
    if (item.toLowerCase() === 'reservedleased')
      return 'c-primary';
    if (item.toLowerCase() === 'draft')
      return '';

    return '';
  };

  return (
    <div className='units-cards-wrapper childs-wrapper'>
      {data.result &&
        data.result.map((item, index) => (
          <div
            className={`units-card-wrapper${isExpanded ? ' is-expanded' : ''}${(((activeCard && activeCard.id === item.id) ||
              (selectedDetailsUnitItem && selectedDetailsUnitItem.id === item.id)) &&
              ' is-open') ||
              ''
              }`}
            key={`unitsCardItemRef${index + 1}`}
          >
            {withCheckbox && (
              <div className='card-checkbox-wrapper'>
                <CheckboxesComponent
                  idRef={`unitsCheckboxItemRef${index + 1}`}
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
                <div className='card-body-section'>
                  <div className='body-item-wrapper'>
                    <div className={`flex-wrapper ${!isExpanded ? 'w-100' : ''}`}>
                      <div className='body-images-wrapper'>
                        <div className='body-image-item-wrapper'>
                          <div className='body-image-item'>
                            <LoadableImageComponant
                              classes='cover-image'
                              type={LoadableImageEnum.div.key}
                              alt={t(`${translationPath}unit-image`)}
                              src={
                                (item.allunitImages && getDownloadableLink(item.allunitImages.fileId)) ||
                                getDefaultUnitImage(item.type)
                              }
                            />
                          </div>
                        </div>
                        <div className='body-image-item-wrapper'>
                          <div className='body-title-wrapper'>
                            <span className='body-title'>{item.name}</span>
                            <div
                              className={`body-status ${(
                                item.operation_type.lookupItemId === UnitsOperationTypeEnum.rentAndSale.key && item.status.toLowerCase() !== 'draft' &&
                                colorPikerset(item.lease_status && item.lease_status) ||
                                colorPikerset(item.unitStatus.value)
                              )
                                }`}
                            >
                              <div className='body-status-type'>
                                {(pathName === 'Contacts-CRM' && +item.operation_type.lookupItemId === UnitsOperationTypeEnum.rentAndSale.key &&
                                  t(`${translationPath}Status_sale`)) ||
                                  t(`${translationPath}status`)}
                              </div>
                              {' : '}
                              {pathName === 'Contacts-CRM' && item.operation_type.lookupItemId === UnitsOperationTypeEnum.rent.key &&
                                (((item.lease_status &&
                                  item.lease_status &&
                                  t(`${translationPath}${item.lease_status}`)) ||
                                  'N/A')) ||
                                ((item.unitStatus &&
                                  item.unitStatus.value &&
                                  t(`${translationPath}${item.unitStatus.value}`)) ||
                                  'N/A')}
                            </div>
                            {pathName === 'Contacts-CRM' && +item.operation_type.lookupItemId === UnitsOperationTypeEnum.rentAndSale.key && (
                              <div
                                className={`body-status ${(
                                  colorPikerset(item.lease_status && item.lease_status || item.unitStatus.value))
                                  }`}
                              >
                                <div className='body-status-type'>
                                  {t(`${translationPath}lease_status`)}
                                </div>
                                {' : '}
                                {
                                  (item.lease_status &&
                                    item.lease_status &&
                                    t(`${translationPath}${item.lease_status}`)) ||
                                  'N/A'
                                }
                              </div>
                            ) ||
                              ''}
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className='card-body-section'>
                          {item.details.map(
                            (subItem, subIndex) =>
                              subIndex > notExpandedMax && (
                                <div
                                  key={`unitsCardItemRef${subIndex + 1}`}
                                  className='details-item-wrapper'
                                >
                                  {/* <span className={`details-icon ${subItem.iconClasses}`} /> */}
                                  <span className='details-item'>
                                    <span className='details-text'>
                                      {t(`${translationPath}${subItem.title}`)}
                                      :
                                    </span>
                                    <span className='px-1' title={subItem.value}>
                                      {subItem.value}
                                    </span>
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>

                    {pathName === 'Contacts-CRM' && +item.operation_type.lookupItemId === UnitsOperationTypeEnum.rentAndSale.key && (
                      <div className='price-wrapper w-100'>
                        <div className='for-lable body-status c-success-light'>
                          {t(`${translationPath}for`)}
                        </div>
                        <div className='body-status c-success-light'>
                          {`${'sale'}`}
                          :
                        </div>
                        <div className='unit-price'>
                          {`   ${item.selling_price_agency_fee ? formatCommas(item.selling_price_agency_fee.salePrice) : 'N/A'} AED`}
                        </div>
                      </div>
                    ) || ''}
                    <div className='price-wrapper'>
                      <div className={`for-lable ${item.unitOperationType}`}>
                        {t(`${translationPath}for`)}
                      </div>
                      <div className={item.unitOperationType}>
                        {`  ${item.unitOperationType}`}
                        :
                      </div>
                      <div className='unit-price'>
                        {`   ${item.price ? formatCommas(item.price) : 'N/A'} AED`}
                      </div>
                    </div>
                    <div className='flat-contents-wrapper'>
                      {item.flatContent
                        .filter(
                          (filterItem, filterIndex) =>
                            (!isExpanded && filterIndex < notExpandedMax) || isExpanded
                        )
                        .map((subItem, subIndex) => (
                          <div
                            key={`flatContentsItemRef${subIndex + 1}`}
                            className='flat-content-item'
                          >
                            <span className={`flat-content-icon ${subItem.iconClasses} mdi-18px`} />
                            <span className='px-1'>{subItem.value}</span>
                            <span>
                              {subItem.title && (
                                <span className='flat-content-text'>
                                  {t(`${translationPath}${subItem.title}`)}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className='id-date-wrapper pl-2 pr-2'>
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
                        {t(`${translationPath}ref-#`)}
                        :
                        <div className='contact-id'>
                          {item.refNo}
                          <textarea readOnly aria-disabled value={item.refNo} ref={textArea} />
                        </div>
                        <Tooltip title={t(`${translationPath}copy`)}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              copyTextToClipboard(item.refNo);
                            }}
                            className='mdi mdi-content-copy'
                          />
                        </Tooltip>
                      </div>
                    </div>
                    {/* <div className='body-item d-flex-v-center mb-1'>
                      <span className='card-tooltip bg-secondary-light c-primary'>
                        <span>{t(`${translationPath}match-with`)}</span>
                        <span className='px-1'>10</span>
                        <span>{t(`${translationPath}buyers`)}</span>
                      </span>
                      <ButtonBase className='btns fw-simi-bold'>
                        <span>{t(`${translationPath}view`)}</span>
                        <span className='px-1 mdi mdi-chevron-right' />
                      </ButtonBase>
                    </div> */}
                  </div>
                </div>
                <div className='flex-section'>
                  <div className={`card-body-section${isExpanded ? ' is-expanded' : ''}`}>
                    {item.details
                      .filter(
                        (filterItem, filterIndex) =>
                          (!isExpanded && filterIndex < notExpandedMax) || isExpanded
                      )
                      .map(
                        (subItem, subIndex) =>
                          subIndex < notExpandedMax && (
                            // listing_agent.name
                            !(+item.operation_type.lookupItemId === UnitsOperationTypeEnum.rentAndSale.key && subItem.title === 'listing-agent') && (
                              <div
                                key={`unitsCardItemRef${subIndex + 1}`}
                                className='details-item-wrapper'
                              >
                                {/* <span className={`details-icon ${subItem.iconClasses}`} /> */}
                                <span className='details-item'>
                                  <span className='details-text'>
                                    {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                                    {t(`${translationPath}${subItem.title}`)}
                                    :
                                  </span>
                                  <span className='px-1' title={subItem.value}>
                                    {subItem.value}
                                  </span>
                                </span>
                              </div>
                            ) ||
                            ''
                          )
                      )}
                    {(pathName === 'Contacts-CRM' && item.operation_type.lookupItemId === UnitsOperationTypeEnum.rent.key && (
                      <div
                        key='unitsCardItemRef'
                        className='details-item-wrapper'
                      >
                        <span className='details-item'>
                          <span className='details-text'>
                            {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                            {t(`${translationPath}${'rent_listing_agent'}`)}
                            :
                          </span>
                          <span className='px-1' title='rent_listing_agent'>
                            {item.rent_listing_agent && item.rent_listing_agent.name ? item.rent_listing_agent.name : 'N/A'}
                          </span>
                        </span>
                      </div>
                    )) || ''}

                  </div>
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
                  disabled={pathName === 'contacts'}
                  className='btns theme-transparent mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.folder.key, item, index)}
                >
                  <span className='mdi mdi-folder-outline' />
                  <span className='px-1'>{t('open-file')}</span>
                </ButtonBase>
                <ButtonBase
                  disabled={item.matchingLeadsNumber === 0 || pathName === 'contacts'}
                  className='btns theme-transparent mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.matching.key, item, index)}
                >
                  <span className={ActionsEnum.matching.icon} />
                  <span className='px-1'>{item.matchingLeadsNumber}</span>
                  <span>{t(ActionsEnum.matching.label)}</span>
                </ButtonBase>
                <ButtonBase
                  className='btns theme-transparent mx-0'
                  disabled={pathName === 'contacts'}
                  onClick={onFooterActionsClicked(ActionsEnum.reportEdit.key, item, index)}
                >
                  <span className='mdi mdi-pencil-outline' />
                  <span className='px-1'>{t('edit')}</span>
                  <Tooltip title={moment(item.updateDate).format('DD/MM/YYYY HH:mm A') || 'N/A'}>
                    <span className='edit-power-icon mdi mdi-clock-time-four-outline c-warning pr-2 pl-2' />
                  </Tooltip>
                </ButtonBase>
              </div>
            </a>
          </div>
        ))}
    </div>
  );
};

UnitsCardsComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  activeCard: PropTypes.instanceOf(Object),
  selectedDetailsUnitItem: PropTypes.instanceOf(Object),
  isExpanded: PropTypes.bool.isRequired,
  withCheckbox: PropTypes.bool.isRequired,
  onCardClicked: PropTypes.func.isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  onCardCheckboxClick: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  notExpandedMax: PropTypes.number,
  checkedDetailedCards: PropTypes.arrayOf(PropTypes.number).isRequired,
};
UnitsCardsComponent.defaultProps = {
  notExpandedMax: 4,
  selectedDetailsUnitItem: undefined,
  activeCard: undefined,
};
