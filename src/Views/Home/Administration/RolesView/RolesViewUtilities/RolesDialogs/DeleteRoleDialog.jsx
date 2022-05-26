import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DeleteRoleByRolesId } from '../../../../../../Services/roleServices';
import { showError, showSuccess } from '../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../Components';

export const DeleteRoleDialog = ({
 open, close, deletedId, name, reloadData
}) => {
  const { t } = useTranslation('RolesView');
  const [loading, setLoading] = useState(false);

  const handleDeleteButton = async () => {
    setLoading(true);
    const result = await DeleteRoleByRolesId(deletedId);
    if (result) {
      close();
      reloadData();
      showSuccess(t('DeleteDialog.role-deleted-successfully'));
    } else showError(t('DeleteDialog.role-delete-failed'));

    setLoading(false);
  };

  return (
    <DialogComponent
      titleText={t('DeleteDialog.confirm-message')}
      saveText={t('DeleteDialog.Confirm')}
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <div className='d-flex-column-center'>
          <Spinner isActive={loading} />
          <span className='mdi mdi-close-octagon c-danger mdi-48px' />
          <span>{`${t('DeleteDialog.DeleteText')}  ${name}`}</span>
        </div>
      )}
      saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
      isOpen={open}
      onSaveClicked={handleDeleteButton}
      onCloseClicked={close}
      onCancelClicked={close}
    />
  );
};

DeleteRoleDialog.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  deletedId: PropTypes.number.isRequired,
};
