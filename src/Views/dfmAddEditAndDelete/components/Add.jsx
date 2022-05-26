import React, { useState, useEffect } from 'react';
import TypePicker from '../../../Components/dfmAddEditAndDelete/typePicker/TypePicker';
import GenricStepper from '../../../Components/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';
import { PROPERTIES } from '../../../config/pagesName';

const Add = ({
  match: {
 params: {
 pageName, type, id, showType
}
},
  closeDialog,
  isDialog,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    setActiveStep(0);
  }, [pageName]);
  return (
    <div>
      {(activeStep === 0 && !type && !id && pageName !== PROPERTIES) ? (
        <TypePicker
          typeName={pageName}
          setPcikedType={setActiveStep}
        />
      ) : (
        <GenricStepper
          pageName={pageName}
          type={type || activeStep}
          id={id}
          setPcikedType={setActiveStep}
          closeDialog={closeDialog}
          isDialog={isDialog}
          showType={showType && showType === 'missing'}
        />
      )}
    </div>
  );
};

export default Add;
