import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Spinner } from '../../../../../../../Components';
import {
  GetAllAccessTypes, GetAllModuleComponents // GetAllComponentsByAppServiceId
} from '../../../../../../../Services';
import { RolesPermissionsComponent } from './Sections';
import { RolesAccessTypesComponent } from '../RolesAccessTypes/RolesAccessTypesComponent';

export const RolesComponentsComponent = ({
  rolesId,
  state,
  onStateChanged,
  activeModule,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [accessTypes, setAccessTypes] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null);
  const [activePermission, setActivePermission] = useState(null);
  const [filter] = useState({
    pageIndex: 1,
    pageSize: 999999,
  });
  const [components, setComponents] = useState({
    result: [],
    totalCount: 0,
  });
  const getAllComponentsByAppServiceId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllModuleComponents(
      activeModule.id,
      filter.pageIndex,
      filter.pageSize
    );
    if (!(res && res.data && res.data.ErrorId) && res && res.result) setComponents(res);
    else {
      setComponents({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [activeModule, filter]);
  const getAllAccessTypes = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllAccessTypes(filter.pageIndex, filter.pageSize);
    if (!(res && res.data && res.data.ErrorId) && res && res.result) {
      setAccessTypes(
        res.result.map((item) => ({ ...item, color: `access-type-color-${item.accessTypesId}` })) ||
        []
      );
    } else setAccessTypes([]);
    setIsLoading(false);
  }, [filter.pageIndex, filter.pageSize]);
  const onActivePermissionChanged = (newValue) => {
    setActivePermission(newValue);
  };
  const activeComponentHandler = useCallback(
    (componentId) => () => {
      setActiveComponent(componentId);
    },
    []
  );
  useEffect(() => {
    getAllAccessTypes();
  }, [getAllAccessTypes]);
  useEffect(() => {
    if (activeModule) getAllComponentsByAppServiceId();
  }, [activeModule, getAllComponentsByAppServiceId]);
  return (
    <>
      <div className='roles-components-wrapper childs-wrapper'>
        <Spinner isActive={isLoading} />
        <div className='roles-components-header-wrapper'>
          <div className='roles-components-title'>
            <span className='title-text'>{t(`${translationPath}components`)}</span>
          </div>
          <div className='roles-components-description'>
            <span className='description-text'>
              <span>{t(`${translationPath}components-description`)}</span>
              <span className='px-1 c-primary fw-simi-bold'>
                {activeModule && activeModule.name}
              </span>
            </span>
          </div>
        </div>
        <div className='roles-component-items-wrapper'>
          {components.result &&
            components.result.map((item, index) => (
              <div
                className={`roles-component-item${(activeComponent &&
                    item.moduleId === activeComponent.id &&
                    ' active-component') ||
                  ''
                  }`}
                key={`rolesComponentsItemKey${index + 1}`}
                onClick={activeComponentHandler({
                  id: item.moduleId,
                  name: item.moduleName || 'N/A',
                })}
                role='button'
                tabIndex={0}
              >
                <RolesPermissionsComponent
                  state={state}
                  rolesId={rolesId}
                  onStateChanged={onStateChanged}
                  componentItem={item}
                  index={index}
                  accessTypes={accessTypes}
                  activePermission={activePermission}
                  onActivePermissionChanged={onActivePermissionChanged}
                />
              </div>
            ))}
        </div>
      </div>
      {activePermission && (
        <RolesAccessTypesComponent
          state={state}
          onStateChanged={onStateChanged}
          accessTypes={accessTypes}
          activePermission={activePermission}
          onActivePermissionChanged={onActivePermissionChanged}
        />
      )}
    </>
  );
};

RolesComponentsComponent.propTypes = {
  rolesId: PropTypes.string,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  activeModule: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
RolesComponentsComponent.defaultProps = {
  rolesId: null,
  activeModule: undefined,
};
