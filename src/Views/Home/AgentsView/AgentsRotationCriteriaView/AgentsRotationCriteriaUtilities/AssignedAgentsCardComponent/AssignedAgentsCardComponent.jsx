import React, {
  useCallback, useEffect, useState, useReducer
} from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { GetParams, showSuccess } from '../../../../../../Helper';
import { DeleteAgentCriteriaDialog } from '../../Dialogs/DeleteAgentCriteriaDialog/DeleteAgentCriteriaDialog';
import { Spinner } from '../../../../../../Components/SpinnerComponent/Spinner';

export const AssignedAgentsCardComponent = ({
  parentTranslationPath,
  translationPath,
  agents,
  removeAgent,
  onClick,
  SetActive,
  setDropBox,
  type,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('Agents');
  const [activeItem, setactive] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const apperActivearrow = (item) => {
    setactive(item);
  };
  const handleDrag = (item) => {
    SetActive(item);
    setDropBox(true);
  };
  useEffect(() => {
    setId(+GetParams('id'));
  });


  return (
    <div className='assigned-agents view-wrapper'>
      <Spinner isActive={loading} />
      {agents &&
        SetActive &&
        agents.map((item) => (
          <div
            id={item.agentId}
            draggable
            onDragStart={() => handleDrag(item)}
            onDragEnd={() => setDropBox(false)}
            className='ageent-section'
            onClick={() => {
              apperActivearrow(item);
              onClick && onClick(item);
            }}
          >
            <div className='arrow-section'>
              {activeItem && activeItem.agentId === item.agentId && (
                <span className='section-seperator mdi mdi-arrow-collapse-right c-gray' />
              )}
            </div>
            <div className='card-section'>
              <div
                className={`agents-card ${activeItem && activeItem.agentId === item.agentId ? 'active' : ''
                  }`}
              >
                <div className={removeAgent ? 'container-assigned uncursor' : 'container-assigned'}>
                  <div className='assigned-name'>
                    <div className='name-section'>
                      <span>{item.agentName}</span>
                    </div>
                    <div className='email-section'>
                      <span>{item.agentEmail}</span>
                    </div>
                  </div>
                  <div className='id-section'>
                    <span>{item.agentId || ''}</span>
                  </div>

                  <div className='assigned-delete'>
                    {activeItem === item ? (
                      <DeleteAgentCriteriaDialog
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        open={open}
                        setOpen={setOpen}
                        name={item.agentName}
                        item={item}
                        onCancel={() => setOpen(false)}
                        onDelete={async (e) => {
                          removeAgent(item);
                        }}
                      />
                    ) : null}

                    {removeAgent && (
                      <div className='delete-icon'>
                        <ButtonBase
                          className='MuiButtonBase-root btns-icon theme-transparent mx-1'
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <span className='mdi mdi-trash-can c-warning icon-size' />
                          <span className='MuiTouchRipple-root' />
                        </ButtonBase>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {agents &&
        !SetActive &&
        agents.map((item) => (
          <div
            id={item.agentId}
            className='ageent-section'
            onClick={() => {
              apperActivearrow(item);
              onClick && onClick(item);
            }}
          >
            <div className='arrow-section'>
              {activeItem && activeItem.agentId === item.agentId && (
                <span className='section-seperator mdi mdi-arrow-collapse-right c-gray' />
              )}
            </div>
            <div className='card-section'>
              <div
                className={`agents-card ${activeItem && activeItem.agentId === item.agentId ? 'active' : ''
                  }`}
              >
                <div className={removeAgent ? 'container-assigned uncursor' : 'container-assigned'}>
                  <div className='assigned-name'>
                    <div className='name-section'>
                      <span>{item.agentName}</span>
                    </div>
                    <div className='email-section'>
                      <span>{item.agentEmail}</span>
                    </div>
                  </div>
                  <div className='id-section'>
                    <span>{item.agentId || ''}</span>
                  </div>

                  <div className='assigned-delete'>
                    {activeItem === item ? (
                      <DeleteAgentCriteriaDialog
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        open={open}
                        setOpen={setOpen}
                        name={item.agentName}
                        item={item}
                        onCancel={() => setOpen(false)}
                        onDelete={async (e) => {
                          removeAgent(item);
                        }}
                      />
                    ) : null}

                    {removeAgent && (
                    <div className='delete-icon'>
                      <ButtonBase
                        className='MuiButtonBase-root btns-icon theme-transparent mx-1'
                        onClick={() => {
                            setOpen(true);
                          }}
                      >
                        <span className='mdi mdi-trash-can c-warning icon-size' />
                        <span className='MuiTouchRipple-root' />
                      </ButtonBase>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
