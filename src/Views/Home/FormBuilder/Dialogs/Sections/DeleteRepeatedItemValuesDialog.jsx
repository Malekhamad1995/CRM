import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../Components';

export const DeleteRepeatedItemValuesDialog = ({ open, close, onSave }) => {
    const { t } = useTranslation(['FormBuilder', 'Shared']);
    return (
      <DialogComponent
        titleText={`${t('delete-values')}`}
        saveText={`${t('confirm')}`}
        saveType='button'
        disableBackdropClick
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />

            <span>{`${t('Are-you-sure-you-want-to-Delete')}`}</span>
          </div>
            )}
        saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
        isOpen={open}
        onSaveClicked={() => {
                onSave();
            }}
        onCloseClicked={close}
        onCancelClicked={close}
      />
    );
};
DeleteRepeatedItemValuesDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,

};
