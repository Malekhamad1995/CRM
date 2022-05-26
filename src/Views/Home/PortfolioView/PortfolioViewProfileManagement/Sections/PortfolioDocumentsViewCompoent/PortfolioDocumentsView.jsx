import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { DialogComponent, Spinner, Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { GetPortfolioDocumentById, DleteDocumentById } from '../../../../../../Services';
import { getDownloadableLink, GetParams, showSuccess } from '../../../../../../Helper';
import { PortfolioDocumentsDialog } from './PortfolioDocumentsDialog/PortfolioDocumentsDialog';

export const PortfolioDocumentsView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setopen] = React.useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [response, setresponse] = useState({
    result: [],
    totalCount: 0,
  });
  const getDocument = useCallback(async () => {
    setIsLoading(true);
    const result = await GetPortfolioDocumentById(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) {
      setresponse({
        result: (result && result.result) || [],
        totalCount: (result && result.totalCount) || 0,
      });

      setFilter({ ...filter, pageSize: result.result.length || 0 });
    } else {
      setresponse({
        result: [],
        totalCount: 0,
      });
      setFilter({ ...filter, pageSize: 0 });
    }

    setIsLoading(false);
  }, [filter]);
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.downloadText.key) {
      try {
        const e = getDownloadableLink(item.fileId);
        window.open(e);
      } catch (error) {
        console.log(error);
      }
    } else if (actionEnum === TableActions.delete.key) {
      setActiveItem(item);
      setOpenDialogDlete(true);
    }
  }, []);

  useEffect(() => {
    if (GetParams('id')) getDocument(+GetParams('id'));
  }, [getDocument]);

  const reloadData = useCallback(() => {
    getDocument(+GetParams('id'));
  }, [getDocument]);

  const DleteDocument = useCallback(
    async (item) => {
      await DleteDocumentById(item.documentId);
      showSuccess(t(`${translationPath}SuccessDlete`));
      setOpenDialogDlete(false);
      reloadData();
    },
    [reloadData, t, translationPath]
  );

  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section'>
        <span>{t(`${translationPath}Documents`)}</span>
      </div>
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
          data={response.result}
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
              enum: TableActions.delete.key,
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
          totalItems={response.totalCount}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
        />
      </div>
      <DialogComponent
        isOpen={openDialogDlete}
        onCancelClicked={() => setOpenDialogDlete(false)}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        totalItems={response.totalCount}
        titleText='Documentdelte'
        saveText='yes'
        cancelText='no'
        saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
        onSubmit={(e) => {
          e.preventDefault();
          DleteDocument(activeItem);
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}AreYousherdelteDocumentfile`)}</span>}
      />
      {open && (
        <PortfolioDocumentsDialog
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
PortfolioDocumentsView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
