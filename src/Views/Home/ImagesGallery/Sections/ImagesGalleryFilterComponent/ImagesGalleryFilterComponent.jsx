import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import Joi from 'joi';
import { GalleryFilterLookupsAutocomplete } from './Controls';
import {
  Country,
  Cities,
  District,
  Community,
  SubCommunity,
  UAECities
} from '../../../../../assets/json/StaticLookupsIds.json';
import { ImagesGalleryFilterEnum } from '../../../../../Enums';
import { showError } from '../../../../../Helper';


export const ImagesGalleryFilterComponent = ({
  fromPage,
  filterBy,
  onFilterByChanged,
  parentTranslationPath,
  translationPath,

}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const defaultLocalFilterBy = {
    countryId: null,
    cityId: null,
    districtId: null,
    communityId: null,
    subCommunityId: null,
  };

  const [localFilterBy, setLocalFilterBy] = useReducer(reducer, {
    ...defaultLocalFilterBy,
    ...filterBy,
  });

  const schema = Joi.object({
    countryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}country-is-required`),
        'number.empty': t(`${translationPath}country-is-required`),
      }),
    // cityId: ((
    //   fromPage === ImagesGalleryFilterEnum.District.key ||
    //   fromPage === ImagesGalleryFilterEnum.Community.key ||
    //   fromPage === ImagesGalleryFilterEnum.Subcommunity.key) &&
    //   Joi.number()
    //   .required()
    //   .messages({
    //     'number.base': t(`${translationPath}city-is-required`),
    //     'number.empty': t(`${translationPath}city-is-required`),
    //   })) ||
    //   Joi.any(),
    // districtId:
    //   ((fromPage === ImagesGalleryFilterEnum.District.key ||
    //     fromPage === ImagesGalleryFilterEnum.Community.key ||
    //     fromPage === ImagesGalleryFilterEnum.Subcommunity.key) &&
    //     Joi.number()
    //       .required()
    //       .messages({
    //         'number.base': t(`${translationPath}district-is-required`),
    //         'number.empty': t(`${translationPath}district-is-required`),
    //       })) ||
    //   Joi.any(),
    // communityId:
    //   ((fromPage === ImagesGalleryFilterEnum.Community.key ||
    //     fromPage === ImagesGalleryFilterEnum.Subcommunity.key) &&
    //     Joi.number()
    //       .required()
    //       .messages({
    //         'number.base': t(`${translationPath}community-is-required`),
    //         'number.empty': t(`${translationPath}community-is-required`),
    //       })) ||
    //   Joi.any(),
    // subCommunityId:
    //   (fromPage === ImagesGalleryFilterEnum.Subcommunity.key &&
    //     Joi.number()
    //       .required()
    //       .messages({
    //         'number.base': t(`${translationPath}sub-community-is-required`),
    //         'number.empty': t(`${translationPath}sub-community-is-required`),
    //       })) ||
    //   Joi.any(),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(localFilterBy);
  const onLocalFilterByChanged = (newValue) => {
    setLocalFilterBy(newValue);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    if (onFilterByChanged) onFilterByChanged({ id: 'edit', value: localFilterBy });
  };
  const resetHandler = () => {
    setLocalFilterBy({ id: 'edit', value: { ...defaultLocalFilterBy } });
    setIsSubmitted(false);
    if (onFilterByChanged) onFilterByChanged({ id: 'edit', value: { ...defaultLocalFilterBy } });
  };

  useEffect(() => {
    setLocalFilterBy({
      id: 'edit',
      value: {
        ...{
          cityId: UAECities,
          countryId: UAECities,
          districtId: null,
          communityId: null,
          subCommunityId: null,
        }
      }
    });
  }, []);
  return (
    <form
      noValidate
      onSubmit={submitHandler}
      className='images-gallery-filter-wrapper shared-wrapper'
    >
      <span className='title-text'>{t(`${translationPath}filter`)}</span>
      <div className='filter-item'>
        <GalleryFilterLookupsAutocomplete
          idRef='countryIdRef'
          inputPlaceholder='country'
          stateValue={localFilterBy.countryId}
          lookupTypeId={Country}
          schema={schema}
          isSubmitted={isSubmitted}
          stateKey='countryId'
          onStateChanged={(newValue) => {
            const localNewValue = {
              id: 'edit',
              value: {
                ...defaultLocalFilterBy,
                countryId: newValue,
              },
            };
            onLocalFilterByChanged(localNewValue);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='filter-item'>
        <GalleryFilterLookupsAutocomplete
          idRef='cityIdRef'
          inputPlaceholder='city'
          stateValue={localFilterBy.cityId}
          lookupParentId={localFilterBy.countryId}
          lookupTypeId={Cities}
          isWithLookupParentId
          schema={schema}
          isSubmitted={isSubmitted}
          stateKey='cityId'
          onStateChanged={(newValue) => {
            const localNewValue = {
              id: 'edit',
              value: {
                ...defaultLocalFilterBy,
                countryId: localFilterBy.countryId,
                cityId: newValue,
              },
            };
            onLocalFilterByChanged(localNewValue);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      {(fromPage === ImagesGalleryFilterEnum.District.key ||
        fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
          <div className='filter-item'>
            <GalleryFilterLookupsAutocomplete
              idRef='districtIdRef'
              inputPlaceholder='district'
              stateValue={localFilterBy.districtId}
              lookupParentId={localFilterBy.cityId}
              lookupTypeId={District}
              isWithLookupParentId
              schema={schema}
              isSubmitted={isSubmitted}
              stateKey='districtId'
              onStateChanged={(newValue) => {
                const localNewValue = {
                  id: 'edit',
                  value: {
                    ...defaultLocalFilterBy,
                    countryId: localFilterBy.countryId,
                    cityId: localFilterBy.cityId,
                    districtId: newValue,
                  },
                };
                onLocalFilterByChanged(localNewValue);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        )}
      {(fromPage === ImagesGalleryFilterEnum.Community.key ||
        fromPage === ImagesGalleryFilterEnum.Subcommunity.key) && (
          <div className='filter-item'>
            <GalleryFilterLookupsAutocomplete
              idRef='communityIdRef'
              inputPlaceholder='community'
              stateValue={localFilterBy.communityId}
              lookupParentId={localFilterBy.districtId}
              lookupTypeId={Community}
              isWithLookupParentId
              stateKey='communityId'
              schema={schema}
              isSubmitted={isSubmitted}
              onStateChanged={(newValue) => {
                const localNewValue = {
                  id: 'edit',
                  value: {
                    ...defaultLocalFilterBy,
                    countryId: localFilterBy.countryId,
                    cityId: localFilterBy.cityId,
                    districtId: localFilterBy.districtId,
                    communityId: newValue,
                  },
                };
                onLocalFilterByChanged(localNewValue);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        )}
      {fromPage === ImagesGalleryFilterEnum.Subcommunity.key && (
        <div className='filter-item'>
          <GalleryFilterLookupsAutocomplete
            idRef='subCommunityIdRef'
            inputPlaceholder='sub-community'
            stateValue={localFilterBy.subCommunityId}
            lookupParentId={localFilterBy.communityId}
            lookupTypeId={SubCommunity}
            isWithLookupParentId
            stateKey='subCommunityId'
            schema={schema}
            isSubmitted={isSubmitted}
            onStateChanged={(newValue) => {
              const localNewValue = {
                id: 'edit',
                value: {
                  ...defaultLocalFilterBy,
                  countryId: localFilterBy.countryId,
                  cityId: localFilterBy.cityId,
                  districtId: localFilterBy.districtId,
                  communityId: localFilterBy.communityId,
                  subCommunityId: localFilterBy.communityId,
                },
              };
              onLocalFilterByChanged(localNewValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      )}
      <div className='d-inline-flex-v-center pt-1 px-2 mb-2'>
        <ButtonBase className='btns theme-solid mx-2' type='submit'>
          <span>{t(`${translationPath}apply`)}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-transparent mx-2' onClick={resetHandler}>
          <span>{t(`${translationPath}reset`)}</span>
        </ButtonBase>
      </div>
    </form>
  );
};

ImagesGalleryFilterComponent.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key))
    .isRequired,
  filterBy: PropTypes.instanceOf(Object).isRequired,
  onFilterByChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
