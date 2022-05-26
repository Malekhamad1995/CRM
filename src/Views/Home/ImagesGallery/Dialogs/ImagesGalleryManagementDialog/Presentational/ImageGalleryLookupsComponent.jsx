import React from 'react';
import PropTypes from 'prop-types';
import { GalleryManagementLookupsAutocomplete } from '../Controls';
import {
  Country,
  Cities,
  District,
  Community,
  SubCommunity
} from '../../../../../../assets/json/StaticLookupsIds.json';
import { ImagesGalleryFilterEnum, UnitProfileImagesCardActionEnum } from '../../../../../../Enums';

export const ImageGalleryLookupsComponent = ({
  activeItem,
  initialId,
  unit,
  locationDefault,
  fromPage,
  state,
  schema,
  isSubmitted,
  isDisabled,
  onStateChanged,
  parentTranslationPath,
  translationPath,
  ImageCategoryLookup
}) => (
  <>
    {unit === UnitProfileImagesCardActionEnum.Hide ? (
      <>
        <div className='dialog-item'>
          <GalleryManagementLookupsAutocomplete
            idRef='countryIdRef'
            labelValue='country'
            stateValue={state.countryId}
            lookupTypeId={Country}
            schema={schema}
            isSubmitted={isSubmitted}
            isDisabled={isDisabled}
            stateKey='countryId'
            onStateChanged={(newValue) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...state,
                  ...locationDefault,
                  countryId: newValue,
                },
              };
              onStateChanged(localNewValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className='dialog-item'>
          <GalleryManagementLookupsAutocomplete
            idRef='cityIdRef'
            labelValue='city'
            stateValue={state.cityId}
            lookupParentId={state.countryId}
            lookupTypeId={Cities}
            isWithLookupParentId
            schema={schema}
            isSubmitted={isSubmitted}
            isDisabled={isDisabled}
            stateKey='cityId'
            onStateChanged={(newValue) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...state,
                  ...locationDefault,
                  countryId: state.countryId,
                  cityId: newValue,
                },
              };
              onStateChanged(localNewValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      </>
    ) : null}
    {(fromPage === ImagesGalleryFilterEnum.District.key ||
      fromPage === ImagesGalleryFilterEnum.Community.key ||
      fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
      <div className='dialog-item'>
        <GalleryManagementLookupsAutocomplete
          idRef='districtIdRef'
          labelValue='district'
          stateValue={state.districtId}
          lookupParentId={state.cityId}
          lookupTypeId={District}
          isWithLookupParentId
          schema={schema}
          isSubmitted={isSubmitted}
          isDisabled={isDisabled}
          stateKey='districtId'
          onStateChanged={(newValue) => {
            const localNewValue = {
              id: 'edit',
              value: {
                ...state,
                ...locationDefault,
                countryId: state.countryId,
                cityId: state.cityId,
                districtId: newValue,
              },
            };
            onStateChanged(localNewValue);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    )}
    {(fromPage === ImagesGalleryFilterEnum.Community.key ||
      fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
      <div className='dialog-item'>
        <GalleryManagementLookupsAutocomplete
          idRef='communityIdRef'
          labelValue='community'
          stateValue={state.communityId}
          lookupParentId={state.districtId}
          lookupTypeId={Community}
          isWithLookupParentId
          stateKey='communityId'
          schema={schema}
          isSubmitted={isSubmitted}
          isDisabled={isDisabled}
          onStateChanged={(newValue) => {
            const localNewValue = {
              id: 'edit',
              value: {
                ...state,
                ...locationDefault,
                countryId: state.countryId,
                cityId: state.cityId,
                districtId: state.districtId,
                communityId: newValue,
              },
            };
            onStateChanged(localNewValue);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    )}
    {fromPage === ImagesGalleryFilterEnum.Subcommunity.key && (
      <div className='dialog-item'>
        <GalleryManagementLookupsAutocomplete
          idRef='subCommunityIdRef'
          labelValue='sub-community'
          stateValue={state.subCommunityId}
          lookupParentId={state.communityId}
          lookupTypeId={SubCommunity}
          isWithLookupParentId
          stateKey='subCommunityId'
          schema={schema}
          isSubmitted={isSubmitted}
          isDisabled={isDisabled}
          onStateChanged={(newValue) => {
            onStateChanged({ id: 'subCommunityId', value: newValue });
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    )}
    {unit === UnitProfileImagesCardActionEnum.Show ? (
      <div className='dialog-item'>
        <GalleryManagementLookupsAutocomplete
          idRef='categoryIdRef'
          labelValue='Category'
          stateValue={(activeItem ? initialId : state.categoryId) || ''}
          lookupTypeId={ImageCategoryLookup}
          schema={schema}
          isSubmitted={isSubmitted}
          stateKey='categoryId'
          onStateChanged={(newValue) => {
            const localNewValue = {
              id: 'edit',
              value: {
                ...state,
                categoryId: newValue,
              },
            };
            onStateChanged(localNewValue);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    ) : null}
  </>
);

ImageGalleryLookupsComponent.propTypes = {
  ImageCategoryLookup: PropTypes.instanceOf(Object).isRequired,
  locationDefault: PropTypes.instanceOf(Object).isRequired,
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key))
    .isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  unit: PropTypes.number,
  isSubmitted: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  initialId: PropTypes.number.isRequired,
};
ImageGalleryLookupsComponent.defaultProps = {
  unit: undefined,
};
