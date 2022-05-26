import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tables } from '../../../../Components';
import { TableActions } from '../../../../Enums';

export const MyLeadsTable = ({
  filter,
  myLeads,
  setFilter,
  translationPath,
  parentTranslationPath,
  setIsOpenConfirmDialog,
}) => {
  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      if (actionEnum === TableActions.editText.key) setIsOpenConfirmDialog(true);
    },
    [setIsOpenConfirmDialog]
  );
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  return (
    <div className='w-100 px-3'>
      <Tables
        data={myLeads.result}
        headerData={[
          {
            id: 1,
            isSortable: true,
            label: 'id',
            input: 'id',
          },
          {
            id: 2,
            isSortable: true,
            label: 'date',
            input: 'date',
            isDate: true,
          },
          {
            id: 3,
            isSortable: true,
            label: 'last-activity-update',
            input: 'updateDate',
            isDate: true,
          },
          {
            id: 4,
            isSortable: true,
            label: 'name',
            input: 'name',
          },
          {
            id: 5,
            isSortable: true,
            label: 'community',
            input: 'myLeadcommunity',
          },
          {
            id: 6,
            isSortable: true,
            label: 'property',
            input: 'myLeadproperty',
          },
        ]}
        defaultActions={[]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        totalItems={myLeads.totalCount}
        translationPath={translationPath}
        onPageSizeChanged={onPageSizeChanged}
        onPageIndexChanged={onPageIndexChanged}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};
MyLeadsTable.propTypes = {
  setFilter: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  myLeads: PropTypes.instanceOf(Object).isRequired,
  setIsOpenConfirmDialog: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
