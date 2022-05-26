import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogComponent, Spinner, Tables } from '../../../../../../Components';
import { GetWorkOrderStatusHistory } from '../../../../../../Services';

export const WorkOrderStatusHistoryDialog = ({
  id,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const getAllWorkOrderStatuses = useCallback(async () => {
    setIsLoading(true);
    const res = await GetWorkOrderStatusHistory({ ...filter, id });
    if (!(res && res.status && res.status !== 200)) {
      setStatusHistory({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setStatusHistory({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter, id]);
  useEffect(() => {
    if (id) getAllWorkOrderStatuses();
  }, [getAllWorkOrderStatuses, filter, id]);
  return (
    <DialogComponent
      titleText='status-history'
      dialogContent={(
        <div className='work-order-status-history-dialog view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <Tables
            data={statusHistory.result || []}
            headerData={[
              {
                id: 1,
                label: 'status',
                input: 'workOrderStatusName',
              },
              {
                id: 2,
                label: 'date-and-time',
                input: 'dateTime',
                isDate: true,
                dateFormat: 'MMM, DD, YYYY hh:mm a',
              },
              {
                id: 3,
                label: 'activity-performed-by',
                input: 'activityPerformedByName',
              },
              {
                id: 4,
                label: 'user',
                input: 'userName',
              },
              {
                id: 4,
                label: 'remarks',
                input: 'remarks',
              },
            ]}
            defaultActions={[]}
            itemsPerPage={filter.pageSize}
            activePage={filter.pageIndex}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            totalItems={statusHistory.totalCount || 0}
          />
        </div>
      )}
      isOpen={isOpen}
      pageIndex={filter.pageIndex}
      pageSize={filter.pageSize}
      onPageIndexChanged={onPageIndexChanged}
      onPageSizeChanged={onPageSizeChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

WorkOrderStatusHistoryDialog.propTypes = {
  id: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrderStatusHistoryDialog.defaultProps = {
  id: undefined,
};
