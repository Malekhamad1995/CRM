import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../Components';

export const ActivityNameComponent = ({
  parentTranslationPath,
  translationPath,
  state,
  setState,
}) => (
  <div>
    <Inputs
      idRef='ActivityNameRef'
      labelClasses='Requierd-Color'
      labelValue='activity-name'
      value={state.activityTypeName}
      inputPlaceholder={`${translationPath}Add-text`}
      isWithError
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onInputChanged={(event) => {
        setState(event.target.value);
      }}
    />
  </div>
);

ActivityNameComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};
