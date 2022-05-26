import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import Joi from 'joi';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { DialogComponent } from '../../../../../Components';
import { CreateActivity } from '../../../../../Services';
import { showError, showSuccess } from '../../../../../Helper';
import { InquireEnum } from '../../../../../Enums';
import { UntInquiryDialogFields } from './UntInquiryDialogFields';

export const UntInquiryDialog = ({
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    leadId: null,
    activityType: null,
    extraRequirements: null,
    askingMinPrice: null,
    askingMaxPrice: null,
  });
  const defaultState = {
    assignAgentId: activeItem && activeItem.listing_agent.id,
    activityDate: moment(new Date()).format(),
    relatedLeadNumberId: null,
    relatedUnitNumberId: activeItem && activeItem.id,
    relatedPortfolioId: null,
    relatedWorkOrderId: null,
    relatedMaintenanceContractId: null,
    activityTypeId: null,
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: [
      {
        reminderType: 1,
        contactId: null,
        usersId: activeItem && activeItem.listing_agent.id,
        reminderTime: null,
      },
    ],
  };
  const [state, setState] = useReducer(reducer, defaultState);
  useEffect(() => {
    if (activeItem && state.activityDate && activeItem.listing_agent) {
      setState({
        id: 'activityReminders',
        value: [
          {
            reminderType: 1,
            contactId: null,
            usersId: activeItem.listing_agent.id,
            reminderTime: moment(state.activityDate).subtract(15, 'm').format(),
          },
        ],
      });
    }
  }, [activeItem, state.activityDate]);
  useEffect(() => {
    if (
      activeItem.name &&
      activeItem.id &&
      activeItem.listing_agent &&
      selected.extraRequirements &&
      state.activityTypeId === InquireEnum[0].activityTypeId
    ) {
      setState({
        id: 'comments',
        value: `Unit=${activeItem.name}(${activeItem.id}), ListingAgent=${
          activeItem.listing_agent.name
        }, Extra Requirements=${selected.extraRequirements}, Viewing Schedualed=${moment(
          state.activityDate
        ).format('YYYY-MM-DD HH:mm:ss')}`,
      });
    }
    if (
      activeItem.name &&
      activeItem.listing_agent &&
      selected.extraRequirements &&
      state.activityTypeId === InquireEnum[2].activityTypeId
    ) {
      setState({
        id: 'comments',
        value: `Unit=${activeItem.name}(${activeItem.id}), ListingAgent=${activeItem.listing_agent.name}, Extra Requirements=${selected.extraRequirements}`,
      });
    }
    if (
      activeItem.name &&
      activeItem.listing_agent &&
      selected.extraRequirements &&
      state.activityTypeId === InquireEnum[1].activityTypeId
    ) {
      setState({
        id: 'comments',
        value: `Unit=${activeItem.name}(${activeItem.id}), ListingAgent=${activeItem.listing_agent.name}, Extra Requirements=${selected.extraRequirements}, clientminbudget=${selected.askingMinPrice}, clientmaxbudget=${selected.askingMaxPrice}`,
      });
    }
  }, [
    activeItem.id,
    activeItem.listing_agent,
    activeItem.name,
    selected.askingMaxPrice,
    selected.askingMinPrice,
    selected.extraRequirements,
    state.activityDate,
    state.activityTypeId,
  ]);
  useEffect(() => {
    if (selected.leadId && selected.activityType && activeItem.listing_agent) {
      setState({
        id: 'subject',
        value: `${t(`${translationPath}${selected.activityType}`)}/User Name=${
          activeItem.listing_agent.name
        }/Lead=${selected.leadId.lead.contact_name.name} (${selected.leadId.leadId})`,
      });
    }
  }, [
    t,
    selected.leadId,
    translationPath,
    state.activityTypeId,
    selected.activityType,
    activeItem.listing_agent,
    activeItem.listing_agent.name,
  ]);
  const schema = Joi.object({
    activityDate: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}activity-date-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const saveHandler = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      if (schema.error) {
        showError(t('Shared:please-fix-all-errors'));
        return;
      }
      const res = await CreateActivity(state);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t(`${translationPath}activity-created-successfully`));
        isOpenChanged();
      } else showError(t(`${translationPath}activity-create-failed`));
    },
    [isOpenChanged, schema.error, state, t, translationPath]
  );
  return (
    <DialogComponent
      titleText={t(`${translationPath}send-inquiry`)}
      saveText={t(`${translationPath}send-inquiry`)}
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <UntInquiryDialogFields
          state={state}
          schema={schema}
          setState={setState}
          selected={selected}
          activeItem={activeItem}
          setSelected={setSelected}
          isSubmitted={isSubmitted}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      isOpen={isOpen}
      onSaveClicked={saveHandler}
      onCancelClicked={isOpenChanged}
    />
  );
};
UntInquiryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
