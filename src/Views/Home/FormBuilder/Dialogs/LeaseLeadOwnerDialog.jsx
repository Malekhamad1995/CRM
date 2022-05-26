import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  DialogComponent
} from '../../../../Components';

export const LeaseLeadOwnerDialog = ({
  open,
  close,
  onSave
}) => {
  const { t } = useTranslation(['FormBuilder', 'Shared']);

  return (
    <div>
      <DialogComponent
        titleText='Delete  lease Lead Owner'
        saveText='Confirm'
        saveType='button'
        disableBackdropClick
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />

            <span>{`${t('Are-you-sure-you-want-to-Delete-Lease-lead-Owner')}`}</span>
          </div>
        )}
        saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
        isOpen={open}
        onSaveClicked={onSave}
        onCloseClicked={close}
        onCancelClicked={close}
      />
    </div>
  );
};
LeaseLeadOwnerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
