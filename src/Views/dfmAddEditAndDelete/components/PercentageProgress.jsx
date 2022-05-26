import React from 'react';
import { Grid, LinearProgress } from '@material-ui/core';
import { lighten, withStyles } from '@material-ui/core/styles';
import { config } from '../../../config/config';

const Progress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten(config.theme_primary_color_dark, 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: config.theme_primary_color_dark,
  },
})(LinearProgress);
const PercentageProgress = ({ dataCompleted = '0%' }) => (
  <Grid
    container
    direction='row'
    justify='center'
    alignItems='center'
    spacing={2}
  >
    <Grid item xs={10}>
      <Progress
        variant='determinate'
        color='secondary'
        value={dataCompleted && parseInt(dataCompleted.replace('%', ''))}
      />
    </Grid>
    <Grid item xs={2}>{dataCompleted || '0%'}</Grid>
  </Grid>
);
export default PercentageProgress;
