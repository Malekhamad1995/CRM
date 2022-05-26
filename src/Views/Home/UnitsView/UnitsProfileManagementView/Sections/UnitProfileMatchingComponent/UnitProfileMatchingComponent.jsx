import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { LeadsCardsComponent } from '../../../../LeadsView';
import {
  ActionsEnum,
  ContactTypeEnum,
  LeadsPriorityEnum,
  LeadsStatusEnum,
  LeadsTypesEnum,
} from '../../../../../../Enums';
import {
 bottomBoxComponentUpdate, GetParams, GlobalHistory, GlobalTranslate
} from '../../../../../../Helper';
import { GetAllMatchingLeadsByUnitId } from '../../../../../../Services';
import { PaginationComponent } from '../../../../../../Components';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';

export const UnitProfileMatchingComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState({
    result: [],
    totalCount: 0,
  });
  const [matchingLead, setmatchingLead] = useState();
  const [filter, setFilter] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  const GetAllMatchingByLeadId = useCallback(async () => {
    const result = await GetAllMatchingLeadsByUnitId(
      +GetParams('id'),
      filter.pageIndex,
      filter.pageSize
    );
    if (!(result && result.status && result.status !== 200)) setLeadData(result);
    else setLeadData({});
  }, [filter.pageIndex, filter.pageSize]);

  useEffect(() => {
    GetAllMatchingByLeadId(1, 30);
  }, [GetAllMatchingByLeadId]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const discardHandler = () => {};
  const sendSelectedMatchedHandler = () => {};
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
          <ButtonBase className='btns theme-transparent mb-2' onClick={discardHandler}>
            <span>{t(`${translationPath}discard-selected`)}</span>
          </ButtonBase>
          <ButtonBase className='btns theme-solid mb-2' onClick={sendSelectedMatchedHandler}>
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
              (lead.status &&
                lead.status.lookupItemName &&
                LeadsStatusEnum[lead.status.lookupItemName].value) ||
              'N/A',
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
                        `${element.lookupItemName}${
                          (index < lead.fitting_and_fixtures.length - 1 && ',') || ''
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
                        `${element.lookupItemName}${
                          (index < lead.developers.length - 1 && ',') || ''
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
          `/home/leads/lead-profile-edit?formType=${activeData.leadTypeId}&id=${
            activeData.id
          }&matching=${true}`
        );
      }
    },
    [dispatch]
  );

  return (
    <div className='units-information-wrapper childs-wrapper b-0'>
      <LeadsCardsComponent
        data={(matchingLead && matchingLead) || []}
        onFooterActionsClicked={detailedCardSideActionClicked}
        onActionClicked={detailedCardActionClicked}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

UnitProfileMatchingComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
