import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../../../Helper';
import { lookupItemsGetId, SetUnitAsAvailableOrDraft } from '../../../../../../../Services';
import { UnitsOperationTypeEnum, UnitsStatusEnum } from '../../../../../../../Enums';
import { AvailableStatusReason } from '../../../../../../../assets/json/StaticLookupsIds.json';
import {
  AutocompleteComponent,
  DialogComponent,
  Inputs,
  Spinner,
} from '../../../../../../../Components';

export const UnitStatusAvailableDialog = ({
  activeItem,
  isOpen,
  reloadData,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);
  const searchTimer = useRef(null);
  const [notes, setNotes] = useState('');
  const [reasons, setReasons] = useState([]);
  const [reasonId, setReasonId] = useState(null);
  const getAllReasons = useCallback(async () => {
    setIsLoadingReasons(true);
    const res = await lookupItemsGetId({
      lookupTypeId: AvailableStatusReason,
    });
    if (!(res && res.status && res.status !== 200)) setReasons(res || []);
    else setReasons([]);
    setIsLoadingReasons(false);
  }, []);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const res = await SetUnitAsAvailableOrDraft({
      unitId: activeItem.id,
      status: UnitsStatusEnum.Available.key,
      note: notes,
      availableReasonId: reasonId,
      rowVersion: activeItem.rowVersion,
      OperationType: UnitsOperationTypeEnum.rent.key
    });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}unit-status-updated-successfully`);
      if (reloadData) reloadData();
    } else showError(t`${translationPath}unit-status-update-failed`);
  };
  useEffect(() => {
    getAllReasons();
  }, [getAllReasons]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <DialogComponent
      titleText='make-available-description'
      saveText='make-available'
      maxWidth='sm'
      dialogContent={(
        <div className='unit-status-draft-dialog-wrapper view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='title-box-wrapper'>
            <div className='box-wrapper'>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}ref-no`)}</span>
                <span className='box-value'>{activeItem.refNumber || 'N/A'}</span>
              </div>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}unit-no`)}</span>
                <span className='box-value'>{activeItem.unitNumber || 'N/A'}</span>
              </div>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}community`)}</span>
                <span className='box-value'>{activeItem.community || 'N/A'}</span>
              </div>
              <div className='box-item-wrapper'>
                <span className='box-title'>{t(`${translationPath}property`)}</span>
                <span className='box-value'>{activeItem.property || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className='w-100 px-3'>
            <AutocompleteComponent
              idRef='reasonIdRef'
              labelValue='reason-available-description'
              selectedValues={selectedReason}
              multiple={false}
              data={reasons}
              displayLabel={(option) => option.lookupItemName || ''}
              withoutSearchButton
              isLoading={isLoadingReasons}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelectedReason(newValue);
                setReasonId((newValue && newValue.lookupItemId) || null);
              }}
            />
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

UnitStatusAvailableDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
UnitStatusAvailableDialog.defaultProps = {
  activeItem: null,
  parentTranslationPath: 'UnitsStatusManagementView',
  translationPath: '',
};
