import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'masonry-layout';

export const MasonryComponent = ({
  children,
  itemClassName,
  customMonitor,
  executeDelay,
  secondCustomMonitor,
  fitWidth,
}) => {
  const masonryWrapperRef = useRef(null);
  const masonryRef = useRef(null);
  const masonaryInit = useCallback(() => {
    if (
      !masonryWrapperRef.current ||
      (!itemClassName && (!children || children.length === 0 || !children[0].props))
    )
      return;
    masonryRef.current = new Masonry(masonryWrapperRef.current, {
      itemSelector: `.${itemClassName || children[0].props.className}`,
      gutter: 0,
      fitWidth,
      horizontalOrder: true,
      percentPosition: true,
    });
    setTimeout(() => {
      masonryRef.current.layout();
    }, executeDelay);
  }, [children, executeDelay, fitWidth, itemClassName]);

  useEffect(() => {
    masonaryInit();
  }, [children, itemClassName, customMonitor, secondCustomMonitor, executeDelay, masonaryInit]);
  return (
    <div className='masonry-wrapper' ref={masonryWrapperRef}>
      {children}
    </div>
  );
};

MasonryComponent.propTypes = {
  children: PropTypes.instanceOf(Array).isRequired,
  itemClassName: PropTypes.string,
  customMonitor: PropTypes.instanceOf(Array),
  secondCustomMonitor: PropTypes.instanceOf(Array),
  fitWidth: PropTypes.bool,
  executeDelay: PropTypes.number,
};
MasonryComponent.defaultProps = {
  itemClassName: undefined,
  customMonitor: undefined,
  secondCustomMonitor: undefined,
  fitWidth: true,
  executeDelay: 0,
};
