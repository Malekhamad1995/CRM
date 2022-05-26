import React, {
  useState, useCallback, useReducer, useEffect, useRef
} from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { PermissionsComponent, Spinner } from '../../../../../../Components';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  OrganizationUserSearch,
  UpdateUnitReferenceDetails,
  GetUnitReferenceDetailsById,
  GetOwnersKeyAccess,
} from '../../../../../../Services';
import { UnitProfileReferanceDetailsFields } from './UnitProfileReferanceDetailsFields/UnitProfileReferanceDetailsFields';
import { UnitsSalesPermissions, UnitPermissions } from '../../../../../../Permissions';
import { UnitsLeasePermissions } from '../../../../../../Permissions/Lease/UnitsLeasePermissions';

export const UnitProfileReferanceDetailsComponent = ({
  parentTranslationPath,
  translationPath,
}) => {
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];

  const isPropertyManagementView = (pathName === 'units-property-management/unit-profile-edit');
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchTimer = useRef(null);
  const [loadings, setLoadings] = useReducer(reducer, {
    internalReferralId: false,
    keyStatusId: false,
  });
  const [selected, setSelected] = useReducer(reducer, {
    internalReferralId: null,
    keyStatusId: null,
  });
  const [data, setData] = useReducer(reducer, {
    internalReferralId: [],
    keyStatusId: [],
  });
  const [state, setState] = useReducer(reducer, {
    internalReferralId: '',
    internalReferralName: '',
    reraSpecialTransactionReport: '',
    referralCommission: '',
    numberOfKeys: '',
    keyStatusId: '',
    keyStatusName: '',
    sendForApproval: true,
    transactionNo: '',
  });
  const getAllRefernces = useCallback(async () => {
    setIsLoading(true);
    const response = await GetUnitReferenceDetailsById(+GetParams('id'));
    if (!(response && response.status && response.status !== 200)) {
      setState({
        id: 'edit',
        value: {
          internalReferralId: response.internalReferralId,
          internalReferralName: response.internalReferralName,
          reraSpecialTransactionReport: response.reraSpecialTransactionReport,
          referralCommission: response.referralCommission,
          numberOfKeys: response.numberOfKeys,
          keyStatusId: response.keyStatusId,
          keyStatusName: response.keyStatusName,
          sendForApproval: response.sendForApproval,
          transactionNo: response.transactionNo,
        },
      });
      setSelected({
        id: 'edit',
        value: {
          internalReferralId: {
            id: response.internalReferralId,
            fullName: response.internalReferralName,
          },
          keyStatusId: {
            ownerKeyAccessId: response.keyStatusId,
            ownerKeyAccessName: response.keyStatusName,
          },
        },
      });
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (GetParams('id')) getAllRefernces();
  }, [getAllRefernces]);
  const getAllInternalReferralId = useCallback(async (value) => {
    setLoadings({ id: 'internalReferralId', value: true });
    const response = await OrganizationUserSearch({
      name: value,
      userStatusId: 2
    });
    if (!(response && response.status && response.status !== 200)) {
      setData({
        id: 'internalReferralId',
        value: response.result || [],
      });
    } else setData({ id: 'internalReferralId', value: [] });

    setLoadings({ id: 'internalReferralId', value: false });
  }, []);
  const getAllKeyStatus = useCallback(async () => {
    setLoadings({ id: 'keyStatusId', value: true });
    const response = await GetOwnersKeyAccess();
    if (!(response && response.status && response.status !== 200)) {
      setData({
        id: 'keyStatusId',
        value: response || [],
      });
    } else setData({ id: 'keyStatusId', value: [] });

    setLoadings({ id: 'keyStatusId', value: false });
  }, []);
  useEffect(() => {
    getAllKeyStatus();
    getAllInternalReferralId();
  }, [getAllInternalReferralId, getAllKeyStatus]);
  const onStateChange = (newId, newValue) => {
    setState({ id: newId, value: newValue });
  };
  const onSelectedChange = (newId, newValue) => {
    setSelected({ id: newId, value: newValue });
  };
  const cancelHandler = useCallback(() => {
    GlobalHistory.goBack();
  }, []);
  const schema = Joi.object({
    internalReferralId: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}interanl-referral-is-required`),
      }),
    reraSpecialTransactionReport: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}rera-is-required`),
      }),
    referralCommission: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}referral-commission-is-required`),
        'number.empty': t(`${translationPath}referral-commission-is-required`),
      }),
    numberOfKeys: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}number-of-keys-is-required`),
        'number.empty': t(`${translationPath}number-of-keys-is-required`),
      }),
    transactionNo: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}transaction-number-is-required`),
        'number.empty': t(`${translationPath}transaction-number-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res = await UpdateUnitReferenceDetails(GetParams('id'), state);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200))
      showSuccess(t`${translationPath}unit-referance-details-updated-successfully`);
    else showError(t`${translationPath}unit-referance-details-update-failed`);
  }, [schema.error, state, t, translationPath]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        {!isPropertyManagementView && (
          <PermissionsComponent
            permissionsList={[...Object.values(UnitsSalesPermissions), ...Object.values(UnitsLeasePermissions)]}
            permissionsId={[UnitsSalesPermissions.EditReferenceDetailsForUnit.permissionsId, UnitsLeasePermissions.EditReferenceDetailsForUnit.permissionsId]}
          >
            <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
              <span>{t('Shared:save')}</span>
            </ButtonBase>
          </PermissionsComponent>
        )}

        {isPropertyManagementView && (
          <PermissionsComponent
            permissionsList={Object.values(UnitPermissions)}
            permissionsId={UnitPermissions.EditReferenceDetailsForUnit.permissionsId}
          >
            <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
              <span>{t('Shared:save')}</span>
            </ButtonBase>
          </PermissionsComponent>
        )}
      </div>
    );
  }, [cancelHandler, isPropertyManagementView, saveHandler, t]);

  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  return (
    <div className='units-information-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <UnitProfileReferanceDetailsFields
        data={data}
        state={state}
        schema={schema}
        selected={selected}
        loadings={loadings}
        activeItem={activeItem}
        searchTimer={searchTimer}
        isSubmitted={isSubmitted}
        onStateChange={onStateChange}
        translationPath={translationPath}
        onSelectedChange={onSelectedChange}
        parentTranslationPath={parentTranslationPath}
        getAllInternalReferralId={getAllInternalReferralId}
      />
    </div>
  );
};

UnitProfileReferanceDetailsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
