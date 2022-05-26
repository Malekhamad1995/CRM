import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NotFound from '../../assets/images/defaults/PageError.png';
import './PageErrorLayout.scss';

const translationPath = 'NotFoundViews.';
export const PageErrorLayout = () => {
  const { t } = useTranslation('Shared');

  return (
    <Grid container className='no-data-error'>
      <Grid item className='no-error-text'>
        <h1 className='no-error-title'>{t(`${translationPath}oops`)}</h1>
        <h3 className='no-data-error-subtitle'>
          {t(
            `${translationPath}This-page-is-in-a-vacation-now-please-try-again-later`
          )}
        </h3>
      </Grid>
      <Grid item>
        <img
          src={NotFound}
          alt={t(`${translationPath}not-found`)}
          className='no-error-img'
        />
      </Grid>
    </Grid>
  );
};
