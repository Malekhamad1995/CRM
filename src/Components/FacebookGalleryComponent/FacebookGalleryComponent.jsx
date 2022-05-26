import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { DefaultImagesEnum } from '../../Enums';
import { DialogComponent } from '../DialogComponent/DialogComponent';
import { LoadableImageComponant } from '../LoadableImageComponant/LoadableImageComponant';
import { getDownloadableLink } from '../../Helper';
import { useLocalStorage } from '../../Hooks';
import { FacebookGalleryImageInfoIdComponent } from './FacebookGalleryImageInfoIdComponent';

export const FacebookGalleryComponent = ({
  data,
  titleText,
  parentTranslationPath,
  translationPath,
  imageInput,
  defaultImage,
  isOpen,
  onOpenChanged,
  keyRef,
  altInput,
  alt,
  activeImageIndex,
  activeImageTooltipComponent,
  nextHandle,
  backHandle,
  WithUnitDetails,
  thumbnail,
  updateData
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  // const DetailsImgesStatus = localStorage.getItem('DetailsImgesStatus');
  const [activeImage, setActiveImage] = useState(null);
  const [datastate, setdatastate] = useState((data && data) || []);
  const [showInfoFildes, setShowInfoFildes] = useState(true);
  const [currentDirection] = useLocalStorage('localization', { isRtl: false });
  const thumbnailWrapperRef = useRef(null);
  const scrollTimer = useRef(null);
  const [scrollCurrentItem, setScrollCurrentItem] = useState(0);
  const dataReturn = (dataItem, columnPath) => {
    if (!dataItem) return '';
    if (!columnPath) return (typeof dataItem !== 'object' && dataItem) || '';
    if (!columnPath.includes('.')) return dataItem[columnPath];
    let a = dataItem;
    columnPath.split('.').map((item) => {
      if (a) a = a[item];
      return item;
    });
    return a;
  };

  const scrollPositionHandler = useCallback(() => {
    const element = thumbnailWrapperRef.current;
    if (
      !(element && element.firstChild && element.firstChild.childNodes.length > scrollCurrentItem)
    )
      return;
    const nodeElement = element.firstChild.childNodes[scrollCurrentItem];
    const isVisable =
      (currentDirection.isRtl &&
        nodeElement.offsetLeft < element.scrollLeft &&
        nodeElement.offsetLeft - nodeElement.offsetWidth >
        element.offsetWidth - element.scrollLeft) ||
      (nodeElement.offsetLeft > element.scrollLeft &&
        nodeElement.offsetLeft + nodeElement.offsetWidth <
        element.offsetWidth + element.scrollLeft);
    if (!isVisable) {
      element.scrollTo({
        left: nodeElement.offsetLeft - 35,
        behavior: 'smooth',
      });
    }
  }, [currentDirection.isRtl, scrollCurrentItem]);

  const toHandler = (direction) => () => {
    setScrollCurrentItem((item) => {
      let currentItemLocal = item;
      if (direction === 'next') currentItemLocal += 1;
      else currentItemLocal -= 1;
      return currentItemLocal;
    });
  };
  const activeImageHandler = useCallback(
    (item, index) => () => {
      setScrollCurrentItem(index);
      thumbnail(index);
    },
    []
  );
  useEffect(() => {
    scrollPositionHandler();
  }, [scrollPositionHandler, scrollCurrentItem]);
  useEffect(() => {
    setActiveImage((datastate && datastate.length > scrollCurrentItem && datastate[scrollCurrentItem]) || null);
  }, [datastate, scrollCurrentItem]);

  useEffect(() => {
    setScrollCurrentItem(0);
  }, [currentDirection.isRtl]);
  useEffect(() => {
    if (datastate && datastate.length > activeImageIndex && datastate[activeImageIndex]) {
      setActiveImage(datastate[activeImageIndex]);
      setScrollCurrentItem(activeImageIndex);
    }
  }, [activeImageIndex, datastate]);
  useEffect(
    () => () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    },
    []
  );
  return (
    <DialogComponent
      titleText={titleText}
      dialogContent={(
        <div className='facebook-gallery-wrapper'>

          <div className='facebook-gallery-wrapper-inputs'>
            {activeImage && (
              <>
                <div className='facebook-gallery-active-wrapper'>
                  <div className='facebook-gallery-active-image-wrapper'>
                    <LoadableImageComponant
                      classes='facebook-gallery-active-image'
                      alt={dataReturn(activeImage, altInput) || t(`${translationPath}${alt}`)}
                      src={
                        (dataReturn(activeImage, imageInput) &&
                          getDownloadableLink(dataReturn(activeImage, imageInput))) ||
                        defaultImage
                      }
                    />
                    {activeImageTooltipComponent && (
                      <div className='over-active-image-tooltip-wrapper'>
                        {activeImageTooltipComponent(scrollCurrentItem)}
                      </div>
                    )}
                  </div>
                </div>
                {WithUnitDetails && (
                  <>
                    {((
                      <div style={{ display: (!showInfoFildes ? ('none') : '') }}>
                        <FacebookGalleryImageInfoIdComponent
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          data={activeImage}
                          activeImage={activeImage}
                          updateData={updateData}
                          onOpenChanged={(value) =>
                            setdatastate((items) => {
                              items.splice(scrollCurrentItem, 1, value);
                              return [...items];
                            })}
                          scrollCurrentItem={scrollCurrentItem}
                        />
                      </div>
                    )) || ''}
                    <div className='hide-or-show-information-Fildes'>
                      <ButtonBase
                        onClick={() => {
                          setShowInfoFildes(!showInfoFildes);
                          // localStorage.setItem('DetailsImgesStatus', !showInfoFildes);
                        }}
                        title={t('Shared:hide-or-show-information-Fildes')}
                      >
                        {(showInfoFildes && (
                          <>
                            <span className='mdi mdi-eye-off-outline c-success-light' />
                            {' '}
                            <span className='mdi mdi-format-line-style  c-success-light' />
                          </>
                        )) || (
                        <>
                          <span className='mdi mdi-eye-outline c-primary' />
                          {' '}
                          <span className='mdi mdi-format-line-style c-primary' />
                        </>
                          )}
                      </ButtonBase>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {datastate && datastate.length > 0 && (
            <div className='w-100 d-flex-center flex-wrap mb-2'>
              <ButtonBase
                className='btns-icon theme-solid mx-2 mb-2'
                disabled={scrollCurrentItem === 0}
                onClick={backHandle ? backHandle(toHandler, 'previous') : toHandler('previous')}
              >
                <span className='mdi mdi-chevron-left' />
              </ButtonBase>
              <ButtonBase
                className='btns-icon theme-solid mx-2 mb-2'
                disabled={scrollCurrentItem >= datastate.length - 1}
                onClick={
                  nextHandle ?
                    nextHandle(toHandler, 'next', scrollCurrentItem + 1) :
                    toHandler('next')
                }
              >
                <span className='mdi mdi-chevron-right' />
              </ButtonBase>
            </div>
          )}
          {datastate && datastate.length > 0 && (
            <div className='facebook-gallery-thumbnail-wrapper' ref={thumbnailWrapperRef}>
              <div className='facebook-gallery-thumbnail-items-wrapper'>
                {datastate.map((image, index) => (
                  <ButtonBase
                    onClick={activeImageHandler(image, index)}
                    className={`facebook-gallery-thumbnail-item${(activeImage &&
                      dataReturn(activeImage, imageInput) === dataReturn(image, imageInput) &&
                      ' active-image') ||
                      ''
                      }`}
                    key={`${keyRef}${index + 1}`}
                  >
                    <LoadableImageComponant
                      classes='facebook-gallery-thumbnail-image'
                      alt={dataReturn(image, altInput) || t(`${translationPath}${alt}`)}
                      src={
                        (dataReturn(image, imageInput) &&
                          getDownloadableLink(dataReturn(image, imageInput))) ||
                        defaultImage
                      }
                    />
                  </ButtonBase>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      isOpen={isOpen}
      saveType='button'
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onCloseClicked={onOpenChanged}
      onCancelClicked={onOpenChanged}
    />
  );
};

FacebookGalleryComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  defaultImage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(Object.values(DefaultImagesEnum).map((item) => item.defaultImg)),
  ]),
  nextHandle: PropTypes.func,
  updateData: PropTypes.func,
  backHandle: PropTypes.func,
  onOpenChanged: PropTypes.func.isRequired,
  activeImageTooltipComponent: PropTypes.func,
  thumbnail: PropTypes.func,
  activeImageIndex: PropTypes.number,
  titleText: PropTypes.string,
  altInput: PropTypes.string,
  imageInput: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  keyRef: PropTypes.string,
  isOpen: PropTypes.bool,
  alt: PropTypes.string,
  WithUnitDetails: PropTypes.bool,
};
FacebookGalleryComponent.defaultProps = {
  nextHandle: null,
  backHandle: null,
  defaultImage: DefaultImagesEnum.buildings.defaultImg,
  activeImageIndex: 0,
  titleText: undefined,
  activeImageTooltipComponent: undefined,
  updateData: undefined,
  imageInput: null,
  thumbnail: () => { },
  parentTranslationPath: '',
  translationPath: '',
  keyRef: 'imageGalleryRef',
  altInput: null,
  WithUnitDetails: false,
  alt: null,
  isOpen: false,
};
