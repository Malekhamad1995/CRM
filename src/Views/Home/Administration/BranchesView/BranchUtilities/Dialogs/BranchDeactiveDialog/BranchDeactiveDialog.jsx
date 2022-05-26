import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { SetBranchAsActiveOrInactive } from '../../../../../../../Services';
import { showSuccess,showError } from '../../../../../../../Helper';
import { Spinner, DialogComponent } from '../../../../../../../Components';

const BranchDeactiveDialog = ({
  activeItem,
   isOpen,
   isOpenChanged,
   reloadData,
   translationPath,
   parentTranslationPath
}) => {

  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation(parentTranslationPath);
  const deactiveHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const res = await SetBranchAsActiveOrInactive({branchId:activeItem.branchId});
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}branch-activated-successfully`));
      reloadData();
    } else showError(t(`${translationPath}branch-activation-failed`));

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
            {`${t(`${translationPath}deactivation-text`)}  ${activeItem&&activeItem.branchName||''}`}
          </span>
        </div>
      )}
      saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
      isOpen={isOpen}
      onSaveClicked={deactiveHandler}
      onCloseClicked={isOpenChanged}
      onDeactiveClicked={isOpenChanged}

    />
  );
};
export { BranchDeactiveDialog };
BranchDeactiveDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
