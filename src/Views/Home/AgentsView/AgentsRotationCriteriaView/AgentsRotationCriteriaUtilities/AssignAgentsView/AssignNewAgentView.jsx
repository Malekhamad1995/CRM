import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import { AssignedAgentsCardComponent } from '../AssignedAgentsCardComponent/AssignedAgentsCardComponent';
import { useOnClickOutside } from '../../../../../../Hooks';
import { Inputs } from '../../../../../../Components/Controls/Inputs/Inputs';

export const AssignNewAgent = ({
  agants, removeAgent, onClick, SetActive, setDropBox, setSearch, search, type, setSortName, sortName, sortNum, setSortNum
}) => {
  const parentTranslationPath = 'Agents';
  const translationPath = '';
  const { t } = useTranslation(parentTranslationPath);
  const agentRef = useRef(null);
  const [isSearch, setIsSearch] = useState(false);
  useOnClickOutside(agentRef, () =>
    setIsSearch(false));

  useEffect(() => {
    if (!isSearch)
      setSearch('');
  }, [isSearch]);

  return (
    <div className='assign-agents view-wrapper' ref={agentRef}>
      <div className='agent-header-section'>
        <div className='header-section1' />
        <div className='header-section2'>
          <div className='Process-details'>
            {' '}
            <div className='All-agent'>
              <span>
                {type === 0 ? t(`${translationPath}All-Agents`) : t(`${translationPath}All-Listing`)}
              </span>
            </div>
            <div className={`details ${isSearch} `}>
              <span onClick={() => setIsSearch(true)}>
                {type === 0 ? t(`${translationPath}search-or-select`) : t(`${translationPath}search-or-select_listing_agent`)}
              </span>
            </div>
            <div className={`detalis-Auto ${isSearch}`}>
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

          <ButtonBase
            className='MuiButtonBase-root btns theme-solid header-search-btn search'
            tabIndex='0'
            onClick={() => {
              setIsSearch(!isSearch);
            }}
          >
            <span className='mdi mdi-magnify' />
            <span className='px-1'>{t(`${translationPath}search`)}</span>
            <span className='MuiTouchRipple-root' />
          </ButtonBase>
        </div>
      </div>
      <div>
        <div className='agent-sub-header-section'>
          <div className='sub-header1' />
          <div className='sub-header2 sortName'>
            <div>
              <span
                className='MuiButtonBase-root MuiTableSortLabel-root'
                tabIndex='0'
                role='button'
                aria-disabled='false'
              >
                {t(`${translationPath}name-email`)}

                <svg
                  className={`MuiSvgIcon-root MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc sortByName ${sortName}`}
                  focusable='false'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  onClick={() => {
                    setSortName(!sortName);
                  }}
                >
                  <path d='M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z' />
                </svg>
              </span>
            </div>
            <div className='header-sub-section-id'>
              <span
                className='MuiButtonBase-root MuiTableSortLabel-root MuiButtonBase-responsive'
                tabIndex='0'
                role='button'
                aria-disabled='false'
              >
                {type === 0 ? t(`${translationPath}numberOfAssignedSchemas`) : t(`${translationPath}numberOfListingSchemas`)}
                <svg
                  className={`MuiSvgIcon-root MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc sortById ${sortNum}`}
                  focusable='false'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  onClick={() => {
                    setSortNum(!sortNum);
                  }}
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
          type={type}
          setDropBox={setDropBox}
          SetActive={SetActive}
          agents={agants}
          onClick={onClick}
          removeAgent={removeAgent}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};


AssignNewAgent.propTypes = {
  removeAgent: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
  agants: PropTypes.instanceOf(Array),
  onClick: PropTypes.func.isRequired,
  SetActive: PropTypes.func.isRequired,
  setDropBox: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  setSortName: PropTypes.func.isRequired,
  sortName: PropTypes.bool.isRequired,
  sortNum: PropTypes.bool.isRequired,
  setSortNum: PropTypes.func.isRequired,
};
