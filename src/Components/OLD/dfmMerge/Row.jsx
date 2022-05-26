import React from 'react';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import { }from '../../../utils/ExtractValue';

const Row = ({
  keyOfValue, firstValue, secondValue, onChange,selectedValue,firstValueBeforeExtacting,secondValueBeforeExtacting
}) => {
  // const [value, setValue] = React.useState(0);
  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            minHeight: 50,
          }}
        >
          <Grid item xs={2} className="dfmMergeRowItem">{keyOfValue}</Grid>
          <Grid item xs={2} className="dfmMergeRowItem">N/A</Grid>
         <Grid item xs={1}/>
          <Grid item xs={3} className="dfmMergeRowItem">
            <Grid
              container
              justify="center"
              alignItems="center"
              spacing={3}
              className="dfmMergeRowItem"
            >
              <Grid item xs={2}  className="dfmMergeRowItem">
                <Radio
                  checked={firstValue === secondValue || selectedValue === firstValue}
                  disabled={firstValue === secondValue}
                  onChange={() => {
                    onChange(keyOfValue, firstValueBeforeExtacting);
                  }}
                  value={firstValue}
                />
              </Grid>
              <Grid item xs={10}   style={{justifyContent:'left'}} className="dfmMergeRowItem">{firstValue}</Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}/>
          <Grid item xs={3} className="dfmMergeRowItem">
            <Grid
              container
              justify="center"
              alignItems="center"
              spacing={3}
              className="dfmMergeRowItem"
            >
              <Grid item xs={2}  className="dfmMergeRowItem">
                <Radio
                  checked={firstValue === secondValue || selectedValue === (secondValue)}
                  disabled={firstValue === secondValue}
                  onChange={() => {
                    onChange(keyOfValue, secondValueBeforeExtacting);
                  }}
                  value={secondValue}
                />
              </Grid>
              <Grid item xs={10}   style={{justifyContent:'left'}} className="dfmMergeRowItem">{secondValue}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};
export default Row;
