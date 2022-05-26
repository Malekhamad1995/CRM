import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { getDownloadableLink } from '../../../../../../../../../Helper';
import {
  ActionsEnum,
  DefaultImagesEnum,
  UnitProfileImagesCardActionEnum,
} from '../../../../../../../../../Enums';
import { LoadableImageComponant } from '../../../../../../../../../Components';
import { useLocalStorage } from '../../../../../../../../../Hooks';

export const CardFooterComponent = ({
  Display,
  data,
  onFooterActionsClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [language] = useLocalStorage('localization', {
    currentLanguage: 'en',
    isRtl: false,
  });
  return (
    <div className='albums-footer-wrapper presentational-wrapper'>
      <div className='images-more-wrapper'>
        {data &&
          data.filteredImagesDto &&
          data.filteredImagesDto.result &&
          data.filteredImagesDto.result.length > 0 && (
            <div className='slide-images'>
              {data.filteredImagesDto.result
                .filter((item, index) => index < 3)
                .map((item, index) => (
                  <LoadableImageComponant
                    classes='slide-image'
                    key={`albumImageSliderRef${index + 1}`}
                    alt={t(`${translationPath}location-image`)}
                    src={
                      (item.fileId && getDownloadableLink(item.fileId)) ||
                      DefaultImagesEnum.buildings.defaultImg
                    }
                    style={{
                      zIndex: index,
                      transform: `translateX(${
                        (language.isRtl &&
                          -(index * (175 / data.filteredImagesDto.result.length))) ||
                        index * (175 / data.filteredImagesDto.result.length)
                      }%)`,
                    }}
                  />
                ))}
            </div>
          )}
        {data &&
          data.filteredImagesDto &&
          data.filteredImagesDto.result &&
          data.filteredImagesDto.result.length > 3 && (
            <div
              className='images-more'
              style={{
                zIndex: data.filteredImagesDto.result.length,
                transform: `translateX(${
                    (language.isRtl &&
                    -(
                      (data.filteredImagesDto.result.length - 1) *
                      (175 / data.filteredImagesDto.result.length)
                    )) ||
                  (data.filteredImagesDto.result.length - 1) *
                    (175 / data.filteredImagesDto.result.length)
                }%)`,
              }}
            >
              {`+${data.filteredImagesDto.result.length - 3}`}
            </div>
          )}
      </div>
      <div className='footer-actions-wrapper px-1'>
        {Display === UnitProfileImagesCardActionEnum.Show ? (
          <ButtonBase
            className='btns-icon theme-transparent mx-1'
            onClick={() => onFooterActionsClicked(ActionsEnum.edit.key, data)}
          >
            <span className={`${ActionsEnum.edit.icon} c-black-light`} />
          </ButtonBase>
        ) : null}
        {Display === UnitProfileImagesCardActionEnum.Show ? (
          <ButtonBase
            className='btns-icon theme-transparent mx-1'
            onClick={() => onFooterActionsClicked(ActionsEnum.delete.key, data)}
          >
            <span className={`${ActionsEnum.delete.icon} c-warning`} />
          </ButtonBase>
        ) : null}
      </div>
    </div>
  );
};

CardFooterComponent.propTypes = {
  Display: PropTypes.instanceOf(UnitProfileImagesCardActionEnum).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
