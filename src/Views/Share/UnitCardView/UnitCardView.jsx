import React, { useEffect, useState } from 'react';
import { GetParams, showError } from '../../../Helper';
import UnitCardHeader from './Sections/UnitCardHeader';
import { Spinner } from '../../../Components';
import { GetShareUnitById } from '../../../Services';
import UnitCardImagePart from './Sections/UnitCardImagePart';
import UnitCardInformation from './Sections/UnitCardInformation';
import UnitCardFloorPlan from './Sections/UnitCardFloorPlan';
import UnitCardAmenities from './Sections/UnitCardAmenities';
import PSIFooterTemplet from '../../../assets/images/defaults/PSIFooter.png';
import FooterPSIAssetsTemplet from '../../../assets/images/defaults/FooterPSIAssetsTemplet.jpg';

function UnitCardView() {
  const [unitId, setUnitId] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [unit, setUnit] = useState(null);
  useEffect(() => {
    setUnitId(+GetParams('id'));
  }, []);

  useEffect(() => {
    if (unitId === 0) return;
    callUnitShareDetails(unitId);
  }, [unitId]);

  const callUnitShareDetails = async (currentUnitId) => {
    setLoading(true);
    const res = await GetShareUnitById(currentUnitId);
    if (!res) showError('Server Error');
    setUnit(res);

    setLoading(false);
  };
  return (
    <div className='unit-card-view'>
      <Spinner isActive={isLoading} isAbsolute />
      <table width='600' align='center' className='c1' cellSpacing='0' cellPadding='0'>
        <tbody>
          <tr>
            <td>
              <table width='701' align='center' border='0' cellSpacing='0' cellPadding='0'>
                <tbody>
                  <UnitCardHeader unit={unit} />
                  <UnitCardImagePart unit={unit} />
                  <UnitCardInformation unit={unit} />
                  <UnitCardAmenities unit={unit} />
                </tbody>
              </table>
            </td>
          </tr>
          <footer>
            <img alt='FooterPSITemplet' src={PSIFooterTemplet || FooterPSIAssetsTemplet} style={{ width: '100%' }} />
          </footer>
        </tbody>
      </table>

      <UnitCardFloorPlan unit={unit} />

    </div>
  );
}

export default UnitCardView;
