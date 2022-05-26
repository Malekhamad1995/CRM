import React, { useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import { Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ViewTypes2Enum } from '../../Enums';

const ViewTypesActivities = ({
  onTypeChanged,
  activeTypes,
  initialActiveType,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeType, setActiveType] = useState(initialActiveType || ViewTypes2Enum.tableRelatedView.key);
  const viewTypeClicked = useCallback(
    (actionType) => {
      if (actionType !== activeType) {
        setActiveType(actionType);
        onTypeChanged(actionType);
      }
    },
    [onTypeChanged, activeType]
  );
  const getViewTypesValue = (key) => Object.values(ViewTypes2Enum).find((item) => item.key === key);
  return (
    <div className='view-types-wrapper'>
      {activeTypes.map((item) => (
        <Tooltip title={t(`${translationPath}${getViewTypesValue(item).name}`)}>
          <Button
            className={`btns-view-type${activeType === getViewTypesValue(item).key ? ' active' : ''}`}
            key={getViewTypesValue(item).key}
            onClick={() => viewTypeClicked(getViewTypesValue(item).key)}
          >
            <span className={getViewTypesValue(item).classes} />
          </Button>
        </Tooltip>

      ))}
    </div>
  );
};
ViewTypesActivities.propTypes = {
  initialActiveType: PropTypes.instanceOf(Object),
  onTypeChanged: PropTypes.func.isRequired,
  activeTypes: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(ViewTypes2Enum).map((item) => item.key))
  ),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
ViewTypesActivities.defaultProps = {
  initialActiveType: ViewTypes2Enum.tableRelatedView.key,
  activeTypes: Object.values(ViewTypes2Enum).map((item) => item.key),
  parentTranslationPath: 'Shared',
  translationPath: '',
};
export { ViewTypesActivities };
