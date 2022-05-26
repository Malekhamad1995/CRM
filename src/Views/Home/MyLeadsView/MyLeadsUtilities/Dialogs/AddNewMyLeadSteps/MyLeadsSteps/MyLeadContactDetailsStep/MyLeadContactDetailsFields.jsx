import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  AutocompleteComponent,
  CheckboxesComponent,
  Inputs,
  SelectComponet,
} from '../../../../../../../../Components';
import { MyLeadsTypesEnum } from '../../../../../../../../Enums';
import { getErrorByName } from '../../../../../../../../Helper';
import { MobileNumberComponent } from '../../../../../Component/FieldsComponent/index';
import { EmailComponent } from '../../../../../Component/FieldsComponent/EmailComponent';

const parentTranslationPath = 'MyLeadView';
const translationPath = '';
export const MyLeadContactDetailsFields = ({
  data,
  state,
  schema,
  selected,
  setState,
  loadings,
  isQuickAdd,
  isSubmitted,
  onStateChangeHandler,
  setFilter,
  onSelectedChangeHandler,
  labelClasses,
  setNumber,
  onSearchUsers
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const itemRegex = new RegExp('^[A-Za-z ]*$');
  const [firstNameHelperText, setFirstNameHelperText] = useState('');
  const [lastNameHelperText, setLastNameHelperText] = useState('');

  useEffect(() => {
    if (state.isForAutoRotation === true) {
      onStateChangeHandler('referredTo', null);
      onSelectedChangeHandler('referredTo', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isForAutoRotation]);

  return (
    <div className='dialog-content-wrapper'>
      <div className='form-item form-item-two-fields'>
        <SelectComponet
          labelClasses={labelClasses}
          idRef='salutationRef'
          labelValue='salutation'
          data={data.salutation}
          value={state.salutationId}
          valueInput='lookupItemId'
          textInput='lookupItemName'
          helperText={getErrorByName(schema, 'salutationId').message}
          error={getErrorByName(schema, 'salutationId').error}
          isWithError
          isSubmitted={isSubmitted}
          translationPath={translationPath}
          wrapperClasses='over-input-select w-auto salutation-select'
          translationPathForData={translationPath}
          parentTranslationPath={parentTranslationPath}
          onSelectChanged={(newValue) => onStateChangeHandler('salutationId', newValue)}
        />
        <Inputs
          idRef='portfolioNameRef'
          labelValue='first-name'
          labelClasses={labelClasses}
          helperText={firstNameHelperText || getErrorByName(schema, 'firstName').message}
          error={firstNameHelperText !== '' || getErrorByName(schema, 'firstName').error}
          isWithError
          isSubmitted={isSubmitted}
          value={state.firstName || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            if (!itemRegex.test(event.target.value))
              setFirstNameHelperText('First name is incorrect way');
            else
              setFirstNameHelperText('');
            onStateChangeHandler('firstName', event.target.value);
          }}

        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='portfolioNameRef'
          labelValue='last-name'
          labelClasses={labelClasses}
          helperText={lastNameHelperText || getErrorByName(schema, 'lastName').message}
          error={lastNameHelperText !== '' || getErrorByName(schema, 'lastName').error}
          isWithError
          isSubmitted={isSubmitted}
          value={state.lastName || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            if (!itemRegex.test(event.target.value))
              setLastNameHelperText('Last name is incorrect way');
            else
              setLastNameHelperText('');
            onStateChangeHandler('lastName', event.target.value);
          }}

        />
      </div>
      <div className='form-item'>
        <MobileNumberComponent
          mobileNumbers={state.mobileNumbers}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setNumber={(value) => {
            onStateChangeHandler('mobileNumbers', value || null);
            // setState && setState({ id: 'phoneNumber', value: event || null });
          }}
        />
      </div>
      <div className='form-item'>
        <EmailComponent
          emailAddresses={state.emailAddresses}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setEmail={(value) => {
            onStateChangeHandler('emailAddresses', value || null);
            // setState({ id: 'emailAddress', value: event || null });
          }}
          isSubmitted={isSubmitted}
          helperText={getErrorByName(schema, 'emailAddresses').message}
          error={getErrorByName(schema, 'emailAddresses').error}
        />
      </div>
      <div className='form-item'>
        <SelectComponet
          idRef='salutationRef'
          labelValue='language'
          labelClasses={labelClasses}
          data={data.language}
          helperText={getErrorByName(schema, 'languageId').message}
          error={getErrorByName(schema, 'languageId').error}
          isWithError
          isSubmitted={isSubmitted}
          value={state.languageId}
          valueInput='lookupItemId'
          textInput='lookupItemName'
          translationPath={translationPath}
          wrapperClasses='over-input-select w-100'
          translationPathForData={translationPath}
          parentTranslationPath={parentTranslationPath}
          onSelectChanged={(newValue) => onStateChangeHandler('languageId', newValue)}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          multiple={false}
          labelClasses={labelClasses}
          withoutSearchButton
          idRef='nationalityRef'
          data={data.nationality}
          helperText={getErrorByName(schema, 'nationalityId').message}
          error={getErrorByName(schema, 'nationalityId').error}
          isWithError
          isSubmitted={isSubmitted}
          value={state.nationalityId}
          labelValue='nationality'
          isLoading={loadings.nationality}
          translationPath={translationPath}
          selectedValues={selected.nationality}
          parentTranslationPath={parentTranslationPath}
          displayLabel={(option) => option.lookupItemName || ''}
          renderOption={(option) => option.lookupItemName || ''}
          onChange={(event, newValue) => {
            onSelectedChangeHandler('nationality', newValue);
            onStateChangeHandler('nationalityId', newValue && newValue.lookupItemId);
          }}
        />
      </div>
      {isQuickAdd && (
        <div className='form-item'>
          <SelectComponet
            valueInput='id'
            labelClasses={labelClasses}
            idRef='salutationRef'
            helperText={getErrorByName(schema, 'leadClassId').message}
            error={getErrorByName(schema, 'leadClassId').error}
            isWithError
            isSubmitted={isSubmitted}
            labelValue='lead-class'
            data={MyLeadsTypesEnum}
            value={state.leadClassId}
            textInput="value"
            translationPath={translationPath}
            wrapperClasses='over-input-select w-100'
            translationPathForData={translationPath}
            parentTranslationPath={parentTranslationPath}
            onSelectChanged={(newValue) => {
            //  onStateChangeHandler('leadClassId', newValue);
              onStateChangeHandler('edit', { ...state, leadClassId: newValue, referredTo: null });
              onSelectedChangeHandler('edit', { ...selected, referredTo: null });
            }}
          />
        </div>
      )}
      <div className={(!state.isForAutoRotation && 'form-item') || 'form-item-case'}>
        <CheckboxesComponent
          idRef='RotationRef'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          label='Rotation'
          singleChecked={state.isForAutoRotation}
          themeClass='theme-secondary'
          onSelectedCheckboxClicked={() =>
            onStateChangeHandler('isForAutoRotation', !state.isForAutoRotation)}
        />
        {!state.isForAutoRotation && (
          <AutocompleteComponent
            idRef='referredToRef'
            labelValue='referredTo'
            multiple={false}
            data={data.users}
            value={state.referredTo}
            displayLabel={(option) => option.fullName}
            withoutSearchButton
            inputPlaceholder={t(`${translationPath}selectreferred`)}
            isSubmitted={isSubmitted}
            helperText={getErrorByName(schema, 'referredTo').message}
            error={getErrorByName(schema, 'referredTo').error}
            isWithError
           // onInputKeyUp={(e) => setFilter(e)}
            onInputChange={(e) => {
              if (e && e.target && e.target.value)
                onSearchUsers(e.target.value);
            }}
            isLoading={loadings.users}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            selectedValues={selected.referredTo}
            onChange={(event, newValue) => {
              onSelectedChangeHandler('referredTo', newValue);
              onStateChangeHandler('referredTo', newValue && newValue.id);
            }}
          />
        )}
      </div>
    </div>
  );
};
MyLeadContactDetailsFields.propTypes = {
  setState: PropTypes.func.isRequired,
  isQuickAdd: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  loadings: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  setNumber: PropTypes.func.isRequired,
  onSearchUsers: PropTypes.func.isRequired,
};
