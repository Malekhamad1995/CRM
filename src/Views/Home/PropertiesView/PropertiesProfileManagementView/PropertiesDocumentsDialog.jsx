import React, { useCallback, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Button, DialogTitle, DialogContent, DialogActions, Dialog
} from '@material-ui/core';
import Joi from 'joi';
import {
    showError, showSuccess, getErrorByName, GetParams
} from '../../../../Helper';
import { Spinner, AutocompleteComponent } from '../../../../Components';
import { lookupItemsGetId, CreateScopeDocument, UpdateScopeDocument, GetScopeCategoryDocuments } from '../../../../Services';
import { UnitsDocuments } from '../../../../assets/json/StaticLookupsIds.json';
import { UploadDialog } from '../../UnitsView/UnitsProfileManagementView/Dialogs/UploadDialog';
import { ScopeDocumentEnum } from '../../../../Enums';

const parentTranslationPath = 'PropertiesProfileManagementView';
const translationPath = '';
export const PropertiesDocumentsDialog = ({
    open,
    close,
    activeItem,
    onSave,
}) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [propertiesDocumentsFiles, setPropertiesDocumentsFiles] = useState([]);
    const [propertiesId, setPropertiesId] = useState(0);
    const [categoryFiles, setCategoryFiles] = useState([]);
    const [categoryFilesFilter, setCategoryFilesFilter] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [disabledAttchment, setDisabledAttchment] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [isEdit] = useState(activeItem?true:false);
    const [initialState, setSelectItem] = useState({
        selected: []
    });
    const [categoryDocumentsData, setCategoryDocumentsData] = useState([]);

    const schema = Joi.object({
        selected: Joi.array()
            .required()
            .min(1)
            .messages({
                'array.empty': t(`${translationPath}properties-document-is-required`),
                'array.min': t(`${translationPath}properties-document-is-required`),
            }),
    })
        .options({
            abortEarly: false,
            allowUnknown: true,
        })
        .validate(initialState);

    const lookupPropertiesDocumentsFiles = useCallback(async () => {
        setIsLoading(true);
        const result = await lookupItemsGetId({
            lookupTypeId: UnitsDocuments, // Lookups.,
        });
        if (!(result && result.status && result.status !== 200))
            setPropertiesDocumentsFiles(result);
        else
            setPropertiesDocumentsFiles([]);
        setIsLoading(false);
    }, []);

    const getObject = useCallback(async (e) => {
        // eslint-disable-next-line prefer-const
        let list = [];
        Object.entries(e).map(([key, value]) => {
            // eslint-disable-next-line no-unused-vars
            if (key !== 'selected') {
                const category = { categoryId: null, files: [] };
                const found = e && e.selected && e.selected.find((item) => item.lookupItemName === key);
                if (found) {
                    category.categoryId = found.lookupItemId;
                    category.files = value;
                    list.push(category);
                }
            }
        });
        setCategoryFiles(list || []);
    }, []);

    useEffect(() => {
        lookupPropertiesDocumentsFiles();
    }, [lookupPropertiesDocumentsFiles]);


    useEffect(()=>{
      if(isEdit&&propertiesId){
        getScopeCategoryDocuments();
      }
    },[activeItem,propertiesId])



    const getScopeCategoryDocuments = useCallback(async () => {
      setIsLoading(true);

      const body = {categoryId : +(activeItem.categoryId),
       scopeId : propertiesId,
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
  

    const saveHandler = useCallback(async () => {
        setIsLoading(true);
        const chackCategoryFiles = categoryFiles && categoryFiles.length > 0 ? categoryFiles.filter((o1) => categoryFilesFilter.find((o2) => o2.lookupItemId === o1.categoryId)) : [];
        if (chackCategoryFiles && chackCategoryFiles.length > 0) {
            chackCategoryFiles.map((item) => {
                const list = [];
                item.files.map((item2) => {
                    list.push({
                        fileId: (item2.uuid || item2.fileId),
                        fileName: item2.fileName
                    });
                });
                item.files = list;
            });
        }
        const addOrEdit = {
            scopeId: +propertiesId,
            scopeTypeId: ScopeDocumentEnum.Property.scopeTypeId,
            categoryFiles: chackCategoryFiles
        };
        if (chackCategoryFiles && chackCategoryFiles.length === 0) {
            showError(t('select-doucument-and-upload-his-files'));
            setIsLoading(false);
            return;
        }
        const haveNotCategoryFiles = (categoryFiles.length > 0 ? categoryFiles.some((o1) => o1.files.length === 0) : true);
        const haveCategoryFiles = categoryFiles.length > 0;
        const DocumentNotHaveFiles = haveCategoryFiles && initialState.selected.filter((o) => !categoryFiles.find((o2) => o.lookupItemId === o2.categoryId));

        if (haveNotCategoryFiles || (DocumentNotHaveFiles.length > 0)) {
            showError(t('select-doucument-and-upload-his-files'));
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const res =
          (activeItem &&
            activeItem.categoryId &&
            (await UpdateScopeDocument(addOrEdit))) ||
          (await CreateScopeDocument(addOrEdit));

          setIsLoading(false);        
          
          if (!(res && res.status && res.status !== 200)) {
            if (!activeItem) showSuccess(t`${translationPath}Create-propertie-doucument-successfully`);
            else showSuccess(t`${translationPath}Edit-propertie-doucument-successfully`);
            onSave();
        } else if (res && res.data && res.data.Message && res.data.Message === '/CrmDfm/ScopeDocument/CreateScopeDocument : SCOPE_IMAGE_ALREADY_EXISTS_PLEASE_UPDATE_THIS_UNIT_IMAGE')
            showError(t('SCOPE_IMAGE_ALREADY_EXISTS_PLEASE_UPDATE_THIS_UNIT_IMAGE'));
        else showError(t('Shared:Server-Error'));

        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState]);

    useEffect(() => {
        setPropertiesId(+GetParams('id'));
    }, []);

    
    const findActiveItemLookup = ()=>{
      const activeItemLookup =  (propertiesDocumentsFiles && propertiesDocumentsFiles.length > 0 && propertiesDocumentsFiles.find((item)=>item.lookupItemName===activeItem.categoryName)) || null;
        
      return activeItemLookup;
    }

    const getActiveItemDocuments = (categoryName) =>{
      
      const files = (categoryDocumentsData&&categoryDocumentsData.length>0&&categoryDocumentsData.map(item=>(
        {
          "uuid": item.documentId,
          "fileName": item.documentName
        }
      )))||[];
    
      
        const activeItemDocuments = (categoryName&&{ 
          [categoryName] : files
        } )|| {}
        return activeItemDocuments;
    
    } 

  useEffect(()=>{
    if (activeItem) {
        const activeItemDocuments = getActiveItemDocuments(activeItem.categoryName)
        if(activeItemDocuments){
            const newValue = activeItemDocuments;
            setSelectItem({ ...newValue, selected: [] });
            getObject(newValue);
        }

        const activeItemLookup = findActiveItemLookup();

        if (activeItemLookup){
            const newValue = [activeItemLookup]

            setCategoryFilesFilter(newValue || []);
            if (newValue && newValue.length > 0) {
                setDisabledAttchment(true);
                setSelectItem((item) => ({ ...item, selected: newValue }));
            } else {
                setDisabledAttchment(false);
                setSelectItem((item) => ({ ...item, selected: [] }));
            }
        }
    }
  },[activeItem,propertiesDocumentsFiles,categoryDocumentsData])

    return (
      <div>
        <Dialog
          open={open}
          fullWidth
          maxWidth='md'
          className='Documents-dialog-wrapper'
          disableBackdropClick
          onClose={() => {
                    close();
                }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        >
          <Spinner isActive={isLoading} isAbsolute />
          <form
            noValidate
          >
            <DialogTitle>
              {!activeItem ?
                            t(`${translationPath}add-property-Documents-files`) :
                            t(`${translationPath}edit-property-Documents-files`)}
            </DialogTitle>
            <DialogContent>
              <AutocompleteComponent
                isDisabled={isEdit}
                idRef='propertiesDocuments'
                labelValue='propertie-Documents'
                data={propertiesDocumentsFiles || []}
                displayLabel={(option) => (option && option.lookupItemName) || ''}
                chipsLabel={(option) => (option && option.lookupItemName) || ''}
                withoutSearchButton
                selectedValues={initialState.selected}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                                setCategoryFilesFilter(newValue || []);
                                if (newValue && newValue.length > 0) {
                                    setDisabledAttchment(true);
                                    setSelectItem((item) => ({ ...item, selected: newValue }));
                                } else {
                                    setDisabledAttchment(false);
                                    setSelectItem((item) => ({ ...item, selected: [] }));
                                }
                            }}
                buttonOptions={{
                                className: 'btns-icon theme-solid bg-blue-lighter',
                                iconClasses: 'mdi mdi-attachment',
                                isDisabled: !disabledAttchment,
                                isRequired: false,
                                onActionClicked: () => {
                                    if (disabledAttchment)
                                        setOpenUploadDialog(true);
                                    else
                                        setOpenUploadDialog(false);
                                },
                            }}
                hideDeleteMark={!isEdit}
                isWithError
                helperText={getErrorByName(schema, 'selected').message}
                error={getErrorByName(schema, 'selected').error}
              />
            </DialogContent>
            <DialogActions>
              <Button className='btns theme-solid bg-cancel' onClick={() => close(false)}>
                {t(`${translationPath}Cancel`)}
              </Button>
              <Button
                className='btns theme-solid'
                variant='contained'
                onClick={() => saveHandler()}
              >
                {t(`${translationPath}save`)}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {openUploadDialog && (
        <UploadDialog
          open={openUploadDialog}
          onChange={(e) => {
                        //  onValueChanged({ ...e, selected: itemValue.selected });
                        setSelectItem({ ...e, selected: e.selected });
                        getObject(e);
                    }}
          initialState={initialState}
          closeDialog={() => {
                        setOpenUploadDialog(false);
                    }}
          activeItem={activeItem}
        />
            )}

      </div>
    );
};

PropertiesDocumentsDialog.propTypes = {
    open: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    activeItem: PropTypes.instanceOf(Object),

};
PropertiesDocumentsDialog.defaultProps = {
    activeItem: null,

};
