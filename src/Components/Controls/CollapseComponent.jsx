import React, { memo, useRef } from 'react';
import Collapse from '@material-ui/core/Collapse';
import { PropTypes } from 'prop-types';
import { useOnClickOutside } from '../../Hubs';

const CollapseComponent = memo(
  ({
 isOpen, top, component, onClickOutside, classes, isCentered
}) => {
    const collapseRef = useRef(null);
    useOnClickOutside(collapseRef, onClickOutside);
    return (
      <Collapse
        in={isOpen}
        ref={collapseRef}
        className={`collapses ${classes}${isCentered ? ' is-centered' : ''}`}
        style={{ top }}
      >
        {component}
      </Collapse>
    );
  }
);
CollapseComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node])
    .isRequired,
  onClickOutside: PropTypes.func,
  top: PropTypes.number,
  classes: PropTypes.string,
  isCentered: PropTypes.bool,
};
CollapseComponent.defaultProps = {
  onClickOutside: () => {},
  top: 0,
  classes: 'absolute-collapse',
  isCentered: false,
};
export { CollapseComponent };
