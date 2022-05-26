import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetParams } from '../../../../../../Helper';
import { FacebookGalleryComponent, Spinner } from '../../../../../../Components';
import { GetUnitImage } from '../../../../../../Services';
import { ImagesCardComponent } from './Sections';

export const UnitProfileImagesComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setresponse] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imageHandler = useCallback(
    (option) => {
      const index =
        response && response.unitJson.findIndex((item) => item.uuid === option.imagePath);
      if (index !== -1) setActiveImageIndex(index);
      setIsGalleryOpen(true);
    },
    [response]
  );

  const GetUnitImageFormId = useCallback(async (editId) => {
    setIsLoading(true);
    const result = await GetUnitImage(editId);
    if (!(result && result.status && result.status !== 200)) {
      setresponse(
        (result && {
          ...result,
          unitJson:
            (result.unitJson &&
              Object.entries(result.unitJson).reduce((total, item) => {
                if (item[0] !== 'selected')
                  total = total.concat(item[1].map((element) => ({ ...element, key: item[0] })));
                return total;
              }, [])) ||
            [],
        }) ||
          []
      );
    } else setresponse([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const editId = GetParams('id');
    if (editId !== null) GetUnitImageFormId(editId);
  }, [GetUnitImageFormId]);

  return (
    <div className='unit-profile-images-wrapper childs-wrapper'>
      <div className='title-section'>
        <span>{t(`${translationPath}Images`)}</span>
      </div>
      <div>
        <Spinner isActive={isLoading} isAbsolute />
        <div>
          <ImagesCardComponent
            cardClasses='unit-card-image-wrapper'
            onCardClickedHandler={(option) => imageHandler(option)}
            data={
              response &&
              response.unitJson &&
              response.unitJson.map((item) => ({
                imagePath: item.uuid,
                details: [
                  { title: 'category', value: item.key },
                  { title: 'title', value: item.fileName.replace(/\.[^.]*$/, '') },
                  {
                    title: 'Enteredon',
                    value: response.createdOn,
                    dateFormat: 'MM/DD/YYYY' || 'N/A',
                  },
                  { title: 'EnteredBy', value: response.createdBy || 'N/A' },
                ],
              }))
            }
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <FacebookGalleryComponent
            imageInput='uuid'
            titleText='images'
            isOpen={isGalleryOpen}
            translationPath={translationPath}
            activeImageIndex={activeImageIndex}
            data={response && response.unitJson}
            onOpenChanged={() => setIsGalleryOpen(false)}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
    </div>
  );
};

UnitProfileImagesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
