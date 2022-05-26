import React from 'react';
import { PropTypes } from 'prop-types';
import { DialogComponent } from '../../../../../../../../Components';
import { OperatingCostsViewManagement } from '../../../../../../OperatingCosts/OperatingCostsViewManagement/OperatingCostsViewManagement';

export const OperatingCostsAddManagementDialog = ({
  isOpen,
  reloadData,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => (
  <DialogComponent
    titleText='add-new-operating-costs'
    saveText='confirm'
    saveType='button'
    maxWidth='lg'
    dialogContent={(
      <OperatingCostsViewManagement
        isPortfolio
        reloadData={reloadData}
        isOpenChanged={isOpenChanged}
      />
    )}
    isOpen={isOpen}
    translationPath={translationPath}
    parentTranslationPath={parentTranslationPath}
    saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
  />
);
OperatingCostsAddManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
