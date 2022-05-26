/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogComponent, Spinner, TabsComponent, UploaderComponent
} from '../../../../../Components';
import 'react-quill/dist/quill.snow.css';
import {
  GetParams, showError, showSuccess
} from '../../../../../Helper';
import { ImagesGalleryFilterEnum, UploaderThemesEnum } from '../../../../../Enums';
import { DetailsComponentTabsData } from '../DetailsComponentTabsData';
import { TabelSubCommunitiesRelated } from '../../LocationSharingUtilities';
import { TabelCommunitiesRelated } from '../../LocationSharingUtilities/TabelCommunitiesRelated';
import { ImagesGalleryPhotosCardComponent } from '../../LocationSharingUtilities/ImagesGalleryPhotosCardComponent/ImagesGalleryPhotosCardComponent';
import { CreateOrUpdateLocationLookupAlbum, DeleteAlbumImage, GetAllImagesByTypeId } from '../../../../../Services';

export const EditFormDistrict = ({
  parentTranslationPath,
  translationPath,
  // validatestate,
  // obejectDTO,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filter] = useState({
    pageSize: 1000,
    pageIndex: 0,
    search: '',
  });
  const [state, setState] = useState({
    lookupItemId: 0,
    arabicLocationName: '',
    LocationName: '',
    files: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setisOpen] = useState(false);
  const [item, setitem] = useState(null);
  const [cityPhotos, setCityPhotos] = useState({
    result: [],
    totalCount: 0,
  });
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllCityPhotos = useCallback(async () => {
    const res = await GetAllImagesByTypeId({
      ...filter,
      lookupItemId: +GetParams('id'),
      typeId: ImagesGalleryFilterEnum.District.key
    });
    if (!(res && res.status && res.status !== 200)) {
      setCityPhotos({
        result: res.result,
        totalCount: res.totalCount,
      });
    } else
      showError(t(`${translationPath}permission`));
  });
  const deleteHandler = async (ImageId) => {
    setIsLoading(true);
    const res = await DeleteAlbumImage(ImageId.albumImagesId);
    if (!(res && res.status && res.status !== 200)) {
      getAllCityPhotos();
      setIsLoading(false);
      showSuccess(t(`${translationPath}image-delete-successfully`));
    } else showError(t(`${translationPath}image-delete-failed`));
    setisOpen(false);
    setIsLoading(false);
  };

  const saveHandler = async () => {
    setIsLoading(true);
    const toSaveState = {
      imageGalleryType: ImagesGalleryFilterEnum.District.lookupType,
      lookupItemId: +GetParams('id'),
      albumImages: state.files,
    };
    const res =
      await CreateOrUpdateLocationLookupAlbum(toSaveState);
    setIsLoading(false);
    if (!(res && res.data && res.data.ErrorId)) {
      if (res) {
        showSuccess(t(`${translationPath}image-uplode-successfully`));
        getAllCityPhotos();
      } else showError(t(`${translationPath}image-uplode-failed`));
    }
  };
  useEffect(() => {
    getAllCityPhotos();
  }, []);
  useEffect(() => {
    if (state.files !== '')
      saveHandler();
  }, [state.files]);

  return (
    <div className='view-wrapper-editFormCountry'>
      <div className='d-flex-column'>
        <div className='UploaderComponent-wrapered pt-4'>
          <UploaderComponent
            idRef='profileImgRef'
            uploaderTheme={UploaderThemesEnum.box.key}
            defaultImage='Uploadmark'
            WithoutDefaultImg
            dropHereText='Drag-and-drop-here-or-browse-File'
            multiple={false}
            initUploadedFiles={
              (state.templateFileId && [
                {
                  uuid: state.templateFileId,
                  fileName: state.templateFileName,
                },
              ]) ||
              []
            }
            uploadedChanged={(files) => {
              setState((items) => ({
                ...items,
                files: [{
                  fileId: (files.length > 0 && files[0].uuid) || null,
                  fileName: (files.length > 0 && files[0].fileName) || null,
                }]
              }));
            }}
          />
        </div>
        <div>
          <span className=' pb-4 label-wrapper'>{t(`${translationPath}All-images-for-selected-District`)}</span>
          <div className='pt-4 ImagesGalleryPhotosCardComponent-wraper-EditFormCountry '>
            <div className='pt-4  '>
              <>
                <ImagesGalleryPhotosCardComponent
                  data={cityPhotos.result || []}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  WithCheckbox
                  Selectedvalue={(items) => console.log(items)}
                  deletevalue={(items) => { setitem(items); setisOpen(true); }}
                />
                <DialogComponent
                  titleText='confirm-message'
                  saveText='confirm'
                  saveType='button'
                  maxWidth='sm'
                  dialogContent={(
                    <div className='d-flex-column-center'>
                      <Spinner isActive={isLoading} isAbsolute />
                      <span className='mdi mdi-close-octagon c-danger mdi-48px' />
                      <span>{`${t(`${translationPath}ConfirmText`)}`}</span>
                    </div>
                  )}
                  saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
                  isOpen={isOpen}
                  onSaveClicked={() => deleteHandler(item)}
                  onCloseClicked={() => { setisOpen(false); }}
                  onCancelClicked={() => { setisOpen(false); }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </>
            </div>
          </div>
        </div>
      </div>
      <div className='w-100 pt-4'>

        <TabsComponent
          data={DetailsComponentTabsData}
          labelInput='tab'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          themeClasses='theme-curved'
          currentTab={activeTab}
          onTabChanged={onTabChanged}
        />
        {activeTab === 0 && (
          <div>
            <TabelCommunitiesRelated
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <TabelSubCommunitiesRelated
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        )}
      </div>
    </div>


  );
};
// AddFormCountry.propTypes = {
//   parentTranslationPath: PropTypes.string.isRequired,
//   translationPath: PropTypes.string.isRequired,
//   activeItem: PropTypes.instanceOf(Object).isRequired,
//   Data: PropTypes.instanceOf(Object).isRequired,
//   edit: PropTypes.bool.isRequired,
//   onCancelClicked: PropTypes.func.isRequired,
//   GetAllActivityTypesAPI: PropTypes.func.isRequired,
//   setReloading: PropTypes.func,
// };
