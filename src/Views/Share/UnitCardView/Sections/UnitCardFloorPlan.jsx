import React from 'react';
import PropTypes from 'prop-types';

UnitCardFloorPlan.propTypes = {
  unit: PropTypes.object
};

function UnitCardFloorPlan({ unit }) {
  if (!unit) return <></>;
  return (
    <>
      {((unit && unit.floorPlanImages && unit.floorPlanImages[0] !== undefined) && (
        <table width='600' align='center' className='c1' cellSpacing='0' cellPadding='0'>
          <tbody>
            <tr>
              <td>
                <table width='644' align='center' border='0' cellSpacing='0' cellPadding='0'>
                  <tbody>
                    <tr>
                      <td className='c17'>
                        Floor Plan
                      </td>
                      <td
                        align='right'
                        className='c18'
                        colSpan='2'
                      >
                        {' '}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className='c17'
                        colSpan='3'
                      >
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td
                        className='c17'
                        colSpan='3'
                      >
                        <table
                          width='484'
                          height='662'
                          align='center'
                          border='0'
                          cellSpacing='0'
                          cellPadding='0'
                        >
                          <tbody>
                            <tr>
                              <td align='center' valign='center' style={{ border: '1px solid #999999' }}>
                                <div className='c19'>
                                  <a
                                    href={unit.floorPlanImages && unit.floorPlanImages[0]}
                                    // eslint-disable-next-line react/jsx-no-target-blank
                                    target='_blank'
                                  >
                                    <img
                                      width='474'
                                      height='652'
                                      style={{ cursor: 'pointer' }}
                                      alt='Floor Plan 1'
                                      src={unit.floorPlanImages && unit.floorPlanImages[0]}
                                    />
                                  </a>
                                </div>
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
      )) || ''}
    </>
  );
}

export default UnitCardFloorPlan;
