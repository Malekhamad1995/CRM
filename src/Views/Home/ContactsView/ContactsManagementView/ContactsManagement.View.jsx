import React, { useEffect, useState } from 'react';
import GenricStpeper from '../../../../Components/OLD/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';
import { CONTACTS } from '../../../../config/pagesName';
import { GetParams } from '../../../../Helper';

function ContactsManagementView() {
  const [activeFormType, setActiveFormType] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    setActiveFormType(GetParams('formType'));
    setId(GetParams('id'));
    return () => {};
  }, []);
  return (
    <div className='view-wrapper pt-3'>
      <div className='d-flex-column'>
        {activeFormType && (
          <GenricStpeper
            pageName={CONTACTS}
            type={activeFormType.toString()}
            id={(id && +id) || undefined}
            withTotal
            isDialog={false}
          />
        )}
      </div>
    </div>
  );
}

export { ContactsManagementView };