import React from 'react';
import { PropTypes } from 'prop-types';
import { ImagesCardComponent } from '../Shared';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../Enums';

export const LocationImagesTabComponent = ({ parentTranslationPath, translationPath }) => {
  const data = [
    {
      cityName: 'amman',
      districtName: 'amman',
      communityName: 'amman',
      countryName: 'amman',
      Subcommunity: 'amman',
    },
    {
      cityName: 'aqaba',
      districtName: 'aqaba',
      communityName: 'aqaba',
      countryName: 'aqaba',
      Subcommunity: 'aqaba',
    },
  ];
  return (
    <div>
      <ImagesCardComponent
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        data={data}
        Display={UnitProfileImagesCardActionEnum.Hide}
      />
    </div>
  );
};
LocationImagesTabComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
