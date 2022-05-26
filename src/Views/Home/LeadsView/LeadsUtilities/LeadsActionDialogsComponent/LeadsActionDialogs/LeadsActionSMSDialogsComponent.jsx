import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import Joi from 'joi';
import { AutocompleteComponent, Inputs, Spinner } from '../../../../../../Components';
import { GetContacts, SendBulkSmsPost } from '../../../../../../Services';
import { getErrorByName, showError, showSuccess } from '../../../../../../Helper';

export const LeadsActionSMSDialogsComponent = ({
  isOpenChanged,
  item,
  translationPath,
  parentTranslationPath,
  unitItem
}) => {
  const [state, setstate] = useState(() => ({
    contactIds: '',
    message: '',
  }));
  const { t } = useTranslation(parentTranslationPath);
  const [res, setres] = useState([]);
  const [Selected, setSelected] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const searchTimer = useRef(null);
  const ContactsAPI = useCallback(async (search) => {
    setisLoading(true);
    const results = await GetContacts({ pageIndex: 0, pageSize: 100, search , isAdvance:false });
    setres(results.result);
    setisLoading(false);
  }, []);

  const schema = Joi.object({
    contactIds: Joi.array()
      .min(1)
      .required()
      .messages({
        'array.min': t(`${translationPath}please-select-at-least-one-contact`),
      }),
    message: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}message-is-required`),
        'string.empty': t(`${translationPath}message-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  useEffect(() => {
    ContactsAPI();
  }, [ContactsAPI]);

  useEffect(() => {
    if (unitItem) {
      setstate({
        ...state,
        message: `${unitItem.name} -  ${unitItem.bedrooms} bedrooms - ${unitItem.bathrooms} bathrooms\n\rTo See More click Here: ${window.location.origin}/share/UnitCard?id=${unitItem.id}`
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitItem]);


  useEffect(() => {
    if (!item) return;
    setSelected([
      {
        contactsId: item.contact_name && item.contact_name.id,
        contact: {
          // first_name: item && item.allDetails && item.allDetails['Main Information'][1].value || item.contact_name.name,
          // last_name: item && item.allDetails && item.allDetails['Main Information'][2].value || item.contact_name.name,
          company_name: item.name,
        },
      },
    ]);
    setstate((items) => ({
      ...items,
      contactIds: [item.contact_name && item.contact_name.id],
    }));
  }, [item]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      ContactsAPI(value);
    }, 700);
  };

  const saveHandler = useCallback(async () => {
    setisLoading2(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setisLoading(false);
      return;
    }
    const result = await SendBulkSmsPost(state);
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t`${translationPath}SMS-sernd-successfully`);
      isOpenChanged();
      setisLoading(false);
    } else {
      showError(`${translationPath}SMS-sernd-failed`);
      isOpenChanged();
      setisLoading2(false);
    }
  }, [isOpenChanged, schema.error, state, t, translationPath]);

  return (
    <div className='w-100 px-3'>
      <Spinner isActive={isLoading2} isAbsolute />
      <div>
        <AutocompleteComponent
          idRef='ToRef'
          labelValue='To'
          data={res}
          isLoading={isLoading}
          chipsLabel={(option) =>
            option.contact.company_name ||
            (option.contact &&
              (option.contact.first_name || option.contact.last_name) &&
              `${option.contact.first_name} ${option.contact.last_name}`) ||
            ''}
          displayLabel={(option) =>
            option.contact.company_name ||
            (option.contact &&
              (option.contact.first_name || option.contact.last_name) &&
              `${option.contact.first_name} ${option.contact.last_name}`) ||
            ''}
          withoutSearchButton
          inputPlaceholder={t(`${translationPath}Selectcont`)}
          isSubmitted
          getOptionSelected={(option) =>
            Selected.findIndex((items) => items.contactsId === option.contactsId) !== -1 || ''}
          helperText={getErrorByName(schema, 'contactIds').message}
          error={getErrorByName(schema, 'contactIds').error}
          isWithError
          onInputKeyUp={(e) => searchHandler(e)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          selectedValues={Selected || []}
          onChange={(event, newValue) => {
            setstate((items) => ({
              ...items,
              contactIds: newValue && newValue.map((option) => option.contactsId),
            }));
            setSelected(
              newValue &&
              newValue.map((option) => ({
                contactsId: option.contactsId,
                contact: {
                  first_name: option.contact && option.contact.first_name,
                  last_name: option.contact && option.contact.last_name,
                  company_name: option.contact && option.contact.company_name,
                },
              }))
            );
          }}
        />
      </div>
      <div>
        <Inputs
          idRef='MassageRef'
          labelValue='Massage'
          value={state.message || ''}
          helperText={getErrorByName(schema, 'message').message}
          error={getErrorByName(schema, 'message').error}
          isWithError
          multiline
          rows={7}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const { value } = event.target;
            setstate((items) => ({
              ...items,
              message: value,
            }));
          }}
        />
      </div>
      <span>{t(`${translationPath}number-of-characters`)}</span>
      {' '}
      <span>
        :
        {' '}
        {' '}
        {state.message.length}
      </span>
      <div className='d-flex-v-center-h-end flex-wrap'>
        <Button
          className='MuiButtonBase-root btns theme-transparent mb-2'
          onClick={() => {
            isOpenChanged();
          }}
        >
          <span>{t(`${translationPath}Cancel`)}</span>
          <span className='MuiTouchRipple-root' />
        </Button>
        <Button
          disabled={!!schema.error}
          className='MuiButtonBase-root btns theme-solid mb-2'
          onClick={() => {
            saveHandler();
          }}
        >
          <span>{t(`${translationPath}Send`)}</span>
        </Button>
      </div>
    </div>
  );
};
LeadsActionSMSDialogsComponent.propTypes = {
  isOpenChanged: PropTypes.func.isRequired,
  item: PropTypes.instanceOf(Object).isRequired,
  unitItem: PropTypes.instanceOf(Object),
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
