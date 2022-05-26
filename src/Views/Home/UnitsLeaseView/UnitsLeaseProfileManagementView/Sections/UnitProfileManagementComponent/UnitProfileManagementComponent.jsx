import React, {
 useCallback, useEffect, useRef, useState, useReducer
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { object } from 'joi';
import { useDispatch } from 'react-redux';
import { AutocompleteComponent } from '../../../../../../Components';
import {
  GetAllPortfolio,
  lookupItemsGetId,
  DeAssignPortfolioToUnit,
  AssignPortfolioToUnit,
} from '../../../../../../Services';
import { ManagementTypeEnum } from '../../../../../../Enums';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';
import { PermissionsComponent } from '../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsLeasePermissions } from '../../../../../../Permissions/Lease/UnitsLeasePermissions';

export const UnitProfileManagementComponent = ({
  parentTranslationPath,
  translationPath,
  activeItem,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isManaged, setisManaged] = useState(activeItem.portfolio !== null);
  const searchTimer = useRef(null);
  const dispatch = useDispatch();
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [loadings, setLoadings] = useReducer(reducer, {
    portfolio: false,
    managementType: false,
  });
  const [selected, setSelected] = useReducer(reducer, {
    portfolio: null,
    managementType: null,
  });
  const [data, setData] = useReducer(reducer, {
    portfolio: [],
    managementType: [],
  });
  const [state, setState] = useReducer(reducer, {
    UnitId: +GetParams('id'),
    PortfolioId: null,
    ManageTypeId: null,
  });
  const getAllPortfolio = useCallback(
    async (value = '') => {
      if (isManaged) {
        setLoadings({ id: 'portfolio', value: true });
        const res = await GetAllPortfolio({ pageIndex: 0, pageSize: 25, search: value });
        if (!(res && res.status && res.status !== 200))
          setData({ id: 'portfolio', value: (res && res.result) || [] });
        setLoadings({ id: 'portfolio', value: false });
      }
    },
    [isManaged]
  );
  const getAllManagementTypes = useCallback(async () => {
    if (isManaged) {
      setLoadings({ id: 'managementType', value: true });
      const res = await lookupItemsGetId({ lookupTypeId: ManagementTypeEnum.lookupTypeId });
      if (!(res && res.status && res.status !== 200))
        setData({ id: 'managementType', value: res || [] });
      setLoadings({ id: 'managementType', value: false });
    }
  }, [isManaged]);
  useEffect(() => {
    getAllPortfolio();
    getAllManagementTypes();
  }, [getAllPortfolio, getAllManagementTypes]);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const saveHandler = useCallback(async () => {
    let result;
    if (isManaged)
    result = await AssignPortfolioToUnit({ ...state, rowVersion: activeItem.rowVersion });
    else result = await DeAssignPortfolioToUnit({ ...state, rowVersion: activeItem.rowVersion });
    if (!(result && result.status && result.status !== 200)) {
      if (isManaged) showSuccess(t(`${translationPath}portfolio-assigned-successfully`));
      else showSuccess(t(`${translationPath}portfolio-deassigned-successfully`));
    } else showError(t(`${translationPath}portfolio-operation-failed`));
    dispatch(ActiveItemActions.activeUnitItemRequest({ id: +GetParams('id') }));
  }, [activeItem.rowVersion, dispatch, isManaged, state, t, translationPath]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(UnitsLeasePermissions)}
          permissionsId={UnitsLeasePermissions.EditManagemntForUnit.permissionsId}
        >
          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    );
  }, [saveHandler, t]);
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  useEffect(() => {
    if (
      activeItem &&
      activeItem.portfolio !== null &&
      activeItem.portfolio.id &&
      activeItem.mangeType &&
      activeItem.mangeType.id
    ) {
      setState({
        id: 'edit',
        value: {
          UnitId: +GetParams('id'),
          PortfolioId: activeItem.portfolio.id,
          ManageTypeId: activeItem.mangeType.id,
        },
      });
      setSelected({
        id: 'edit',
        value: {
          portfolio: {
            portfolioName: activeItem.portfolio.name,
            portfolioId: activeItem.portfolio.id,
          },
          managementType: {
            lookupItemName: activeItem.mangeType.name,
            lookupItemId: activeItem.mangeType.id,
          },
        },
      });
    }
  }, [activeItem]);
  return (
    <div className='unit-profile-managemnt-wrapper childs-wrapper'>
      <div>
        <div className='px-2 management-type-actions-wrapper mb-4'>
          <div className='title-section'>
            <span>{t(`${translationPath}is-manged`)}</span>
          </div>
          <div className='actions-wrapper'>
            <ButtonBase
              className={`managed-button ${isManaged ? 'is-active' : ''}`}
              onClick={() => setisManaged(true)}
            >
              <span className={`icons i-manged-${isManaged ? 'blue' : 'black'}`} />
              <span className='mt-2'>{t(`${translationPath}managed`)}</span>
            </ButtonBase>
            <ButtonBase
              className={`non-managed-button ${!isManaged ? 'is-active' : ''}`}
              onClick={() => {
                setisManaged(false);
                setSelected({ id: 'portfolio', value: null });
                setSelected({ id: 'managementType', value: null });
              }}
            >
              <span className={`icons i-non-manged-${!isManaged ? 'blue' : 'black'}`} />
              <span className='mt-2'>{t(`${translationPath}non-managed`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className={`form-item ${!isManaged ? 'is-disabled' : ''}`}>
          <AutocompleteComponent
            idRef='PortfolioName'
            isDisabled={!isManaged}
            labelValue='portfolio'
            inputPlaceholder='select'
            selectedValues={selected.portfolio}
            multiple={false}
            data={data.portfolio || []}
            displayLabel={(option) => option.portfolioName || ''}
            getOptionSelected={(option) => option.portfolioId === state.portfolioId}
            withoutSearchButton
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllPortfolio(value);
              }, 700);
            }}
            isLoading={loadings.portfolio}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'portfolio', value: newValue });
              setState({
                id: 'PortfolioId',
                value: (newValue && newValue.portfolioId) || null,
              });
            }}
          />
        </div>
        <div className={`form-item ${!isManaged ? 'is-disabled' : ''}`}>
          <AutocompleteComponent
            isDisabled={!isManaged}
            inputPlaceholder='select'
            idRef='managementType'
            labelValue='management-type'
            selectedValues={selected.managementType}
            multiple={false}
            data={data.managementType || []}
            displayLabel={(option) => option.lookupItemName || ''}
            getOptionSelected={(option) => option.lookupItemId === state.portfolioId}
            withoutSearchButton
            isLoading={loadings.managementType}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'managementType', value: newValue });
              setState({
                id: 'ManageTypeId',
                value: (newValue && newValue.lookupItemId) || null,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
UnitProfileManagementComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(object).isRequired,
};
