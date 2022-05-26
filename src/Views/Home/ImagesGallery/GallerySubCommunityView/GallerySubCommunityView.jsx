import { ButtonBase } from '@material-ui/core';
import React, {
  useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Inputs, TabsComponent, PermissionsComponent } from '../../../../Components';
import { ImagesGalleryFilterEnum } from '../../../../Enums';
import { ImagesGalleryManagementDialog } from '../Dialogs';
import { ImagesGalleryTabsData } from '../TabsData';
import { ImageGalleryPermissions } from '../../../../Permissions';

const parentTranslationPath = 'ImagesGalleryGroup';
const translationPath = '';
export const GallerySubCommunityView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [filterBy, setFilterBy] = useReducer(reducer, {
    countryId: null,
    cityId: null,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
  });

  const searchHandler = (search) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search }));
    }, 700);
  };
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const onFilterByChanged = (newValue) => {
    setFilterBy(newValue);
  };
  const onActiveItemChanged = (newValue) => {
    setActiveItem(newValue);
    setIsOpenManagementDialog(true);
  };

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='gallery-city-wrapper view-wrapper'>
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(ImageGalleryPermissions)}
                permissionsId={ImageGalleryPermissions.CreateNewAlbum.permissionsId}
              >
                <ButtonBase
                  onClick={() => setIsOpenManagementDialog(true)}
                  className='btns theme-solid bg-primary'
                >
                  <span className='mdi mdi-plus' />
                  <span className='px-1'>{t(`${translationPath}add-new-photo`)}</span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>
                  <Inputs
                    idRef='subCommunityGallerySearchRef'
                    label='filter'
                    beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    // value={searchInput}
                    onInputChanged={(e) => {
                      searchHandler(e.target.value);
                    }}
                    inputPlaceholder='search-sub-community-gallery'
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-100 px-3'>
          <TabsComponent
            data={ImagesGalleryTabsData}
            labelInput='label'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            wrapperClasses='is-with-line'
            currentTab={activeTab}
            onTabChanged={onTabChanged}
            dynamicComponentProps={{
              filter,
              filterBy,
              onFilterByChanged,
              onPageIndexChanged,
              onPageSizeChanged,
              onActiveItemChanged,
              fromPage: ImagesGalleryFilterEnum.Subcommunity.key,
              parentTranslationPath,
              translationPath,
            }}
          />
        </div>
      </div>
      {isOpenManagementDialog && (
        <ImagesGalleryManagementDialog
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          fromPage={ImagesGalleryFilterEnum.Subcommunity.key}
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
    </div>
  );
};
