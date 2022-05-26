import React from 'react';
import { Tables } from '../../../Components';
import { TableActions } from '../../../Enums';
import { GlobalHistory } from '../../../Helper';

const FormBuilderListView = (props) => {
  const handlePageChange = async (e, newPage) => {
    props.setPage(newPage);
    props.reloadData(newPage + 1, props.rowsPerPage);
  };
  const handlePageRowChange = async (e) => {
    props.setRowsPerPage(parseInt(e.target.value, 10));
    props.setPage(0);
    props.reloadData(1, parseInt(e.target.value, 10));
  };

  return (
    <div className='mx-3'>
      <Tables
        headerData={[
          {
            id: 1,
            isSortable: true,
            label: 'FormBuilder:FormName',
            input: 'formsName',
            isDate: false,
          },
        ]}
        data={
          props.formsResponse &&
          props.formsResponse.result &&
          Array.isArray(props.formsResponse.result) ?
            props.formsResponse.result :
            []
        }
        activePage={props.page - 1}
        totalItems={
          props.formsResponse && props.formsResponse.totalCount ? props.formsResponse.totalCount : 0
        }
        activePageChanged={handlePageChange}
        itemsPerPage={props.rowsPerPage}
        itemsPerPageChanged={handlePageRowChange}
        actionsOptions={{
          actions: [
            {
              enum: TableActions.view.key,
              isDiabled: false,
              externalComponent: null,
            },
            {
              enum: TableActions.edit.key,
              isDiabled: false,
              externalComponent: null,
            },
          ],
          classes: '',
          isDisabled: false,
          onActionClicked: (key, item) => {
            if (key === 'view')
              GlobalHistory.push(`/home/FormBuilder/FormEdit?type=${item.formsName}`);
            if (key === 'edit')
              GlobalHistory.push(`/home/FormBuilder/FormEdit?type=${item.formsName}`);
          },
        }}
      />
    </div>
  );
};

export { FormBuilderListView };
