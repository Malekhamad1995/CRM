import React from 'react';
import PropTypes from 'prop-types';
import { LeadPreferredLanguageComponent } from './Sections/LeadPreferredLanguageComponent';
import { LeadClassComponent } from './Sections/LeadClassComponent';
import { CountrySectionComponent } from './Sections/CountrySectionComponent';
import { MediaSectionDetailComponent } from './Sections/MediaSectionDetailComponent';
import { UnitTypeComponent } from './Sections/UnitTypeComponent';
import { RangeComponent } from './Sections/RangeComponent';
import { DeveloperComponent } from './Sections/DeveloperComponent';
import { LabelComponent } from './Sections/LableComponent';
import { AgentRotationRangeTypeEnum } from '../../../../../../Enums/AgentRotationRangeTypeEnum';
import { PropertyComponent } from './Sections/PropertyComponent';
import { RefferdByComponent } from './Sections/ReferredByComponent';
import { LeadTypeComponent } from './Sections/LeadTypeComponent';
import { MethodOfContact } from './Sections/MethodOfContact';

export const RotationCriteriaDialogContent = ({
  parentTranslationPath,
  translationPath,
  state,
  onStateChanged,
  schema,
  isSubmitted,
  setIsLoading,
  rotationEdit
}) => (
  <div className='dialog-content-wrapper'>
    <LabelComponent
      state={state}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onStateChanged={onStateChanged}
      isSubmitted={isSubmitted}
      schema={schema}
    />

    {/* <MediaSectionNameComponent
      state={state}
      values={state.rotationSchemeMedias && state.rotationSchemeMedias.filter((w) => w.mediaNameId)}
      schema={schema}
      setIsLoading={setIsLoading}
      isSubmitted={isSubmitted}
      onStateChanged={(newValue) => {
                const filterd = state.rotationSchemeMedias.filter((w) => w.mediaDetailsId);
                const localNewValue = {
                    id: 'rotationSchemeMedias',
                    value: [
                        ...filterd,
                        ...newValue
                    ]
                };
                onStateChanged(localNewValue);
            }}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    /> */}
    <MediaSectionDetailComponent
      state={state}
      schema={schema}
      isSubmitted={isSubmitted}
      values={state.rotationSchemeMedias && state.rotationSchemeMedias.filter((w) => w.mediaDetailsId)}
      onStateChanged={(newValue) => {
        const filterd = state.rotationSchemeMedias.filter((w) => w.mediaNameId);
        const localNewValue = {
          id: 'rotationSchemeMedias',
          value: [
            ...filterd,
            ...newValue,
          ],
        };
        onStateChanged(localNewValue);
      }}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
    <LeadTypeComponent
      state={state}
      schema={schema}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      isSubmitted={isSubmitted}
      onStateChanged={onStateChanged}
      values={state.rotationSchemaLeadsType && state.rotationSchemaLeadsType.filter((item) => item.leadClass)}
      rotationEdit={rotationEdit}
    />
    <MethodOfContact
      state={state}
      schema={schema}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      isSubmitted={isSubmitted}
      onStateChanged={onStateChanged}
      values={state.rotationSchemaMethodOfContacts && state.rotationSchemaMethodOfContacts.filter((item) => item.methodOfContactName)}
    />
    <LeadClassComponent
      state={state}
      schema={schema}
      isSubmitted={isSubmitted}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      schemaKey='rotationSchemaContactCLasses'
    />

    <LeadPreferredLanguageComponent
      state={state}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onStateChanged={(newValue) => {
        const localNewValue = {
          id: 'rotationPreferredLanguages',
          value: [
            ...newValue,
          ],
        };
        onStateChanged(localNewValue);
      }}
    />
    <CountrySectionComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />


    <PropertyComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />

    <RefferdByComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      schema={schema}
      isSubmitted={isSubmitted}
      schemaKey='rotationSchemaReferredBys'
    />

    <DeveloperComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />


    <UnitTypeComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
    <div className='dialog-content-item' />
    <RangeComponent
      state={state}
      schema={schema}
      idRef='priceRangeRef'
      labelValue='priceRange'
      agentRotationRangeType={AgentRotationRangeTypeEnum.PriceRange.key}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />

    <RangeComponent
      state={state}
      schema={schema}
      idRef='BedroomsRef'
      labelValue='Bedrooms'
      agentRotationRangeType={AgentRotationRangeTypeEnum.Bedroom.key}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />

    <RangeComponent
      state={state}
      schema={schema}
      idRef='BathroomsRef'
      labelValue='Bathrooms'
      agentRotationRangeType={AgentRotationRangeTypeEnum.Bathroom.key}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
    <RangeComponent
      state={state}
      schema={schema}
      idRef='SizeRef'
      labelValue='Size'
      agentRotationRangeType={AgentRotationRangeTypeEnum.Size.key}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />

  </div>
);
const convertJsonValueShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.array,
  PropTypes.array,
  PropTypes.array,
]);
RotationCriteriaDialogContent.propTypes =
{
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath:
    PropTypes.string.isRequired,
  state:
    PropTypes.objectOf(convertJsonValueShape).isRequired,
  onStateChanged:
    PropTypes.func.isRequired,
  schema:
    PropTypes.instanceOf(Object).isRequired,
  isSubmitted:
    PropTypes.bool.isRequired,

  setIsLoading:
    PropTypes.func.isRequired,
};
