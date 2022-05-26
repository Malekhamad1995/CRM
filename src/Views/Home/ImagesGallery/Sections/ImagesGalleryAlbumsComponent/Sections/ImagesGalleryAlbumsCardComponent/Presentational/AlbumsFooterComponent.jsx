import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { getDownloadableLink } from '../../../../../../../../Helper';
import {
  ActionsEnum,
  DefaultImagesEnum,
  UnitProfileImagesCardActionEnum,
} from '../../../../../../../../Enums';
import { LoadableImageComponant, PermissionsComponent } from '../../../../../../../../Components';
import { useLocalStorage } from '../../../../../../../../Hooks';
import { ImageGalleryPermissions } from '../../../../../../../../Permissions';

export const AlbumsFooterComponent = ({
  hideIcon,
  Display,
  data,
  onFooterActionsClicked,
  parentTranslationPath,
  activeImageHandler,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [language] = useLocalStorage('localization', {
    currentLanguage: 'en',
    isRtl: false,
  });
  return (
    <div className='albums-footer-wrapper presentational-wrapper'>
      {Display ? (
        <div className='images-more-wrapper'>
          {data && data.images && data.images.result && data.images.result.length > 0 && (
            <div className='slide-images'>
              {data.images.result
                .filter((item, index) => index < 3)
                .map((item, index) => (
                  <ButtonBase
                    className='slide-image'
                    style={{
                      zIndex: index,
                      transform: `translateX(${(language.isRtl && -(index * (175 / data.images.result.length))) ||
                        index * (175 / data.images.result.length)
                        }%)`,
                    }}
                    onClick={activeImageHandler(data.images.result, index, data)}
                  >
                    <LoadableImageComponant
                      classes='slide-image'
                      key={`albumImageSliderRef${index + 1}`}
                      alt={t(`${translationPath}location-image`)}
                      src={
                        (item.fileId && getDownloadableLink(item.fileId)) ||
                        DefaultImagesEnum.buildings.defaultImg
                      }
                    />
                  </ButtonBase>
                ))}
            </div>
          )}
          {data && data.images && data.images.result && data.images.result.length > 3 && (
            <ButtonBase
              className='images-more'
              onClick={activeImageHandler(data.images.result, 0, data)}
              style={{
                zIndex: data.images.result.length,
                transform: `translateX(${(language.isRtl &&
                  -((data.images.result.length - 1) * (175 / data.images.result.length))) ||
                  (data.images.result.length - 1) * (175 / data.images.result.length)
                  }%)`,
              }}
            >
              {`+ ${(data &&
                data &&
                data.images &&
                data.images.totalCount - 3 <= 99 &&
                data.images.totalCount - 3) ||
                '99'
                }` || `+ ${data.filteredImagesDto.result.length}`}
            </ButtonBase>
          )}
        </div>
      ) : (
        <div className='images-more-wrapper'>
          {data &&
            data.filteredImagesDto &&
            data.filteredImagesDto.result &&
            data.filteredImagesDto.result.length > 0 && (
              <div className='slide-images'>
                {data.filteredImagesDto.result
                  .filter((item, index) => index < 3)
                  .map((item, index) => (
                    <ButtonBase
                      className='slide-image'
                      style={{
                        zIndex: index,
                        transform: `translateX(${(language.isRtl &&
                          -(index * (175 / data.filteredImagesDto.result.length))) ||
                          index * (175 / data.filteredImagesDto.result.length)
                          }%)`,
                      }}
                      onClick={activeImageHandler(data.filteredImagesDto.result, index, data)}
                    >
                      <LoadableImageComponant
                        classes='slide-image'
                        key={`albumImageSliderRef${index + 1}`}
                        alt={t(`${translationPath}location-image`)}
                        src={
                          (item.fileId && getDownloadableLink(item.fileId)) ||
                          DefaultImagesEnum.buildings.defaultImg
                        }
                      />
                    </ButtonBase>
                  ))}
              </div>
            )}
          {data &&
            data.filteredImagesDto &&
            data.filteredImagesDto.result &&
            data.filteredImagesDto.result.length > 3 && (
              <ButtonBase
                className='images-more'
                onClick={activeImageHandler(data.filteredImagesDto.result, 0, data)}
                style={{
                  zIndex: data.filteredImagesDto.result.length,
                  transform: `translateX(${(language.isRtl &&
                    -(
                      (data.filteredImagesDto.result.length - 1) *
                      (175 / data.filteredImagesDto.result.length)
                    )) ||
                    (data.filteredImagesDto.result.length - 1) *
                    (175 / data.filteredImagesDto.result.length)
                    }%)`,
                }}
              >
                {`+ ${(data &&
                  data &&
                  data.images &&
                  data.images.totalCount - 3 <= 99 &&
                  data.images.totalCount - 3) ||
                  data.filteredImagesDto.result.length - 3
                  }` || `+ ${data.filteredImagesDto.result.length}`}
              </ButtonBase>
            )}
        </div>
      )}
      <div className='footer-actions-wrapper px-1'>
        {Display === UnitProfileImagesCardActionEnum.Hide || hideIcon ? null : (
          <PermissionsComponent
            permissionsList={Object.values(ImageGalleryPermissions)}
            permissionsId={ImageGalleryPermissions.DeleteAlbum.permissionsId}
          >

            <ButtonBase
              className='btns-icon theme-transparent mx-1'
              onClick={() => onFooterActionsClicked(ActionsEnum.delete.key, data)}
            >
              <span className={`${ActionsEnum.delete.icon} c-warning`} />
            </ButtonBase>
          </PermissionsComponent>
        )}
      </div>
    </div>
  );
};
AlbumsFooterComponent.propTypes = {
  hideIcon: PropTypes.bool.isRequired,
  Display: PropTypes.instanceOf(UnitProfileImagesCardActionEnum).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  activeImageHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
