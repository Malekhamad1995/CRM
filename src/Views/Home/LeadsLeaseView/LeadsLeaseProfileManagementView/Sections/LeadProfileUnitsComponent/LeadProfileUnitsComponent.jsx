import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import {
  // CheckboxesComponent,
  PaginationComponent,
  RadiosGroupComponent,
} from '../../../../../../Components';
import { LeadProfileUnitsCardComponent } from './Sections';
import { bottomBoxComponentUpdate, GetParams, GlobalTranslate } from '../../../../../../Helper';
import { UnitsOperationTypeEnum } from '../../../../../../Enums';
import { GetAllMatchingUnitsByLeadId } from '../../../../../../Services';

export const LeadProfileUnitsComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [allCardSelected, setAllCardSelected] = useState(false);
  const [viewType, setViewType] = useState(1);
  // const dispatch = useDispatch();
  const [unitData, setUnitData] = useState({});
  const [selectedCards, setSelectedCards] = useState([]);
  const [units, setUnits] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  const GetAllMatchingByLeadId = useCallback(async () => {
    const result = await GetAllMatchingUnitsByLeadId(
      +GetParams('id'),
      filter.pageIndex,
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
            unitName: `${(unit.unit_type && unit.unit_type.lookupItemName) || ''} ${
              unit.property_name ? unit.property_name.name || unit.property_name : ''
            } ${unit.unit_number ? unit.unit_number : ''}`,
            refNumber: `${(unit.unit_ref_no && unit.unit_ref_no) || 'N/A'}`,
            operationType,
            unitStatus:
              operationType === UnitsOperationTypeEnum.rent.key ?
                GlobalTranslate.t('Shared:actions-buttons.rent') :
                GlobalTranslate.t('Shared:actions-buttons.sale'),
            price:
              operationType === UnitsOperationTypeEnum.rent.key ?
                (unit.rent_price_fees && unit.rent_price_fees.rentPerYear) || 'N/A' :
                (unit.selling_price_agency_fee && unit.selling_price_agency_fee.salePrice) ||
                  'N/A',
            flatContent: [
              {
                iconClasses: 'mdi mdi-bed-outline',
                title: null,
                value: unit.bedrooms ? unit.bedrooms : GlobalTranslate.t('Shared:any'),
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
                value: unit.maid_rooms ? unit.maid_rooms : 'N/A',
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
                value: `${
                  (unit.developers && unit.developers.map((el) => `${el.name}, `)) || 'N/A'
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
  const cardCheckboxClicked = (item) => {
    setSelectedCards((items) => {
      const index = items.findIndex((element) => item.id === element.id);
      if (index !== -1) items.splice(index, 1);
      else items.push(item.id);
      return [...items];
    });
  };
  const discardHandler = () => {};
  const sendSelectedMatchedHandler = () => {};

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
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
        {/* <div className='filter-section-item'>
          <CheckboxesComponent
            idRef='leadProfileSelectAllRef'
            singleChecked={allCardSelected}
            singleIndeterminate={!allCardSelected && selectedCards.length < units.totalCount.length}
            label={t(`${translationPath}select`)}
            onSelectedCheckboxChanged={(event, checked) => setAllCardSelected(checked)}
          />
        </div>
        <span className='separator-v s-gray-dark s-h-25px' /> */}
        <div className='filter-section-item px-0'>
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
      </div>
      <LeadProfileUnitsCardComponent
        data={units}
        selectedCards={selectedCards}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onCardCheckboxClick={cardCheckboxClicked}
      />
    </div>
  );
};

LeadProfileUnitsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
