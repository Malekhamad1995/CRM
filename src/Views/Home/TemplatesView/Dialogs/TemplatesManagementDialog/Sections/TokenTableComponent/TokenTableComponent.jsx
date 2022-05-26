import React, { useCallback, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Inputs, Tables } from '../../../../../../../Components';
import { getErrorByName, showError } from '../../../../../../../Helper';
import { TableActions } from '../../../../../../../Enums';

export const TokenTableComponent = ({
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const reducer = useCallback((reducerState, action) => {
    if (action.id !== 'edit') return { ...reducerState, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 250,
  });
  const [localState, setLocalState] = useReducer(reducer, {
    templateTokenKey: null,
    templateTokenValue: null,
  });
  const schema = Joi.object({
    templateTokenKey: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}key-is-required`),
        'string.empty': t(`${translationPath}key-is-required`),
      }),
    templateTokenValue: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}value-is-required`),
        'string.empty': t(`${translationPath}value-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(localState);
  const tableActionClicked = useCallback(
    (actionEnum, item, index) => {
      if (actionEnum === TableActions.deleteText.key) {
        const localTemplateTokens = (state.templateTokens && [...state.templateTokens]) || [];
        localTemplateTokens.splice(index, 1);
        if (onStateChanged) onStateChanged({ id: 'templateTokens', value: localTemplateTokens });
      }
    },
    [onStateChanged, state.templateTokens]
  );
  const addTokenHandler = () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    if (
      state.templateTokens.findIndex(
        (items) =>
          items.templateTokenKey === localState.templateTokenKey &&
          items.templateTokenValue === localState.templateTokenValue
      ) !== -1
    ) {
      showError(t(`${translationPath}cannot-add-same-key-and-value-twice`));
      return;
    }
    const localTemplateTokens = (state.templateTokens && [...state.templateTokens]) || [];
    localTemplateTokens.push(localState);
    if (onStateChanged) onStateChanged({ id: 'templateTokens', value: localTemplateTokens });
    setTimeout(() => {
      setIsSubmitted(false);
    });
    setLocalState({
      id: 'edit',
      value: {
        templateTokenKey: null,
        templateTokenValue: null,
      },
    });
  };
  const activePageChanged = useCallback((event, pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  }, []);
  const itemsPerPageChanged = useCallback((event, newItemsPerPage) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize: newItemsPerPage.props.value }));
  }, []);
  return (
    <div className='token-table-wrapper childs-wrapper'>
      <div className='form-item'>
        <Inputs
          idRef='templateTokenKeyRef'
          labelValue='key'
          value={localState.templateTokenKey || ''}
          helperText={getErrorByName(schema, 'templateTokenKey').message}
          error={getErrorByName(schema, 'templateTokenKey').error}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            setLocalState({ id: 'templateTokenKey', value: event.target.value });
          }}
        />
        <span className='mdi mdi-chevron-right mr-2-reversed ml-3-reversed mt-3 pt-2 c-gray-dark' />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='templateTokenValueRef'
          labelValue='value'
          value={localState.templateTokenValue || ''}
          helperText={getErrorByName(schema, 'templateTokenValue').message}
          error={getErrorByName(schema, 'templateTokenValue').error}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            setLocalState({ id: 'templateTokenValue', value: event.target.value });
          }}
        />
        <span className='mdi mdi-chevron-right mx-2 mr-2-reversed ml-3-reversed mt-3 pt-2 c-gray-dark' />
      </div>
      <div className='form-item pt-1'>
        <ButtonBase className='btns theme-solid mt-3 mx-0' onClick={addTokenHandler}>
          <span>{t(`${translationPath}add`)}</span>
        </ButtonBase>
      </div>
      <Tables
        data={state.templateTokens}
        headerData={[
          {
            id: 1,
            label: 'key',
            input: 'templateTokenKey',
          },
          {
            id: 2,
            label: 'value',
            input: 'templateTokenValue',
          },
        ]}
        defaultActions={[
          {
            enum: TableActions.deleteText.key,
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        activePageChanged={activePageChanged}
        itemsPerPageChanged={itemsPerPageChanged}
        //isOriginalPagination
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={(state.templateTokens && state.templateTokens.length) || 0}
      />
    </div>
  );
};

TokenTableComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
