import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssignedAgentsCardComponent } from '../../../AgentsRotationCriteriaUtilities/AssignedAgentsCardComponent/AssignedAgentsCardComponent';

export const SelectedAgentsView = ({
  agants, ondrag, active, setDropBox, dropBox, type, rotationCriteriaId, removeAgent,
  sortNameSelectedAgents,
  sortNumSelectedAgents,
  setSortNumSelectedAgents,
  setSortNameSelectedAgents,
}) => {
  const parentTranslationPath = 'Agents';
  const translationPath = '';
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className='assign-agents view-wrapper'>
      <div className='dragDrop-section'>
        <div className='section1' />
        <div className='section2'>
          <div className='Process-details'>
            {' '}
            <div className='rule-user'>
              <span>
                {type === 0 ? t(`${translationPath}AssignAgent-this-rotation-Criteria`) : t(`${translationPath}AssignListing-this-rotation-Criteria`)}
              </span>
            </div>
            <div className='AgentsInRotation'>
              <span>
                {type === 0 ? t(`${translationPath}Agents-in-this-rotation-Criteria`) : t(`${translationPath}Listing-in-this-rotation-Criteria`)}

              </span>
            </div>
          </div>

          <div
            className={dropBox ? 'dropBoxOver' : 'dropBox'}
            onDrop={(ev) => {
              ev.preventDefault();
              ondrag(active);
              setDropBox(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDropBox(true);
            }}
          >
            <div className='account-multiple'>
              <span className=' mdi mdi-account-multiple-outline c-blue-lighter' />
            </div>
            <div className='drop-here'>
              <span>{t(`${translationPath}Drag-and-drop`)}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='agent-sub-header-section'>
          <div className='sub-header1' />
          <div className='sub-header2 selected-agent'>
            <div>
              <span
                className='MuiButtonBase-root MuiTableSortLabel-root'
                tabIndex='0'
                role='button'
                aria-disabled='false'
              >
                {t(`${translationPath}name-email`)}
                <svg
                  className={`MuiSvgIcon-root MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc sortByName ${sortNameSelectedAgents}`}
                  focusable='false'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  onClick={() => {
                    setSortNameSelectedAgents(!sortNameSelectedAgents);
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
                  className={`MuiSvgIcon-root MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc sortById ${sortNumSelectedAgents}`}
                  focusable='false'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  onClick={() => {
                    setSortNumSelectedAgents(!sortNumSelectedAgents);
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
          agents={agants}
          removeAgent={removeAgent}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          rotationCriteriaId={rotationCriteriaId}
        />
      </div>
    </div>
  );
};
