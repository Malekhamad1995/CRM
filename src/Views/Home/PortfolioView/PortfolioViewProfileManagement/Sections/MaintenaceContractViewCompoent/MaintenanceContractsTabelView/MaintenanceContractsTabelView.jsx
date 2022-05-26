import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../../Components';
import { TableActions } from '../../../../../../../Enums';
import { MaintenanceContractDialog } from '../Dialogs/MaintenanceContractDialog';

export const MaintenanceContractsTabelView = ({
  parentTranslationPath,
  translationPath,
  maintenanceContracts,
  filter,
  setFilter,
  loading,
  isEdit,
  setisEdit,
  reloadData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeMaintenanceContract, setActiveMaintenanceContract] = useState();
  const [openDialogEdit, setOpenDialogEdit] = useState(false);

  const tableActionClicked = useCallback(async (actionEnum, item) => {
    setActiveMaintenanceContract(item);

    if (actionEnum === TableActions.edit.key) {
      setOpenDialogEdit(true);
      setisEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='dialog-content-wrapper portfoilio-management-dialog-wrapper'>
      <Spinner isActive={loading} />
      <div className='filter-section-item' />
      <div className='w-100 px-2'>
        <Tables
          data={maintenanceContracts && maintenanceContracts.result ? maintenanceContracts.result : []}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}Property`),
              input: 'propertyName',
            },
            {
              id: 2,
              label: t(`${translationPath}Company`),
              input: 'contactName',
            },
            {
              id: 3,
              label: t(`${translationPath}ContractDate`),
              input: 'contractDate',
            },
            {
              id: 4,
              label: t(`${translationPath}startDate`),
              input: 'startDate',
            },
            { id: 5, label: t(`${translationPath}endDate`), input: 'endDate' },
          ]}
          onPageIndexChanged={(e) => {
            setFilter({ ...filter, pageIndex: e });
          }}
          onPageSizeChanged={(e) => {
            setFilter({ ...filter, pageSize: e, pageIndex: 0 });
          }}
          defaultActions={[
            {
              enum: TableActions.edit.key,
              isDiabled: false,
              externalComponent: null,
            },
          ]}
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          totalItems={maintenanceContracts.totalCount}
        />

        {openDialogEdit && (
          <MaintenanceContractDialog
            open={openDialogEdit}
            isEdit={isEdit}
            activeItem={activeMaintenanceContract}
            close={() => {
              setOpenDialogEdit(false);
              setisEdit(false);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            reloadData={reloadData}
          />
        )}
      </div>
    </div>
  );
};
MaintenanceContractsTabelView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
