import React from 'react';
import { PropTypes } from 'prop-types';
import image from '../../assets/images/defaults/loader.gif';
import './Spinner.scss';

export const Spinner = ({
 isActive, isAbsolute, isSmall, isWithoutText
}) => (
  <>
    {isActive && (
      <div
        className={`spinner-wrapper${isAbsolute ? '  is-absolute' : ''}${
          (isSmall && ' is-small') || ''
        }`}
      >
        <div className='app-spinner'>
          <img src={image} alt='...' className='spinner-img' />
          {!isWithoutText && <span className='fz-15px'>Please Wait ...</span>}
        </div>
      </div>
    )}
  </>
);
Spinner.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isAbsolute: PropTypes.bool,
  isSmall: PropTypes.bool,
  isWithoutText: PropTypes.bool,
};
Spinner.defaultProps = {
  isAbsolute: false,
  isSmall: false,
  isWithoutText: false,
};
