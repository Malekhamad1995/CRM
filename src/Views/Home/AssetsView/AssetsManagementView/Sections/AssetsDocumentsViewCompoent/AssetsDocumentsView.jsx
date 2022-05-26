import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import {
  DialogComponent,
  PaginationComponent,
  Spinner,
  Tables,
} from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { DleteDocumentById, GetAllDocumentsByAssetId } from '../../../../../../Services';
import {
  bottomBoxComponentUpdate,
  getDownloadableLink,
  GetParams,
  showSuccess,
} from '../../../../../../Helper';
import { AssetsDocumentsDialog } from './AssetsDocumentsDialog/AssetsDocumentsDialog';

export const AssetsDocumentsView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [response, setresponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setopen] = React.useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  const getDocument = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllDocumentsByAssetId(+GetParams('id'), filter);
    if (!(result && result.status && result.status !== 200)) setresponse(result.result);
    else setresponse([]);
    setIsLoading(false);
  }, [filter]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={response.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  useEffect(() => {
    getDocument();
  }, [getDocument]);

  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.downloadText.key) {
      try {
        const e = getDownloadableLink(item.fileId);
        window.open(e);
      } catch (error) {}
    } else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setOpenDialogDlete(true);
    }
  }, []);

  const reloadData = useCallback(() => {
    getDocument(+GetParams('id'));
  }, [getDocument]);

  const DleteDocument = useCallback(async () => {
    await DleteDocumentById(activeItem.documentId);
    showSuccess(t(`${translationPath}SuccessDlete`));
    setOpenDialogDlete(false);
    reloadData();
  }, [activeItem, reloadData, t, translationPath]);

  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />

      <div className='w-100 px-2'>
        <div className='d-flex mb-2 w-100 filter-wrapper'>
          <ButtonBase className='btns theme-solid' onClick={() => setopen(true)}>
            <span className='mdi mdi-plus' />
            <span>{t(`${translationPath}AddNew`)}</span>
          </ButtonBase>
        </div>
      </div>
      <div className='filter-section-item' />
      <div className='w-100 px-2'>
        <Tables
          data={response}
          headerData={[
            { id: 1, label: t(`${translationPath}Category`), input: 'categoryName' },
            {
              id: 2,
              label: t(`${translationPath}Title`),
              input: 'titleName',
            },
            {
              id: 3,
              label: t(`${translationPath}created-date`),
              isDate: true,
              input: 'createdOn',
            },
            {
              id: 4,
              label: t(`${translationPath}Enteredby`),
              input: 'createdBy',
            },
            {
              id: 5,
              label: t(`${translationPath}Remarks`),
              component: (item) => <span>{(item.remark && item.remark) || 'N/A'}</span>,
            },
          ]}
          defaultActions={[
            {
              enum: TableActions.deleteText.key,
              isDisabled: false,
              externalComponent: null,
            },
            {
              enum: TableActions.downloadText.key,
              isDisabled: false,
              externalComponent: null,
            },
          ]}
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response.totalCount || 0}
        />
      </div>
      <DialogComponent
        isOpen={openDialogDlete}
        onCancelClicked={() => setOpenDialogDlete(false)}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleText='Documentdelte'
        onSubmit={(e) => {
          e.preventDefault();
          DleteDocument();
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}AreYousherdelteDocumentfile`)}</span>}
      />
      {open && (
        <AssetsDocumentsDialog
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          open={open}
          reloadData={reloadData}
          close={() => setopen(false)}
        />
      )}
    </div>
  );
};

AssetsDocumentsView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
