import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetParams, showError, showSuccess } from '../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../Components';
import {
  CreatePropertyImage,
  GetAllPropertyImageLocationCategoryByPropertyId,
  UpdatePropertyImage,
} from '../../../../../../Services';
import { ImagesGalleryAlbumsCardComponent } from '../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { UnitProfileImagesCardActionEnum } from '../../../../../../Enums';
import { DialogsPropertiesLocationimages } from './Dialogs/DialogsPropertiesLocationimages';

export const Locationimages = ({ parentTranslationPath, translationPath, HideEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setresponse] = useState([]);
  const { t } = useTranslation(parentTranslationPath);
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const property = true;
  const [DialogComponentSize, setDialogComponentSize] = useState('sm');
  const [state, setstate] = useState({});
  const GetAllPropertyImageLocationCategory = useCallback(async (propertyId) => {
    setIsLoading(true);
    const result = await GetAllPropertyImageLocationCategoryByPropertyId(propertyId);
    if (!(result && result.status && result.status !== 200)) setresponse(result || []);
    else setresponse([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const propertyId = +GetParams('id');
    if (propertyId !== null) GetAllPropertyImageLocationCategory(propertyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddPropertiesLocationImage = useCallback(async () => {
    setIsLoading(true);
    const res =
      (activeItem && (await UpdatePropertyImage(state))) || (await CreatePropertyImage(state));
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}CreatePropertyImage-successfully`));
      setIsOpen(false);
      GetAllPropertyImageLocationCategory(+GetParams('id'));
    } else showError(t(`${translationPath}Create-PropertyImage-failed`));
    setIsLoading(false);
  }, [GetAllPropertyImageLocationCategory, activeItem, state, t, translationPath]);
  return (
    <div className='property-imgaes-wrapers'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='property-cards'>
        <div className='childs-wrapper'>
          <div
            className={
              response.length === 0 ?
                'section px-2 d-flex-center mt-3 mb-3 ' :
                'section px-2  mt-3 mb-3'
            }
          >
            {/* <ButtonBase className='btns theme-solid bg-primary' onClick={() => setIsOpen(true)}>
              <span className='mdi mdi-plus' />
              <span className='px-1'>{t(`${translationPath}add-new`)}</span>
            </ButtonBase> */}
          </div>
          {response.length === 0 ? (
            <div className='EmptyPage' />
          ) : (
            <ImagesGalleryAlbumsCardComponent
              data={response.map((element) => {
                var album = {};
                album["categoryId"] = element.categoryId;
                album["categoryName"] = element.categoryName;
                album["createdBy"] = element.createdBy;
                album["images"] = element.image;
                return album;
              })}
              Display={UnitProfileImagesCardActionEnum.Hide}
              HideEdit={HideEdit}
              onClickEdit={() => setIsOpen(true)}
              isEdit
              property={property}
              hidePhotosTooltip
              // onIconImageClick
              propertyId={+GetParams('id')}
              EdititemData={(activeitem) => setActiveItem(activeitem)}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
        <DialogComponent
          titleText={(activeItem && 'edit-image') || 'Add-new-image'}
          saveText='save'
          saveType='button'
          maxWidth={DialogComponentSize}
          saveIsDisabled={!state.categoryId || !state.files.length >= 1}
          dialogContent={(
            <>
              <DialogsPropertiesLocationimages
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                activeItemcard={activeItem}
                size={(itemsize) => setDialogComponentSize(itemsize)}
                data={(data) => setstate(data)}
              />
            </>
          )}
          saveClasses='btns theme-solid  w-100 mx-2 mb-2'
          isOpen={isOpen}
          onSaveClicked={() => {
            AddPropertiesLocationImage();
            setActiveItem(null);
          }}
          onCloseClicked={() => {
            setIsOpen(false);
            setActiveItem(null);
          }}
          onCancelClicked={() => {
            setIsOpen(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};

Locationimages.propTypes = {
  HideEdit: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
Locationimages.defaultProps = {
  HideEdit: true,
};
