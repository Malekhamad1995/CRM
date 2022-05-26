import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NoSearchResult from '../../assets/images/defaults/NoSearchResult.png';
import './NoSearchResult.scss';

export const NoSearchResultComponent = () => {
  const { t } = useTranslation('Shared');
  const translationPath = 'NotFoundViews.';

  return (
    navigator.onLine && (
      <Grid container className='no-search-result'>
        <Grid item className='no-result-text'>
          <h1 className='no-result-title'>{t(`${translationPath}No-Result-Found`)}</h1>
          <h3 className='no-search-result-subtitle'>
            {t(`${translationPath}Try-to-search-with-different-keywords`)}
          </h3>
        </Grid>
        <Grid item>
          <img
            src={NoSearchResult}
            alt={t(`${translationPath}No-Result-Found`)}
            className='no-search-img'
          />
        </Grid>
      </Grid>
    )
  );
};
