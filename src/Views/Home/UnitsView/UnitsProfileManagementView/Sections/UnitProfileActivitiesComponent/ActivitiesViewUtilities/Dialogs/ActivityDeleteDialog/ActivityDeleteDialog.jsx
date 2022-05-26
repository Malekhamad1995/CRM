import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../../../../Components';
import { DeleteActivity } from '../../../../../../../../../Services';

const ActivityDeleteDialog = ({
  activeItem,
  isOpen,
  isOpenChanged,
  reloadData,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const deleteHandler = async () => {
    setIsLoading(true);
    const res = await DeleteActivity(activeItem.id);
    if (!(res && res.status && res.status !== 200)) {
      reloadData();
      showSuccess(t(`${translationPath}activity-deleted-successfully`));
    } else showError(t(`${translationPath}activity-delete-failed`));
    setIsLoading(false);
    isOpenChanged();
  };
  return (
    <DialogComponent
      titleText='confirm-message'
      saveText='confirm'
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <div className='d-flex-column-center'>
          <Spinner isActive={isLoading} isAbsolute />
          <span className='mdi mdi-close-octagon c-danger mdi-48px' />
          <span>{`${t(`${translationPath}activity-delete-description`)}`}</span>
        </div>
      )}
      saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
      isOpen={isOpen}
      onSaveClicked={deleteHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
export { ActivityDeleteDialog };
ActivityDeleteDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
