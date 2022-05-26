import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { DialogComponent, Spinner, Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { DleteDocumentById, GetAllDocumentsByIncidentId } from '../../../../../../Services';
import {
 getDownloadableLink, GetParams, showError, showSuccess
} from '../../../../../../Helper';
import { PortfolioDocumentsDialog } from './IncidentsDocumentsDialog/IncidentsDocumentsDialog';

export const IncidentsDocumentsView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [response, setresponse] = useState({
    result: [],
    totalCount: 0,
  });

  const [filter, setFilter] = useState({
    pageSize: 0,
    pageIndex: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setopen] = React.useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const getDocument = useCallback(async (propertiesId) => {
    setIsLoading(true);
    const result = await GetAllDocumentsByIncidentId(propertiesId, 1, 100);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.downloadText.key) {
      try {
        const e = getDownloadableLink(item.fileId);
        window.open(e);
      } catch (error) {
        showError(t(`${translationPath}error`));
      }
    } else if (actionEnum === TableActions.delete.key) {
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
  useEffect(() => {
    const ID = +GetParams('id');
    if (ID !== null) getDocument(ID);
  }, [getDocument]);
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
              component: (item) => <span>{(item && item.remark) || 'N/A'}</span>,
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
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response.totalCount}
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

IncidentsDocumentsView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
