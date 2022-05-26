import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  approvedAllValidProcessRecord,
  getImportFileDetailsByID,
  GetProcess,
} from '../../../../Services';
import {
 GetParams, GlobalHistory, showError, showSuccess
} from '../../../../Helper';
import { Spinner } from '../../../../Components';
import { ImportDetailsCardComponent } from './ImportDetailsUtilities';
import { bottomBoxComponentUpdate } from '../../../../Helper/Middleware.Helper';
import { PaginationComponent } from '../../../../Components/PaginationComponent/PaginationComponent';

const translationPath = '';
export const ImportDetailsView = () => {
  const { t } = useTranslation('ImportDetailsView');
  const [importDetails, setImportDetails] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({ pageIndex: 0, pageSize: 25, isValid: false });
  const [importStatusDetails, setImportStatusDetails] = useState(null);
  const [importId, setImportId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getProcess = useCallback(async () => {
     setIsLoading(true);
    const response = await GetProcess(importId, filter);
    if (!(response && response.status && response.status !== 200)) setImportStatusDetails(response);
     setIsLoading(false);
  }, [filter, importId]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const getImportDetails = useCallback(async () => {
    if (
      importDetails &&
      importDetails.result &&
      importDetails.result.length <= importDetails.totalCount
    ) {
      setIsLoading(true);
      const response = await getImportFileDetailsByID(importId, filter);
      if (!(response && response.status && response.status !== 200)) {
          const data = {
            result:
              (response &&
                response.result.map((item) => ({
                  fileRow: item.fileRow,
                  isValid: item.isValid,
                  jsonRecord:
                    item.jsonRecord &&
                    JSON.parse(item.jsonRecord) &&
                    JSON.parse(item.jsonRecord).contact,
                  processId: item.processId,
                  processRecordId: item.processRecordId,
                  reason: item.reason && JSON.parse(item.reason),
                }))) ||
              [],
            totalCount: response.totalCount || 0,
          };
          setImportDetails(data);
      }
      setIsLoading(false);
    }
  }, [filter, importDetails, importId]);
  const approvedHandler = async () => {
    setIsLoading(true);
    const result = await approvedAllValidProcessRecord(importId);
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}approved-updated-successfully`));
      setIsLoading(false);
      GlobalHistory.goBack();
    } else {
      showError(t(`${translationPath}approved-update-failed`));
      setIsLoading(false);
    }
  };
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={importDetails.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setImportId(GetParams('id'));
  });
  useEffect(() => {
    if (importId) {
      getImportDetails();
      getProcess();
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [importId, filter]);
  return (
    <div className='import-details-view'>
      <Spinner isActive={isLoading} />
      <div className='header-section'>
        <div className='item-section'>
          <div className='box-wrapper'>
            <span className='mdi mdi-clock-time-three mdi-36px c-blue-lighter px-2' />
            <div className='d-inline-flex-column px-2'>
              <span>{`contact ${t(`${translationPath}status`)}`}</span>
              <span className='c-blue-lighter fw-bold'>
                {(importStatusDetails &&
                  importStatusDetails.isApproved &&
                  t(`${translationPath}approved`)) ||
                  t(`${translationPath}pending`)}
              </span>
            </div>
          </div>
        </div>
        <div className='item-section'>
          <div className='box-wrapper d-flex-column'>
            <span className='mdi mdi-check mdi-24px icon-circle px-2' />
            <div className='d-inline-flex-column px-2'>
              <span>{t(`${translationPath}number-of-success`)}</span>
              <span className='c-success d-flex-center fw-bold fz-22px'>
                {importStatusDetails && importStatusDetails.validRecords}
              </span>
            </div>
            <Button
              className='btns w-100 mx-0 mt-3 bg-success'
              disabled={
                !importStatusDetails ||
                importStatusDetails.validRecords === 0 ||
                importStatusDetails.isApproved
              }
              onClick={approvedHandler}
            >
              <span className='c-white'>{t(`${translationPath}approve-valid-fields`)}</span>
            </Button>
          </div>
        </div>
        <div className='item-section'>
          <div className='box-wrapper'>
            <span className='mdi mdi-message-alert mdi-flip-h mdi-36px c-danger px-2' />
            <div className='d-inline-flex-column px-2'>
              <span>{t(`${translationPath}number-of-failed`)}</span>
              <span className='d-flex-center c-danger fz-22px fw-bold'>
                {importStatusDetails && importStatusDetails.invalidRecords}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ImportDetailsCardComponent
        isLoading={isLoading}
        data={importDetails}
        translationPath={translationPath}
        // onLoadMore={onLoadMore}
      />
    </div>
  );
};

// ImportDetailsView.propTypes = {

// }
