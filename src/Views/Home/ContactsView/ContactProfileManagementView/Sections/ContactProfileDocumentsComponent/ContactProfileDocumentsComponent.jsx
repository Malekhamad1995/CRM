import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import { Spinner, Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { getDownloadableLink, GetParams } from '../../../../../../Helper';
import { GetAllScopeDocuments } from '../../../../../../Services';
import { ContactProfileDocumentManagementDialog } from './Dialogs';
import { TemplatesPreviewDialog } from '../../../../TemplatesView/Dialogs';
import { DeleteDocumentDialog } from '../../../../UnitsView/UnitsProfileManagementView/Sections/UnitProfileDocumentsComponent/DeleteDocumentDialog';

export const ContactProfileDocumentsComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [response, setResponse] = useState({ result: [], totalCount: 0 });
  const [contactId] = useState((GetParams('id') && +GetParams('id')) || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const getDocumentByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllScopeDocuments({ ...filter, scopeId: contactId });
    if (!(result && result.status && result.status !== 200)) {
      setResponse({
        result: (result && result.result) || [],
        totalCount: (result && result.totalCount) || 0,
      });
    } else {
      setResponse({
        result: [],
        totalCount: 0,
      });
    }
    // setresponse(
    //   (result && {
    //     ...result,
    //     property:
    //       (result.property &&
    //         Object.entries(result.property).reduce(
    //           (total, item) =>
    //             (item[0] !== 'selected' &&
    //               total.concat(item[1].map((element) => ({ ...element, key: item[0] })))) ||
    //             total,
    //           []
    //         )) ||
    //       [],
    //   }) ||
    //   []
    // );
    setIsLoading(false);
  }, [contactId, filter]);

  useEffect(() => {
    if (contactId) getDocumentByFormId();
  }, [getDocumentByFormId, filter, contactId]);

  const tableActionClicked = useCallback((actionEnum, item) => {
    setActiveItem({
      templateFileId: item.documentId || item.uuid || item.fileId || null,
      templateFileName: item.documentName || item.fileName || item.fullfileName,
      templateText: '',
      scopeDocumentId: item.scopeDocumentId,
      documentName: item.documentName,
      categoryId: item.categoryId,
      documentId: item.documentId || item.uuid || item.fileId || null,
    });


    if (actionEnum === TableActions.openFile.key)
    setIsOpenPreviewDialog(true);

    if (actionEnum === TableActions.editText.key)
    setIsOpenManagementDialog(true);
    
    if (actionEnum === TableActions.deleteText.key)
    setIsOpenDeleteDialog(true);
    
    if (actionEnum === TableActions.downloadText.key) {
      try {
        const link = document.createElement('a');
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute('download', item.documentName);
        link.href = getDownloadableLink(item.documentId);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setActiveItem(null);
      } catch (error) { }
    }
  }, []);

  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section'>
        <span>{t(`${translationPath}documents`)}</span>
      </div>
      <div className='filter-section px-2 mb-3'>
        <div className='section'>
          <ButtonBase
            className='btns theme-solid px-3'
            onClick={() => {
              setIsOpenManagementDialog(true);
            }}
          >
            <span className='mdi mdi-plus' />
            {t(`${translationPath}add-new`)}
          </ButtonBase>
        </div>
      </div>
      <div className='w-100 px-2'>
        <Tables
          data={(response && response.result) || []}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}category`),
              input: 'categoryName'
            },
            {
              id: 2,
              label: t(`${translationPath}title`),
              input: 'documentName',
            },

            {
              id: 3,
              label: t(`${translationPath}created-date`),
              isDate: true,
              input: 'createdOn',
              dateFormat: 'DD/MM/YYYY',

            },
            {
              id: 4,
              label: t(`${translationPath}created-by`),
              input: 'createdBy',
            }]}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          defaultActions={[
            {
              enum: TableActions.openFile.key,
              isDisabled: false,
              externalComponent: null,
            },
            {
              enum: TableActions.downloadText.key,
              isDisabled: false,
              externalComponent: null,
            },
            {
              enum: TableActions.deleteText.key,
              isDisabled: false,
              externalComponent: null,
            },
            {
              enum: TableActions.editText.key,
              isDisabled: false,
              externalComponent: null,
            },
          ]}
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          // focusedRowChanged={focusedRowChanged}
          totalItems={response && response.totalCount}
        />
      </div>
      {isOpenManagementDialog && (
        <ContactProfileDocumentManagementDialog
          contactId={contactId}
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          onSave={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenPreviewDialog && (
        <TemplatesPreviewDialog
          activeItem={activeItem}
          maintitleText='FILE-VIEW'
          isOpen={isOpenPreviewDialog}
          isOpenChanged={() => {
            setIsOpenPreviewDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath='Shared'
          translationPath={translationPath}
        />
      )}
      {isOpenDeleteDialog && (
        <DeleteDocumentDialog
          activeItem={activeItem}
          open={isOpenDeleteDialog}
          close={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          onSave={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            setFilter((item) => ({ ...item, pageIndex: 0 }));
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};
ContactProfileDocumentsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
