import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NotFound from '../../assets/images/defaults/404.png';
import './NoInternetComponent.scss';

export const NoDataFoundComponent = () => {
  const { t } = useTranslation('Shared');
  const translationPath = 'NotFoundViews.';

  return (
    !navigator.onLine && (
      <Grid container className="no-data-result">
        <Grid item className="no-data-text">
          {t(`${translationPath}no-internet-connection`)}
        </Grid>
        <Grid item>
          <img
            src={NotFound}
            alt={t(`${translationPath}No-internet`)}
            className="no-data-img"
          />
        </Grid>
      </Grid>
    )
  );
};
