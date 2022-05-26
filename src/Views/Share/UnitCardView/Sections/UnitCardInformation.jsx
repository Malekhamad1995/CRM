import React from 'react';
import PropTypes from 'prop-types';

UnitCardInformation.propTypes = {
    unit: PropTypes.object
};

function UnitCardInformation({ unit }) {
    if (!unit) return <></>;

    return (
      <>
        <tr>
          <td style={{ height: '22px' }} colSpan='4'>
            <table width='644' border='0' cellSpacing='0' cellPadding='0'>
              <tbody>
                <tr>
                  <td align='center' valign='center' colSpan='7'>
                    <table width='100%' border='0' cellSpacing='0' cellPadding='0'>
                      <tbody>
                        <tr>
                          <td valign='top' style={{ width: '48%' }}>
                            <table className='table-collapsible'>
                              <tbody>
                                <tr>
                                  <th
                                    align='left'
                                    className='c14'
                                    colSpan='4'
                                  >
                                    Unit Details
                                  </th>
                                </tr>
                                <tr>
                                  <td align='left' valign='top' className='c13'>
                                    Type
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.category}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Handover
                                    Date
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.handoverDate}
                                  </td>
                                </tr>
                                <tr>
                                  <td align='left' valign='top' className='c13'>
                                    Ownership
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.property_ownership_desc}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td style={{ width: '4%' }}>&nbsp;</td>
                          <td valign='top' style={{ width: '48%' }}>
                            <table className='table-collapsible'>
                              <tbody>
                                <tr>
                                  <th
                                    align='left'
                                    className='c14'
                                    colSpan='4'
                                  >
                                    Financial Details
                                  </th>
                                </tr>
                                <tr>
                                  <td align='left' valign='top' className='c13'>
                                    Selling Price
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.sellprice}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Prices per Sq.ft/m
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {/* {'{Prices per Sq.ft/m}'} */}
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Expected Mortgage Installment
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {/* {'{Mortgage per Month}'} */}
                                    <br />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>

                        </tr>
                        <tr>
                          <td valign='top' style={{ width: '48%' }}>
                            <table className='table-collapsible'>
                              <tbody>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-bed-single-outline' />
                                    {' '}
                                    Bedroom
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.bedrooms}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-greenhouse' />
                                    {' '}
                                    Balcony
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.balconySize}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-view-compact' />
                                    {' '}
                                    Terrace
                                  </td>
                                  <td align='right' valign='top'>{unit.terraceSize}</td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-alpha-w-circle-outline' />
                                    {' '}
                                    Bathroom


                                  </td>


                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.no_of_bathrooms}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-alpha-p-circle-outline' />
                                    {' '}
                                    Private Parking
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.parking}
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-room-service-outline' />
                                    Maids Room
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.maidsroom}
                                  </td>
                                </tr>
                                <tr>
                                  <td align='left' valign='top' className='c13'>
                                    <i className='vertical-middle mdi mdi-store-outline' />
                                    Store Room
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.storeRoom}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-ruler' />
                                    Total Size
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.built_upArea}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-view-split-vertical' />
                                    {' '}
                                    View
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.unitView}
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-cat' />
                                    {' '}
                                    Pets
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.isAllowPets}

                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    <i className='vertical-middle mdi mdi-clock-outline' />
                                    Property Age
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.propertyCompletionDate}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td style={{ width: '4%' }}>&nbsp;</td>

                          <td valign='top' style={{ width: '48%' }}>
                            <table className='table-collapsible'>
                              <tbody>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Transfer Fee
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {/* {'{ Transfer Fee Completed PaidProp }'} */}
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td align='left' valign='top' className='c13'>
                                    Agency Fee
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {/* {'{Agency Fee}'} */}
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td align='left' valign='top' className='c13'>
                                    ROI
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.roi}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Service Charge
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {/* {'{Maintenance Fee}'} */}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Escrow No.
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {/* {'{Escrow Number}'} */}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align='left'
                                    valign='top'
                                    className='c13'
                                  >
                                    Expected Rent
                                  </td>
                                  <td
                                    align='right'
                                    valign='top'
                                    className='c15'
                                  >
                                    {unit.rent}
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
        <tr>
          <td style={{ height: '22px' }} colSpan='4'>&nbsp;</td>
        </tr>

      </>
    );
}

export default UnitCardInformation;
