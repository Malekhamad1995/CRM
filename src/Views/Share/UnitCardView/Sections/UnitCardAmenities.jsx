import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

UnitCardAmenities.propTypes = {
    unit: PropTypes.object
};

function UnitCardAmenities({ unit }) {
    if (!unit || !unit.unit_Amenities) return <></>;
    return (
      <tr>
        <td style={{ height: '22px' }} colSpan='4'>
          <table width='644' border='0' cellSpacing='0' cellPadding='0'>
            <tbody>
              <tr>
                <td align='center' valign='center' colSpan='7'>
                  <table width='100%' border='0' cellSpacing='0' cellPadding='0'>
                    <tbody>
                      <tr>
                        <td valign='top' style={{'width': '48%'}}>
                            <table width='100%' border='0' cellSpacing='0' cellPadding='0'>
                                <tbody>
                                    <tr>
                                        <td
                                        align='left'
                                        className='c14'
                                        colSpan='3'
                                      >
                                                  Amenities
                                      </td>
                                      </tr>
                                    <tr>
                                        <td>
                                        <Grid container justifyContent='center' spacing={2}>
                                            {unit.unit_Amenities && unit.unit_Amenities.split('|').map((el) => (
                                                <Grid item xs={3} className={'c21'}>
                                                    {' '}
                                                    {el.split('^')[1]}
                                                  </Grid>

                                                      ))}
                                          </Grid>
                                      </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );
}

export default UnitCardAmenities;
