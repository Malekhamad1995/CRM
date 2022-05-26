import React from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DeleteOrganizationUser } from '../../../../../../../Services/UsersServices/userServices';
import { showSuccess, showError } from '../../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../../Components';

const UserDeleteDialog = ({
 activeUserItem, isOpen, isOpenChanged, reloadData
}) => {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation('UsersView');
  const translationPath = 'UsersDeleteDialog.';
  const deleteHandler = async () => {
    setLoading(true);
    const res = await DeleteOrganizationUser(activeUserItem.id);
    if (res) {
      reloadData();
      showSuccess(t(`${translationPath}Notif_DeleteUsers`));
    } else showError(t(`${translationPath}user-delete-failed`));
    setLoading(false);
    isOpenChanged();
  };

  return (
    <DialogComponent
      titleText={t(`${translationPath}confirm-message`)}
      saveText='confirm'
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <div className='d-flex-column-center'>
          <Spinner isActive={loading} />
          <span className='mdi mdi-close-octagon c-danger mdi-48px' />
          <span>
            {' '}
            {`${t(`${translationPath}DeleteText`)}  ${activeUserItem.fullName}`}
          </span>
        </div>
      )}
      saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
      isOpen={isOpen}
      onSaveClicked={deleteHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath.confirm}
    />
  );
};
export { UserDeleteDialog };
UserDeleteDialog.propTypes = {
  activeUserItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
