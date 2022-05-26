import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../Components';
import { DeleteInvoice } from '../../../../../../Services';

const InvoiceDeleteDialog = ({
  activeItem,
  isOpen,
  isOpenChanged,
  reloadData,
  parentTranslationPath,
  translationPath,
  localTableList,
  invoiceId
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [saveIsDisabled, setSaveIsDisabled] = useState(false);
  const deleteHandler = async () => {
    setIsLoading(true);
    setSaveIsDisabled(true);
    const res = await DeleteInvoice(activeItem.invoiceId);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}invoice-deleted-successfully`));
      const deletedIndex = localTableList.findIndex(
        (element) => activeItem.invoiceId === element.invoiceId
      );
      if (deletedIndex !== -1) {
        localTableList.splice(deletedIndex, 1);
        invoiceId.invoiceId.splice(deletedIndex, 1);
      }
      reloadData();
    } else showError(t(`${translationPath}invoice-delete-failed`));
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
            <span>
              {`${t(`${translationPath}invoice-delete-description`)}  ${activeItem && activeItem.paymentNo
                }`}
            </span>
          </div>
        )}
        saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
        isOpen={isOpen}
        onSaveClicked={deleteHandler}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        saveIsDisabled={saveIsDisabled}
        disableBackdropClick
      />
  );
};
export { InvoiceDeleteDialog };
InvoiceDeleteDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
