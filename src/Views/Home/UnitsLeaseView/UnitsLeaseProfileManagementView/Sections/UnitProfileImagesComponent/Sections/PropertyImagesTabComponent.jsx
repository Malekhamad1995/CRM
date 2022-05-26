import React, { useCallback, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { ImagesCardComponent } from '../Shared';
import { UnitProfileImagesCardActionEnum } from '../../../../../../../Enums';
import { GetAllPropertyImagesCategoryByPropertyId } from '../../../../../../../Services';

export const PropertyImagesTabComponent = ({
  parentTranslationPath,
  translationPath,
  propertyId,
}) => {
  const [result, setResult] = useState();

  const GetAllPropertyImages = useCallback(async () => {
    const response = await GetAllPropertyImagesCategoryByPropertyId(propertyId);
    setResult(response);
  }, [propertyId]);
  useEffect(() => {
    GetAllPropertyImages();
  }, [GetAllPropertyImages]);
  return (
    <div>
      <ImagesCardComponent
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        data={result}
        Display={UnitProfileImagesCardActionEnum.Hide}
      />
    </div>
  );
};
PropertyImagesTabComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertyId: PropTypes.number.isRequired,
};
