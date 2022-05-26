import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { bottomBoxComponentUpdate, returnPropsByPermissions } from '../../../../Helper';
import { TableActions } from '../../../../Enums';
import {
  DialogComponent,
  PaginationComponent,
  Spinner,
  Tables,
  NoSearchResultComponent,
} from '../../../../Components';
import { AgentsTabelDialogView } from '../AgentsDialogsView/AgentsTabelDialogView';
import { GetAllAgentsServices } from '../../../../Services/AgentsServices';
import { AgentsPermissions } from '../../../../Permissions';

export const AgentsTabelView = ({
   parentTranslationPath,
   translationPath,
   filter,
  setFilter,
  setSearchedItem,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [response, setresponse] = useState({
    result: [],
    totalCount: 0,
  });
  const getAgents = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllAgentsServices({ ...filter });
    if (!(result && result.status && result.status !== 200)) {
      setresponse({
        result: (result && result.result) || [],
        totalCount: (result && result.totalCount) || 0,
      });
    } else {
      setresponse({
        result: [],
        totalCount: 0,
      });
    }

    setIsLoading(false);
  }, [filter]);

  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) setActiveItem(item);
    setOpenDialog(true);
  }, []);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({
     ...item, pageIndex, search: '', filterBy: null, orderBy: null
    }));
    setSearchedItem('');
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({
      ...item, pageIndex: 0, search: '', pageSize, filterBy: null, orderBy: null
     }));
    setSearchedItem('');
  };

  const getActionTableWithPermissions = () => {
    const list = [];
    if (returnPropsByPermissions(AgentsPermissions.EditAgentFile.permissionsId)) {
      list.push({
        enum: TableActions.editText.key,
        isDisabled: false,
        externalComponent: null,
      });
    }
    return list;
  };
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={response.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });

  useEffect(() => {
    if (sortBy) {
      setSearchedItem('');
      setFilter((item) => ({
    ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy, search: '', pageIndex: 0
    }));
    }
  }, [sortBy]);

  useEffect(() => {
    getAgents();
  }, [getAgents]);
  return (
    <div className='Agents-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='w-100 px-2'>
        {(response && response.totalCount === 0 && (
          <>
            <NoSearchResultComponent />
          </>
        )) || (
        <Tables
          data={response.result}
          headerData={[
                {
                  id: 1,
                   label: t(`${translationPath}Agent-name`),
                   input: 'agentName',
                   isSortable: true,
                },
                {
                  id: 2,
                  label: t(`${translationPath}Agent-Email`),
                  input: 'agentEmail',
                  isSortable: true,
                },
                {
                  id: 3,
                  label: t(`${translationPath}Agent-mobile`),
                  isSortable: true,
                  input: 'agentMobile',
                  component: (item) => <div>{(item.agentMobile) || 'N/A'}</div>,
                },
                {
                  id: 4,
                  label: t(`${translationPath}In-rotation-now`),
                  component: (item) => (
                    <div>
                      {(item && item.isInRotation === true && (
                        <div className='ROTATION-ON'>{t(`${translationPath}On`)}</div>
                      )) || <div className='ROTATION-Off'>{t(`${translationPath}Off`)}</div> ||
                        'N/A'}
                    </div>
                  ),
                },
                {
                  id: 5,
                  isSortable: true,
                  label: t(`${translationPath}Lead-cap`),
                  input: 'leadCapacity',
                },
                {
                  id: 6,
                  label: t(`${translationPath}Created-date`),
                  component: (item) => (
                    <div>
                      {(item.createdDate && moment(item.createdDate).format('YYYY-MM-DD')) || 'N/A'}
                    </div>
                  ),
                  input: 'createdDate',
                  isSortable: true,
                },
              ]}
          defaultActions={getActionTableWithPermissions()}
          actionsOptions={{
                onActionClicked: tableActionClicked,
              }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response.totalCount}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          setSortBy={setSortBy}
        />
          )}
      </div>

      <DialogComponent
        isOpen={openDialog}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        totalItems={response.totalCount}
        titleClasses='DialogComponent-WorkingHoursDialogView'
        wrapperClasses='wrapperClasses-WorkingHoursDialogView'
        titleText='Manage-Agent'
        onCloseClicked={() => setOpenDialog(false)}
        maxWidth='md'
        dialogContent={(
          <>
            <AgentsTabelDialogView
              onCancelClicked={() => setOpenDialog(false)}
              activeItem={activeItem && activeItem}
              relode={() => setFilter((item) => ({
              ...item, pageSize: 25, pageIndex: 0, search: '', filterBy: null, orderBy: null
            }))}
            />
          </>
        )}
      />
    </div>
  );
};

AgentsTabelView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  filter: PropTypes.objectOf(PropTypes.any).isRequired,
  setFilter: PropTypes.func.isRequired,
  setSearchedItem: PropTypes.func.isRequired,
};
