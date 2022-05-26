import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import Joi from 'joi';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { DialogComponent } from '../../../../../Components';
import { CreateActivity } from '../../../../../Services';
import { showError, showSuccess } from '../../../../../Helper';
import { UntZeroMatchingFields } from './UntZeroMatchingFields';
import { validationObject } from './ValidationObject';
import { ZeroMatchingUnitEnum } from '../../../../../Enums';

const parentTranslationPath = 'SalesAvailabilityView';
const translationPath = '';
export const UntZeroMatchingDialog = ({ isOpen, isOpenChanged }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    bedroom: null,
    unitFor: null,
    property: null,
    areaSize: null,
    unitType: null,
    unitModel: null,
    community: null,
    moveInDate: null,
    movingMonth: null,
    expectedRoi: null,
    unitLocation: null,
    projectStatus: null,
    paymentMethod: null,
    askingMinPrice: null,
    askingMaxPrice: null,
    unitPrimaryViews: null,
    extraRequirements: null,
    unitSecondaryViews: null,
    relatedLeadNumberId: null,
    locationRequirements: null,
  });
  const defaultState = {
    assignAgentId: loginResponse.userId,
    activityDate: moment(new Date()).format(),
    relatedLeadNumberId: null,
    relatedUnitNumberId: null,
    relatedPortfolioId: null,
    relatedWorkOrderId: null,
    relatedMaintenanceContractId: null,
    activityTypeId: ZeroMatchingUnitEnum.typeId,
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: [],
  };
  const [state, setState] = useReducer(reducer, defaultState);
  const schema = Joi.object(validationObject(t, translationPath))
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(selected);
  useEffect(() => {
    if (
      selected.bedroom &&
      selected.unitFor &&
      selected.property &&
      selected.unitType &&
      selected.areaSize &&
      selected.property &&
      selected.community &&
      selected.unitModel &&
      selected.expectedRoi &&
      selected.unitLocation &&
      selected.paymentMethod &&
      selected.projectStatus &&
      selected.askingMaxPrice &&
      selected.askingMinPrice &&
      selected.unitPrimaryViews &&
      selected.extraRequirements &&
      selected.relatedLeadNumberId
    ) {
      setState({
        id: 'comments',
        value: `Sales Zero Matching Inuirey, Lead=${selected.relatedLeadNumberId.lead.contact_name.name} (${selected.relatedLeadNumberId.leadId}), Unit For=${selected.unitFor.value}, Community=${selected.community.lookupItemName}, Property Name=${selected.property.property.property_name}, unittype=${selected.unitType.lookupItemName}, Bedrrom=${selected.bedroom}, Area Size=${selected.areaSize}, ROI=${selected.expectedRoi} Payment Method=${selected.paymentMethod}, Project Status=${selected.projectStatus}, clientminbudget=${selected.askingMinPrice}, clientmaxbudget=${selected.askingMaxPrice}, Unit Model=${selected.unitModel}, Unit Location=${selected.unitLocation}, Primary View=${selected.unitPrimaryViews}, Secondary View=${selected.unitSecondaryViews}, Extra Requirements=${selected.extraRequirements}`,
      });
    }
  }, [
    selected.unitFor,
    selected.bedroom,
    selected.areaSize,
    selected.property,
    selected.unitType,
    selected.unitModel,
    selected.community,
    selected.expectedRoi,
    selected.unitLocation,
    selected.paymentMethod,
    selected.projectStatus,
    selected.askingMaxPrice,
    selected.askingMinPrice,
    selected.unitPrimaryViews,
    selected.extraRequirements,
    selected.unitSecondaryViews,
    selected.relatedLeadNumberId,
  ]);
  useEffect(() => {
    if (selected.relatedLeadNumberId && loginResponse && loginResponse.userName) {
      setState({
        id: 'subject',
        value: `Zero Matching Unit/User Name=${loginResponse.userName}/Lead=${selected.relatedLeadNumberId.lead.contact_name.name} (${selected.relatedLeadNumberId.leadId})`,
      });
    }
  }, [loginResponse, selected.relatedLeadNumberId]);
  const saveHandler = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      const res = await CreateActivity(state);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t(`${translationPath}activity-created-successfully`));
        isOpenChanged();
      } else showError(t(`${translationPath}activity-create-failed`));
    },
    [isOpenChanged, state, t]
  );
  return (
    <DialogComponent
      titleText={t(`${translationPath}zero-matching`)}
      saveText={t(`${translationPath}send-inquiry`)}
      saveType='button'
      dialogContent={(
        <UntZeroMatchingFields
          state={state}
          schema={schema}
          setState={setState}
          selected={selected}
          setSelected={setSelected}
          isSubmitted={isSubmitted}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      isOpen={isOpen}
      saveIsDisabled={
        !selected.bedroom ||
        !selected.unitFor ||
        !selected.property ||
        !selected.unitType ||
        !selected.areaSize ||
        !selected.property ||
        !selected.community ||
        !selected.unitModel ||
        !selected.expectedRoi ||
        !selected.unitLocation ||
        !selected.paymentMethod ||
        !selected.projectStatus ||
        !selected.askingMaxPrice ||
        !selected.askingMinPrice ||
        !selected.unitPrimaryViews ||
        !selected.extraRequirements ||
        !selected.relatedLeadNumberId
      }
      onSaveClicked={saveHandler}
      onCancelClicked={isOpenChanged}
    />
  );
};
UntZeroMatchingDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
};
