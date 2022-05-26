import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../Components';

export const ExpiredPeriodComponent = ({
  parentTranslationPath,
  translationPath,
  state,
  setState,
}) => (
  <div>
    <Inputs
      idRef='ExpiredPeriodRef'
      labelValue='ExpiredPeriod'
      labelClasses='Requierd-Color'
      value={state.expiredPeriod}
      inputPlaceholder={`${translationPath}Add-number`}
      isWithError
      type='number'
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      min={0}
      max={+(state.expiredPeriod || 0)}
      onInputChanged={(event) => {
        setState(event.target.value);
      }}
    />
  </div>
);

ExpiredPeriodComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};
