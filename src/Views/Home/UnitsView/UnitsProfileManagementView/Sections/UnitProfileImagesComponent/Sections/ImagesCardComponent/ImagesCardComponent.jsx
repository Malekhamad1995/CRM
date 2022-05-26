import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import i18next from 'i18next';
import moment from 'moment';
import { CheckboxesComponent, LoadableImageComponant } from '../../../../../../../../Components';
import { DefaultImagesEnum, LoadableImageEnum } from '../../../../../../../../Enums';
import { getDownloadableLink } from '../../../../../../../../Helper';

export const ImagesCardComponent = ({
  data,
  selectedCards,
  translationPath,
  parentTranslationPath,
  deleteImageHandler,
  onCardCheckboxClickedHandler,
  onCardClickedHandler,
  withCheckbox,
  cardClasses,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const deleteImageClicked = useCallback(
    (item) => (event) => {
      event.preventDefault();
      if (deleteImageHandler) deleteImageHandler(item);
    },
    [deleteImageHandler]
  );
  const onSelectedCheckboxClicked = useCallback(
    (item) => (event) => {
      event.preventDefault();
      if (onCardCheckboxClickedHandler) onCardCheckboxClickedHandler(item);
    },
    [onCardCheckboxClickedHandler]
  );
  const onCardClicked = useCallback(
    (item) => () => {
      if (onCardClickedHandler) onCardClickedHandler(item);
    },
    [onCardClickedHandler]
  );
  const getIsSelectedCard = useCallback(
    (item) => selectedCards && selectedCards.findIndex((element) => item.id === element) !== -1,
    [selectedCards]
  );

  return (
    <div className='images-card-component-wrapper childs-wrapper'>
      {data &&
        data.map((item, index) => (
          <a
            className={`images-card-item-wrapper ${
              (getIsSelectedCard(item) && 'is-selected') || ''
            }`}
            key={`imagesCardDetailsRef${index + 1}`}
            onClick={onCardClicked(item)}
          >
            <div className={`images-card-header-wrapper ${cardClasses}`}>
              {withCheckbox && (
                <div className='card-checkbox-wrapper'>
                  <CheckboxesComponent
                    idRef={`imagesCardCheckboxItemRef${index + 1}`}
                    singleChecked={getIsSelectedCard(item)}
                    onSelectedCheckboxClicked={onSelectedCheckboxClicked(item)}
                  />
                </div>
              )}
              <LoadableImageComponant
                classes='cover-image'
                type={LoadableImageEnum.div.key}
                alt={t(`${translationPath}unit-image`)}
                src={
                  (item.imagePath && getDownloadableLink(item.imagePath)) ||
                  DefaultImagesEnum.buildings.defaultImg
                }
              />
              {deleteImageHandler && (
                <ButtonBase
                  className='btns theme-solid delete-btn'
                  onClick={deleteImageClicked(index)}
                >
                  <span className='mdi mdi-trash-can-outline' />
                </ButtonBase>
              )}
            </div>
            <div className='images-card-body-wrapper'>
              {item.details &&
                item.details.map((subItem, subIndex) => (
                  <div className='body-item' key={`imagesCardDetailsRef${subIndex + 1}`}>
                    <span className='body-title'>
                      {t(`${translationPath}${subItem.title}`)}
                      :
                    </span>
                    <span className='body-description'>
                      {(subItem.dateFormat &&
                        subItem.value &&
                        moment(subItem.value)
                          .locale(i18next.language)
                          .format(subItem.dateFormat)) ||
                        subItem.value ||
                        'N/A'}
                    </span>
                  </div>
                ))}
            </div>
          </a>
        ))}
    </div>
  );
};

ImagesCardComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  selectedCards: PropTypes.instanceOf(Array).isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  deleteImageHandler: PropTypes.func,
  onCardCheckboxClickedHandler: PropTypes.func,
  onCardClickedHandler: PropTypes.func,
  withCheckbox: PropTypes.bool,
  cardClasses: PropTypes.string,
};
ImagesCardComponent.defaultProps = {
  deleteImageHandler: undefined,
  onCardCheckboxClickedHandler: undefined,
  onCardClickedHandler: undefined,
  withCheckbox: false,
  cardClasses: '',
};
