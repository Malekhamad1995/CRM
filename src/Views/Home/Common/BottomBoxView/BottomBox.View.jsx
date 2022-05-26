import React, { useState } from 'react';

import { bottomBoxComponentCallback } from '../../../../Helper';

export const BottomBoxView = () => {
  const [bottomBoxComponent, setBottomBoxComponent] = useState();
  bottomBoxComponentCallback(setBottomBoxComponent);
  return (
    (bottomBoxComponent && (
      <div className='bottom-box-wrapper'>
        <div className='bottom-box-content'>{bottomBoxComponent}</div>
      </div>
    )) || <span />
  );
};
