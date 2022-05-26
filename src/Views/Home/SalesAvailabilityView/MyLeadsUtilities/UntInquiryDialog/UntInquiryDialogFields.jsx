import React, {
 useCallback, useEffect, useReducer, useRef
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs, SelectComponet, DataFileAutocompleteComponent } from '../../../../../Components';
import { getErrorByName } from '../../../../../Helper';
import { InquireEnum } from '../../../../../Enums';
import { UntInquiryDialogDateComponent } from './UntInquiryDialogDateComponent';
import { GetLeads } from '../../../../../Services';

export const UntInquiryDialogFields = ({
  state,
  schema,
  setState,
  selected,
  activeItem,
  setSelected,
  isSubmitted,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const getAskingPriceData = useCallback(() => {
    const askingArr = [100000, 500000];
    let counter = 1;
    while (askingArr[askingArr.length - 1] !== 7000000) {
      askingArr.push(askingArr[counter] + 50000);
      counter += 1;
    }
    askingArr.push(10000000, 15000000, 20000000);
    return askingArr;
  }, []);
  const reducer = useCallback((itemState, action) => {
    if (action.id !== 'edit') return { ...itemState, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [loadings, setLoadings] = useReducer(reducer, {
    leadId: false,
  });
  const [data, setData] = useReducer(reducer, {
    leadId: [],
  });
  const getAllLeads = useCallback(async (value) => {
    setLoadings({ id: 'leadId', value: true });
    const res = await GetLeads({ pageIndex: 0, pageSize: 25, search: value });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'leadId', value: res.result });
    else setData({ id: 'leadId', value: [] });
    setLoadings({ id: 'leadId', value: false });
  }, []);
  useEffect(() => {
    getAllLeads();
  }, [getAllLeads]);
  return (
    <div className='form-wrapper px-5'>
      <div className='px-2 mb-3'>
        <span className='fw-bold fz-15px c-primary'>
          {t(`${translationPath}unit`)}
          :
          {`  ${(activeItem && activeItem.name && activeItem.name) || 'N/A'}  `}
          {`( ${(activeItem && activeItem.id && activeItem.id) || 'N/A'} )`}
        </span>
      </div>
      <div className='form-item mb-3'>
        <DataFileAutocompleteComponent
          idRef='contactPersonRef'
          labelValue='lead'
          multiple={false}
          selectedValues={selected.leadId}
          data={(data.leadId && data.leadId) || []}
          displayLabel={(option) =>
            `${option.leadId || ''} - ${option.lead.leadClass} - ${
              option.lead.company_name ||
              (option.lead.contact_name && option.lead.contact_name.name) ||
              ''
            }`}
          withoutSearchButton
          renderFor='lead'
          helperText={getErrorByName(schema, 'leadId').message}
          error={getErrorByName(schema, 'leadId').error}
          isLoading={loadings.leadId}
          isWithError
          isSubmitted={isSubmitted}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllLeads(value);
            }, 700);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) =>
            setSelected({
              id: 'leadId',
              value: (newValue && newValue) || null,
            })}
        />
      </div>
      <div className='form-item mb-3'>
        <SelectComponet
          data={InquireEnum}
          textInput='value'
          labelValue='inquire'
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) => {
            setState({
              id: 'activityTypeId',
              value: (newValue && newValue.activityTypeId) || null,
            });
            setSelected({
              id: 'activityType',
              value: (newValue && newValue.value) || null,
            });
          }}
          value={state.communicationType}
          translationPath={translationPath}
          wrapperClasses='over-input-select w-100'
          translationPathForData={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      <div className='form-item mb-3'>
        <Inputs
          multiline
          rows={4}
          idRef='firstNameRef'
          labelValue='extra-requirements'
          value={selected.extraRequirements || ''}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) =>
            setSelected({ id: 'extraRequirements', value: event.target.value })}
        />
      </div>
      {state.activityTypeId === InquireEnum[0].activityTypeId && (
        <UntInquiryDialogDateComponent
          state={state}
          schema={schema}
          setState={setState}
          isSubmitted={isSubmitted}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {state.activityTypeId === InquireEnum[1].activityTypeId && (
        <div className='form-item mb-3'>
          <SelectComponet
            data={getAskingPriceData()}
            labelValue='asking-price'
            idRef='relatedToTypeRef'
            onSelectChanged={(newValue) =>
              setSelected({
                id: 'askingMinPrice',
                value: (newValue && newValue) || null,
              })}
            value={selected.askingMinPrice}
            translationPath={translationPath}
            wrapperClasses='over-input-select px-2 w-50'
            translationPathForData={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <SelectComponet
            data={getAskingPriceData()}
            idRef='relatedToTypeRef'
            onSelectChanged={(newValue) =>
              setSelected({
                id: 'askingMaxPrice',
                value: (newValue && newValue) || null,
              })}
            value={selected.askingMaxPrice}
            translationPath={translationPath}
            wrapperClasses='over-input-select px-2 w-50 mt-3 pt-1'
            translationPathForData={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      )}
    </div>
  );
};
UntInquiryDialogFields.propTypes = {
  setState: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
