import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AgentsTabelView } from './AgentsTabelView/AgentsTabelView';
import { Inputs, PermissionsComponent } from '../../../Components';
import { useTitle } from '../../../Hooks';
import { AgentsPermissions } from '../../../Permissions';

const parentTranslationPath = 'Agents';
const translationPath = '';

export const AgentsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [searchedItem, setSearchedItem] = useState('');
  const searchTimer = useRef(null);
  useTitle(t(`${translationPath}Agents`));

  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    filterBy: null,
    orderBy: null
  });
  const searchHandler = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({
     ...item, search: searchedItem, pageIndex: 0, filterBy: null, orderBy: null
     }));
    }, 700);
  };
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='Agents-wrapper view-wrapper'>
      <div className='w-100 px-2'>
        <PermissionsComponent
          permissionsList={Object.values(AgentsPermissions)}
          permissionsId={AgentsPermissions.ViewAllAgents.permissionsId}
        >
          <div className='header-section'>
            <div className='filter-section'>
              <div className='section' />
              <div className='section px-2'>
                <Inputs
                  value={searchedItem}
                  onKeyUp={searchHandler}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  idRef='AgentsRef'
                  label={t(`${translationPath}search-in-Agents`)}
                  inputPlaceholder={t(`${translationPath}search-Agents`)}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </div>
            </div>
          </div>
          <AgentsTabelView
            filter={filter}
            setFilter={setFilter}
            setSearchedItem={setSearchedItem}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </PermissionsComponent>
      </div>
    </div>
  );
};
