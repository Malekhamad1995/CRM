import React from 'react';
import { Popover } from '@material-ui/core';
import PropTypes from 'prop-types';

export const PopoverComponent = ({
  component,
  idRef,
  attachedWith,
  handleClose,
  popoverClasses,
  anchorOrigin,
  transformOrigin,
  style,
  themeClass,
  withBackdrop,
}) => {
  const open = Boolean(attachedWith);
  return (
    <Popover
      id={idRef}
      open={open}
      anchorEl={attachedWith}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      style={style}
      transformOrigin={transformOrigin}
      className={`popover-wrapper ${popoverClasses} ${themeClass || ''}${
        (withBackdrop && ' with-backdrop') || ''
      }`}
    >
      {component}
    </Popover>
  );
};
PopoverComponent.propTypes = {
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node])
    .isRequired,
  idRef: PropTypes.string.isRequired,
  attachedWith: PropTypes.instanceOf(Object),
  handleClose: PropTypes.func,
  popoverClasses: PropTypes.string,
  themeClass: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
    horizontal: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
  }),
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
    horizontal: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
  }),
  withBackdrop: PropTypes.bool,
};
PopoverComponent.defaultProps = {
  attachedWith: undefined,
  handleClose: undefined,
  popoverClasses: '',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  style: undefined,
  themeClass: undefined,
  withBackdrop: undefined,
};
