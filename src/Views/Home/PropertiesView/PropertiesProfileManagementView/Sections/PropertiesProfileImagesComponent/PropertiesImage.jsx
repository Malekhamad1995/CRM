import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { GetParams, showError, showSuccess } from '../../../../../../Helper';
import { DialogComponent, Spinner } from '../../../../../../Components';
import {
  CreatePropertyImage,
  GetAllPropertyImagesCategoryByPropertyId,
  UpdatePropertyImage,
} from '../../../../../../Services';
import { ImagesGalleryAlbumsCardComponent } from '../../../../ImagesGallery/Sections/ImagesGalleryAlbumsComponent/Sections';
import { UnitProfileImagesCardActionEnum } from '../../../../../../Enums';
import { DialogsPropertiesImage } from './Dialogs/DialogsPropertiesImage';

export const PropertiesImage = ({ parentTranslationPath, translationPath, HideEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setresponse] = useState([]);
  const [state, setstate] = useState([]);
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [DialogComponentSize, setDialogComponentSize] = useState('sm');
  const property = true;
  const GetAllPropertyImagesCategory = useCallback(async (propertyId) => {
    setIsLoading(true);
    const result = await GetAllPropertyImagesCategoryByPropertyId(propertyId);
    if (!(result && result.status && result.status !== 200)) setresponse(result || []);
    else setresponse([]);
    setIsLoading(false);
  }, []);

  const AddPropertiesImage = useCallback(async () => {
    setIsLoading(true);
    const res =
      (activeItem && (await UpdatePropertyImage(state))) || (await CreatePropertyImage(state));
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}CreatePropertyImage-successfully`));
      setIsOpenDialog(false);
      GetAllPropertyImagesCategory(+GetParams('id'));
    } else {
      showError(t(`${translationPath}Create-PropertyImage-failed`));
      setIsOpenDialog(false);
    }

    setIsLoading(false);
  }, [GetAllPropertyImagesCategory, activeItem, state, t, translationPath]);

  useEffect(() => {
    const propertyId = +GetParams('id');
    if (propertyId !== null) GetAllPropertyImagesCategory(propertyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <ButtonBase
              className='btns theme-solid bg-primary'
              onClick={() => {
                setIsOpenDialog(true);
                setActiveItem(null);
              }}
            >
              <span className='mdi mdi-plus' />
              <span className='px-1'>{t(`${translationPath}Add-new`)}</span>
            </ButtonBase>
          </div>
          {response.length === 0 ? (
            <div className='EmptyPage' />
          ) : (
            <ImagesGalleryAlbumsCardComponent
              data={response || []}
              Display={UnitProfileImagesCardActionEnum.Hide}
              HideEdit={false}
              isEdit
              property={property}
              isOpenDialog
              hidePhotosTooltip
              onIconImageClick
              propertyId={+GetParams('id')}
              onClickEdit={() => setIsOpenDialog(true)}
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
          saveIsDisabled={
            (!state && state.categoryId) || (state && state.files && !state.files.length >= 1)
          }
          maxWidth={DialogComponentSize}
          dialogContent={(
            <>
              <DialogsPropertiesImage
                size={(itemsize) => setDialogComponentSize(itemsize)}
                data={(data) => setstate(data)}
                activeItem={activeItem}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </>
          )}
          saveClasses='btns theme-solid  w-100 mx-2 mb-2'
          isOpen={isOpenDialog}
          onSaveClicked={() => {
            AddPropertiesImage();
            setActiveItem(null);
          }}
          onCloseClicked={() => {
            setIsOpenDialog(false);
            setActiveItem(null);
          }}
          onCancelClicked={() => {
            setIsOpenDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};
PropertiesImage.propTypes = {
  HideEdit: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
PropertiesImage.defaultProps = {
  HideEdit: true,
};
