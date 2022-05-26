import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { GetParams } from '../../../../../../Helper';
import { GetAllMaintenanceContractsAPIByPortfolio } from '../../../../../../Services';
import { MaintenanceContractsTabelView } from './MaintenanceContractsTabelView/MaintenanceContractsTabelView';
import { MaintenanceContractDialog } from './Dialogs/MaintenanceContractDialog';

export const MaintenaceContractView = ({
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [PortfolioId, SetPortfolioId] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maintenanceContracts, setMaintenanceContracts] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  useEffect(() => {
    SetPortfolioId(+GetParams('id'));
  });

  useEffect(() => {
    GetAllMaintenanceContractsByPortfolio(PortfolioId);
  }, [PortfolioId, filter]);

  const GetAllMaintenanceContractsByPortfolio = useCallback(
    async (PortfolioId) => {
      setLoading(true);
      if (PortfolioId) {
        const res = await GetAllMaintenanceContractsAPIByPortfolio(
          filter.pageIndex + 1,
          filter.pageSize,
          PortfolioId
        );

        if (!(res && res.status && res.status !== 200)) {
          setMaintenanceContracts({
            result: (res && res.result) || [],
            totalCount: (res && res.totalCount) || 0,
          });
        } else {
          setMaintenanceContracts({
            result: [],
            totalCount: 0,
          });
        }
      }
      setLoading(false);
    },
    [PortfolioId, filter]
  );

  const reloadData = () => {
    GetAllMaintenanceContractsByPortfolio(PortfolioId);
  };

  return (
    <div className='dialog-content-wrapper portfoilio-management-dialog-wrapper'>
      <div className='w-100 px-2 m-2'>
        <div className='d-flex mb-2 w-100 filter-wrapper mb-3'>
          <ButtonBase
            className='btns theme-solid'
            onClick={() => {
              setOpenDialog(true);
              setisEdit(false);
            }}
          >
            <span className='mdi mdi-plus' />
            <span>{t(`${translationPath}AddNew`)}</span>
          </ButtonBase>
        </div>

        <MaintenanceContractsTabelView
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          portfolioId={PortfolioId}
          maintenanceContracts={maintenanceContracts}
          filter={filter}
          setFilter={setFilter}
          loading={loading}
          isEdit={isEdit}
          setisEdit={setisEdit}
          reloadData={reloadData}
        />

        {openDialog && (
          <MaintenanceContractDialog
            open={openDialog}
            isEdit={isEdit}
            close={() => {
              setOpenDialog(false);
              setisEdit(false);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            reloadData={() => {
              GetAllMaintenanceContractsByPortfolio(PortfolioId);
              setOpenDialog(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

MaintenaceContractView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
