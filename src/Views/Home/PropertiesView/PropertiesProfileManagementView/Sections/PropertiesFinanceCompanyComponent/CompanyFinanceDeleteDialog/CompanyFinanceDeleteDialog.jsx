import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { showSuccess, showError } from '../../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../../Components';
import { DeleteCompanyFinance } from '../../../../../../../Services';

export const CompanyFinanceDeleteDialog = ({
  activeUserItem,
  isOpen,
  isOpenChanged,
  reloadData,
  t,
  translationPath,
}) => {
  const [loading, setLoading] = useState(false);
  const deleteHandler = async () => {
    setLoading(true);
    const result = await DeleteCompanyFinance(activeUserItem ? activeUserItem.companyFinanceId : 0);
    if (!(result && result.status && result.status !== 200)) {
      reloadData();
      showSuccess(t(`${translationPath}company-finance-deleted-successfully`));
    } else showError(t(`${translationPath}company-finance-deleted-successfully`));

    setLoading(false);
    isOpenChanged();
  };

  return (
    <DialogComponent
      titleText={t(`${translationPath}confirm-message`)}
      saveText={t(`${translationPath}confirm`)}
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <div className='d-flex-column-center'>
          <Spinner isActive={loading} />
          <span className='mdi mdi-close-octagon c-danger mdi-48px' />
          <span>
            {`${t(`${translationPath}DeleteText`)}  ${
              activeUserItem ? activeUserItem.companyName : ''
            }`}
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
CompanyFinanceDeleteDialog.propTypes = {
  activeUserItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
};
