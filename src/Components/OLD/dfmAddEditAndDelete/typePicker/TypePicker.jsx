
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
} from '@material-ui/core';
import { types } from '../../../config/pagesTypes';

const TypePicker = ({ typeName, setPcikedType }) => {
  const type = types[typeName];
  if (!type) {
    setPcikedType(1);
    return (<></>);
  }
  return (
    <div
      className="pickTypeBackground"
      style={{ backgroundImage: `url(${type.backGroundImgurl})` }}
    >
      <Card className="pickTypeCard">
        <CardContent>
          <Typography className="pickTypeTitle" color="textSecondary" gutterBottom>
            <span style={{ color: '#fff', fontSize: 17 }}>{type.label}</span>
          </Typography>
          <Grid>

            {
          type.options.map((option,index) => (
            <Grid key= {index} className="pickTypeContainer" onClick={() => setPcikedType(option.value)}>
              <Grid item xs={12} className="pickTypeImageContainer">
                {option.icon}
              </Grid>
              <Grid item xs={12} className="pickTypeImageContainer">
                <span style={{ color: '#fff', fontSize: 17 }}>{option.label}</span>
              </Grid>
            </Grid>
          ))
          }

          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default TypePicker;