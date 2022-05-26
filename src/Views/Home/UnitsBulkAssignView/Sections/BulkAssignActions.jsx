import React, { useEffect } from 'react';
import { ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  bottomBoxComponentUpdate,
  GlobalHistory,
  showError,
  showSuccess,
  showWarn,
  sideMenuComponentUpdate,
  sideMenuIsOpenUpdate,
} from '../../../../Helper';
import { BulkUpdateUnits } from '../../../../Services';

export const BulkAssignActions = ({
  parentTranslationPath,
  translationPath,
  setIsSubmitted,
  setUnitStatus,
  unitStatus,
  errors,
  state,
  setIsLoading
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const saveHandler = async () => {
    setIsLoading(true);
    setIsSubmitted(true);
    if (errors && errors.length > 0) {
      showError(errors[0].message);
      setIsLoading(false);
      return;
    }
    const result = await BulkUpdateUnits(state);
    if (!(result && result.status && result.status !== 200)) {
      setUnitStatus(result);
      if (result.success.length === 0 && result.failure.length > 0)
        showError(t(`${translationPath}units-update-failed`));
      if (result.failure.length === 0 && result.success.length > 0) {
        // cancelHandler();
        showSuccess(t(`${translationPath}units-updated-successfully`));
      }
      if (result.failure.length > 0 && result.success.length > 0) {
        showWarn(
          `${t(`${translationPath}number-of-units-failed`)} : ${result.failure.length} / ${t(
            `${translationPath}number-of-units-succeeded`
          )} : ${result.success.length}`
        );
      }
    } else showError(t(`${translationPath}units-update-failed`));
    setIsLoading(false);
  };
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='bulk-actions-wrapper w-100'>
        <ButtonBase className='btns c-danger' onClick={cancelHandler}>
          <span>{t(`${translationPath}cancel`)}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid' onClick={saveHandler}>
          <span className='px-3'>
            {unitStatus.failure.length > 0 ?
              t(`${translationPath}update-failed-units`) :
              t(`${translationPath}save-changes`)}
          </span>
        </ButtonBase>
      </div>
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );
  return <div />;
};
BulkAssignActions.propTypes = {
  setUnitStatus: PropTypes.func.isRequired,
  setIsSubmitted: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  errors: PropTypes.instanceOf(Array).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  unitStatus: PropTypes.instanceOf(Object).isRequired,
  setIsLoading: PropTypes.func.isRequired,
};
