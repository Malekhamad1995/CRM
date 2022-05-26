import React, {
  useCallback, useState, useReducer, useEffect
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  DialogActions, DialogContent, DialogTitle, Dialog
} from '@material-ui/core';
import Joi from 'joi';
import { Spinner } from '../../../../../../Components';
import { showError, showSuccess } from '../../../../../../Helper';
import { RotationCriteriaDialogContent } from './RotationCriteriaDialogContent';
import { RotationCriteriaDialogFooter } from './RotationCriteriaDialogFooter';
import {
  CreateRotationSchemeServices,
  UpdateRotationScheme,
} from '../../../../../../Services/RotaionSchemaService/RotationSchemaService';

export const RotationCriteriaDialog = ({
  parentTranslationPath,
  translationPath,
  open,
  close,
  onSave,
  rotationEdit,
  isEdit,
  setRotationEdit,
}) => {
  useEffect(() => {
    if (rotationEdit === undefined || rotationEdit === null) return;
    const currntState = {
      rotationSchemeId: null,
      label: '',
      rotationPreferredLanguages: [],
      rotationSchemeCountries: [],
      rotationSchemeCities: [],
      rotationSchemeCommunities: [],
      rotationSchemeDistricts: [],
      rotationSchemeSubCommunities: [],
      rotationSchemeUnitTypes: [],
      rotationSchemeRanges: [],
      rotationSchemaContactCLasses: [],
      rotationSchemeMedias: [],
      rotationSchemaDeveloperIds: [],
      rotationSchemaReferredBys: [],
      rotationSchemeProperties: [],
      rotationSchemaLeadsType: [],
      rotationSchemaMethodOfContacts: []
    };
    currntState.rotationSchemeId = rotationEdit.rotationSchemeId;
    rotationEdit.languages.map((item) => {
      currntState.rotationPreferredLanguages.push({
        languageName: item.lookupItemName,
        languageId: item.lookupsId,
      });
    });
    rotationEdit.countries.map((item) => {
      currntState.rotationSchemeCountries.push({
        countryName: item.lookupItemName,
        countryId: item.lookupsId,
      });
    });
    rotationEdit.cities.map((item) => {
      currntState.rotationSchemeCities.push({
        cityName: item.lookupItemName,
        cityId: item.lookupsId,
      });
    });
    rotationEdit.districts.map((item) => {
      currntState.rotationSchemeDistricts.push({
        districtName: item.lookupItemName,
        districtId: item.lookupsId,
      });
    });
    rotationEdit.communities.map((item) => {
      currntState.rotationSchemeCommunities.push({
        communityName: item.lookupItemName,
        communityId: item.lookupsId,
      });
    });
    rotationEdit.subCommunities.map((item) => {
      currntState.rotationSchemeSubCommunities.push({
        subCommunityName: item.lookupItemName,
        subCommunityId: item.lookupsId,
      });
    });
    rotationEdit.leadClasses.map((item) => {
      currntState.rotationSchemaContactCLasses.push({
        contactClassId: item.lookupsId,
        contactClassName: item.lookupItemName
      });
    });
    rotationEdit.unitTypes.map((item) => {
      currntState.rotationSchemeUnitTypes.push({
        unitTypeName: item.lookupItemName,
        unitTypeId: item.lookupsId,
      });
    });
    rotationEdit.developers.map((item) => {
      currntState.rotationSchemaDeveloperIds.push({
        developerName: item.developerName,
        developerId: item.developerId,
      });
    });

    rotationEdit.properties.map((item) => {
      currntState.rotationSchemeProperties.push({
        propertyName: item.propertyName,
        propertyId: item.propertyId,
      });
    });

    rotationEdit.referredBys.map((item) => {
      currntState.rotationSchemaReferredBys.push({
        userId: item.userId,
        fullName: item.fullName
      });
    });
    rotationEdit.medias.map((item) => {
      currntState.rotationSchemeMedias.push({
        mediaName: item.mediaName,
        mediaNameId: item.mediaId === 0 ? null : item.mediaId,
        mediaDetailsName: item.mediaDetails,
        mediaDetailsId: item.mediaDetailsId === 0 ? null : item.mediaDetailsId,
      });
    });
    rotationEdit.rotationSchemeRanges.map((item) => {
      currntState.rotationSchemeRanges.push({
        ...item,
      });
    });
    rotationEdit.methodOfContact.map((item) => {
      currntState.rotationSchemaMethodOfContacts.push({
        methodOfContactName: item.methodOfContactName,
        methodOfContactId: item.methodOfContactId
      });
    });
    rotationEdit.leadsType.map((item) => {
      currntState.rotationSchemaLeadsType.push({
        leadClass: item.leadClass.toLowerCase()
      });
    });
    currntState.label = rotationEdit.label;
    setState({ id: 'edit', value: currntState });
  }, [rotationEdit]);
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInValidPrice, setIsInValidPrice] = useState(false);
  const [isInValidBedrooms, setIsInValidBedrooms] = useState(false);
  const [isInValidBathrooms, setIsInValidBathrooms] = useState(false);
  const [saveIsDisabled, setSaveIsDisabled] = useState(false);

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [state, setState] = useReducer(reducer, {
    rotationSchemeId: null,
    label: '',
    rotationPreferredLanguages: [],
    rotationSchemeCountries: [],
    rotationSchemeCities: [],
    rotationSchemeCommunities: [],
    rotationSchemeDistricts: [],
    rotationSchemeSubCommunities: [],
    rotationSchemeUnitTypes: [],
    rotationSchemeRanges: [],
    rotationSchemaContactCLasses: [],
    rotationSchemeMedias: [],
    rotationSchemaDeveloperIds: [],
    rotationSchemaReferredBys: [],
    rotationSchemeProperties: [],
    rotationSchemaLeadsType: [],
    rotationSchemaMethodOfContacts: [],
  });

  const schema = Joi.object({
    label: Joi.string()
      .required()
      .messages({
        'string.empty': t`${translationPath}label-is-required`,
      }),
    rotationSchemaReferredBys: Joi.array()
      .required()
      .min(1)
      .messages({
        'array.empty': t(`${translationPath}ReferredBy-is-required`),
        'array.min': t(`${translationPath}ReferredBy-is-required`),
      }),
    rotationSchemaContactCLasses: Joi.array()
      .required()
      .min(1)
      .messages({
        'array.empty': t(`${translationPath}lead-class-is-required`),
        'array.min': t(`${translationPath}lead-class-is-required`),
      }),
    rotationSchemaLeadsType: Joi.array()
      .required()
      .messages({
        'array.empty': t(`${translationPath}lead-type-is-required`),
        'array.min': t(`${translationPath}lead-type-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const saveHandler = useCallback(async () => {
    setSaveIsDisabled(true);
    setIsSubmitted(true);
    setIsLoading(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setSaveIsDisabled(false);
      setIsLoading(false);
      return;
    }
    const rotationSchemeId = rotationEdit ? rotationEdit.rotationSchemeId : 0;
    const res = rotationEdit ?
      await UpdateRotationScheme(rotationSchemeId, state) :
      await await CreateRotationSchemeServices(state);
    if (!(res && res.status && res.status !== 200)) {
      if (!rotationEdit) showSuccess(t`${translationPath}Create-Rotation-Scheme-successfully`);
      else showSuccess(t`${translationPath}Edit-Rotation-Scheme-successfully`);
      onSave();
      close();
    } else {
      setSaveIsDisabled(false);
      showError(t('Shared:Server-Error'));
    }
    setIsLoading(false);
  }, [state]);

  return (
    <div>
      <Spinner isActive={isLoading} />
      <Dialog
        open={open}
        maxWidth='lg'
        onClose={() => {
          close();
        }}
        className='rotationCriteriaDialog-dialog-wrapper'
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            <span>
              {!rotationEdit ?
                t(`${translationPath}add-new-rotation-criteria`) :
                t(`${translationPath}Edit-rotation-criteria`)}
            </span>
          </DialogTitle>
          <DialogContent>
            <RotationCriteriaDialogContent
              state={state}
              schema={schema}
              setIsLoading={setIsLoading}
              isSubmitted={isSubmitted}
              setIsInValidPrice={setIsInValidPrice}
              isInValidPrice={isInValidPrice}
              isInValidBedrooms={isInValidBedrooms}
              setIsInValidBedrooms={setIsInValidBedrooms}
              isInValidBathrooms={isInValidBathrooms}
              setIsInValidBathrooms={setIsInValidBathrooms}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              rotationEdit={rotationEdit}
            />
          </DialogContent>
          <DialogActions>
            <RotationCriteriaDialogFooter
              close={close}
              onSave={() => {
                saveHandler();
                // onSave();
              }}
              saveIsDisabled={saveIsDisabled}
              rotationEdit={rotationEdit}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
RotationCriteriaDialog.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  rotationEdit: PropTypes.instanceOf(Object),
  isEdit: PropTypes.bool,
};
RotationCriteriaDialog.defaultProps = {
  rotationEdit: null,
  isEdit: false,
  setRotationEdit: () => {
    // handleChange function here
  },
};
