import React, {
 useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import Joi from 'joi';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DataFileAutocompleteComponent,
  DialogComponent,
  SelectComponet,
} from '../../../../Components';
import { SharedVirtualTour, GetLeads } from '../../../../Services';
import { getErrorByName, showError, showSuccess } from '../../../../Helper';
import { ShareTourEnum } from '../../../../Enums';

export const VirtualTourDilaog = ({
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    leadId: null,
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    leadId: false,
  });
  const [data, setData] = useReducer(reducer, {
    leadId: [],
  });
  const defaultState = {
    unitId: null,
    leadId: null,
    communicationType: null,
  };
  const [state, setState] = useReducer(reducer, defaultState);
  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          unitId: activeItem && activeItem.id,
          leadId: null,
        },
      });
    }
  }, [activeItem]);
  const schema = Joi.object({
    leadId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}lead-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

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

  const saveHandler = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      if (schema.error) {
        showError(t('Shared:please-fix-all-errors'));
        return;
      }
      const res = await SharedVirtualTour(state);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t(`${translationPath}portfolio-created-successfully`));
        isOpenChanged();
      } else showError(t(`${translationPath}portfolio-create-failed`));
    },
    [isOpenChanged, schema.error, state, t, translationPath]
  );

  return (
    <DialogComponent
      titleText='virtual-tour'
      saveText='share'
      saveType='button'
      maxWidth='sm'
      dialogContent={(
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
              onChange={(event, newValue) => {
                setSelected({
                  id: 'leadId',
                  value: (newValue && newValue) || null,
                });
                setState({
                  id: 'leadId',
                  value: (newValue && newValue.leadId) || null,
                });
              }}
            />
          </div>
          <div className='form-item mb-3'>
            <SelectComponet
              data={ShareTourEnum}
              valueInput='key'
              textInput='value'
              labelValue='share-via'
              idRef='relatedToTypeRef'
              onSelectChanged={(newValue) => {
                setState({
                  id: 'communicationType',
                  value: (newValue && newValue) || null,
                });
              }}
              value={state.communicationType}
              translationPath={translationPath}
              wrapperClasses='over-input-select w-100'
              translationPathForData={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSaveClicked={saveHandler}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
    />
  );
};
VirtualTourDilaog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
