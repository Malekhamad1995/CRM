import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { LeadsCardsComponent, LeadsTableComponent } from '../../../../LeadsView';

import {
  ActionsEnum,
  ContactTypeEnum,
  LeadsPriorityEnum,
  LeadsStatusEnum,
  LeadsTypesEnum,
} from '../../../../../../Enums';

import { GetAllMatchingLeadsByUnitId, SendUnitProposalToLeadAPI } from '../../../../../../Services';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  GlobalTranslate,
  showError,
  showSuccess
} from '../../../../../../Helper';

import {
  PaginationComponent,
  Spinner,
  ViewTypes
} from '../../../../../../Components';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';
import { ViewTypesEnum } from '../../../../../../Enums/ViewTypes.Enum';
import { config } from '../../../../../../config';

export const UnitProfileMatchingComponent = ({ parentTranslationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const translationPath = '';
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState({
    result: [],
    totalCount: 0,
  });
  const [matchingLead, setmatchingLead] = useState();
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [activeActionType, setActiveActionType] = useState(
    ViewTypesEnum.cards.key
  );
  const [checkedCards, setCheckedCards] = useState([]);
  const [checkedCardsIds, setCheckedCardsIds] = useState([]);

  const GetAllMatchingByLeadId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllMatchingLeadsByUnitId(
      +GetParams('id'),
      filter.pageIndex + 1,
      filter.pageSize
    );
    if (!(result && result.status && result.status !== 200)) setLeadData(result);
    else setLeadData({});
    setIsLoading(false);
  }, [filter.pageIndex, filter.pageSize]);

  const sendUnitToLead = useCallback(async (leadIdArray) => {
    setIsLoading(true);
    const result = await SendUnitProposalToLeadAPI(
    leadIdArray && leadIdArray, [+GetParams('id')],
    null,
    config.SalesUnitProposalTemplateId,
    config.SendKey,
    config.server_name
);
    if (!(result && result.status && result.status !== 200))
      showSuccess(t`${translationPath}send-unit-proposal-to-lead-success`);
    else showError(t`${translationPath}send-unit-proposal-to-lead-fail`);
    setIsLoading(false);
  });

  const getIsSelected = useCallback(
    (row) => checkedCards && checkedCards.findIndex((item) => item.id === row.id) !== -1,
    [checkedCards]
  );

  const onSelectClicked = useCallback(
    (row) => {
      const itemIndex = checkedCardsIds ? checkedCardsIds.findIndex((item) => item === row.id) : -1;
      if (itemIndex !== -1) {
        checkedCardsIds.splice(itemIndex, 1);
        setCheckedCards((items) => {
          const elementIndex = items.findIndex((item) => item.id === row.id);
          if (elementIndex !== -1) items.splice(elementIndex, 1);
          return [...items];
        });
      } else {
        checkedCardsIds.push(row.id);
        setCheckedCards((items) => {
          items.push(row);
          return [...items];
        });
      }
      setCheckedCardsIds(checkedCardsIds);
    },
    [checkedCardsIds]
  );

  useEffect(() => {
    GetAllMatchingByLeadId(1, 30);
  }, [GetAllMatchingByLeadId]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const discardHandler = () => {
    setCheckedCardsIds([]);
    setCheckedCards([]);
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='bottom-box-two-sections'>
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={leadData.totalCount}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
        <div className='d-flex-v-center flex-wrap'>
          <ButtonBase
            className='btns theme-transparent mb-2'
            disabled={!checkedCardsIds.length}
            onClick={discardHandler}
          >
            <span>{t(`${translationPath}discard-selected`)}</span>
          </ButtonBase>
          <ButtonBase
            className='btns theme-solid mb-2'
            disabled={!checkedCardsIds.length}
            onClick={() => sendUnitToLead(checkedCardsIds)}
          >
            <span>{t(`${translationPath}send-selected-matches`)}</span>
          </ButtonBase>
        </div>
      </div>
    );
  });

  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  useEffect(() => {
    if (leadData && leadData.result) {
      setmatchingLead({
        result: leadData.result.map((item) => {
          const { lead } = item;
          return {
            id: item.leadId,
            leadClass: (lead.leadClass && lead.leadClass) || 'N/A',
            leadTypeId: (lead.lead_type_id && lead.lead_type_id) || 'N/A',
            imagePath: null,
            name: `${(lead.contact_name && lead.contact_name.name) || 'N/A'}`,
            matchingUnits: (lead.matching_units && lead.matching_units) || [],
            matchingUnitsNumber: (lead.matching_units && lead.matching_units.length) || 0,
            creationDate: item.createdOn,
            updateDate: item.updateOn,
            type: ContactTypeEnum.man.value,
            leadType:
              (lead.lead_type_id === 1 &&
                ((LeadsTypesEnum.Owner && LeadsTypesEnum.Owner.value) || 'N/A')) ||
              (lead.lead_type_id === 2 &&
                ((LeadsTypesEnum.Seeker && LeadsTypesEnum.Seeker.value) || 'N/A')) ||
              'N/A',
            rating: lead.rating ?
              (lead.rating.lookupItemName &&
                (LeadsPriorityEnum[lead.rating.lookupItemName] || '')) ||
              '' :
              '',
            progress:
              typeof lead.data_completed === 'string' && lead.data_completed.includes('%') ?
                +lead.data_completed.substr(0, lead.data_completed.length - 1) :
                +lead.data_completed,
            progressWithPercentage:
              typeof lead.data_completed !== 'string' ?
                `${lead.data_completed}%` :
                lead.data_completed,
            status:
              (lead && lead.status),

            flatContent: lead.lead_type_id === 2 && [
              {
                iconClasses: 'mdi mdi-cash-multiple',
                title: null,
                value: lead.budget ?
                  lead.budget.map(
                    (element, index) =>
                      `${element}${(index < lead.budget.length - 1 && ',') || ''} `
                  ) :
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-bed',
                title: null,
                value: lead.bedrooms ?
                  lead.bedrooms.map(
                    (element, index) =>
                      `${element}${(index < lead.bedrooms.length - 1 && ',') || ''} `
                  ) :
                  GlobalTranslate.t('Shared:any'),
              },
              {
                iconClasses: 'mdi mdi-shower',
                title: null,
                value: lead.bathrooms ?
                  lead.bathrooms.map(
                    (element, index) =>
                      `${element}${(index < lead.bathrooms.length - 1 && ',') || ''} `
                  ) :
                  GlobalTranslate.t('Shared:any'),
              },
              {
                iconClasses: 'mdi mdi-ruler-square',
                title: 'sqf',
                value: lead.size_sqft ?
                  lead.size_sqft.map(
                    (element, index) =>
                      `${element}${(index < lead.size_sqft.length - 1 && ',') || ''} `
                  ) :
                  'N/A',
              },
            ],
            details: [
              {
                iconClasses: 'mdi mdi-clipboard-account-outline',
                title: 'lead-type',
                value:
                  lead.lead_type_id === 1 ?
                    t(`${translationPath}owner`) :
                    t(`${translationPath}seeker`),
              },
              {
                iconClasses: 'mdi mdi-account-circle',
                title: 'stage',
                value: lead.lead_stage ? lead.lead_stage.lookupItemName : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-account-box',
                title: 'contact-name',
                value: lead.contact_name ? lead.contact_name.name : 'N/A',
              },

              {
                iconClasses: 'mdi mdi-table-furniture',
                title: 'equipments-and-fixtures',
                value:
                  (lead.fitting_and_fixtures &&
                    lead.fitting_and_fixtures.map(
                      (element, index) =>
                        `${element.lookupItemName}${(index < lead.fitting_and_fixtures.length - 1 && ',') || ''
                        } `
                    )) ||
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-window-open-variant',
                title: 'views',
                value:
                  (lead.view &&
                    ((Array.isArray(lead.view) &&
                      lead.view.map(
                        (element, index) =>
                          `${element.lookupItemName}${(index < lead.view.length - 1 && ',') || ''} `
                      )) ||
                      (typeof lead.view === 'object' && lead.view.lookupItemName) ||
                      'N/A')) ||
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-laptop-windows',
                title: 'developers',
                value:
                  (lead.developers &&
                    lead.developers.map(
                      (element, index) =>
                        `${element.lookupItemName}${(index < lead.developers.length - 1 && ',') || ''
                        } `
                    )) ||
                  'N/A',
              },
            ],
          };
        }),
        totalCount: (leadData && leadData.totalCount) || 0,
      });
    }
  }, [t, translationPath, leadData]);

  const detailedCardActionClicked = useCallback(
    (actionEnum, item) => (event) => {
      event.stopPropagation();
    },
    []
  );

  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/leads/edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        GlobalHistory.push(
          `/home/leads/lead-profile-edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.matching.key) {
        localStorage.setItem('leadInformation', JSON.stringify(activeData.matchingLeads));
        GlobalHistory.push(
          `/home/leads/lead-profile-edit?formType=${activeData.leadTypeId}&id=${activeData.id
          }&matching=${true}`
        );
      }
    },
    [dispatch]
  );

  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
    },
    [setActiveActionType]
  );

  const cardCheckboxClicked = useCallback((itemIndex, element) => {
    setCheckedCards((items) => {
      const index = items.findIndex((item) => item.id === element.id);
      if (index !== -1) items.splice(index, 1);
      else items.push(element);
      return [...items];
    });
    setCheckedCardsIds((items) => {
      const index = items.findIndex((item) => item === element.id);
      if (index !== -1) items.splice(index, 1);
      else items.push(element.id);
      return [...items];
    });
  });

  return (
    <div className='units-information-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='view'>
        <ViewTypes
          onTypeChanged={onTypeChanged}
          activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
          className='mb-3'
        />
      </div>
      {matchingLead && activeActionType === ViewTypesEnum.cards.key &&
        (
          <LeadsCardsComponent
            data={(matchingLead && matchingLead) || []}
            onFooterActionsClicked={detailedCardSideActionClicked}
            onActionClicked={detailedCardActionClicked}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}

            withCheckboxMatching={matchingLead && matchingLead.totalCount !== 0}
            onCardCheckboxClick={cardCheckboxClicked}
            selectedCards={checkedCards}
          />
        )}

      {leadData && activeActionType === ViewTypesEnum.tableView.key &&
        (
          <LeadsTableComponent
            data={(leadData && leadData.result) || []}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            totalCount={(leadData && leadData.totalCount) || 0}
            filter={filter}
            t={t}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            checkedCardsIds={checkedCardsIds}
            getIsSelected={getIsSelected}
            onSelectClicked={onSelectClicked}
            sendUnitToLead={sendUnitToLead}
            discardHandler={discardHandler}
          />
        )}
    </div>
  );
};

UnitProfileMatchingComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
