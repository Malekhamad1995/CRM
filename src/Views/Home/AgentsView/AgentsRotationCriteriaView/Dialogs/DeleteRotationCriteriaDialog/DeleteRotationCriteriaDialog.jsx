import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { showSuccess, showError } from '../../../../../../Helper';
import { DeleteRotationSchema } from '../../../../../../Services/RotaionSchemaService/RotationSchemaService';
import {
    DialogComponent,
    Spinner,
} from '../../../../../../Components';

export const DeleteRotationCriteriaDialog = ({
    open,
    close,
    parentTranslationPath,
    translationPath,
    onSave,
    rotationCriteria,
}) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [isLoading, setIsLoading] = useState(false);
    const deleteHandler = async () => {
        setIsLoading(true);
        const res = await DeleteRotationSchema(rotationCriteria && rotationCriteria.rotationSchemeId);
        if (!(res && res.status && res.status !== 200)) {
            showSuccess(t(`${translationPath}delete-Rotation-Schema-success`));
            onSave();
        } else showError(t(`${translationPath}delete-rotation-Schema-failed`));
        setIsLoading(false);
    };

    return (
      <DialogComponent
        titleText={t(`${translationPath}delete-rotation-schema`)}
        saveText={t('confirm')}
        saveType='button'
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <Spinner isActive={isLoading} />
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />
            <span>
              {' '}
              <span>{`${t('Are-you-sure-you-want-to-Delete')} ${rotationCriteria && rotationCriteria.label}`}</span>
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
DeleteRotationCriteriaDialog.propTypes = {
    parentTranslationPath: PropTypes.string.isRequired,
    translationPath: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    rotationCriteria: PropTypes.instanceOf(Object),
};
