import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import image from '../../assets/images/defaults/loader.gif';
import { LoadableImageEnum } from '../../Enums';

export const LoadableImageComponant = ({
  src,
  alt,
  type,
  classes,
  withOverlay,
  overlayText,
  overlayImage,
  onFinishLoading,
  ...props
}) => {
  const [state, setState] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    if (type === LoadableImageEnum.div.key) {
      const bgImg = new Image();
      bgImg.src = src;
      bgImg.onload = () => {
        if (mounted.current) {
          setState(true);
          if (onFinishLoading) onFinishLoading();
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, src, type]);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  return (
    <>
      {type === LoadableImageEnum.image.key && (
        <img
          src={src}
          alt={alt}
          className={`${classes} ${state ? ' show' : ' hidden'}`}
          onLoad={() => {
            setState(true);
            if (onFinishLoading) onFinishLoading();
          }}
          {...props}
        />
      )}
      {type === LoadableImageEnum.div.key && state && (
        <div
          className={classes}
          aria-label={alt}
          {...props}
          style={{
            ...props.style,
            backgroundImage: `url(${src})`,
          }}
        />
      )}
      <img
        src={image}
        alt={alt}
        className={`${classes} ${!state ? ' show' : ' hidden'}`}
        {...props}
      />
      {withOverlay && (
        <div className='loadable-overlay'>
          {overlayText && <span>{overlayText}</span>}
          {overlayImage && <span className={overlayImage} />}
        </div>
      )}
    </>
  );
};
LoadableImageComponant.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(LoadableImageEnum).map((item) => item.key)),
  classes: PropTypes.string,
  onFinishLoading: PropTypes.func,
  withOverlay: PropTypes.bool,
  overlayText: PropTypes.string,
  overlayImage: PropTypes.string,
  props: PropTypes.instanceOf(Object),
};
LoadableImageComponant.defaultProps = {
  type: LoadableImageEnum.image.key,
  withOverlay: false,
  overlayText: undefined,
  overlayImage: undefined,
  onFinishLoading: undefined,
  classes: undefined,
  props: undefined,
};
