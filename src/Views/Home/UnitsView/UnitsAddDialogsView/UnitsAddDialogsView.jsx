import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { DialogComponent } from '../../../../Components';
import { UnitsAddForSaleView } from './UnitsDialogsManagementView/UnitsAddForSaleView/UnitsAddForSaleView';
import { UnitsAddForRentView } from './UnitsDialogsManagementView/UnitsAddForRentView/UnitsAddForRentView';

export const UnitsAddDialogsView = ({ open, close }) => {
  const [view, setview] = useState(1);
  const translationPath = '';
  const parentTranslationPath = 'UnitsDialogsManagementView';
  return (
    <DialogComponent
      titleText='add-new-units'
      titleClasses='DialogComponent-add-new-units'
      wrapperClasses='wrapperClasses-add-new-units'
      maxWidth='lg'
      SmothMove
      fullWidth
      dialogContent={
        view === 2 ? (
          <>
            <UnitsAddForRentView
              setview={(viewval) => setview(viewval)}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              isClose={() => close()}
            />
          </>
        ) : (
          <>
            <UnitsAddForSaleView
              setview={(viewval) => setview(viewval)}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              isClose={() => close()}
            />
          </>
        )
      }
      isOpen={open}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
    />
  );
};
UnitsAddDialogsView.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
};
