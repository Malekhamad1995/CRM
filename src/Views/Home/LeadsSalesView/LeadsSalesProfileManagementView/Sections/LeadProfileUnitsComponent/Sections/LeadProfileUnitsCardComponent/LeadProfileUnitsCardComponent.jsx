/* eslint-disable no-nested-ternary */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  CheckboxesComponent,
  FacebookGalleryComponent,
  LoadableImageComponant,
} from '../../../../../../../../Components';
import {
  DefaultImagesEnum,
  LoadableImageEnum,
  UnitsOperationTypeEnum,
} from '../../../../../../../../Enums';
import { getDownloadableLink, GlobalHistory } from '../../../../../../../../Helper';
import { formatCommas } from '../../../../../../../../Helper/formatCommas.Helper';

export const LeadProfileUnitsCardComponent = ({
  data,
  selectedMatchesIds,
  parentTranslationPath,
  translationPath,
  onViewMoreClicked,
  onCardCheckboxClick,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const pathName = window.location.pathname.split('/home/')[1].split('/')[0];

  const onViewMoreHandler = useCallback(
    (item, index) => () => {
      if (onViewMoreClicked) onViewMoreClicked(item, index);
      if (
        item.operationType === UnitsOperationTypeEnum.sale.key) {
        GlobalHistory.push(
          `/home/units-sales/unit-profile-edit?formType=${item.unit_type_id}&id=${item.unitId}`
        );
      } else if (item.operationType === UnitsOperationTypeEnum.rent.key) {
        GlobalHistory.push(
          `/home/units-lease/unit-profile-edit?formType=${item.unit_type_id}&id=${item.unitId}`
        );
      } else {
        GlobalHistory.push(
          `/home/units-property-management/unit-profile-edit?formType=${item.unit_type_id}&id=${item.unitId}`
        );
      }
    },
    [onViewMoreClicked, pathName]
  );
  const imageHandler = useCallback(
    (item, imageIndex) => () => {
      setActiveItem(item);
      setActiveImageIndex(imageIndex);
    },
    []
  );

  const getIsSelectedCard = useCallback(
    (itemId) => selectedMatchesIds.findIndex((item) => item === itemId) !== -1,
    [selectedMatchesIds]
  );
  return (
    <div className='lead-profile-units-card-wrapper childs-wrapper'>
      {data.result &&
        data.result.map((item, index) => (
          <div className='units-card-wrapper' key={`unitsCardItemRef${index + 1}`}>
            <div className='cards-wrapper'>
              <div className='cards-header-wrapper'>
                {item.unitImages &&
                  item.unitImages
                    .filter((subItem, subIndex) => subIndex < 3)
                    .map((subItem, subIndex) => (
                      <div className='card-header-item' key={`unitImagesRef${subIndex + 1}`}>
                        <ButtonBase
                          className='card-header-btn'
                          onClick={imageHandler(item, subIndex)}
                        >
                          <LoadableImageComponant
                            classes='cover-image'
                            type={LoadableImageEnum.div.key}
                            alt={t(`${translationPath}unit-image`)}
                            withOverlay={subIndex === 3}
                            overlayText={`+ ${item.unitImages.length - 3}`}
                            overlayImage='mdi mdi-image-outline mdi-24px px-1'
                            src={
                              (subItem.imagePath && getDownloadableLink(subItem.imagePath)) ||
                              DefaultImagesEnum.corporate.defaultImg
                            }
                          />
                        </ButtonBase>
                      </div>
                    ))}
              </div>
              <div className='cards-body-wrapper'>
                <div className='card-title-wrapper'>
                  <span>{item.unitName}</span>
                  <span>
                    <span>{t(`${translationPath}ref`)}</span>
                    <span className='px-1'>#:</span>
                    <span>{item.refNumber}</span>
                  </span>
                </div>
                <div className='card-statuses-wrapper'>
                  <div className='card-statuses-items-wrapper'>
                    <span className='card-statuses-item'>
                      {pathName === 'lead-lease' ?
                        <span className={UnitsOperationTypeEnum.rent.color}>
                          {t(`${translationPath}${UnitsOperationTypeEnum.rent.forValue}`)}
                        </span> ||
                        'N/A' :
                        (((pathName === 'lead-sales') ? (
                          <span className={UnitsOperationTypeEnum.sale.color}>
                            {t(`${translationPath}${UnitsOperationTypeEnum.sale.forValue}`)}
                          </span>
                        ) :
                          (
                            item.operationType === UnitsOperationTypeEnum.sale.key ? (
                              <span className={UnitsOperationTypeEnum.sale.color}>
                                {t(`${translationPath}${UnitsOperationTypeEnum.sale.forValue}`)}
                              </span>
                            ) : (
                              <span className={UnitsOperationTypeEnum.rent.color}>
                                {t(`${translationPath}${UnitsOperationTypeEnum.rent.forValue}`)}
                              </span>
                            )
                          )))}
                      <span className='px-1'>
                        {(pathName === 'lead-lease') && (formatCommas(item.pricerent) || 'N/A') || (pathName === 'lead-sales') && (formatCommas(item.Pricesale) || 'N/A') ||
                          <span className='px-1'>{formatCommas(item.price) || 'N/A'}</span>}
                      </span>
                      <span>AED</span>
                    </span>
                  </div>
                  <div className='flat-content-item bg-success'>
                    <span>{t(`${translationPath}available`)}</span>
                  </div>
                </div>
                <div className='flat-contents-wrapper'>
                  {item.flatContent &&
                    item.flatContent.map((subItem, subIndex) => (
                      <div key={`flatContentsItemRef${subIndex + 1}`} className='flat-content-item'>
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
                {item.details &&
                  item.details.map((subItem, subIndex) => (
                    <div key={`unitCardItemRef${subIndex + 1}`} className='details-item-wrapper'>
                      {/* <span className={`details-icon ${subItem.iconClasses}`} /> */}
                      <div className='details-item'>
                        {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                        <div className='details-text'>
                          {t(`${translationPath}${subItem.title}`)}
                          :
                        </div>
                        <div className='px-1'>{subItem.value}</div>
                      </div>
                    </div>
                  ))}
                <div className='description-wrapper'>
                  {/* <span>
                    Horizon Towers is immortalized by its clean and minimalist lines both inside and
                    out. Infused with a natural color palette, the hues make it a modern home in a
                    natural environment, with beautiful views through the floor-to-ceiling windows
                    of the mangroves and waterfront.
                  </span> */}
                </div>
              </div>
              <div className='cards-footer-wrapper'>
                <div className='footer-item'>
                  <CheckboxesComponent
                    idRef={`unitsCheckboxItemRef${index + 1}`}
                    label={t(`${translationPath}select`)}
                    singleChecked={getIsSelectedCard(item.unitId)}
                    onSelectedCheckboxClicked={(event) => {
                      event.preventDefault();
                      onCardCheckboxClick(item, index);
                    }}
                  />
                </div>
                <div className='footer-item'>
                  <ButtonBase
                    className='btns theme-transparent mx-0'
                    onClick={onViewMoreHandler(item, index)}
                  >
                    <span>{t(`${translationPath}view-more-des`)}</span>
                  </ButtonBase>
                </div>
              </div>
            </div>
          </div>
        ))}
      <FacebookGalleryComponent
        data={(activeItem && activeItem.unitImages) || []}
        isOpen={(activeImageIndex !== null && activeItem && true) || false}
        activeImageIndex={activeImageIndex}
        titleText='unit-images'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onOpenChanged={() => {
          setActiveItem(null);
          setActiveImageIndex(null);
        }}
      />
    </div>
  );
};

LeadProfileUnitsCardComponent.propTypes = {
  data: PropTypes.arrayOf({
    result: PropTypes.shape({
      flatContent: PropTypes.instanceOf(Array),
    }),
  }).isRequired,
  selectedMatchesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onViewMoreClicked: PropTypes.func.isRequired,
};
