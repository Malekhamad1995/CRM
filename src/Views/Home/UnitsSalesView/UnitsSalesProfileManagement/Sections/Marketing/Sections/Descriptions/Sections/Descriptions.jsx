import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  MarketingAgentAutocomplete,
  TitleDescriptionTemplateControls,
  UspAutocomplete,
} from './controls';
import {
  CheckboxesComponent,
  RadiosGroupComponent,
} from '../../../../../../../../../Components';
import { unitDetailsGet } from '../../../../../../../../../Services';
import { GetParams } from '../../../../../../../../../Helper';
import {
  Sales,
  Rent,
  SaleAndRent,
} from '../../../../../../../../../assets/json/StaticLookupsIds.json';

export const Descriptions = ({
  state,
  schema,
  onStateChanged,
  isMarketAsADifferentAgent,
  onIsMarketAsADifferentAgent,
  isSubmitted,
  parentTranslationPath,
  translationPath,
  activeItem,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  return (
    <div className='marketing-description-wrapper presentational-wrapper'>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}description`)}</span>
      </div>
      <UspAutocomplete
        state={state}
        schema={schema}
        onStateChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <div className='form-item'>
        <RadiosGroupComponent
          idRef='isMarketAsADifferentAgentRef'
          labelValue='is-market-as-a-different-agent'
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
          value={isMarketAsADifferentAgent}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) => {
            if (state.agentsId && onStateChanged)
              onStateChanged({ id: 'agentsId', value: null });
            if (onIsMarketAsADifferentAgent)
              onIsMarketAsADifferentAgent(newValue === 'true');
          }}
        />
      </div>
      {isMarketAsADifferentAgent && (
        <MarketingAgentAutocomplete
          state={state}
          schema={schema}
          onStateChanged={onStateChanged}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      <TitleDescriptionTemplateControls
        state={state}
        schema={schema}
        onStateChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />

      <div className='w-100'>
        <CheckboxesComponent
          idRef='printMediaRef'
          labelValue=''
          data={[
            {
              key: 'isFeatureUnit',
              value: 'featured-unit',
            },
            {
              key: 'isHotDealUnit',
              value: 'hot-deal-unit',
            },
          ]}
          isRow
          onSelectedCheckboxChanged={(item) => {
            if (onStateChanged) {
              onStateChanged({
                id: item.key,
                value: !state[item.key],
              });
            }
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          labelInput='value'
          checked={(selectedItem) => state[selectedItem.key]}
        />
      </div>

      {activeItem.operation_type.lookupItemId === Sales || activeItem.operation_type.lookupItemId === SaleAndRent ? (
        <CheckboxesComponent
          idRef='printMediaRef'
          labelValue=''
          data={[
              {
                key: 'isPublishUnitSale',
                value: 'Publish-as-sale-listing-Unit',
              },
            ]}
          isRow
          onSelectedCheckboxChanged={(item) => {
              if (onStateChanged) {
                onStateChanged({
                  id: item.key,
                  value: !state[item.key],
                });
              }
            }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          labelInput='value'
          checked={(selectedItem) => state[selectedItem.key]}
        />
           ) : null }

      {activeItem.operation_type.lookupItemId === Rent || activeItem.operation_type.lookupItemId === SaleAndRent ? (
        <CheckboxesComponent
          idRef='printMediaRef'
          labelValue=''
          data={[
             {
               key: 'isPublishUnitLease',
               value: 'Publish-as-lease-listing-unit',
             },
           ]}
          isRow
          onSelectedCheckboxChanged={(item) => {
             if (onStateChanged) {
               onStateChanged({
                 id: item.key,
                 value: !state[item.key],
               });
             }
           }}

          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          translationPathForData={translationPath}
          labelInput='value'
          checked={(selectedItem) => state[selectedItem.key]}
        />

) : null}

    </div>
  );
};

Descriptions.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isMarketAsADifferentAgent: PropTypes.bool.isRequired,
  onIsMarketAsADifferentAgent: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired
};
