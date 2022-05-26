import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../../../../Components';
import { WorkOrderAddOnlyView, WorkOrdersManagementView } from '../../../../../../WorkOrdersView';

export const WorkOrdersManagementDialog = ({
  id,
  maintenanceContractId,
  reloadData,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const saveRef = useRef(null);
  const [fromChildData, setFromChildData] = useState({
    filter: null,
    setFilter: null,
    activeTab: 0,
  });
  const onPageIndexChanged = (pageIndex) => {
    if (fromChildData.setFilter) fromChildData.setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    if (fromChildData.setFilter)
      fromChildData.setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  return (
    <DialogComponent
      titleText={(id && 'edit-work-order') || 'add-work-order'}
      saveText={
        (saveRef && saveRef.current !== null && ((id && 'edit-work-order') || 'add-work-order')) ||
        undefined
      }
      maxWidth='lg'
      dialogContent={(
        <div className='work-order-management-dialog'>
          {(id && (
            <WorkOrdersManagementView
              isFromDialog
              parentSaveRef={saveRef}
              toParentSender={(key, value) => {
                if (fromChildData[key] !== value)
                  setFromChildData((items) => ({ ...items, [key]: value }));
              }}
              maintenanceContractId={maintenanceContractId}
              reloadData={reloadData}
              workOrderId={id}
            />
          )) || (
            <WorkOrderAddOnlyView
              isFromDialog
              parentSaveRef={saveRef}
              maintenanceContractId={maintenanceContractId}
              reloadData={reloadData}
            />
          )}
        </div>
      )}
      isOpen={isOpen}
      onSubmit={
        ((fromChildData.activeTab === 0 || fromChildData.activeTab === 2) &&
          ((event) => {
            event.preventDefault();
            if (saveRef && saveRef.current) saveRef.current();
          })) ||
        undefined
      }
      saveType={
        ((fromChildData.activeTab === 0 || fromChildData.activeTab === 2) && 'submit') || 'button'
      }
      pageIndex={
        fromChildData.setFilter && fromChildData.filter ? fromChildData.filter.pageIndex : undefined
      }
      pageSize={
        fromChildData.setFilter && fromChildData.filter ? fromChildData.filter.pageSize : undefined
      }
      onPageIndexChanged={
        fromChildData.setFilter && fromChildData.filter ? onPageIndexChanged : undefined
      }
      onPageSizeChanged={
        fromChildData.setFilter && fromChildData.filter ? onPageSizeChanged : undefined
      }
      onCancelClicked={
        (!(fromChildData.setFilter && fromChildData.filter) && isOpenChanged) || undefined
      }
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

WorkOrdersManagementDialog.propTypes = {
  id: PropTypes.number,
  maintenanceContractId: PropTypes.number.isRequired,
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrdersManagementDialog.defaultProps = {
  id: undefined,
};
