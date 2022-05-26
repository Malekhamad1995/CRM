import React, {
  useCallback, useReducer, useRef, useState, useEffect
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Tooltip } from '@material-ui/core';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
  UploaderComponent,
  PermissionsComponent
} from '../../../../../../Components';
import {
  OrganizationUserSearch,
  GetPortfolioById,
  UpdatePortfolio,
  GetContacts,
} from '../../../../../../Services';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showinfo,
  showSuccess,
} from '../../../../../../Helper';
import { PortfolioPermissions } from '../../../../../../Permissions';

export const PortfolioDetailsView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [Loading, setLoading] = useState(false);
  const [propertyManagers, setPropertyManagers] = useState([]);
  const [workOrders, setQorkOrders] = useState([]);
  const [contactPerson, setContactPerson] = useState([]);
  const [selected, setSelected] = useState({
    contactPersonName: '',
    propertyManagerName: '',
    workOrderName: '',
  });
  const [isActive, setIsActive] = useState(false);
  const textArea = useRef(null);
  const [state, setState] = useReducer(reducer, {
    portfolioName: '',
    description: '',
    propertyManagersId: '',
    ccWorkOrdersToId: '',
    contactPersonId: 0,
    managementFee: 0,
    managementFeePercentage: 0,
    remark: '',
    fileId: '',
    fileName: '',
    isActive: true,
  });
  useEffect(() => {
    if (GetParams('isActive')) setIsActive(GetParams('isActive') === 'true');
  }, []);
  const getAllPropertyManagers = useCallback(async (value) => {
    const res = await OrganizationUserSearch(value);
    if (!(res && res.status && res.status !== 200)) setPropertyManagers(res);
    else setPropertyManagers({});
  }, []);

  const getAllWorkOrders = useCallback(async (value) => {
    const res = await OrganizationUserSearch(value);
    if (!(res && res.status && res.status !== 200)) setQorkOrders(res);
    else setQorkOrders({});
  }, []);

  const getAllContacts = useCallback(async (value) => {
    const res = await GetContacts({
 pageIndex: 0, pageSize: 25, search: value, isAdvance: false
});
    if (!(res && res.status && res.status !== 200)) setContactPerson(res);
    else setContactPerson({});
  }, []);

  const getPortfolioDataById = useCallback(async () => {
    setLoading(true);
    const res = await GetPortfolioById(+GetParams('id'));
    if (!(res && res.status && res.status !== 200)) {
      setState({
        id: 'edit',
        value: {
          portfolioName: res.portfolioName,
          description: res.description,
          propertyManagersId: res.propertyManagersId,
          ccWorkOrdersToId: res.ccWorkOrdersToId,
          contactPersonId: res.contactPersonId,
          managementFee: res.managementFee,
          managementFeePercentage: res.managementFeePercentage,
          remark: res.remark,
          fileId: res.fileId,
          fileName: res.fileName,
          isActive: res.isActive,
        },
      });
      setSelected({
        propertyManagerName: { id: res.propertyManagersId, fullName: res.propertyManagerName },
        contactPersonName: {
          contact: { first_name: res.contactPersonName },
          contactsId: res.contactPersonId,
        },
        workOrderName: { id: res.ccWorkOrdersToId, fullName: res.ccWorkOrderToName },
      });
    } else setState([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    getPortfolioDataById();
  }, [getPortfolioDataById]);

  const saveHandler = useCallback(async () => {
    const res = await UpdatePortfolio(+GetParams('id'), state);
    if (!(res && res.status && res.status !== 200))
      showSuccess(t(`${translationPath}portfolio-updated-successfully`));
    else showError(t(`${translationPath}portfolio-update-failed`));
  }, [state, t, translationPath]);

  const cancelHandler = useCallback(() => {
    GlobalHistory.push('/home/portfolio');
  }, []);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(PortfolioPermissions)}
          permissionsId={(PortfolioPermissions.EditPortfolio.permissionsId)}
        >

          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    );
  });

  const copyTextToClipboard = (itemId) => {
    const context = textArea.current;
    if (itemId && context) {
      context.value = itemId;
      context.select();
      document.execCommand('copy');
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
    } else
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
  };
  return (
    <div>
      <div className='dialog-content-wrapper portfoilio-management-dialog-wrapper'>
        <Spinner isActive={Loading} />
        <div className='d-flex  mb-4 '>
          <div className={`active-inactive-portfolio mx-2 ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? t(`${translationPath}active`) : t(`${translationPath}in-active`)}
          </div>
          <div className='ref-number'>{`${t(`${translationPath}ref-no`)} ${GetParams('id')} `}</div>
          <div className='contact-id-wrapper'>
            <div className='contact-id'>
              <textarea readOnly aria-disabled value={GetParams('id')} ref={textArea} />
            </div>
            <Tooltip title={t(`${translationPath}copy`)}>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  copyTextToClipboard(GetParams('id'));
                }}
                className='mdi mdi-content-copy'
              />
            </Tooltip>
          </div>
        </div>
        <div className='form-item'>
          <Inputs
            idRef='portfolioNameRef'
            labelValue='portfolio-name'
            value={state.portfolioName || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'portfolioName', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='propertyManagerNameRef'
            labelValue='property-manager'
            multiple={false}
            selectedValues={selected.propertyManagerName}
            data={(propertyManagers && propertyManagers.result) || []}
            displayLabel={(option) => option.fullName || ''}
            renderOption={(option) => option.fullName || ''}
            withoutSearchButton
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllPropertyManagers({ pageIndex: 1, pageSize: 25, name: value });
              }, 700);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setState({
                id: 'propertyManagersId',
                value: (newValue && newValue.id) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='managementFeeRef'
            labelValue='management-fees'
            type='number'
            min={0}
            value={state.managementFee || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'managementFee', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='managementFeePercentageRef'
            labelValue='management-fees-%'
            type='number'
            min={0}
            value={state.managementFeePercentage || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'managementFeePercentage', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <DataFileAutocompleteComponent
            idRef='contactPersonNameRef'
            labelValue='contact-person'
            multiple={false}
            selectedValues={selected.contactPersonName}
            data={(contactPerson && contactPerson.result) || []}
            displayLabel={(option) =>
              `${option.contact && option.contact.first_name} ${(option.contact && option.contact.last_name) || ''
              }` || ''}
            withoutSearchButton
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllContacts(value);
              }, 700);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setState({
                id: 'contactPersonId',
                value: (newValue && newValue.contactsId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='workOrderNameRef'
            labelValue='cc-work-order'
            multiple={false}
            selectedValues={selected.workOrderName}
            data={(workOrders && workOrders.result) || []}
            displayLabel={(option) => option.fullName || ''}
            renderOption={(option) => option.fullName || ''}
            withoutSearchButton
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllWorkOrders({ name: value });
              }, 700);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setState({
                id: 'ccWorkOrdersToId',
                value: (newValue && newValue.id) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='remarkRef'
            labelValue='remarks'
            multiline
            rows={4}
            value={state.remark || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'remark', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='descriptionRef'
            labelValue='description'
            multiline
            rows={4}
            value={state.description || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'description', value: event.target.value });
            }}
          />
        </div>
        <div className='form-item'>
          <UploaderComponent
            labelClasses='mt-2 ml-2 mr-2'
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            labelValue='upload-logo'
            idRef='contactsImportRef'
            uploadedChanged={(files) => {
              setState({ id: 'fileId', value: files && files[0] && files[0].uuid });
              setState({ id: 'fileName', value: files && files[0] && files[0].fileName });
            }}
          />
        </div>
        <div className='form-item is-active'>
          <RadiosGroupComponent
            idRef='isNegotiableRef'
            labelValue='is-active'
            data={[
              {
                key: true,
                value: 'yes',
              },
              {
                key: false,
                value: 'no',
              },
            ]}
            value={state.isActive || false}
            parentTranslationPath={parentTranslationPath}
            translationPathForData={translationPath}
            translationPath={translationPath}
            labelInput='value'
            valueInput='key'
            onSelectedRadioChanged={(e, newValue) =>
              setState({ id: 'isActive', value: newValue === 'true' })}
          />
        </div>
      </div>
    </div>
  );
};

PortfolioDetailsView.propTypes = {
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
PortfolioDetailsView.defaultProps = {
  parentTranslationPath: '',
  translationPath: '',
};
