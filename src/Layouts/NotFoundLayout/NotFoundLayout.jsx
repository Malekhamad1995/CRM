import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NotFound from '../../assets/images/defaults/404.png';
import './NotFound.scss';

export const NotFoundLayout = () => {
  const { t } = useTranslation('Shared');
  const translationPath = 'NotFoundViews.';

  return (
    navigator.onLine && (
      <Grid container className='no-data-result'>
        <Grid item className='no-data-text'>
          <h1 className='no-data-title'>404</h1>
          <h3 className='no-data-result-subtitle'>
            {t(`${translationPath}Error-page-not-found`)}
          </h3>
        </Grid>
        <Grid item>
          <img
            src={NotFound}
            alt={t(`${translationPath}not-found`)}
            className='no-data-img'
          />
        </Grid>
      </Grid>
    )
  );
};
