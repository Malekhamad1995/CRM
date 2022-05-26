import React, {
  useCallback, useReducer, useState, useEffect
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent, DialogComponent, Inputs, Spinner } from '../../../../../../../../Components';
import { CloseListOfLeads, lookupItemsGetId } from '../../../../../../../../Services';
import { showError, showSuccess } from '../../../../../../../../Helper';
import { LeadCloseReasonsEnum } from '../../../../../../../../Enums';

export const CloseLeadDialog = ({
  isOpen,
  reloadData,
  activeItem,
  onClose,
  translationPath,
  parentTranslationPath,
  listOfSelectedIds
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [reasons, setreasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id === 'edit') {
      return {
        ...action.value,
      };
    }
    return { ...state, [action.id]: action.value };
  }, []);
  const [state, setState] = useReducer(reducer, {
    closeReasonId: null,
    remarks: '',
  });
  const getAllCloseReasons = useCallback(async () => {
    setIsLoading(true);
    const result = await lookupItemsGetId({ lookupTypeId: LeadCloseReasonsEnum.lookupTypeId });
    if (!(result && result.status && result.status !== 200)) setreasons(result);
    else setreasons([]);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    getAllCloseReasons();
  }, [getAllCloseReasons]);
  const saveHandler = async () => {
    setSaveDisabled(true);
    const result = await CloseListOfLeads(
      {
        leadIds: listOfSelectedIds,
        closeReasonId: state.closeReasonId,
        remarks: state.remarks
      }
    );
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t`${translationPath}activity-close-successfully`);
      reloadData();
    } else {
      setSaveDisabled(false);
      showError(t(`${translationPath}activity-close-failed`));
    }
  };

  return (
    <>
      <Spinner isActive={isLoading} isAbsolute={true}/>
      <DialogComponent
        titleText='close-lead'
        saveText='close'
        saveType='button'
        maxWidth='sm'
        saveIsDisabled={saveDisabled}
        disableBackdropClick
        dialogContent={(
          <div className='close-lead-dialog-wrapper'>
            <div className='dialog-content-item'>
              <AutocompleteComponent
                multiple={false}
                withoutSearchButton
                data={reasons || []}
                idRef='closeReasonRef'
                labelValue='close-reason'
                inputPlaceholder='close-reason'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                getOptionSelected={(option) => option.lookupItemName === state.closeReasonId}
                displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                isLoading={isLoading}
                selectedValues={
                  state.closeReasonId &&
                  reasons.find((item) => item.lookupItemId === state.closeReasonId)
                }
                onChange={(event, newValue) =>
                  setState({ id: 'closeReasonId', value: newValue && newValue.lookupItemId })}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                rows={4}
                multiline
                idRef='remarksRef'
                labelValue='remarks'
                inputPlaceholder='remarks'
                value={state.remarks || ''}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                onInputChanged={(event) => setState({ id: 'remarks', value: event.target.value })}
              />
            </div>
          </div>
        )}
        isOpen={isOpen}
        onSaveClicked={saveHandler}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onCancelClicked={() => {
          onClose();
          setState({ id: 'edit', value: { closeReasonId: null, remarks: '' } });
        }}
      />
    </>
  );
};

CloseLeadDialog.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
