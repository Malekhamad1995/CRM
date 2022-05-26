import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Tables } from '../../../TablesComponent/Tables';
import { GetParams, setLoading } from '../../../../Helper';
import {
  GetAllDFMTransactionForContact,
  GetAllDFMTransactionForLead,
  GetAllDFMTransactionForProperty,
  GetAllDFMTransactionForUnit,
} from '../../../../Services/AuditTrailServices/AuditTrailServices';
import { PaginationComponent } from '../../../PaginationComponent/PaginationComponent';
import { Spinner } from '../../../SpinnerComponent/Spinner';
import { GetAllFormFieldsByFormId } from '../../../../Services';
import { FormsIdsEnum } from '../../../../Enums';

export const HistoryComponent = ({
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState({
    result: [],
    totalCount: 0,
  });
  const [changeFields, setChangeFields] = useState([]);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [formsContent, setFormsContent] = useState([]);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const pathName = window.location.pathname
    .split('/home/')[1]
    .split('/view')[0]
    .split('/')[0];
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const GetAllFormByFormId = useCallback(async () => {
    let formId = 0;
    if (pathName.includes('contact')) {
      formId =
        activeItem.userTypeId === FormsIdsEnum.contactsIndividual.id ?
          FormsIdsEnum.contactsIndividual.id :
          FormsIdsEnum.contactsCorporate.id;
    } else if (pathName.includes('unit')) formId = FormsIdsEnum.units.id;
    else if (pathName.includes('lead')) {
      formId =
        activeItem.leadTypeId === 1 ?
          FormsIdsEnum.leadsOwner.id :
          FormsIdsEnum.leadsSeeker.id;
    } else formId = FormsIdsEnum.properties.id;

    const result = await GetAllFormFieldsByFormId(formId);
    setFormsContent(
      result.map((item) => ({ type: item.uiWidgetType, el: item.formFieldKey }))
    );
  }, [activeItem, pathName]);

  const getAllDFMTransaction = useCallback(async () => {
    setIsLoading(true);
    let result;
    if (pathName.toLowerCase().includes('contacts'))
      result = await GetAllDFMTransactionForContact(filter, +GetParams('id'));
    else if (pathName.toLowerCase().includes('unit'))
      result = await GetAllDFMTransactionForUnit(filter, +GetParams('id'));
    else if (pathName.toLowerCase().includes('lead'))
      result = await GetAllDFMTransactionForLead(filter, +GetParams('id'));
    else {
 result = await GetAllDFMTransactionForProperty(
        filter.pageIndex + 1,
        filter.pageSize,
        +GetParams('id')
      );
}
    if (!(result && result.status && result.status !== 200)) {
 setTransactions({
        result: result && result.result,
        totalCount: result && result.totalCount,
      });
} else setTransactions({ result: [], totalCount: 0 });
    setIsLoading(false);
  }, [filter, pathName]);

  useEffect(() => {
    GetAllFormByFormId();
    getAllDFMTransaction();
  }, [GetAllFormByFormId, getAllDFMTransaction]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
    setChangeFields([]);
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
    setChangeFields([]);
  };

  const contactFieldChangeMapper = useCallback(
    (itemValue) => {
      setLoading(true);
      let typeId = 0;
      if (pathName.toLowerCase().includes('contacts')) typeId = 'contact';
      else if (pathName.toLowerCase().includes('unit')) typeId = 'unit';
      else if (pathName.toLowerCase().includes('lead')) typeId = 'lead';
      else typeId = 'property';
      const changes = [];
      const beforeChangeArr = JSON.parse(itemValue.response)[typeId];
      const afterChangeArr = JSON.parse(itemValue.responseAfterChanged);

      formsContent.map(({ type, el }) => {
        const item = beforeChangeArr[el];
        const afterChangeValue = afterChangeArr[el];
        if (
          JSON.stringify(beforeChangeArr[el]) !==
          JSON.stringify(afterChangeArr[el])
        ) {
          if (
            (item && item.lookupItemName) ||
            (afterChangeValue && afterChangeValue.lookupItemName)
          ) {
            changes.push({
              fieldName: el,
              changedFrom: item && item.lookupItemName,
              changedTo: afterChangeValue && afterChangeValue.lookupItemName,
            });
          } else if (
            (item && item.phone && type !== 'searchField') ||
            (afterChangeValue &&
              afterChangeValue.phone &&
              type !== 'searchField')
          ) {
            changes.push({
              fieldName: el,
              changedFrom: item && item.phone,
              changedTo: afterChangeValue && afterChangeValue.phone,
            });
          } else if (
            (item && item.name) ||
            (afterChangeValue && afterChangeValue.name)
          ) {
            changes.push({
              fieldName: el,
              changedFrom: item && item.name,
              changedTo: afterChangeValue && afterChangeValue.name,
            });
          } else if (
            (item && item.email) ||
            (afterChangeValue && afterChangeValue.email)
          ) {
            changes.push({
              fieldName: el,
              changedFrom: item && item.email,
              changedTo: afterChangeValue && afterChangeValue.email,
            });
          } else {
            changes.push({
              fieldName: el,
              changedFrom: item,
              changedTo: afterChangeValue,
            });
          }
        }
        return changes;
      });
      setChangeFields(() => changes.length > 0 && changes);
      setLoading(false);
    },
    [formsContent, pathName]
  );

  return (
    <div className='history-component-content-wrapper w-100 mt-2'>
      <div className='history-table-conent-wrapper history-dialog-wrapper d-flex-column-center w-100 transaction-history-wrapper'>
        <Spinner isActive={isLoading} />
        <div className='w-100 history-table-header'>
          <span>{t(`${translationPath}date-and-time-viewed`)}</span>
          <span>{t(`${translationPath}user`)}</span>
          <span>{t(`${translationPath}type`)}</span>
        </div>
        {transactions &&
          transactions.result &&
          transactions.result.map((item, index) => (
            <Accordion
              key={`${index + 1}-history`}
              className={`expand-history-icon ${
                index % 2 === 0 ? 'is-gray' : ''
              }`}
              expanded={
                expanded === item.dfMTransactionId &&
                item.requestTypeName === 'Update'
              }
              onChange={handleChange(item.dfMTransactionId)}
            >
              <AccordionSummary
                onClick={() =>
                  item.responseAfterChanged && contactFieldChangeMapper(item)}
              >
                <div
                  className={`history-table-content w-100 ${
                    index % 2 === 0 ? 'is-gray' : ''
                  }`}
                >
                  <div
                    className={`history-expand-icon ${
                      item.requestTypeName === 'Update' ? '' : 'is-gray'
                    } `}
                  >
                    <span
                      className={`mdi mdi-chevron-${
                        expanded === item.dfMTransactionId &&
                        item.requestTypeName === 'Update' ?
                          'up' :
                          'down'
                      }`}
                    />
                  </div>
                  <span>
                    {(item.createdOn &&
                      moment(item.createdOn).format('DD/MM/YYYY - hh:mm A')) ||
                      'N/A'}
                  </span>
                  <span>
                    {(item.createdByName && item.createdByName) || 'N/A'}
                  </span>
                  <span>
                    {(item.requestTypeName && item.requestTypeName) || 'N/A'}
                  </span>
                </div>
              </AccordionSummary>
              {item.responseAfterChanged &&
                changeFields &&
                changeFields.length > 0 && (
                  <AccordionDetails>
                    <Tables
                      data={changeFields || []}
                      headerData={[
                        {
                          id: 1,
                          label: 'field-name',
                          input: 'fieldName',
                        },
                        {
                          id: 2,
                          label: 'changed-from',
                          component: (el) => (
                            <span>
                              {(el.changedFrom &&
                                typeof el.changedFrom === 'string' &&
                                el.changedFrom) ||
                                t(`${translationPath}value-has-changed`)}
                            </span>
                          ),
                        },
                        {
                          id: 3,
                          label: 'changed-to',
                          component: (el) => (
                            <span>
                              {(el.changedTo &&
                                typeof el.changedTo === 'string' &&
                                el.changedTo) ||
                                t(`${translationPath}value-has-changed`)}
                            </span>
                          ),
                        },
                      ]}
                      activePage={0}
                      defaultActions={[]}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      totalItems={changeFields.length || 0}
                    />
                  </AccordionDetails>
                )}
            </Accordion>
          ))}
      </div>
      <div className='pagination-history-wrapper'>
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={transactions.totalCount || 0}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
      </div>
    </div>
  );
};

HistoryComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
