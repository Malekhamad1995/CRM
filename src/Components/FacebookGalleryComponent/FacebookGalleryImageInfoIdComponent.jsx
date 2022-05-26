import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Inputs, SwitchComponent, AutocompleteComponent } from '../Controls';
import { GetParams, showError, showSuccess } from '../../Helper';
import { GetUnitImageInfoByImageInfoId, CreateOrUpdateUnitImageInfo } from '../../Services';
import { Spinner } from '../SpinnerComponent/Spinner';
import { setState } from '../../Views/FormBuilder/reactschema/2/lib/utils';

export const FacebookGalleryImageInfoIdComponent = ({
  data,
  parentTranslationPath,
  translationPath,
  activeImageIndex,
  scrollCurrentItem,
  withdetails,
  updateData,
  activeImage,
  onOpenChanged
}) => {
  const { t } = useTranslation('Shared');
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const defaultData =
  {
    fileName: null,
    unitId: null,
    categoryId: null,
    fileId: null,
    imageTitle: null,
    imageDescription: null,
    isPublished: false,
    isNeedOwnerApproval: false,
    isApproved: false,
    approveOwnerId: null,
    approvedById: null,
    approvalDate: null,
    isMarketing: false,
    comments: null
  };
  const [state, setstateData] = useState({
    fileName: null,
    unitId: null,
    categoryId: null,
    fileId: null,
    imageTitle: null,
    imageDescription: null,
    isPublished: false,
    isNeedOwnerApproval: false,
    isApproved: false,
    approveOwnerId: null,
    approvedById: null,
    approvalDate: null,
    comments: null,
    isMarketing: false
  });
  const GetUnitImageInfoByImageInfoIdAPI = useCallback(async (unitId, fileId, categoryId) => {
    setLoading(true);
    const res = await GetUnitImageInfoByImageInfoId(unitId, fileId, categoryId);
    if (res && res.length === 0)
      setState(defaultData);
    else {
      setstateData(res);
      if (data) {
        setstateData((item) => ({
          ...item,
          categoryId: (data && data.categoryId) || null,
          fileId: (data && data.fileId) || null,
          fileName: (data && data.fileName) || null,
          unitId: (data && data.unitId) || +GetParams('id'),
          isMarketing: (data && data.isMarketing) || false,
          isPublished: (data && data.isPublished) || false,
        }));
      }
    }

    setLoading(false);
  }, [data, defaultData]);

  const SaveHandler = async () => {
    setIsLoading(true);
    const res = await CreateOrUpdateUnitImageInfo(state);
    if (!(res && res.status && res.status !== 200)) {
      // updateData();
      showSuccess(t('Shared:Info-add-successfully'));
      onOpenChanged(state);
    } else showError(t('Shared:failed-add-Info'));
    setIsLoading(false);
  };

  useEffect(() => {
    GetUnitImageInfoByImageInfoIdAPI(
      ((data && data.unitId)) || +GetParams('id'),
      ((data && data.fileId)) || null,
      ((data && data.categoryId)) || null,
    );
  }, [data]);

  useEffect(() => {
    if (state.isPublished === false)
      setstateData((item) => ({ ...item, isMarketing: false }));
  }, [state.isPublished]);
  return (
    <div className='FacebookGalleryImageInfoIdComponent-WRAPER'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='items-input'>
        <div className='item'>
          <Inputs
            idRef={`TitleRef${data.unitId}`}
            labelValue={t('Shared:Image-Title')}
            inputPlaceholde={t('Shared:Image-Title')}
            value={state.imageTitle || ''}
            isSubmitted
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const value = event && event.target && event.target.value;
              setstateData((item) => ({ ...item, imageTitle: value || '' }));
            }}
          />
        </div>
        <div className='item'>
          <Inputs
            idRef='DescriptionRef'
            labelValue={t('Shared:Image-Description')}
            inputPlaceholder={t('Shared:Image-Description')}
            value={state.imageDescription || ''}
            multiline
            rows={3}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const value = event && event.target && event.target.value;
              setstateData((item) => ({ ...item, imageDescription: value || null }));
            }}
          />

        </div>
        {' '}
        <div className='item'>
          <SwitchComponent
            idRef='isIsPublishedRef'
            themeClass='theme-line'
            isChecked={state.isPublished}
            labelValue={t('Shared:IsPublished')}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChangeHandler={(event, isChecked) => {
              setstateData((item) => ({ ...item, isPublished: isChecked }));
            }}
          />

        </div>
        <div className='item'>
          <SwitchComponent
            idRef='isMarketingREF'
            themeClass='theme-line'
            isChecked={state.isMarketing}
            isDisabled={state.isPublished === false}
            labelValue={t('Shared:isMarketing')}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChangeHandler={(event, isChecked) => {
              setstateData((item) => ({ ...item, isMarketing: isChecked }));
            }}
          />
        </div>
        {' '}
        <div className='item mt-10'>
          <hr className='hr-line' />
          <SwitchComponent
            idRef='isapprovalRef'
            isChecked={state.isNeedOwnerApproval}
            themeClass='theme-line'
            labelValue={t('Shared:Need-owner-approval')}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChangeHandler={(event, isChecked) => {
              setstateData((item) => ({ ...item, isNeedOwnerApproval: isChecked }));
            }}
          />
          {(state && state.isNeedOwnerApproval && (
            <>
              <SwitchComponent
                idRef='isIsApprovedtusRef'
                isChecked={state.isApproved}
                themeClass='theme-line'
                labelValue={t('Shared:IsApproved')}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChangeHandler={(event, isChecked) => {
                  setstateData((item) => ({ ...item, isApproved: isChecked }));
                }}
              />
              {/* <div className='item-AutocompleteComponent mt-2 '>
                <AutocompleteComponent
                  idRef='referredToRef'
                  // isLoading={isLoading.agents}
                  multiple={false}
                  data={[]}
                  chipsLabel={(option) => option.fullName || ''}
                  displayLabel={(option) => option.fullName || ''}
                  withoutSearchButton
                  labelValue={t('Shared:ApproveOwner')}
                  inputPlaceholder={t('Shared:ApproveOwner')}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    // set((item) => ({ ...item, : (newValue && newValue) || null, }));
                  }}
                />
              </div> */}
            </>
          )) || ''}
          {/* <Inputs
            idRef='Publish-ApprovalRef'
            labelValue={t('Shared:Publish-Approval')}
            inputPlaceholder={t('Shared:Publish-Approval')}
            // value={state. || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setstateData((item) => ({ ...item, imageDescription: (event.target.value) || null }));
            }}
          /> */}
        </div>
        {' '}
        <div className='item mt-3'>
          <Inputs
            idRef='CommentsRef'
            labelValue={t('Shared:Comments')}
            inputPlaceholder={t('Shared:Comments')}
            value={state.comments || ''}
            multiline
            rows={3}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const value = event && event.target && event.target.value;
              setstateData((item) => ({ ...item, comments: value || null }));
            }}
          />
        </div>
      </div>

      <div className='mt-1 d-inline-flex-center w-100'>
        <ButtonBase
          className='btns theme-solid'
          onClick={SaveHandler}
        >
          <span>
            <span className='mdi mdi-content-save-outline ' />
            {' '}
            {t('Shared:save')}
          </span>
        </ButtonBase>
      </div>
    </div>
  );
};
FacebookGalleryImageInfoIdComponent.defaultProps = {
  // activeImageIndex: 0,
  parentTranslationPath: '',
  translationPath: '',
  withdetails: true,

};
