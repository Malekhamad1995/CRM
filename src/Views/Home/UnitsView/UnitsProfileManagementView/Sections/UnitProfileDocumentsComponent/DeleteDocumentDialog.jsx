import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { showSuccess, showError } from '../../../../../../Helper';
import { DeleteScopeDocument } from '../../../../../../Services';
import {
  DialogComponent,
  Spinner,
} from '../../../../../../Components';

const parentTranslationPath = 'UnitsView';
const translationPath = '';

export const DeleteDocumentDialog = ({
  open,
  close,
  onSave,
  activeItem
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = async () => {
    setIsLoading(true);
    const res = await DeleteScopeDocument(activeItem && activeItem.scopeDocumentId);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}delete-document-successfully`));
      onSave();
    } else showError(t(`${translationPath}delete-document-failed`));
    setIsLoading(false);
  };

  return (
    <DialogComponent
      titleText={t(`${translationPath}delete-document`)}
      saveText={t('confirm')}
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <div className='d-flex-column-center'>
          <Spinner isActive={isLoading} />
          <span className='mdi mdi-close-octagon c-danger mdi-48px' />
          <span>
            {' '}
            <span>
              {`${t('Are-you-sure-you-want-to-Delete')}`}
              {' '}
              :
            </span>
            {' '}
            {' '}
            <span style={{ fontWeight: 600 }}>
              {`${activeItem && activeItem.documentName}`}
              {' '}
            </span>
          </span>
        </div>
      )}
      saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
      isOpen={open}
      onSaveClicked={deleteHandler}
      onCloseClicked={close}
      onCancelClicked={close}
      translationPath={translationPath.confirm}
    />
  );
};
DeleteDocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
