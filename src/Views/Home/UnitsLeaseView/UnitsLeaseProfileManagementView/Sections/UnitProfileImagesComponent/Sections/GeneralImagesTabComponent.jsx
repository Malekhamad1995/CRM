import React from 'react';
import { PropTypes } from 'prop-types';
import { ImagesCardComponent } from '../Shared';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../Enums';

export const GeneralImagesTabComponent = ({ parentTranslationPath, translationPath }) => {
  const data = [
    {
      cityName: 'amman',
      districtName: 'amman',
      communityName: 'amman',
      countryName: 'amman',
      Subcommunity: 'amman',
    },
  ];
  return (
    <div>
      <ImagesCardComponent
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        data={data}
        Display={UnitProfileImagesCardActionEnum.Show}
      />
    </div>
  );
};
GeneralImagesTabComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
