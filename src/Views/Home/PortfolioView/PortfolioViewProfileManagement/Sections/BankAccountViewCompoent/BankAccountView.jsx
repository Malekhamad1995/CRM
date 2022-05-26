import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Tables, Spinner, DialogComponent } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import {
  GetAllPortfolioBankAccountByPortfolioId,
  DeletePortfolioBankAccount,
} from '../../../../../../Services';
import { GetParams, showSuccess } from '../../../../../../Helper';
import { BankAccountDialog } from './Dialogs/BankAccountDialog';

export const BankAccountView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [activeCompanyItem, setActiveCompanyItem] = useState(null);
  const [PortfolioId, SetPortfolioId] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  useEffect(() => {
    SetPortfolioId(+GetParams('id'));
  }, []);

  const GetAllPortfolioBankAccountByPortfolio = useCallback(
    async (PortfolioId) => {
      setLoading(true);
      if (PortfolioId) {
        const result = await GetAllPortfolioBankAccountByPortfolioId(
          PortfolioId,
          filter.pageIndex,
          filter.pageSize
        );
        if (!(result && result.status && result.status !== 200)) setResponse(result);
        else setResponse({});
      }
      setLoading(false);
    },
    [filter]
  );

  useEffect(() => {
    GetAllPortfolioBankAccountByPortfolio(PortfolioId);
  }, [GetAllPortfolioBankAccountByPortfolio, PortfolioId]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const tableActionClicked = useCallback(async (actionEnum, item) => {
    setActiveCompanyItem(item);

    if (actionEnum === TableActions.delete.key)
      setOpenDialogDlete(true);
     else if (actionEnum === TableActions.edit.key) {
      setopenDialog(true);
      setisEdit(true);
    }
  }, []);

  const DleteAccount = useCallback(async (portfolioBankAccountId) => {
    await DeletePortfolioBankAccount(portfolioBankAccountId);
    showSuccess(t(`${translationPath}SuccessDlete`));
    setOpenDialogDlete(false);
    await GetAllPortfolioBankAccountByPortfolio(PortfolioId);
  }, []);

  const reloadData = (PortfolioId) => {
    GetAllPortfolioBankAccountByPortfolio(PortfolioId);
  };

  return (
    <div className='associated-contacts-wrapper childs-wrapper properties-finance-wrapper'>
      <Spinner isActive={loading} />
      <div className='title-section'>
        <span>{t(`${translationPath}Bankaccounts`)}</span>
      </div>
      <div className='w-100 px-2'>
        <div className='d-flex mb-2 w-100 filter-wrapper'>
          <ButtonBase
            className='btns theme-solid'
            onClick={() => {
              setopenDialog(true);
              setisEdit(false);
            }}
          >
            <span className='mdi mdi-plus' />
            <span>{t(`${translationPath}AddNew`)}</span>
          </ButtonBase>
        </div>
        {' '}
      </div>
      <Tables
        data={response ? response.result : []}
        headerData={[
          {
            id: 1,
            label: t(`${translationPath}Landlord`),
            input: 'contactName',
          },
          {
            id: 2,
            label: t(`${translationPath}AccTitle`),
            input: 'accountTitle',
          },
          {
            id: 3,
            label: t(`${translationPath}AccNo`),
            input: 'accountNo',
          },
          {
            id: 4,
            label: t(`${translationPath}Bank`),
            input: 'bankName',
          },
          {
            id: 5,
            label: t(`${translationPath}Currency`),
            input: 'currencyName',
          },
          {
            id: 6,
            label: t(`${translationPath}Balance`),
            input: 'startingBalance',
          },
        ]}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        defaultActions={[
          {
            enum: TableActions.openFile.key,
            isDisabled: false,
            externalComponent: null,
          },
          {
            enum: TableActions.delete.key,
            isDiabled: false,
            externalComponent: null,
          },
          {
            enum: TableActions.edit.key,
            isDiabled: false,
            externalComponent: null,
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={response ? response.totalCount : 0}
      />
      {openDialog && (
        <BankAccountDialog
          open={openDialog}
          isEdit={isEdit}
          activeItem={activeCompanyItem}
          close={() => { setopenDialog(false); setisEdit(false); }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          reloadData={() => {
            GetAllPortfolioBankAccountByPortfolio(PortfolioId);
            setisEdit(false);
          }}
        />
      )}
      <DialogComponent
        isOpen={openDialogDlete}
        onCancelClicked={() => setOpenDialogDlete(false)}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleText='Accountdelte'
        onSubmit={(e) => {
          e.preventDefault();
          DleteAccount(activeCompanyItem.portfolioBankAccountId);
          reloadData(PortfolioId);
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}AreYousherdelteAccount`)}</span>}
      />
    </div>
  );
};
