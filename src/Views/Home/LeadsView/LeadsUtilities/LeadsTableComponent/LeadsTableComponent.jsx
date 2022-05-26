import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { TableColumnsFilterComponent, Tables, Spinner, PaginationComponent } from '../../../../../Components';
import {
  ColumnsFilterPagesEnum,
  FormsIdsEnum,
  TableFilterTypesEnum,
  TableActions
} from '../../../../../Enums';
import { GetAllFormFieldsByFormId } from '../../../../../Services';
import { TableColumnsFilterActions } from '../../../../../store/TableColumnsFilter/TableColumnsFilterActions';
import { LeadsLeaseTableHeaderData } from '../../../LeadsLeaseView/LeadsLeaseUtilities'
import { LeadsMapper } from "../LeadsMapper/LeadsMapper";
import { GlobalHistory, bottomBoxComponentUpdate } from '../../../../../Helper';
import { ActiveItemActions } from '../../../../../store/ActiveItem/ActiveItemActions';

export const LeadsTableComponent = ({
  data,
  filter,
  totalCount,
  onPageIndexChanged,
  onPageSizeChanged,
  parentTranslationPath,
  translationPath,
  t,
  checkedCardsIds,
  getIsSelected,
  onSelectClicked,
  sendUnitToLead,
  discardHandler,
}) => {
  const dispatch = useDispatch();
  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const [allFormFields, setAllFormFields] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState(
    LeadsLeaseTableHeaderData.filter((item) => item.isDefaultFilterColumn).map(
      (column) => column.id
    )
  );

  const getAllFormFieldsByFormId = useCallback(async () => {
    setTableData(data.map((item) => LeadsMapper(item, null, t)));
    setIsLoading(true);
    Promise.all([
      await GetAllFormFieldsByFormId(FormsIdsEnum.leadsOwner.id),
      await GetAllFormFieldsByFormId(FormsIdsEnum.leadsSeeker.id),
    ])
      .then((result) => {
        if (Array.isArray(result[0]) && Array.isArray(result[1])) {
          const concantinateFields = result[0]
            .concat(result[1])
            .filter(
              (field, index, array) =>
                array.findIndex((element) => element.formFieldKey === field.formFieldKey) === index
            );
          setAllFormFields(concantinateFields);
        } else setAllFormFields([]);
        setIsLoading(false);
      })
      .catch(() => {
        setAllFormFields([]);
        setIsLoading(false);
      });
  }, []);

  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.openFile.key) {
        if (item.leadClass === 'Tenant' || item.leadClass === 'Landlord') {
          GlobalHistory.push(`/home/lead-lease/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`)
        } else {
          GlobalHistory.push(`/home/lead-sales/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`)
        }
      } else if (actionEnum === TableActions.editText.key) {
        if (item.leadClass === 'Tenant' || item.leadClass === 'Landlord') {
          GlobalHistory.push(`/home/lead-lease/edit?formType=${item.leadTypeId}&id=${item.id}`)
        } else {
          GlobalHistory.push(`/home/lead-sales/edit?formType=${item.leadTypeId}&id=${item.id}`)
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getAllFormFieldsByFormId();
  }, [getAllFormFieldsByFormId]);

  useEffect(() => {
    if (
      tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum.unitsSales.key]
    ) {
      setSelectedTableFilterColumns(
        tableColumnsFilterResponse[ColumnsFilterPagesEnum.unitsSales.key]
      );
    }
  }, [tableColumnsFilterResponse]);

  useEffect(() => {
    setTableColumns([
      ...LeadsLeaseTableHeaderData.filter(
        (item) => selectedTableFilterColumns.findIndex((element) => element === item.id) !== -1
      ),
      ...allFormFields
        .filter(
          (item) =>
            selectedTableFilterColumns.findIndex((element) => element === item.formFieldId) !== -1
        )
        .map((field) => ({
          id: field.formFieldId,
          key: field.formFieldKey,
          isDate: field.uiWidgetType === 'alt-date',
          label: (field.formFieldTitle && field.formFieldTitle.replace('*', '')) || '',
          input: field.displayPath || undefined,
        })),
    ]);
  }, [allFormFields, selectedTableFilterColumns]);

  useEffect(() => {
    tableColumns.map((column) => ({
      key: column.key || column.fieldKey || column.id,
      filterType:
        (column.isDate && TableFilterTypesEnum.datePicker.key) ||
        TableFilterTypesEnum.textInput.key,
      isHiddenFilter: column.isHiddenFilter,
      textInputType: column.textInputType,
      textInputMax: column.textInputMax,
      textInputMin: column.textInputMin,
      displayPath:
        (column.key && column.input) ||
        (column.fieldKey &&
          allFormFields &&
          allFormFields.findIndex((item) => item.formFieldKey === column.fieldKey) !== -1 &&
          allFormFields.find((item) => item.formFieldKey === column.fieldKey).displayPath) ||
        undefined,
    }))
  }, [allFormFields, tableColumns]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='bottom-box-two-sections'>
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={data.totalCount}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
        <div className='d-flex-v-center flex-wrap'>
          <ButtonBase className='btns theme-transparent mb-2'
            disabled={checkedCardsIds.length ? false : true}
            onClick={discardHandler}
          >
            <span>{t(`${translationPath}discard-selected`)}</span>
          </ButtonBase>
          <ButtonBase className='btns theme-solid mb-2'
            disabled={checkedCardsIds.length ? false : true}
            onClick={() => sendUnitToLead(checkedCardsIds)}>
            <span>{t(`${translationPath}send-selected-matches`)}</span>
          </ButtonBase>
        </div>
      </div>
    );
  });

  return (
    <div className='w-100 px-3' >
      <Spinner isActive={isLoading} />
      <TableColumnsFilterComponent
        columns={LeadsLeaseTableHeaderData.concat(
          allFormFields.filter(
            (item) =>
              LeadsLeaseTableHeaderData.findIndex(
                (element) => element.fieldKey === item.formFieldKey
              ) === -1
          )
        ).map((item) => ({
          key: item.formFieldId || item.id,
          value: (item.formFieldTitle && item.formFieldTitle.replace('*', '')) || item.label,
        }))}
        isLoading={isLoading}
        selectedColumns={selectedTableFilterColumns}
        onSelectedColumnsChanged={(newValue) => {
          setSelectedTableFilterColumns(newValue);
          let localTableColumnsFilterResponse = tableColumnsFilterResponse;
          if (localTableColumnsFilterResponse) {
            localTableColumnsFilterResponse[ColumnsFilterPagesEnum.unitsSales.key] = newValue;
          }
          else {
            localTableColumnsFilterResponse = {
              [ColumnsFilterPagesEnum.unitsSales.key]: newValue,
            };
          }
          dispatch(
            TableColumnsFilterActions.TableColumnsFilterRequest(localTableColumnsFilterResponse)
          );
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath=''
      />
      <Tables
        data={tableData}
        headerData={tableColumns}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        isSellectAllDisabled
        defaultActions={[
          {
            enum: TableActions.openFile.key,
          },
          {
            enum: TableActions.editText.key,
          },
        ]}
        parentTranslationPath='LeadsView'
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        totalItems={totalCount ? totalCount : 0}
        selectAllOptions={
          (tableData && tableData.length && {
            selectedRows: checkedCardsIds,
            getIsSelected,
            disabledRows: [],
            onSelectClicked,
          }) ||
          undefined
        }
      />
    </div>
  );
};

LeadsTableComponent.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired,

};
