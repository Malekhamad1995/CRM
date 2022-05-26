import React from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../../Components';
import { getErrorByName } from '../../../../../../../../Helper';

const parentTranslationPath = 'MyLeadView';
const translationPath = '';
export const MyLeadLeadDetailsFields = ({
  data,
  schema,
  state,
  selected,
  loadings,
  isSubmitted,
  onStateChangeHandler,
  onSelectedChangeHandler,
  labelClasses
}) =>
(
  <div className='dialog-content-wrapper'>
    <div className='form-item'>
      <AutocompleteComponent
        multiple={false}
        labelClasses={labelClasses}
        withoutSearchButton
        idRef='nationalityRef'
        data={data.leadStatus}
        labelValue='lead-status'
        helperText={getErrorByName(schema, 'leadStatusId').message}
        error={getErrorByName(schema, 'leadStatusId').error}
        isWithError
        isSubmitted={isSubmitted}
        isLoading={loadings.leadStatus}
        translationPath={translationPath}
        selectedValues={selected.leadStatus}
        parentTranslationPath={parentTranslationPath}
        displayLabel={(option) => option.lookupItemName || ''}
        renderOption={(option) => option.lookupItemName || ''}
        onChange={(event, newValue) => {
          onSelectedChangeHandler('leadStatus', newValue);
          onStateChangeHandler('leadStatusId', newValue && newValue.lookupItemId);
          onStateChangeHandler('closedReasonId', null);
          onSelectedChangeHandler('closeLeadResoun', null);
        }}
      />
    </div>

    {state && state.leadStatusId && state.leadStatusId === 458 && (
      <div className='form-item'>
        <AutocompleteComponent
          multiple={false}
          withoutSearchButton
          idRef='closeLeadResounRef'
          data={data.closeLeadResoun}
          labelValue='closeLeadResoun'
          isLoading={loadings.closeLeadResoun}
          translationPath={translationPath}
          selectedValues={selected.closeLeadResoun}
          parentTranslationPath={parentTranslationPath}
          displayLabel={(option) => option.lookupItemName || ''}
          renderOption={(option) => option.lookupItemName || ''}
          onChange={(event, newValue) => {
            onSelectedChangeHandler('closeLeadResoun', newValue);
            onStateChangeHandler('closedReasonId', newValue && newValue.lookupItemId);
          }}
        />
      </div>
    )}
    <div className='form-item'>
      <AutocompleteComponent
        multiple={false}
        withoutSearchButton
        idRef='nationalityRef'
        labelClasses={labelClasses}
        data={data.leadRating}
        labelValue='lead-rating'
        helperText={getErrorByName(schema, 'leadRatingId').message}
        error={getErrorByName(schema, 'leadRatingId').error}
        isWithError
        isSubmitted={isSubmitted}
        isLoading={loadings.leadRating}
        translationPath={translationPath}
        selectedValues={selected.leadRating}
        parentTranslationPath={parentTranslationPath}
        displayLabel={(option) => option.lookupItemName || ''}
        renderOption={(option) => option.lookupItemName || ''}
        onChange={(event, newValue) => {
          onSelectedChangeHandler('leadRating', newValue);
          onStateChangeHandler('leadRatingId', newValue && newValue.lookupItemId);
        }}
      />
    </div>
    <div className='form-item'>
      <AutocompleteComponent
        idRef='MediaDetailRef'
        labelValue='MediaDetail'
        labelClasses={labelClasses}
        multiple={false}
        data={data.mediaName}
        displayLabel={(option) => option.lookupItemName}
        renderOption={(option) => option.lookupItemName || ''}
        withoutSearchButton
        isWithError
        isSubmitted={isSubmitted}
        helperText={getErrorByName(schema, 'mediaDetailId').message}
        error={getErrorByName(schema, 'mediaDetailId').error}
        selectedValues={selected.MediaDetail}
        inputPlaceholder='selectMediaDetail'
        isLoading={loadings.MediaDetail}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          onSelectedChangeHandler('MediaDetail', (newValue && newValue) || null);
          onStateChangeHandler('mediaDetailId', (newValue && newValue.lookupItemId) || null);
        }}
      />
    </div>
    <div className='form-item'>
      <AutocompleteComponent
        idRef='MethodOfContactRef'
        labelValue='MethodOfContact'
        multiple={false}
        labelClasses={labelClasses}
        data={data.MediaDetail}
        displayLabel={(option) => option.lookupItemName}
        renderOption={(option) => option.lookupItemName || ''}
        withoutSearchButton
        helperText={getErrorByName(schema, 'MethodOfContact').message}
        error={getErrorByName(schema, 'MethodOfContact').error}
        selectedValues={selected.mediaName}
        inputPlaceholder='selectMethodOfContact'
        isWithError
        isSubmitted={isSubmitted}
        isLoading={loadings.mediaName}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          onSelectedChangeHandler('mediaName', (newValue && newValue) || null);
          onStateChangeHandler('MethodOfContact', (newValue && newValue.lookupItemId) || null);
        }}
      />
    </div>
  </div>
);
MyLeadLeadDetailsFields.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  loadings: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
