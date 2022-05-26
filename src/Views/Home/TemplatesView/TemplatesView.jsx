
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  Inputs, PaginationComponent, Spinner, PermissionsComponent, ViewTypes
} from '../../../Components';
import { ActionsEnum, ViewTypesEnum , TableActions} from '../../../Enums';
import { bottomBoxComponentUpdate, returnPropsByPermissions } from '../../../Helper';
import { GetAllTemplates } from '../../../Services';
import { TemplatesPermissions } from '../../../Permissions';
import {
  TemplateDeleteDialog,
  TemplatesManagementDialog,
  TemplatesPreviewDialog,
} from './Dialogs';
import { TemplatesCardsComponent } from './Sections';
import { TeamplateListView } from './TeamplateListView';

const parentTranslationPath = 'TemplatesView';
const translationPath = '';
export const TemplatesView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [viewTypes, setViewTypes] = useState('');
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
  });

  const [templates, setTemplates] = useState({
    result: [],
    totalCount: 0,
  });
  const [searchInput, setSearchInput] = useState('');

  const searchHandler = (search) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search }));
    }, 700);
    setSearchInput(search);
  };
  const onTypeChanged = (activeType) => {
    localStorage.setItem('UserViewType', JSON.stringify(activeType));
    setViewTypes(activeType);
    setFilter((item) => ({ ...item, pageIndex: 0 }));
  };
  const getAllTemplates = useCallback(async () => {
    setIsLoading(true);

    const res = await GetAllTemplates(filter);
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setTemplates({
        result: res.result || [],
        totalCount: res.totalCount || 0,
      });
    } else {
      setTemplates({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex, search: searchInput }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({
      ...item, pageIndex: 0, pageSize, search: ''
    }));
    setSearchInput('');
  };
  const onFooterActionsClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      if (actionEnum === TableActions.edit.key || actionEnum === ActionsEnum.reportEdit.key) {
        setIsOpenManagementDialog(true);
        setActiveItem(activeData);
      } else if (actionEnum === TableActions.view.key || actionEnum === ActionsEnum.preview.key) {
        setIsOpenPreviewDialog(true);
        setActiveItem(activeData);
      } else if (actionEnum === TableActions.delete.key || actionEnum === ActionsEnum.delete.key) {
        setIsOpenDeleteDialog(true);
        setActiveItem(activeData);
      }
    },
    []
  );
  useEffect(() => {
    if (returnPropsByPermissions(TemplatesPermissions.ViewTemplates.permissionsId)) {
      bottomBoxComponentUpdate(
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={templates.totalCount}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
      );
    }
  });
  useEffect(() => {
    getAllTemplates();
  }, [filter, getAllTemplates]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <>
      <div className='templates-wrapper view-wrapper'>
        <Spinner isActive={isLoading} />
        <div className='d-flex-column'>
          <div className='header-section'>
            <div className='filter-section'>
              <div className='section px-2'>
                <PermissionsComponent
                  permissionsList={Object.values(TemplatesPermissions)}
                  permissionsId={TemplatesPermissions.AddNewTemplate.permissionsId}
                >
                  <ButtonBase
                    onClick={() => setIsOpenManagementDialog(true)}
                    className='btns theme-solid bg-primary'
                  >
                    <span className='mdi mdi-plus   mx-1 ' />
                    {t(`${translationPath}add-new-template`)}
                  </ButtonBase>
                </PermissionsComponent>
              </div>
              <div className='section autocomplete-section'>
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='w-100 p-relative'>
                    <PermissionsComponent
                      permissionsList={Object.values(TemplatesPermissions)}
                      permissionsId={TemplatesPermissions.ViewTemplates.permissionsId}
                    >
                      <Inputs
                        idRef='templatesSearchRef'
                        label='filter'
                        value={searchInput}
                        beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                        onInputChanged={(e) => {
                        searchHandler(e.target.value);
                      }}
                        inputPlaceholder='search-templates'
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                      />
                    </PermissionsComponent>
                  </div>
                </div>
                <ViewTypes
                onTypeChanged={onTypeChanged}
                initialActiveType={viewTypes}
                activeTypes={[ViewTypesEnum.cards.key, ViewTypesEnum.tableView.key]}
                className='mb-3'
              />
              </div>
            </div>
          </div>
          <PermissionsComponent
            permissionsList={Object.values(TemplatesPermissions)}
            permissionsId={TemplatesPermissions.ViewTemplates.permissionsId}
          >
            {viewTypes === ViewTypesEnum.tableView.key && (
              <div>
                <TeamplateListView
                  data={templates}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  filter={filter}
                  onPageIndexChanged = {onPageIndexChanged}
                  onPageSizeChanged = {onPageSizeChanged}
                  onFooterActionsClicked={onFooterActionsClicked}
                />
              </div>
            )}
          </PermissionsComponent>
          <PermissionsComponent
            permissionsList={Object.values(TemplatesPermissions)}
            permissionsId={TemplatesPermissions.ViewTemplates.permissionsId}
          >
            {viewTypes !== ViewTypesEnum.tableView.key && (
            <TemplatesCardsComponent
              data={templates && templates}
              onFooterActionsClicked={onFooterActionsClicked}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            )}
          </PermissionsComponent>
        </div>
        {isOpenManagementDialog && (
        <TemplatesManagementDialog
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          onSave={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
        {isOpenPreviewDialog && (
        <TemplatesPreviewDialog
          activeItem={activeItem}
          isOpen={isOpenPreviewDialog}
          isOpenChanged={() => {
            setIsOpenPreviewDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
        {isOpenDeleteDialog && (
        <TemplateDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenDeleteDialog}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setActiveItem(null);
            setIsOpenDeleteDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      </div>
    </>
  );
};
