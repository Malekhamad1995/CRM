import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../../../../../Components';
import { GetAllModules } from '../../../../../../../Services';

export const RolesModulesComponent = ({
  activeModule,
  onActiveModuleChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);

  const [filter] = useState({
    pageIndex: 1,
    pageSize: 999999,
  });
  const [modules, setModules] = useState({
    result: [],
    totalCount: 0,
  });
  const getAllApplicationService = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllModules(filter.pageIndex, filter.pageSize);
    if (!(res && res.data && res.data.ErrorId) && res) setModules(res);
    else {
      setModules({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);
  const activeModuleHandler = useCallback(
    (moduleId) => () => {
      if (onActiveModuleChanged) onActiveModuleChanged(moduleId);
    },
    [onActiveModuleChanged]
  );

  useEffect(() => {
    getAllApplicationService();
  }, [getAllApplicationService]);
  return (
    <div className='roles-modules-wrapper childs-wrapper pl-2-reversed pr-4-reversed'>
      <Spinner isActive={isLoading} />
      <div className='roles-modules-header-wrapper'>
        <div className='roles-modules-title'>
          <span className='title-text'>{t(`${translationPath}modules`)}</span>
        </div>
        <div className='roles-modules-description'>
          <span className='description-text'>{t(`${translationPath}modules-description`)}</span>
        </div>
      </div>
      <div className='roles-module-items-wrapper'>
        {modules.result &&
          modules.result.map((item, index) => (
            <ButtonBase
              className={`btns theme-solid roles-module-item${
                (activeModule &&
                  item.moduleId === activeModule.id &&
                  ' active-module') ||
                ''
              }`}
              key={`rolesModuleItemKey${index + 1}`}
              onClick={activeModuleHandler({
                id: item.moduleId,
                name: item.moduleName || 'N/A',
              })}
            >
              <span>{item.moduleName || 'N/A'}</span>
            </ButtonBase>
          ))}
      </div>
    </div>
  );
};

RolesModulesComponent.propTypes = {
  activeModule: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onActiveModuleChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
RolesModulesComponent.defaultProps = {
  activeModule: undefined,
};
