import React, { useState } from 'react';
import { Spinner } from '../../../../../../Components';

export const UnitProfileMarketingComponent = () => {
  const [isLoading] = useState(false);
  return (
    <div className='units-information-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
    </div>
  );
};

UnitProfileMarketingComponent.propTypes = {};
