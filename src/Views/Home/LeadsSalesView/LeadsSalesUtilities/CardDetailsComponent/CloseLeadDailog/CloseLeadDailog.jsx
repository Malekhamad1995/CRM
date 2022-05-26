import React, {
  useCallback, useReducer, useState, useEffect
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import {
  AutocompleteComponent,
  Inputs,
  Spinner,
} from '../../../../../../Components';
import { LeadCloseReasonsEnum } from '../../../../../../Enums';
import { showError, showSuccess } from '../../../../../../Helper';
import { CloseLead, lookupItemsGetId } from '../../../../../../Services';

export const CloseLeadDailog = ({
  reloadData,
  activeData,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
  close,
  hidebbt,
}) => {
  const { t } = useTranslation('LeadsView');
  const [reasons, setreasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const result = await lookupItemsGetId({
      lookupTypeId: LeadCloseReasonsEnum.lookupTypeId,
    });
    if (!(result && result.status && result.status !== 200)) setreasons(result);
    else setreasons([]);
  }, []);
  useEffect(() => {
    getAllCloseReasons();
  }, [getAllCloseReasons]);
  const saveHandler = async () => {
    if (isOpenChanged) isOpenChanged();
    const result = await CloseLead(

      {
        leadId: activeData.id,
        closeReasonId: state.closeReasonId,
        remarks: state.remarks
      }

    );
    if (!(result && result.status && result.status !== 200)) {
      setIsLoading(true);
      showSuccess('Closed');
      close();
      hidebbt();
      // showSuccess(t`${translationPath}activity-updated-successfully`);
      reloadData();
    } else {
      setIsLoading(false);
      // showError(t(`${translationPath}activity-update-failed`));
      showError('Error');
    }
  };

  return (
    <div className='close-lead-dialog-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='dialog-content-item'>
        <AutocompleteComponent
          multiple={false}
          withoutSearchButton
          data={reasons || []}
          idRef='closeReasonRef'
          labelValue={t(`${translationPath}close-lead-reason`)}
          parentTranslationPath={parentTranslationPath}
          getOptionSelected={(option) =>
            option.lookupItemName === state.closeReasonId}
          displayLabel={(option) =>
            (option.lookupItemName && option.lookupItemName) || ''}
          selectedValues={
            state.closeReasonId &&
            reasons.find((item) => item.lookupItemId === state.closeReasonId)
          }
          onChange={(event, newValue) =>
            setState({
              id: 'closeReasonId',
              value: newValue && newValue.lookupItemId,
            })}
        />
      </div>
      <div className='dialog-content-item'>
        <Inputs
          rows={4}
          multiline
          idRef='remarksRef'
          labelValue={t(`${translationPath}remarks`)}
          // inputPlaceholder="remarks"
          value={state.remarks || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) =>
            setState({ id: 'remarks', value: event.target.value })}
        />
        <div className='d-flex-v-center-h-end flex-wrap mt-3'>
          <Button
            className='MuiButtonBase-root MuiButton-root MuiButton-text MuiButtonBase-root btns theme-transparent mb-2'
            type='button'
            onClick={() => close()}
          >
            <span className='MuiButton-label'>
              <span className='mx-2'>{t(`${translationPath}cancel`)}</span>

              <span className='MuiTouchRipple-root' />
            </span>
            <span className='MuiTouchRipple-root' />
          </Button>
          <Button
            className='MuiButtonBase-root btns theme-solid mb-2'
            type='button'
            onClick={() => saveHandler()}
          >
            <span className='MuiButton-label'>
              <span className='mx-2'>{t(`${translationPath}save`)}</span>
            </span>
            <span className='MuiTouchRipple-root' />
          </Button>
        </div>
      </div>
    </div>
  );
};

CloseLeadDailog.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  activeData: PropTypes.instanceOf(Object).isRequired,
};
