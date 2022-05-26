import React, { useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import { ViewTypesEnum } from '../../Enums';

const ViewTypes = ({ onTypeChanged, activeTypes, initialActiveType }) => {
  const [activeType, setActiveType] = useState(initialActiveType || ViewTypesEnum.cards.key);
  const viewTypeClicked = useCallback(
    (actionType) => {
      if (actionType !== activeType) {
        setActiveType(actionType);
        onTypeChanged(actionType);
      }
      if (activeType !== ViewTypesEnum.tableView.key)
       (document.oncontextmenu = null);
    },
    [onTypeChanged, activeType]
  );
  const getViewTypesValue = (key) => Object.values(ViewTypesEnum).find((item) => item.key === key);
  return (
    <div className='view-types-wrapper'>
      {activeTypes.map((item) => (
        <Button
          className={`btns-view-type${activeType === getViewTypesValue(item).key ? ' active' : ''}`}
          key={getViewTypesValue(item).key}
          onClick={() => viewTypeClicked(getViewTypesValue(item).key)}
        >
          <span className={getViewTypesValue(item).classes} />
        </Button>
      ))}
    </div>
  );
};
ViewTypes.propTypes = {
  initialActiveType: PropTypes.instanceOf(Object),
  onTypeChanged: PropTypes.func.isRequired,
  activeTypes: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(ViewTypesEnum).map((item) => item.key))
  ),
};
ViewTypes.defaultProps = {
  initialActiveType: ViewTypesEnum.cards.key,
  activeTypes: Object.values(ViewTypesEnum).map((item) => item.key),
};
export { ViewTypes };
