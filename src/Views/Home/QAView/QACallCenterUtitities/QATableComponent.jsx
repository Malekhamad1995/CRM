import React, { useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { TableActions } from '../../../../Enums/TableActions.Enum';
import { Tables } from '../../../../Components';
import { ActivityHistory } from '../../ActivitiesView/ActivityHistory/ActivityHistory';
import { isEmptyObject } from '../../../../Helper/isEmptyObject.Helper';
import { GetAllRelatedActivitiesByActivityId } from '../../../../Services';
import { ActivitiesManagementDialog } from '../../ActivitiesView/ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import { GetActivityById } from '../../../../Services/ActivitiesServices';
import { ReplyActivityDialog } from '../../ActivitiesView/ReplyActivitesView/ReplyActivityDialog';
import { GlobalHistory } from '../../../../Helper';

const parentTranslationPath = 'QAActivitiesView';
const translationPath = '';
export const QATableComponent = ({ filter, data, setIsOpenReassign , activeItem, setActiveItem}) => {
  let listflattenObject = [];
  const [isLoading, setIsLoading] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [activityHistory, setActivityHistory] = useState();
  const [openReply, setOpenReply] = useState(false);
  const [edit, setisEdit] = useState(false);
  const [currentActions, setCurrentActions] = useState(() => []);
  const [open, setOpen] = useState(false);
  const pathName = window.location.pathname.split('/home/')[1].split('/QA')[0];
  const flattenObject = (obj) => {
    // eslint-disable-next-line prefer-const
    const flattened = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null && key === 'relatedActivityTo') {
        if (obj[key]) {
          if (!isEmptyObject(obj[key])) listflattenObject.push({ ...obj[key] });
          Object.assign(flattened, flattenObject(obj[key]));
        }
      } else flattened[key] = obj[key];
    });
  };
  const handleActiveItem = useCallback(async (activityId, key) => {
    if (key === TableActions.replyText.key) {
      setOpenReply(true);
      setIsLoading(true);
      const res = await GetActivityById(activityId);
      if (!(res && res.status && res.status !== 200)) {
        setActiveItem(res);
        setIsLoading(false);
      }
    } else {
      setOpen(true);
      setisEdit(true);
      setIsLoading(true);
      const res = await GetActivityById(activityId);
      if (!(res && res.status && res.status !== 200)) setActiveItem(res);
      setIsLoading(false);
    }
  }, []);
  const GetRelatedActivitiesByActivityId = useCallback(
    async (activityId) => {
      setOpenHistory(true);
      setIsLoading(true);
      const res = await GetAllRelatedActivitiesByActivityId(activityId);
      if (!(res && res.status && res.status !== 200)) {
        listflattenObject = [];
        flattenObject(res);
        setActivityHistory(listflattenObject.filter((item) => item.activityId));
      } else setActivityHistory([]);
      setIsLoading(false);
    },
    [activeItem]
  );

  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.preventDefault();
      if (actionEnum === TableActions.openFile.key) {
        if (pathName === 'QA') {
          GlobalHistory.push(
            `/home/Contacts-CRM/contact-profile-edit?formType=${item.contactTypeId}&id=${item.contactId}`
          );
        }
      } else if (actionEnum === TableActions.editText.key) {
        handleActiveItem(item.activityId, TableActions.editText.key);
        setOpen(true);
      } else if (actionEnum === TableActions.replyText.key) {
        handleActiveItem(item.activityId, TableActions.replyText.key);
        setOpenReply(true);
      } else if (actionEnum === TableActions.reassignAgent.key) {
        setIsOpenReassign(true);
        setActiveItem(item);
      }
    },
    [handleActiveItem, pathName]
  );
  const focusedRowChanged = (activeRow) => {
    const item = data&&data[activeRow];
    if (!item) return;
    setCurrentActions(getTableActionsWithPermissions(item.reassignIsAble));
  };
  const getTableActionsWithPermissions = (reassignIsAble) => {
    let list = [];
    if (reassignIsAble) {
        list.push({
          enum: TableActions.openFile.key,
        });
      list.push({
        enum: TableActions.editText.key,
      });
      list.push({
        enum: TableActions.replyText.key,
      });
      list.push({
        enum: TableActions.reassignAgent.key,
      });
    } else {
      list.push({
        enum: TableActions.openFile.key,
      });
    list.push({
      enum: TableActions.editText.key,
    });
    list.push({
      enum: TableActions.replyText.key,
    });
    }
    return list;
  };
  return (
    <div>
      <Tables
        data={data}
        headerData={[
          {
            id: 1,
            label: 'history',
            component: (item) =>
              item.relatedActivityToId && (
                <ButtonBase
                  className='MuiButtonBase-root btns-icon  mt-1 mx-2'
                  onClick={() => {
                    setOpenHistory(true);
                    GetRelatedActivitiesByActivityId(item.activityId);
                  }}
                >
                  <span className='table-action-icon mdi mdi-undo-variant' />
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>
              ),
          },
          {
            id: 2,
            label: 'name',
            input: 'contactName',
          },
          {
            id: 3,
            label: 'Lead-id',
            input: 'relatedLeadNumberId',
          },
          {
            id: 4,
            label: 'email',
            input: 'contactEmail',
          },
          {
            id: 5,
            label: 'lease',
            input: 'leaseTransactionsCount',
          },
          {
            id: 6,
            label: 'sale',
            input: 'saleTransactionsCount',
          },
          {
            id: 7,
            label: 'subject',
            input: 'subject',
          },
          {
            id: 8,
            label: 'agent-name',
            input: 'agentName',
          },
          {
            id: 9,
            label: 'date',
            input: 'activityDate',
            isDate: true,
            dateFormat: 'DD/MM/YYYY',
          },
        ]}
        focusedRowChanged={focusedRowChanged}

        defaultActions={[
          {
            enum: TableActions.editText.key,
          },
          {
            enum: TableActions.replyText.key,
          },
          {
            enum: TableActions.openFile.key,
          },
          {
            enum: TableActions.reassignAgent.key,
          },
        ]}
        actionsOptions={{
          actions: currentActions,
          classes: '',
          isDisabled: false,
          onActionClicked: tableActionClicked,
        }}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      {openHistory && (
        <ActivityHistory
          isLoading={isLoading}
          open={openHistory}
          close={() => {
            listflattenObject = [];
            setActivityHistory([]);
            setOpenHistory(false);
          }}
          data={activityHistory.reverse()}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {open && (
        <ActivitiesManagementDialog
          open={open}
          activeItem={activeItem}
          isLoading={isLoading}
          isEdit={edit}
          onSave={() => {
            setOpen(false);
            setActiveItem(null);
            setisEdit(false);
          }}
          close={() => {
            setActiveItem(null);
            setOpen(false);
            setisEdit(false);
          }}
          translationPath={translationPath}
          parentTranslationPath='ActivitiesView'
        />
      )}
      {openReply && (
        <ReplyActivityDialog
          isLoading={isLoading}
          open={openReply}
          close={() => {
            setActiveItem(null);
            setOpenReply(false);
          }}
          activeItem={activeItem}
          onSave={() => {
            setOpenReply(false);
            setActiveItem(null);
          }}
          translationPath={translationPath}
          parentTranslationPath='ActivitiesView'
        />
      )}
    </div>
  );
};

QATableComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
};
