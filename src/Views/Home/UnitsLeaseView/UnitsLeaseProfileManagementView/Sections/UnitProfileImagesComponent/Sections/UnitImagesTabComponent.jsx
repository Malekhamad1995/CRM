import React from 'react';
import { PropTypes } from 'prop-types';
import { ImagesCardComponent } from '../Shared';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../Enums';

const data = [
  {
    cityName: 'Libya',
    districtName: 'Libya',
    communityName: 'Libya',
    countryName: 'Libya',
    Subcommunity: 'Libya',
  },
];
export const UnitImagesTabComponent = ({ parentTranslationPath, translationPath }) => (
  <div>
    <ImagesCardComponent
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      data={data}
      Display={UnitProfileImagesCardActionEnum.Show}
    />
  </div>
);
UnitImagesTabComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
