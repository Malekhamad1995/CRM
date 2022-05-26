import React, { useCallback, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { getErrorByName, GetParams, showError, showSuccess } from '../../../../../../../Helper';
import { DialogComponent, Spinner, UploaderComponent } from '../../../../../../../Components';
import { ContactUploadDocumentsType, CompanyUploadDocumentsType } from '../../../../../../../assets/json/StaticLookupsIds.json';
import { ContactProfileDocumentLookupsAutocomplete } from '../Controls';
import { DefaultImagesEnum, UploaderThemesEnum, ScopeDocumentEnum } from '../../../../../../../Enums';
import { CreateScopeDocument, UpdateScopeDocument, GetScopeCategoryDocuments } from '../../../../../../../Services';

export const ContactProfileDocumentManagementDialog = ({
  contactId,
  activeItem,
  onSave,
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
  const [isEdit] = useState(activeItem?true:false);
  const [categoryDocumentsData, setCategoryDocumentsData] = useState([]);
  const [state, setState] = useReducer(reducer, {
    categoryId: null,
    contactId,
    files: [],
  });
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const schema = Joi.object({
    categoryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}category-is-required`),
        'number.empty': t(`${translationPath}category-is-required`),
      }),
    files: Joi.array()
      .required()
      .min(1)
      .messages({
        'array.base': t(`${translationPath}please-select-at-least-one-document`),
        'array.empty': t(`${translationPath}please-select-at-least-one-document`),
        'array.min': t(`${translationPath}please-select-at-least-one-document`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const onSaveClicked = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);
    // eslint-disable-next-line prefer-const

    if (getErrorByName(schema, 'files').error) {
      showError(getErrorByName(schema, 'files').message);
      setIsLoading(false);
      return;
    }
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }
    // eslint-disable-next-line prefer-const
    const addOrEditDocument = {
      scopeId: +contactId,
      scopeTypeId: ScopeDocumentEnum.Contact.scopeTypeId,
      categoryFiles: [
        {
          categoryId: state.categoryId,
          files: state.files,
        }

      ]

    };
    
    setIsLoading(true);
    const res =
      (activeItem &&
        activeItem.categoryId &&
        (await UpdateScopeDocument(addOrEditDocument))) ||
      (await CreateScopeDocument(addOrEditDocument));
      setIsLoading(false);

      setIsLoading(true);
    if (!(res && res.data && res.data.ErrorId)) {
       showSuccess(t(`${translationPath}contact-document-created-successfully`));
      onSave();
    } else if (res && res.data && res.data.Message && res.data.Message === '/CrmDfm/ScopeDocument/CreateScopeDocument : SCOPE_IMAGE_ALREADY_EXISTS_PLEASE_UPDATE_THIS_UNIT_IMAGE')
    {showError(t('SCOPE_IMAGE_ALREADY_EXISTS_PLEASE_UPDATE_THIS_UNIT_IMAGE'));}
    else
    { showError(t(`${translationPath}contact-document-create-failed`));}
     setIsLoading(false);
  };

  useEffect(()=>{

    if (activeItem) {

      const files = getActiveItemFiles();

      setState({
        id: 'edit',
        value: {
          files: files,
        categoryId:  activeItem.categoryId,
        }
      })
    }
  },[activeItem, categoryDocumentsData])

  
  const getScopeCategoryDocuments = useCallback(async () => {
    setIsLoading(true);

    const body = {categoryId : +(activeItem.categoryId),
     scopeId : contactId,
     pageSize : 25,
     pageIndex : 0,
    }

    const res = await GetScopeCategoryDocuments(body);

        if (!(res && res.status && res.status !== 200)) {
          setCategoryDocumentsData(res.result)
        }else {
          setCategoryDocumentsData([])
        }
        setIsLoading(false);        

})

  useEffect(()=>{
    if(isEdit&&contactId){
      getScopeCategoryDocuments();
    }
  },[activeItem,contactId])


  const getActiveItemFiles = () =>{

    const files = (categoryDocumentsData&&categoryDocumentsData.length>0&&categoryDocumentsData.map(item=>(
      {
        "uuid": item.documentId,
        "fileName": item.documentName
      }
    )))||[];

      return files;

  } 


  return (
    <DialogComponent
      titleText={(isEdit&&t(`${translationPath}edit-documents`))||t(`${translationPath}upload-documents`)}
      saveText={(isEdit&&t(`${translationPath}save`))||t(`${translationPath}upload`)}
      saveType='button'
      maxWidth='md'
      dialogContent={(
        <div className='contact-profile-document-management-dialog d-flex-column'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='dialog-item'>
            <ContactProfileDocumentLookupsAutocomplete
              idRef='categoryIdRef'
              labelValue='category'
              stateValue={state.categoryId}
              schema={schema}
              lookupTypeId={GetParams ('formType') == '2'? CompanyUploadDocumentsType : ContactUploadDocumentsType}
              isSubmitted={isSubmitted}
              stateKey='categoryId'
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isDisabled={isEdit}
            />
          </div>
          <UploaderComponent
            labelValue={t('AddDocuments')}
            accept='*'
            multiple
            isOpenGallery
            idRef='importFileRef'
            viewUploadedFilesCount
            uploadedChanged={(files) =>
              setState({
                id: 'files',
                value:
                  (files &&
                    files.map((item) => ({
                      fileId: item.uuid,
                      fileName: item.fileName,
                    }))) ||
                  [],
              })}
            initUploadedFiles={
              (state.files &&
                state.files.length > 0 &&
                state.files.map((item) => ({
                  uuid: item.uuid,
                  fileName: item.fileName,
                }))) ||
              []
            }
            defaultImage={DefaultImagesEnum.individual.key}
            uploaderTheme={UploaderThemesEnum.input.key}
          />
        </div>
      )}
      saveClasses='btns theme-solid  w-100 mx-2 mb-2'
      isOpen={isOpen}
      onSaveClicked={onSaveClicked}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
    />
  );
};

ContactProfileDocumentManagementDialog.propTypes = {
  contactId: PropTypes.number.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ContactProfileDocumentManagementDialog.defaultProps = {
  activeItem: null,
};
