import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { AssignedAgentsCardComponent } from '../AssignedAgentsCardComponent/AssignedAgentsCardComponent';
import { Inputs } from '../../../../../../Components/Controls/Inputs/Inputs';
import { useOnClickOutside } from '../../../../../../Hooks';

export const AssignAgentsView = ({ agants, removeAgent, onClick }) => {
  const parentTranslationPath = 'Agents';
  const translationPath = '';
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const agentRef = useRef();
  const { t } = useTranslation(parentTranslationPath);
  useOnClickOutside(agentRef, () => setIsSearch(false));
  return (
    <div className='assign-agents view-wrapper' ref={agentRef}>
      <div className='agent-header-section'>
        <div className='header-section1' />
        <div className='header-section2'>
          <span>{t(`${translationPath}assign-agent-to-this-rotation`)}</span>
          <div className={`search-btn ${isSearch}`}>
            <ButtonBase
              className='MuiButtonBase-root btns theme-solid header-search-btn'
              tabIndex='0'
              onClick={() => setIsSearch(true)}
            >
              <span className='mdi mdi-magnify' />
              <span className='px-1'>{t(`${translationPath}search`)}</span>
              <span className='MuiTouchRipple-root' />
            </ButtonBase>
          </div>

          <div className={`search ${isSearch}`}>
            <Inputs
              className='inputs theme-solid'
              fullWidth
              variant='outlined'
              value={search || ''}
              onInputChanged={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div className='agent-sub-header-section'>
          <div className='sub-header1' />
          <div className='sub-header2'>
            <div>
              <span
                className='MuiButtonBase-root MuiTableSortLabel-root'
                tabIndex='0'
                role='button'
                aria-disabled='false'
              >
                {t(`${translationPath}name-email`)}

                <svg
                  className='MuiSvgIcon-root MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc'
                  focusable='false'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path d='M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z' />
                </svg>
              </span>
            </div>
            <div className='header-sub-section-id'>
              <span
                className='MuiButtonBase-root MuiTableSortLabel-root'
                tabIndex='0'
                role='button'
                aria-disabled='false'
              >
                {t(`${translationPath}numberOfAssignedSchemas`)}

                <svg
                  className='MuiSvgIcon-root MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc'
                  focusable='false'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path d='M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z' />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='bulked-units-section'>
        <AssignedAgentsCardComponent
          agents={
            search ?
              agants.filter((name) =>
                Object.values(name).some((val) => typeof val === 'string' && val.includes(search))) :
              agants
          }
          onClick={onClick}
          removeAgent={removeAgent}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};
