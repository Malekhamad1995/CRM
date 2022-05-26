import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  AutocompleteComponent,
  DialogComponent,
  Inputs,
  Spinner,
  UploaderComponent,
} from '../../../../../../../../Components';
import {
  AttachmentCategory,
  AttachmentTitle,
} from '../../../../../../../../assets/json/StaticLookupsIds.json';
import {
  lookupItemsGetId,
  CreateUnitTransactionDocument,
  UpdateUnitTransactionDocument,
} from '../../../../../../../../Services';
import { getErrorByName, showError, showSuccess } from '../../../../../../../../Helper';

export const DocumentsManagement = ({
  id,
  activeItem,
  reloadData,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [titles, setTitles] = useState([]);

  const [selected, setSelected] = useReducer(reducer, {
    category: null,
    title: null,
  });
  const [loadings, setLoadings] = useState({
    categories: false,
    titles: false,
  });
  const [state, setState] = useReducer(reducer, {
    fileId: null,
    fileName: null,
    unitTransactionId: id,
    categoryId: null,
    titleId: null,
    remark: null,
  });
  const schema = Joi.object({
    fileId: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}please-select-at-least-one-document`),
        'string.empty': t(`${translationPath}please-select-at-least-one-document`),
      }),
    categoryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}category-is-required`),
        'number.empty': t(`${translationPath}category-is-required`),
      }),
    titleId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}title-is-required`),
        'number.empty': t(`${translationPath}title-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getAllCategories = useCallback(async () => {
    setLoadings((items) => ({ ...items, categories: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: AttachmentCategory,
    });
    if (!(res && res.status && res.status !== 200)) setCategories(res || []);
    else setCategories([]);
    setLoadings((items) => ({ ...items, categories: false }));
  }, []);
  const getAllTitles = useCallback(async () => {
    setLoadings((items) => ({ ...items, titles: true }));
    const res = await lookupItemsGetId({
      lookupParentId: state.categoryId,
      lookupTypeId: AttachmentTitle,
    });
    if (!(res && res.status && res.status !== 200)) setTitles(res || []);
    else setTitles([]);
    setLoadings((items) => ({ ...items, titles: false }));
  }, [state.categoryId]);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (getErrorByName(schema, 'fileId').error) {
      showError(getErrorByName(schema, 'fileId').message);
      return;
    }
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res =
      (activeItem && (await UpdateUnitTransactionDocument(activeItem.documentId, state))) ||
      (await CreateUnitTransactionDocument(state));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem) showSuccess(t`${translationPath}document-updated-successfully`);
      else showSuccess(t`${translationPath}document-created-successfully`);
      reloadData();
    } else if (activeItem) showError(t(`${translationPath}document-update-failed`));
    else showError(t`${translationPath}document-create-failed`);
  };
  const getEditInit = useCallback(() => {
    if (state.categoryId && !selected.category && categories.length > 0) {
      const categoryIndex = categories.findIndex((item) => item.lookupItemId === state.categoryId);
      if (categoryIndex !== -1) {
        selected.category = categories[categoryIndex];
        setSelected({ id: 'edit', value: selected });
        getAllTitles();
      }
    }
    if (state.titleId && !selected.title && titles.length > 0) {
      const titleIndex = titles.findIndex((item) => item.lookupItemId === state.titleId);
      if (titleIndex !== -1) {
        selected.title = titles[titleIndex];
        setSelected({ id: 'edit', value: selected });
      }
    }
  }, [categories, getAllTitles, selected, state.categoryId, state.titleId, titles]);
  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          fileId: activeItem.fileId || null,
          fileName: activeItem.fileName || null,
          unitTransactionId: id,
          categoryId: activeItem.categoryId || null,
          titleId: activeItem.titleId || null,
          remark: activeItem.remark || null,
        },
      });
    }
  }, [activeItem, id]);
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-document') || 'add-document'}
      saveText={(activeItem && 'edit-document') || 'add-document'}
      dialogContent={(
        <div className='documents-management-dialog'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='dialog-item'>
            <UploaderComponent
              idRef='documentsUploadRef'
              isOpenGallery
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              labelValue='upload-document'
              multiple={false}
              initUploadedFiles={
                (state.fileId && [
                  {
                    uuid: state.fileId,
                    fileName: state.fileName,
                  },
                ]) ||
                []
              }
              uploadedChanged={(files) => {
                setState({
                  id: 'edit',
                  value: {
                    ...state,
                    fileId: (files.length > 0 && files[0].uuid) || null,
                    fileName: (files.length > 0 && files[0].fileName) || null,
                  },
                });
              }}
            />
          </div>
          <div className='dialog-item'>
            <div className='w-100 mb-2'>
              <AutocompleteComponent
                idRef='categoryIdRef'
                labelValue='category'
                selectedValues={selected.category}
                multiple={false}
                data={categories}
                displayLabel={(option) => option.lookupItemName || ''}
                getOptionSelected={(option) => option.lookupItemId === state.categoryId}
                withoutSearchButton
                helperText={getErrorByName(schema, 'categoryId').message}
                error={getErrorByName(schema, 'categoryId').error}
                isWithError
                isLoading={loadings.categories}
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSelected({ id: 'category', value: newValue });
                  if (selected.title || state.titleId) {
                    setSelected({ id: 'title', value: null });
                    setState({ id: 'titleId', value: null });
                  }
                  if (newValue) getAllTitles();
                  else setTitles([]);

                  setState({
                    id: 'categoryId',
                    value: (newValue && newValue.lookupItemId) || null,
                  });
                }}
              />
            </div>
            <div className='w-100 mb-2'>
              <AutocompleteComponent
                idRef='titleIdRef'
                labelValue='title'
                selectedValues={selected.title}
                multiple={false}
                data={titles}
                displayLabel={(option) => option.lookupItemName || ''}
                getOptionSelected={(option) => option.lookupItemId === state.titleId}
                withoutSearchButton
                helperText={getErrorByName(schema, 'titleId').message}
                error={getErrorByName(schema, 'titleId').error}
                isWithError
                isLoading={loadings.titles}
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSelected({ id: 'title', value: newValue });
                  setState({
                    id: 'titleId',
                    value: (newValue && newValue.lookupItemId) || null,
                  });
                }}
              />
            </div>
            <div className='w-100 mb-2'>
              <Inputs
                idRef='remarkRef'
                labelValue='remarks'
                value={state.remark || ''}
                helperText={getErrorByName(schema, 'remark').message}
                error={getErrorByName(schema, 'remark').error}
                isWithError
                isSubmitted={isSubmitted}
                multiline
                rows={4}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'remark', value: event.target.value });
                }}
              />
            </div>
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

DocumentsManagement.propTypes = {
  id: PropTypes.number.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
DocumentsManagement.defaultProps = {
  activeItem: null,
};
