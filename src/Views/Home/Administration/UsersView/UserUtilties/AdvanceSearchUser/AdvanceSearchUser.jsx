import React, { useState, useReducer, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Joi from 'joi';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getErrorByName, showError } from '../../../../../../Helper';
import {
  SelectComponet, Inputs, PhonesComponent, Spinner
} from '../../../../../../Components';
import { phoneExpression, emailExpression } from '../../../../../../Utils';
import { GetAllRoleTypes } from '../../../../../../Services';

const translationPath = 'AdvanceSearch.';
const parentTranslationPath = 'UsersView';

const AdvanceSearchUser = ({ onSearchChanged }) => {
  const { t } = useTranslation(parentTranslationPath);
  const searchInit = {
    userStatusId: 0,
    username: '',
    name: '',
    phoneNumber: '',
    email: '',
    userTypeId: 0,
  };
  const [userTypes, setUserTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line consistent-return
  const reducer = (state, action) => {
    if (action.id !== 'reset') return { ...state, [action.id]: action.value };
    if (action.id === 'reset') return searchInit;
  };
  const [state, setState] = useReducer(reducer, searchInit);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schema = Joi.object({
    email: Joi.string()
      .empty('')
      .regex(emailExpression)
      .messages({
        'string.pattern.base': t('shared.invalid-email'),
      }),
    phoneNumber: Joi.string()
      .empty('')
      .regex(phoneExpression)
      .messages({
        'string.pattern.base': t('shared.invalid-phone-number'),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getUserTypes = async () => {
    setIsLoading(true);
    const response = await GetAllRoleTypes();
    setUserTypes((response && response) || []);
    setIsLoading(false);
  };
  useEffect(() => {
    getUserTypes();
  }, []);
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (schema.error) {
          showError(t('shared.please-fix-all-errors'));
          return;
        }
        setIsSubmitted(true);
        onSearchChanged(state);
      }}
      className='advance-search-wrapper user-advance-search'
    >
      <Spinner isActive={isLoading} isAbsolute />
      <div className='mb-3'>
        <SelectComponet
          data={[
            { id: 1, city: 'pending' },
            { id: 2, city: 'active' },
            { id: 3, city: 'deactive' },
          ]}
          value={state.userStatusId || 2}
          translationPathForData={translationPath}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          labelValue='status'
          valueInput='id'
          textInput='city'
          onSelectChanged={(value) => setState({ id: 'userStatusId', value })}
        />
      </div>
      <div className='mb-3'>
        <SelectComponet
          data={userTypes}
          emptyItem={{
            value: 0,
            text: 'select-user-type',
          }}
          value={state.userTypeId}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          labelValue='user-type'
          valueInput='rolesId'
          textInput='rolesName'
          onSelectChanged={(value) => setState({ id: 'userTypeId', value })}
        />
      </div>
      <div className='mb-3'>
        <Inputs
          idRef='username'
          labelValue='UserName'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          value={state.username}
          onInputChanged={(event) => setState({ id: 'username', value: event.target.value })}
        />
      </div>
      <div className='mb-3'>
        <Inputs
          idRef='name'
          labelValue='fullName'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          value={state.name}
          onInputChanged={(event) => setState({ id: 'name', value: event.target.value })}
        />
      </div>
      <div className='mb-3'>
        <PhonesComponent
          idRef='Phone'
          labelValue='Phone'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          value={state.phoneNumber}
          helperText={getErrorByName(schema, 'phoneNumber').message}
          error={getErrorByName(schema, 'phoneNumber').error}
          inputPlaceholder='Phone'
          isSubmitted={isSubmitted}
          onInputChanged={(value) => setState({ id: 'phoneNumber', value })}
        />
      </div>
      <div className='mb-3'>
        <Inputs
          idRef='email'
          labelValue='email'
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          value={state.email}
          isWithError
          helperText={getErrorByName(schema, 'email').message}
          error={getErrorByName(schema, 'email').error}
          onInputChanged={(event) => setState({ id: 'email', value: event.target.value })}
        />
      </div>
      <div className='mb-3 px-3'>
        <Button type='submit' className='btns theme-solid w-100'>
          <span>{t(`${translationPath}search`)}</span>
        </Button>
      </div>
      <div className='mb-3 px-2'>
        <Button
          className='btns theme-transparent w-100'
          onClick={() => {
            setState({ id: 'reset' });
            onSearchChanged(searchInit);
          }}
        >
          <span>{t(`${translationPath}clear`)}</span>
        </Button>
      </div>
    </form>
  );
};
export { AdvanceSearchUser };
AdvanceSearchUser.propTypes = {
  onSearchChanged: PropTypes.func.isRequired,
};
