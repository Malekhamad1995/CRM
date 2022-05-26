import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Box, Typography } from '@material-ui/core';
import { getBgProgressColor } from '../../../Helper';

export const ProgressCircularComponent = ({
  value,
  withCenterText,
  wrapperClasses,
  progressClasses,
  themeClasses,
  textClasses,
  variant,
  position,
  bottom,
  left,
  height,
  width,
}) => (
  <Box
    className={`circular-progress-wrapper ${wrapperClasses} ${themeClasses}`}
    style={{ position }}
    bottom={bottom}
    left={left}
    display='inline-flex'
  >
    <div className='circular-progress-item-wrapper'>
      <CircularProgress
        className={`progress-wrapper ${progressClasses} ${
          getBgProgressColor(value).circularColor || ''
        }`}
        style={{ height, width }}
        value={value}
        variant={variant}
      />
    </div>
    {withCenterText && (
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography
          variant='caption'
          component='div'
          className={`progress-text ${textClasses} ${getBgProgressColor(value).textColor}`}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    )}
  </Box>
);

ProgressCircularComponent.propTypes = {
  value: PropTypes.number.isRequired,
  wrapperClasses: PropTypes.string,
  progressClasses: PropTypes.string,
  textClasses: PropTypes.string,
  themeClasses: PropTypes.string,
  variant: PropTypes.string,
  position: PropTypes.string,
  withCenterText: PropTypes.bool,
  bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
ProgressCircularComponent.defaultProps = {
  wrapperClasses: '',
  progressClasses: '',
  textClasses: '',
  variant: 'determinate',
  position: 'relative',
  themeClasses: '',
  withCenterText: false,
  bottom: 0,
  left: 0,
  height: 25,
  width: 25,
};
