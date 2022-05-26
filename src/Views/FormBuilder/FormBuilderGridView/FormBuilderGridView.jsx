import React from 'react';
import { Card, CardContent, Grid } from '@material-ui/core';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import DonutSmallRoundedIcon from '@material-ui/icons/DonutSmallRounded';
import { GlobalHistory } from '../../../Helper';

const FormBuilderGridView = (props) => (
  <div className='FormBuilderGridView'>
    <Grid container spacing={4} className='FormWraper'>
      {props.formsResponse &&
        props.formsResponse.result &&
        props.formsResponse.result.map((item, index) => (
          <Grid item lg={3} sm={6} xl={3} xs={12} key={index}>
            <Card
              className='FormCard'
              onClick={() =>
                GlobalHistory.push(`/home/FormBuilder/FormEdit?type=${item.formsName}`)}
            >
              <CardContent>
                <Grid container>
                  <Grid item xs={3}>
                    <DonutSmallRoundedIcon />
                  </Grid>
                  <Grid item xs={7} className='cardName'>
                    {item.formsName.charAt(0).toUpperCase() + item.formsName.slice(1)}
                  </Grid>
                  <Grid item xs={2}>
                    <ArrowForwardIosRoundedIcon />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  </div>
);
export { FormBuilderGridView };
