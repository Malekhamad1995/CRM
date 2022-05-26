import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RadiosGroupComponent } from '../../../../../../Components';
import { AmountType } from '../../../../../../Enums/AmountType.Enum';

export const AmountRadioComponent = ({
  parentTranslationPath,
  translationPath,
  amountType,
  setamountType,
}) => {
  const [viewType, setViewType] = useState(amountType);

  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
    setamountType(+newValue);
  };

  return (
    <div>
      <div className='d-flex'>
        <RadiosGroupComponent
          idRef='viewDataRef'
          data={Object.values(AmountType)}
          value={viewType}
          labelValue='Amount'
          labelInput='name'
          valueInput='value'
          themeClass='theme-line'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          onSelectedRadioChanged={onViewTypeChangedHandler}
        />
      </div>
    </div>
  );
};
AmountRadioComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setamountType: PropTypes.string.isRequired,
  amountType: PropTypes.number.isRequired,
};
