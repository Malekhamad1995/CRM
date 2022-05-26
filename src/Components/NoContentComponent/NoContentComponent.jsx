import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NoSearchResult from '../../assets/images/defaults/NoContent.png';
import './NoContent.scss';

export const NoContentComponent = () => {
  const { t } = useTranslation('Shared');
  const translationPath = 'NotFoundViews.';

  return (
    navigator.onLine && (
      <Grid container className="no-content-result">
        <Grid item className="no-content-text">
          <h1 className="no-content-title">{t(`${translationPath}No-Content`)}</h1>
          <h3 className="no-content-result-subtitle">
            {t(`${translationPath}This-page-is-empty`)}
          </h3>
        </Grid>
        <Grid item>
          <img
            src={NoSearchResult}
            alt={t(`${translationPath}No-Content`)}
            className="no-content-img"
          />
        </Grid>
      </Grid>
    )
  );
};
