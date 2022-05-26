import React, {
  useState, useCallback, useEffect, useReducer
} from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import { CloseLeadDialog } from './Dialogs';
import {
  ActionsButtonsComponent,
  SelectComponet,
  Spinner,
  PermissionsComponent
} from '../../../../../../Components';
import {
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  CloneLeads,
  GetAllLeadsByContactId,
  GetAllLeaseLeadsByContactId,
  GetAllSaleLeadsByContactId,
  lookupItemsGetId,
  ReassignLeads,
} from '../../../../../../Services';
import { ContactProfileLeadsTable } from './ContactProfileLeadsUtilities/ContactProfileLeadsTable';
import { LeadsMapper } from '../../../../LeadsView/LeadsUtilities/LeadsMapper/LeadsMapper';
import { LeadsStatusEnum } from '../../../../../../Enums';
import { LeadsCAllCenterPermissions } from '../../../../../../Permissions';
import { ReassignLeadDialog } from './Dialogs/ReassignLeadDialog/ReassignLeadDialog';

export const ContactProfileLeadsComponent = ({
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenCloseLead, setIsOpenCloseLead] = useState(false);
  const [leadsDetailes, setLeadsDetailes] = useState(null);
  const [contactId, setContactrId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenReassign, setIsOpenReassign] = useState(false);
  const [isOpenClosedLeads, setIsOpenClosedLeads] = useState(false);

  const [actionType, setActionType] = useState({ id: null, value: null });
  const [status, setStatus] = useState([]);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [state, setState] = useReducer(reducer, {
    leadIds: [],
    leads: [],
    userType: null
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    leadStatus: null,
  });

  const getAllFinances = useCallback(async () => {
    const res = await lookupItemsGetId({
      lookupTypeId: LeadsStatusEnum.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) setStatus(res || []);
  }, []);
  useEffect(() => {
    getAllFinances();
  }, [getAllFinances]);
  const pathName = window.location.pathname
    .split('/home/')[1]
    .split('/view')[0]
    .split('/contact-profile-edit')[0];
  useEffect(() => {
    setContactrId(+GetParams('id'));
  }, [setContactrId]);
  const getAllUnitsByOwnerId = useCallback(async () => {
    setIsLoading(true);
    if (contactId) {
      let res = {};
      if (pathName === 'contact-sales')
        res = await GetAllSaleLeadsByContactId(filter, +GetParams('id'));
      else if (pathName === 'contact-lease')
        res = await GetAllLeaseLeadsByContactId(filter, +GetParams('id'));
      else res = await GetAllLeadsByContactId(filter, +GetParams('id'));
      if (!(res && res.status && res.status !== 200)) {
        if (actionType.id === 'reassign' || actionType.id === 'clone')
          setLeadsDetailes({
            result: ((res && res.result) || []).map((item) =>
              LeadsMapper(item, res, t)).filter(item => (item.leadClass === 'Buyer' || item.leadClass === 'Tenant')),
            totalCount: res && res.totalCount,
          });
        else {
          setLeadsDetailes({
            result: ((res && res.result) || []).map((item) =>
              LeadsMapper(item, res, t)),
            totalCount: res && res.totalCount,
          });

        }
      } else {
        setLeadsDetailes({
          result: [],
          totalCount: 0,
        });
      }
    }
    setIsLoading(false);
  }, [contactId, filter, pathName, t]);

  useEffect(() => {
    getAllUnitsByOwnerId();
  }, [getAllUnitsByOwnerId]);
  const onFormTypeSelectChanged = (formType) => {
    GlobalHistory.push(`/home/leads/add?formType=${formType}&contactId=${contactId}`);
  };
  const filterByChanged = (newValue) => {
    setFilter((item) => ({ ...item, pageIndex: 0, leadStatus: newValue }));
  };
  const actionTypeChanged = (newValue) => {
    onStateChange('leadIds', []);
    onStateChange('leads', []);
    setActionType((item) => ({ ...item, id: newValue }));
    if (!newValue) {
      setFilter((item) => ({ ...item, pageIndex: 0, leadStatus: null }));
    }
    else {
      setFilter((item) => ({ ...item, pageIndex: 0, leadStatus: newValue === 'clone' ? LeadsStatusEnum.Closed.status : LeadsStatusEnum.Open.status }));

    }
  };

  const onStateChange = (valueId, newValue) => {
    setState({ id: valueId, value: newValue });
  };
  const cloneHandler = async () => {
    const result = await CloneLeads(state.leadIds);
    if (!(result && result.status && result.status !== 200)) {
      getAllUnitsByOwnerId();
      showSuccess(t(`${translationPath}leads-cloned-successfully`));
    } else showError(t(`${translationPath}leads-clone-failed`));
    onStateChange('leadIds', []);
    onStateChange('leads', []);
  };

  const reassignHandler = async (reassignItem) => {
    setIsLoading(true);
    const result = await ReassignLeads({ leadIds: state.leadIds, referredToId: reassignItem.referredToId, isCopyTo: reassignItem.isCopyTo });
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}leads-reassigned-successfully`));

    } else showError(t(`${translationPath}leads-reassigned-failed`));
    onStateChange('leadIds', []);
    onStateChange('lead', []);
    setFilter((item) => ({ ...item, pageIndex: 0, leadStatus: null }));
    setIsLoading(false);

  };

  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='title-section'>
        <span>{t(`${translationPath}leads`)}</span>
      </div>
      <div className='filter-sections-wrapper mb-2'>
        <div className='filter-section-item'>
          <ActionsButtonsComponent
            withType
            typeData={[
              { id: '1', name: 'owner' },
              { id: '2', name: 'seeker' },
            ]}
            onFormTypeSelectChanged={onFormTypeSelectChanged}
          />
        </div>
        <div className='filter-section-item'>
          <span className='fw-simi-bold'>
            {t(`${translationPath}status`)}
            :
          </span>
          <SelectComponet
            idRef='filterByRef'
            data={status}
            value={filter.leadStatus}
            onSelectChanged={filterByChanged}
            wrapperClasses='mx-2'
            themeClass='theme-transparent'
            valueInput='lookupItemId'
            textInput='lookupItemName'
            emptyItem={{ value: null, text: 'all', isDisabled: false }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        </div>
        <div className='filter-section-item'>
          <span className='fw-simi-bold'>
            {t(`${translationPath}lead-actions`)}
            :
          </span>
          <SelectComponet
            idRef='filterByRef'
            data={[{ id: 'reassign', value: 'reassign' }, { id: 'clone', value: 'clone' }, { id: 'close-leads', value: 'close-leads' }]}
            valueInput='id'
            textInput='value'
            value={actionType.id}
            onSelectChanged={actionTypeChanged}
            wrapperClasses='mx-2'
            emptyItem={{ value: null, text: 'select', isDisabled: false }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        </div>
        {((actionType.id === 'reassign') && state.leadIds.length > 0) && (
          <div className='filter-section-item'>
            <ButtonBase
              disabled={((actionType.id !== 'reassign') || state.leadIds.length < 1)}
              onClick={() => setIsOpenReassign(true)}
              className='btns theme-transparent c-gray-primary'>
              <span className='mdi mdi-send-outline mdi-rotate-315' />
              <span className='px-2'>{t(`${translationPath}reassign`)}</span>
            </ButtonBase>
          </div>
        )}
        {((actionType.id === 'close-leads') && state.leadIds.length > 0) && (
          <div className='filter-section-item'>
            <ButtonBase
              disabled={actionType.id !== 'close-leads'}
              onClick={() => setIsOpenClosedLeads(true)}
              className='btns theme-transparent c-gray-primary'>
              <span className='mdi mdi-send-outline mdi-rotate-315' />
              <span className='px-2'>{t(`${translationPath}close-leads`)}</span>
            </ButtonBase>
          </div>
        )}
        {((actionType.id === 'clone') && state.leadIds.length > 0) && (
          <div className='filter-section-item'>
            <PermissionsComponent
              permissionsList={Object.values(LeadsCAllCenterPermissions)}
              permissionsId={LeadsCAllCenterPermissions.CloneLead.permissionsId}
            >
              <ButtonBase
                disabled={((actionType.id !== 'clone') || state.leadIds.length < 1)}
                onClick={cloneHandler}
                className='btns theme-transparent c-gray-primary'
              >
                <span className='mdi mdi-content-copy' />
                <span className='px-2'>{t(`${translationPath}clone`)}</span>
              </ButtonBase>
            </PermissionsComponent>
          </div>
        )}
      </div>
      <ContactProfileLeadsTable
        state={state}
        filter={filter}
        pathName={pathName}
        setFilter={setFilter}
        leadsDetailes={leadsDetailes}
        setActiveItem={setActiveItem}
        onStateChange={onStateChange}
        isOpenCloseLead={isOpenCloseLead}
        translationPath={translationPath}
        setIsOpenCloseLead={setIsOpenCloseLead}
        parentTranslationPath={parentTranslationPath}
        actionType={actionType.id}
      />

      {(isOpenReassign && (
        <ReassignLeadDialog
          isOpen={isOpenReassign}
          onClose={() => {
            setIsOpenReassign(false);
          }}
          userType={state && state.userType}
          onSave={(reassignItem) => {
            reassignHandler(reassignItem);
            setIsOpenReassign(false);
            setActionType((item) => ({ ...item, id: null }));
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />


      ))}
      {(isOpenClosedLeads && (
        <CloseLeadDialog
          isOpen={isOpenClosedLeads}
          onClose={() => {
            setIsOpenClosedLeads(false);
          }}
          listOfSelectedIds={state.leadIds}
          activeItem={activeItem}
          reloadData={() => {
            setIsOpenClosedLeads(false);
            getAllUnitsByOwnerId();
          }
          }
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />


      ))}



    </div>
  );
};
ContactProfileLeadsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
