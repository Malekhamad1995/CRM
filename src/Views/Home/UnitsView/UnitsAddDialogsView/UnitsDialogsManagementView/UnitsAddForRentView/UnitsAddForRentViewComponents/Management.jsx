import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RadiosGroupComponent } from '../../../../../../../Components';

export const Management = ({
  parentTranslationPath,
  translationPath,
  setvalue, // value
}) => {
  const [viewType, setViewType] = useState(0);

  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
    setvalue(+newValue);
  };

  return (
    <div>
      <div className='d-flex Raido-Management'>
        <RadiosGroupComponent
          data={[
            { value: 1, label: 'Managed' },
            { value: 0, label: 'Unmanaged' },
          ]}
          valueInput='value'
          labelInput='label'
          value={viewType}
          onSelectedRadioChanged={onViewTypeChangedHandler}
          name='radioGroups'
          titleClasses='texts gray-primary-bold'
          wrapperClasses='mb-3'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          labelValue='Management'
        />
      </div>
    </div>
  );
};
Management.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};
