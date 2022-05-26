import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Spinner, Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { getDownloadableLink, GetParams } from '../../../../../../Helper';
import { GetAllScopeDocuments } from '../../../../../../Services';
import { TemplatesPreviewDialog } from '../../../../TemplatesView/Dialogs';
import { UnitDocumentsDialog } from '../../../../UnitsView/UnitsProfileManagementView/Dialogs/UnitDocumentsDialog'; 
import { DeleteDocumentDialog } from '../../../../UnitsView/UnitsProfileManagementView/Sections/UnitProfileDocumentsComponent/DeleteDocumentDialog';

export const UnitProfileDocumentsComponent = ({
  parentTranslationPath,
  translationPath,
  propertiesId,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [activeItem, setActiveItem] = useState(null);

  const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);

  const [response, setResponse] = useState({ result: [], totalCount: 0 });
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const getDocumentByFormId = useCallback(
    async (UnitId) => {
      //* *************** */
      setIsLoading(true);
      const result = await GetAllScopeDocuments({ ...filter, scopeId: UnitId });
      // setresponse(
      //   (result && {
      //     ...result,
      //     unitJson:
      //       (result.unitJson &&
      //         Object.entries(result.unitJson).reduce((total, item) => {
      //           if (item[0] !== 'selected')
      //             total = total.concat(item[1].map((element) => ({ ...element, key: item[0] })));
      //           return total;
      //         }, [])) ||
      //       [],
      //   }) ||
      //   []
      // );
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

      setIsLoading(false);
    },
    [filter]
  );

  useEffect(() => {
    const editId = GetParams('id');
    if (editId !== null) getDocumentByFormId(editId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const tableActionClicked = useCallback((actionEnum, item) => {
    setActiveItem({
      templateFileId: item.documentId || item.uuid || item.fileId || null,
      templateFileName: item.documentName || item.fileName || item.fullfileName,
      templateText: '',
      scopeDocumentId: item.scopeDocumentId,
      documentName: item.documentName,
      documentId: item.documentId,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
        });
    if (actionEnum === TableActions.openFile.key)
      setIsOpenPreviewDialog(true);

      if (actionEnum === TableActions.editText.key)
    setOpenDocumentDialog(true);
    
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
        setActiveItem(null)
      } catch (error) { }
    } 
  }, []);

  return (
    <div className='unit-profile-documents-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section'>
        <span>{t(`${translationPath}documents`)}</span>
      </div>
      <div className='mb-2'>
        <ButtonBase className='btns theme-solid' onClick={() => setOpenDocumentDialog(true)}>
          <span className='mdi mdi-plus' />
          <span>{t(`${translationPath}add-new`)}</span>
        </ButtonBase>
      </div>
      <div className='w-100 px-2 mb-2'>
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
          totalItems={response && response.totalCount}
        />
        {
          openDocumentDialog && (
            <UnitDocumentsDialog
              open={openDocumentDialog}
              onSave={() => {
                setFilter((item) => ({ ...item, pageIndex: 0 }));
                setOpenDocumentDialog(false);
                setActiveItem(null);
              }}
              close={() => {
                setOpenDocumentDialog(false);
                setActiveItem(null);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              activeItem={activeItem}
            />
          )

        }
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
          />
        )}
      </div>
    </div>
  );
};
UnitProfileDocumentsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
