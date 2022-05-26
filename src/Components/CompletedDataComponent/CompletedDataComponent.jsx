import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { getBgProgressColor } from '../../Helper';
import { HistoryTabsComponent } from '../HistoryComponent/HistoryTabsComponent';

export const CompletedDataComponent = ({ completedData }) => {
  const { t } = useTranslation('Shared');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='completed-data-component-wrapper'>
        <span className='completed-history-wrapper'>
          <ButtonBase onClick={() => setIsOpen(true)} className='btns c-black-light history-button'>
            <span className='mdi mdi-clock-time-four-outline' />
            {t('history')}
          </ButtonBase>
        </span>
        <div
          className={`completed-data-content ${getBgProgressColor(completedData || 0).className}`}
        >
          <span>{`${(completedData && `${completedData}%`) || 'N/A'}`}</span>
        </div>
      </div>
      <HistoryTabsComponent isOpen={isOpen} isOpenChanged={() => setIsOpen(false)} />
    </>
  );
};

CompletedDataComponent.propTypes = {
  completedData: PropTypes.number.isRequired,
};
