import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import {
  // CheckboxesComponent,
  PaginationComponent,
  RadiosGroupComponent,
  ViewTypes,
  Spinner,
} from '../../../../../../Components';
import { LeadProfileUnitsCardComponent, LeadUnitsTable } from './Sections';
import {
  bottomBoxComponentUpdate, GetParams, GlobalTranslate, showError,
  showSuccess,
} from '../../../../../../Helper';
import { UnitsOperationTypeEnum } from '../../../../../../Enums';
import { GetAllMatchingUnitsByLeadId, SendUnitProposalToLeadAPI } from '../../../../../../Services';
import { ViewTypesEnum } from '../../../../../../Enums/ViewTypes.Enum';
import { config } from '../../../../../../config';

export const LeadProfileUnitsComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [allCardSelected, setAllCardSelected] = useState(false);
  const [viewType, setViewType] = useState(1);

  // const dispatch = useDispatch();
  const [unitData, setUnitData] = useState({});
  const [selectedMatchesIds, setSelectedMatchesIds] = useState([]);
  const [selectedMatchesIndexes, setSelectedMatchesIndexes] = useState([]);
  const [units, setUnits] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const GetAllMatchingByLeadId = useCallback(async () => {
    const result = await GetAllMatchingUnitsByLeadId(
      +GetParams('id'),
      filter.pageIndex + 1,
      filter.pageSize
    );

    if (!(result && result.status && result.status !== 200)) setUnitData(result);
    else setUnitData({});
  }, [filter.pageIndex, filter.pageSize]);

  useEffect(() => {
    GetAllMatchingByLeadId();
  }, [GetAllMatchingByLeadId]);

  useEffect(() => {
    if (unitData && unitData.result) {
      setUnits({
        result: unitData.result.map((item) => {
          const { unit } = item;
          const operationType = unit.operation_type.lookupItemId;
          return {
            unitImages: [{}, {}, {}],
            unitId: item.unitId,
            unit_type_id: item.unit.unit_type_id,
            unitName: `${(unit.unit_type && unit.unit_type.lookupItemName) || ''} ${unit.property_name ? unit.property_name.name || unit.property_name : ''
              } ${unit.unit_number ? unit.unit_number : ''}`,
            refNumber: `${(unit.unit_ref_no && unit.unit_ref_no) || 'N/A'}`,
            operationType,
            unitStatus:
              operationType === UnitsOperationTypeEnum.rent.key ?
                GlobalTranslate.t('Shared:actions-buttons.rent') :
                GlobalTranslate.t('Shared:actions-buttons.sale'),
            unitStatussrent: GlobalTranslate.t('Shared:actions-buttons.rent'),
            unitStatussale: GlobalTranslate.t('Shared:actions-buttons.sale'),
            Pricesale: (unit.selling_price_agency_fee && unit.selling_price_agency_fee.salePrice) || 'N/A',
            pricerent: (unit.rent_price_fees && unit.rent_price_fees.rentPerYear) || 'N/A',
            price:
              operationType === UnitsOperationTypeEnum.rent.key ?
                (unit.rent_price_fees && unit.rent_price_fees.rentPerYear) :
                (unit.selling_price_agency_fee && unit.selling_price_agency_fee.salePrice),
            flatContent: [
              {
                iconClasses: 'mdi mdi-bed-outline',
                title: null,
                value: unit.bedrooms ? unit.bedrooms : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-shower',
                title: null,
                value: unit.bathrooms ? unit.bathrooms : GlobalTranslate.t('Shared:any'),
              },
              {
                iconClasses: 'mdi mdi-ruler-square',
                title: 'sqf',
                value: unit.total_area_size_sqft ? unit.total_area_size_sqft : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-broom',
                title: '',
                value: unit.maid_rooms ? unit.maid_rooms : GlobalTranslate.t('Shared:any'),
              },
            ],
            details: [
              {
                iconClasses: 'mdi mdi-point-of-sale',
                title: 'Completion date',
                value: moment(unit.UpdateOn).format('DD/MM/YYYY'),
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'unit-type',
                value: `${(unit.unit_type && unit.unit_type.lookupItemName) || 'N/A'}`,
              },
              {
                iconClasses: 'mdi mdi-point-of-sale',
                title: 'Developers',
                value: `${(unit.developers && unit.developers.map((el) => `${el.name}, `)) || 'N/A'
                  }`,
              },
              {
                iconClasses: 'mdi mdi-point-of-sale',
                title: 'location',
                value: `${(unit.location && unit.location.name) || 'N/A'}`,
              },
            ],
          };
        }),
        totalCount: (unitData && unitData.totalCount) || 0,
      });
    }
  }, [unitData]);

  const onViewTypeChangedHandler = useCallback((event, newValue) => {
    setViewType(+newValue);
  }, []);

  const cardCheckboxClicked = (item, index) => {
    setSelectedMatchesIds(() => {
      const cardIndex = selectedMatchesIds.findIndex((element) => item.unitId === element);
      if (cardIndex !== -1) selectedMatchesIds.splice(cardIndex, 1);
      else selectedMatchesIds.push(item.unitId);
      return [...selectedMatchesIds];
    });
    setSelectedMatchesIndexes(() => {
      const cardIndex = selectedMatchesIndexes.findIndex((element) => index === element);
      if (cardIndex !== -1) selectedMatchesIndexes.splice(cardIndex, 1);
      else selectedMatchesIndexes.push(index);
      return [...selectedMatchesIndexes];
    });
  };
  const discardHandler = () => {
    setSelectedMatchesIds([]);
    setSelectedMatchesIndexes([]);
  };
  const sendSelectedMatchedHandler = useCallback(async () => {
    setIsLoading(true);

    const leadId = +GetParams('id');

    if (leadId && selectedMatchesIds && selectedMatchesIds.length) {
      const result = await SendUnitProposalToLeadAPI(
        [leadId], selectedMatchesIds,
        null,
        config.SalesUnitProposalTemplateId,
        config.SendKey,
        config.server_name
      );
      if (!(result && result.status && result.status !== 200))
        showSuccess(t`${translationPath}selected-matches-sent-successfully`);
      else
        showError(t`${translationPath}selected-matches-sending-failed`);
    }
    setIsLoading(false);
  });

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const [activeActionType, setActiveActionType] = useState(
    ViewTypesEnum.cards.key
  );
  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
    },
    [setActiveActionType]
  );

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='bottom-box-two-sections'>
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={units.totalCount}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
        <div className='d-flex-v-center flex-wrap'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={discardHandler}>
            <span>{t(`${translationPath}discard-selected`)}</span>
          </ButtonBase>
          <ButtonBase className='btns theme-solid mb-2' onClick={sendSelectedMatchedHandler} disabled={!(selectedMatchesIds && selectedMatchesIds.length)}>
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
  return (
    <div className='lead-profile-units-wrapper px-0 pt-0 childs-wrapper'>
      <div className='title-box-wrapper'>
        {/* <div className='title-box-wrapper'> */}
        <div className='title-box-section'>
          <span>{t(`${translationPath}title-dec`)}</span>
          {/* <span>
            <span>1 bedrooms appartment</span>
            <span className='px-1'>{t(`${translationPath}in`)}</span>
            <span>My Island</span>
            <span className='px-1'>-</span>
            <span className='pr-1-reversed'>{t(`${translationPath}budget`)}</span>
            <span>50,000.00</span>
            <span className='px-1'>{t(`${translationPath}to`)}</span>
            <span>60,000.00</span>
          </span> */}
        </div>
        <div className='title-box-section'>
          <span className='c-primary'>
            <span>{t(`${translationPath}lead-#`)}</span>
            <span className='px-1'>987437</span>
          </span>
          <span>
            <span>{t(`${translationPath}entered`)}</span>
            <span className='px-1'>{moment().locale(i18next.language).format('DD/MMM/YYYY')}</span>
          </span>
        </div>
      </div>
      <div className='lead-profile-filter-section'>
        <div className='filter-section-item px-0'>
          <Spinner isActive={isLoading} isAbsolute />
          <div>
            <RadiosGroupComponent
              idRef='viewUnitsRef'
              data={[
                {
                  key: 1,
                  component: () => (
                    <span>
                      <span>{units.totalCount}</span>
                      <span className='px-1'>{t(`${translationPath}matches`)}</span>
                    </span>
                  ),
                },
                {
                  key: 2,
                  component: () => (
                    <span>
                      <span>0</span>
                      <span className='px-1'>{t(`${translationPath}sent-matches`)}</span>
                    </span>
                  ),
                },
                {
                  key: 3,
                  component: () => (
                    <span>
                      <span>0</span>
                      <span className='px-1'>{t(`${translationPath}discarded`)}</span>
                    </span>
                  ),
                },
              ]}
              value={viewType}
              labelValue='view'
              labelInput='value'
              valueInput='key'
              themeClass='theme-line'
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onSelectedRadioChanged={onViewTypeChangedHandler}
            />
          </div>
          <div>
            <ViewTypes
              onTypeChanged={onTypeChanged}
              activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
              className='mb-3'
            />
          </div>
        </div>
      </div>
      {units && activeActionType === ViewTypesEnum.cards.key &&
        (
          <LeadProfileUnitsCardComponent
            data={units}
            selectedMatchesIds={selectedMatchesIds}
            parentTranslationPath='UnitsView'
            translationPath={translationPath}
            onCardCheckboxClick={cardCheckboxClicked}
          />
        )}
      {units && activeActionType === ViewTypesEnum.tableView.key &&
        (
          <LeadUnitsTable
            data={unitData && unitData.result}
            filter={filter}
            totalCount={unitData && unitData.totalCount}
            parentTranslationPath='UnitsView'
            translationPath={translationPath}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            selectedMatchesIndexes={selectedMatchesIndexes}
            selectedMatchesIds={selectedMatchesIds}
            setSelectedMatchesIds={setSelectedMatchesIds}
            setSelectedMatchesIndexes={setSelectedMatchesIndexes}
          />
        )}
    </div>
  );
};
