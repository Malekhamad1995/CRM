import React, {
  useState, useCallback, useReducer, useEffect
} from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../Components';
import { CreateUnitImages, GetAllUnitImages, UpdateUnitImages } from '../../../../../../Services';
import { ImageGalleryLookupsComponent } from '../../../../ImagesGallery/Dialogs/ImagesGalleryManagementDialog/Presentational';
import { UnitUploader } from '../UnitUploader/UnitUploader';
import { LoadableImageComponant } from '../../../../../../Components/LoadableImageComponant/LoadableImageComponant';
import { getDownloadableLink } from '../../../../../../Helper/Middleware.Helper';
import { LoadableImageEnum } from '../../../../../../Enums/LoadableImage.Enum';
import { GetParams, showError, showSuccess } from '../../../../../../Helper';
import { Spinner } from '../../../../../../Components/SpinnerComponent/Spinner';
import './UnitsSalesProfileManagementDialog.scss'

export const UnitsSalesProfileManagementDialog = ({
  unit,
  activeItem,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  updateData,
  ImageCategoryLookup
}) => {
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [images, setImages] = useState([]);
  const [dialogName, setDialogName] = useState();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useReducer(reducer, {
    unitId: +GetParams('id'),
    categoryId: '',
    files: [],
  });
  const [body, setBody] = useState({
    categoryId: state.categoryId,
    unitId: state.unitId,
    pageIndex: 1,
    pageSize: 100,
  });
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const removeImage = (item) => {
    const newImages = images.filter((image) => image !== item);
    setImages(newImages);
  };

  useEffect(() => {
    const getData = async () => {
      if (body && body.categoryId) {
        setLoading(true);
        const response = await GetAllUnitImages(body);
        if (!response) return;
        const list = [];
        response.result.map((item) => {
          list.push({ uuid: item.fileId, fileName: item.fileName });
        });
        setImages(list);
        setLoading(false);
      }
    };
    getData();
  }, [body]);

  useEffect(() => {
    if (activeItem && activeItem.categoryId)
      setBody((itemss) => ({ ...itemss, categoryId: activeItem && activeItem.categoryId }));
    setState({
      id: 'categoryId',
      value: activeItem && activeItem.categoryId,
    });
  }, [activeItem]);

  useEffect(() => {
    if (state && state.categoryId !== body.categoryId)
      setBody((itemss) => ({ ...itemss, categoryId: state && state.categoryId }));
  }, [state, body]);

  useEffect(() => {
    if (images.length > 0) setDialogName(true);
    else if (images.length === 0) setDialogName(false);
    setState({
      id: 'files',
      value: images.map((items) => ({ fileId: items.uuid, fileName: items.fileName })),
    });
    if (state.categoryId === '' || state.categoryId === null || state.categoryId !== body.categoryId) {
      setState({
        id: 'categoryId',
        value: activeItem && activeItem.categoryId,
      });
    }
  }, [images, activeItem]);


  const schema = Joi.object({
    categoryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}category-is-required`),
        'number.empty': t(`${translationPath}category-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const updateHandler = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    isOpenChanged(false);
    const res = await UpdateUnitImages(state);
    if (!(res && res.data && res.data.ErrorId)) {
      updateData();
      showSuccess(t(`${translationPath}photo-update-successfully`));
    } else {
      showError(
        t(
          `${translationPath}${(res &&
            res.data &&
            res.data.Message &&
            res.data.Message.substring(
              res.data.Message.lastIndexOf(':') + 1,
              res.data.Message.length
            )) ||
          'photo-update-failed'
          }`
        )
      );
    }
  };
  const saveHandler = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    isOpenChanged(false);
    setImages([]);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    const res = await CreateUnitImages(state);
    if (!(res && res.data && res.data.ErrorId)) {
      showSuccess(t(`${translationPath}photo-created-successfully`));
      updateData();
    } else {
      showError(
        t(
          `${translationPath}${(res &&
            res.data &&
            res.data.Message &&
            res.data.Message.substring(
              res.data.Message.lastIndexOf(':') + 1,
              res.data.Message.length
            )) ||
          'photo-create-failed'
          }`
        )
      );
    }
  };
  return (
    <DialogComponent
      wrapperClasses='unitpage'
      maxWidth={images.length > 0 || activeItem ? 'md' : 'sm'}
      titleText={dialogName ? 'edit-photo' : 'add-new-photo'}
      saveText='save'
      dialogContent={(
        <div className='Units-Sales-Profile-management view-wrapper'>
          <div className='dialog-item'>
            <ImageGalleryLookupsComponent
              activeItem={activeItem}
              initialId={activeItem && activeItem.categoryId}
              idRef='categoryIdRef'
              unit={unit}
              state={state}
              schema={schema}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              ImageCategoryLookup={ImageCategoryLookup}
            />
          </div>
          <div className='dialog-wrapper'>
            <div
              className={
                images.length > 0 || activeItem ?
                  'Unit-Uploader-wrapper-with-data' :
                  'Unit-Uploader-wrapper'
              }
            >
              <UnitUploader
                images={images}
                setImages={setImages}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>

            <div
              className={
                (images && images.length > 0) || activeItem ? 'previewPic' : 'previewnone'
              }
            >
              <Spinner isActive={loading} />
                {images &&
                  images.length > 0 &&
                  images.map((image) => (
                    <div className='All-Images'>

                      <LoadableImageComponant
                        classes='cover-image'
                        src={image.uuid && getDownloadableLink(image.uuid)}
                        alt={t(`${translationPath}cover-image`)}
                        width={150} height={100}
                      />
                      <span
                        className='mdi mdi-delete-circle-outline c-warning '
                        onClick={() => removeImage(image)}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
      onSubmit={activeItem ? updateHandler : saveHandler}
      isOpen={isOpen}
      onCancelClicked={() => {
        isOpenChanged(false);
        setImages([]);
      }}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
UnitsSalesProfileManagementDialog.propTypes = {
  ImageCategoryLookup: PropTypes.instanceOf(Object).isRequired,
  updateData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  unit: PropTypes.bool.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
