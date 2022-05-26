import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CancelOrganizationUser } from '../../../../../../../Services/UsersServices/userServices';
import { showSuccess } from '../../../../../../../Helper';
import { Spinner, DialogComponent } from '../../../../../../../Components';

const translationPath = 'UsersDeleteDialog.';
const UserCancelDialog = ({
  activeUserItem, isOpen, isOpenChanged, reloadData
}) => {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation('UsersView');
  const cancelHandler = async () => {
    setLoading(true);
    const res = await CancelOrganizationUser(activeUserItem.id);
    if (res) {
      reloadData();
      showSuccess(t(`${translationPath}user-Deactivated-successfully`));
    }
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
            {`${t(`${translationPath}cancelledText`)}  ${activeUserItem.fullName}`}
          </span>
        </div>
      )}
      saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
      isOpen={isOpen}
      onSaveClicked={cancelHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}

    />
  );
};
export { UserCancelDialog };
UserCancelDialog.propTypes = {
  activeUserItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
