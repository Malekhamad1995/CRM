import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../../../Helper';
import { SetUnitAsAvailableOrDraft } from '../../../../../../../Services';
import { UnitsStatusEnum } from '../../../../../../../Enums';
import { DialogComponent, Inputs, Spinner } from '../../../../../../../Components';

export const UnitStatusDraftDialog = ({
  activeItem,
  isOpen,
  reloadData,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const res = await SetUnitAsAvailableOrDraft({
      unitId: activeItem.id,
      status: UnitsStatusEnum.Draft.key,
      note: notes,
      rowVersion: activeItem.rowVersion,
    });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}unit-status-updated-successfully`);
      if (reloadData) reloadData();
    } else showError(t`${translationPath}unit-status-update-failed`);
  };
  return (
    <DialogComponent
      titleText='make-draft'
      saveText='make-draft'
      maxWidth='sm'
      dialogContent={(
        <div className='unit-status-draft-dialog-wrapper view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='title-box-wrapper'>
            <div className='box-wrapper'>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}ref-no`)}</span>
                <span className='box-value'>{activeItem.refNo || 'N/A'}</span>
              </div>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}unit-no`)}</span>
                <span className='box-value'>
                  { activeItem.unit_number || 'N/A'}
                </span>
              </div>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}community`)}</span>
                <span className='box-value'>{(activeItem.community && activeItem.community.lookupItemName) || 'N/A'}</span>
              </div>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}property`)}</span>
                <span className='box-value'>{activeItem.propertyName || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className='w-100 px-3 mb-3'>
            <Inputs
              idRef='notesRef'
              labelValue='notes'
              value={notes || ''}
              multiline
              rows={6}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

UnitStatusDraftDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
UnitStatusDraftDialog.defaultProps = {
  activeItem: null,
  parentTranslationPath: 'UnitsStatusManagementView',
  translationPath: '',
};
