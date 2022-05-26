import React from 'react';
import PropTypes from 'prop-types';
import {
  CityTypeIdEnum,
  NationalityEnum,
  CommunityTypeIdEnum,
  DistrictTypeIdEnum,
  SubCommunityTypeIdEnum,
} from '../../../../../../../Enums';
import { RotationManagementLookupsAutocomplete } from '../Controls/RotationManagementLookupsAutocomplete';

export const CountrySectionComponent = ({
  parentTranslationPath,
  translationPath,
  state,
  onStateChanged,
}) => (
  <>
    <div className='dialog-content-item'>
      <RotationManagementLookupsAutocomplete
        idRef='countryIdRef'
        lookupTypeId={NationalityEnum.lookupTypeId}
        labelValue='country'
        value={state.rotationSchemeCountries }
        mapedData={{id:"countryId",name:"countryName"}}
        onStateChanged={(newValue) => {
          const localNewValue = {
            id: 'rotationSchemeCountries',
            value: [
                ...newValue,
            ]
          };
          onStateChanged(localNewValue);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
    <div className='dialog-content-item'>
      <RotationManagementLookupsAutocomplete
        idRef='cityIdRef'
        labelValue='city'
        value={state.rotationSchemeCities}
        lookupTypeId={CityTypeIdEnum.lookupTypeId}
        mapedData={{id:"cityId",name:"cityName"}}
        onStateChanged={(newValue) => {
          const localNewValue = {
            id: 'rotationSchemeCities',
            value: [
                ...newValue
            ]
          };
          onStateChanged(localNewValue);
        }}
        isWithLookupParentId
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
    <div className='dialog-content-item'>
      <RotationManagementLookupsAutocomplete
        idRef='districtIdRef'
        labelValue='district'
        lookupTypeId={DistrictTypeIdEnum.lookupTypeId}
        mapedData={{id:"districtId",name:"districtName"}}
        value={state.rotationSchemeDistricts}
        onStateChanged={(newValue) => {
          const localNewValue = {
            id: 'rotationSchemeDistricts',
            value: [
                ...newValue,
            ],
          };
          onStateChanged(localNewValue);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
    <div className='dialog-content-item'>
      <RotationManagementLookupsAutocomplete
        idRef='communityIdRef'
        labelValue='community'
        lookupTypeId={CommunityTypeIdEnum.lookupTypeId}
        mapedData={{id:"communityId",name:"communityName"}}
        onStateChanged={(newValue) => {
            const localNewValue = {
                id: 'rotationSchemeCommunities',
                value: [
                    ...newValue,
                ],
            };
            onStateChanged(localNewValue);
        }}
        value={state.rotationSchemeCommunities}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
    <div className='dialog-content-item'>
      <RotationManagementLookupsAutocomplete
        idRef='subcommunityIdRef'
        labelValue='subCommunity'
        lookupTypeId={SubCommunityTypeIdEnum.lookupTypeId}
        onStateChanged={(newValue) => {
            const localNewValue = {
                id: 'rotationSchemeSubCommunities',
                value: [
                    ...newValue,
                ],
            };
            onStateChanged(localNewValue);
        }}
       value={state.rotationSchemeSubCommunities}
        mapedData={{id:"subCommunityId",name:"subCommunityName"}}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  </>
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
CountrySectionComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
};
