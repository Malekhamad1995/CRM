import React, { useEffect, useState } from 'react';
import GenricStpeper from '../../../../Components/OLD/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';
import { PROPERTIES } from '../../../../config/pagesName';
import { GetParams } from '../../../../Helper';

function PropertiesManagementView() {
  const [id, setId] = useState(null);
  useEffect(() => {
    setId(GetParams('id'));
  }, []);
  return (
    <div className='view-wrapper pt-3'>
      <div className='d-flex-column'>
        {id && (
          <GenricStpeper
            pageName={PROPERTIES}
            id={(id && +id) || undefined}
            withTotal
            isDialog={false}
          />
        )}
        {!id && <GenricStpeper pageName={PROPERTIES} withTotal isDialog={false} />}
      </div>
    </div>
  );
}

export { PropertiesManagementView };
