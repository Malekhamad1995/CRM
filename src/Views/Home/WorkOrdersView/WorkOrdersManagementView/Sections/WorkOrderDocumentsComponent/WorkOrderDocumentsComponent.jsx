import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { GetWorkOrderDocuments } from '../../../../../../Services';
import { DocumentsManagementDialog, DocumentDeleteDialog } from './Dialogs';

export const WorkOrderDocumentsComponent = ({
  id,
  toParentSender,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenDocumentDialog, setIsOpenDocumentDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [documents, setDocuments] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setIsOpenDocumentDialog(true);
    } else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setIsOpenConfirm(true);
    }
  }, []);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const getAllDocuments = useCallback(async () => {
    setIsLoading(true);
    const res = await GetWorkOrderDocuments(id, filter);
    if (!(res && res.status && res.status !== 200)) {
      setDocuments({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setDocuments({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter, id]);
  useEffect(() => {
    if (id) getAllDocuments();
  }, [getAllDocuments, id]);
  useEffect(() => {
    if (toParentSender) toParentSender('filter', filter);
  }, [filter, toParentSender]);
  useEffect(() => {
    if (toParentSender) toParentSender('setFilter', setFilter);
  }, [toParentSender]);
  useEffect(
    () => () => {
      if (toParentSender) toParentSender('filter', null);
      if (toParentSender) toParentSender('setFilter', null);
    },
    [toParentSender]
  );
  return (
    <div className='work-order-documents-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex mb-3'>
        <ButtonBase className='btns theme-solid mx-2' onClick={() => setIsOpenDocumentDialog(true)}>
          <span className='mdi mdi-plus' />
          <span className='px-1'>{t(`${translationPath}add-document`)}</span>
        </ButtonBase>
      </div>
      <Tables
        data={documents.result || []}
        headerData={[
          {
            id: 1,
            label: 'category',
            input: 'categoryName',
          },
          {
            id: 2,
            label: 'title',
            input: 'titleName',
          },
          {
            id: 3,
            label: 'created-date',
            input: 'createdOn',
            isDate: true,
          },
          {
            id: 4,
            label: 'remarks',
            input: 'remark',
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        defaultActions={[
          {
            enum: TableActions.editText.key,
          },
          {
            enum: TableActions.deleteText.key,
          },
        ]}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={documents.totalCount}
      />
      {isOpenDocumentDialog && (
        <DocumentsManagementDialog
          id={id}
          activeItem={activeItem}
          isOpen={isOpenDocumentDialog}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setIsOpenDocumentDialog(false);
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenDocumentDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && (
        <DocumentDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenConfirm}
          isOpenChanged={() => {
            setIsOpenConfirm(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setActiveItem(null);
            setIsOpenConfirm(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

WorkOrderDocumentsComponent.propTypes = {
  id: PropTypes.number,
  toParentSender: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrderDocumentsComponent.defaultProps = {
  id: undefined,
  toParentSender: undefined,
};
