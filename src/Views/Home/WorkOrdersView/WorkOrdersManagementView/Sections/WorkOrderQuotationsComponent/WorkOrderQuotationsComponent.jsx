import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../Components';
import { QuotationsManagementDialog, QuotationDeleteDialog } from './Dialogs';
import { TableActions } from '../../../../../../Enums';
import { GetWorkOrderQuotations } from '../../../../../../Services';

export const WorkOrderQuotationsComponent = ({ id, parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenQuotationDialog, setIsOpenQuotationDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setIsOpenQuotationDialog(true);
    } else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setIsOpenConfirm(true);
    }
  }, []);

  const getAllQuotations = useCallback(async () => {
    setIsLoading(true);
    const res = await GetWorkOrderQuotations({ workOrderId: id });
    if (!(res && res.status && res.status !== 200)) setQuotations(res || []);
    else setQuotations([]);
    setIsLoading(false);
  }, [id]);
  useEffect(() => {
    if (id) getAllQuotations();
  }, [getAllQuotations, id]);
  return (
    <div className='work-order-quotations-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex mb-3'>
        <ButtonBase
          className='btns theme-solid mx-2'
          onClick={() => setIsOpenQuotationDialog(true)}
        >
          <span className='mdi mdi-plus' />
          <span className='px-1'>{t(`${translationPath}add-quotation`)}</span>
        </ButtonBase>
      </div>
      <Tables
        data={quotations || []}
        headerData={[
          {
            id: 1,
            label: 'quote-no',
            input: 'quotationId',
          },
          {
            id: 2,
            label: 'amount',
            input: 'amount',
          },
          {
            id: 3,
            label: 'payable-by',
            input: 'payableBy',
          },
          {
            id: 4,
            label: 'approved',
            input: 'isApproved',
            component: (item) => <span>{`${item.isApproved}`}</span>,
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        defaultActions={[
          {
            enum: TableActions.approvedText.key,
          },
          {
            enum: TableActions.editText.key,
          },
          {
            enum: TableActions.deleteText.key,
          },
        ]}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={(quotations && quotations.length) || 0}
      />
      {isOpenQuotationDialog && (
        <QuotationsManagementDialog
          id={id}
          activeItem={activeItem}
          isOpen={isOpenQuotationDialog}
          reloadData={() => {
            setIsOpenQuotationDialog(false);
            setActiveItem(null);
            getAllQuotations();
          }}
          isOpenChanged={() => {
            setIsOpenQuotationDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && (
        <QuotationDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenConfirm}
          isOpenChanged={() => {
            setIsOpenConfirm(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            // setFilter((item) => ({ ...item, pageIndex: 0 }));
            setActiveItem(null);
            setIsOpenConfirm(false);
            getAllQuotations();
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

WorkOrderQuotationsComponent.propTypes = {
  id: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrderQuotationsComponent.defaultProps = {
  id: undefined,
};
