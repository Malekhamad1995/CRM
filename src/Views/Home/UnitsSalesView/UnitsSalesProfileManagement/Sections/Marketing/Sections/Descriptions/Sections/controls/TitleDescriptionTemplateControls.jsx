import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Inputs, CollapseComponent } from '../../../../../../../../../../Components';
import { getErrorByName, showWarn } from '../../../../../../../../../../Helper';
import {
  GetAllMarketingTemplates,
  GetPropertyOverViewByUnitId,
} from '../../../../../../../../../../Services';
import { Template, OtherLanguages } from '../Dialogs';
import { OtherTemplatesAutocomplete } from './OtherTemplatesAutocomplete';

export const TitleDescriptionTemplateControls = ({
  state,
  schema,
  onStateChanged,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [isOpenTemplateDialog, setIsOpenTemplateDialog] = useState(false);
  const [otherTemplatesToggler, setOtherTemplatesToggler] = useState(false);
  const [propertyOverView, setPropertyOverView] = useState(null);
  const [isOpenOtherLanguagesDialog, setIsOpenOtherLanguagesDialog] = useState(false);
  const [marketingTemplates, setMarketingTemplates] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const otherTemplatesTogglerClicked = () => {
    setOtherTemplatesToggler(!otherTemplatesToggler);
  };
  const getAllMarketingTemplates = useCallback(async () => {
    const res = await GetAllMarketingTemplates({
      ...filter,
    });
    if (!(res && res.status && res.status !== 200)) {
      setMarketingTemplates({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setMarketingTemplates({
        result: [],
        totalCount: 0,
      });
    }
  }, [filter]);
  const getPropertyOverViewByUnitId = useCallback(async () => {
    const res = await GetPropertyOverViewByUnitId(state.unitId);
    if (!((res && res.data && res.data.ErrorId) || !res)) setPropertyOverView(res);
  }, [state.unitId]);
  const onTemplateClicked = useCallback(
    (text) => () => {
      if (!text) {
        showWarn(t(`${translationPath}no-data-description`));
        return;
      }
      let value = state.descriptionEn;
      if (value) value += `\n${text}`;
      else value = text;
      onStateChanged({ id: 'descriptionEn', value });
    },
    [onStateChanged, state.descriptionEn, t, translationPath]
  );

  useEffect(() => {
    getAllMarketingTemplates();
    getPropertyOverViewByUnitId();
  }, [getAllMarketingTemplates, getPropertyOverViewByUnitId]);
  return (
    <>
      <div className='w-100'>
        <div className='form-item-double'>
          <Inputs
            idRef='titleEnRef'
            labelValue='marketing-title'
            labelClasses='Requierd-Color'
            value={state.titleEn || ''}
            helperText={getErrorByName(schema, 'titleEn').message}
            error={getErrorByName(schema, 'titleEn').error}
            isWithError
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              onStateChanged({ id: 'titleEn', value: event.target.value });
            }}
          />
          <div className='d-inline-flex px-2 pt-3'>
            <ButtonBase
              className='btns theme-transparent mt-2'
              onClick={() => setIsOpenOtherLanguagesDialog(true)}
            >
              <span>{t(`${translationPath}other-languages`)}</span>
            </ButtonBase>
          </div>
        </div>
      </div>
      <div className='w-100 px-2 mb-3'>
        <Inputs
          idRef='descriptionEnRef'
          labelValue='marketing-description'
          value={state.descriptionEn || ''}
          helperText={getErrorByName(schema, 'descriptionEn').message}
          error={getErrorByName(schema, 'descriptionEn').error}
          isWithError
          isSubmitted={isSubmitted}
          multiline
          rows={6}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'descriptionEn', value: event.target.value });
          }}
        />
      </div>
      <div className='templates-wrapper'>
        <div className='templates-title'>
          <span>{t(`${translationPath}insert`)}</span>
          <span>:</span>
        </div>
        <ButtonBase
          className='btns theme-transparent template-item-wrapper'
          onClick={onTemplateClicked(propertyOverView)}
        >
          <span>{t(`${translationPath}property-overview`)}</span>
        </ButtonBase>
        {/* {marketingTemplates.result.map((item, index) => (
          <ButtonBase
            className='btns theme-transparent template-item-wrapper'
            key={`marketing-templatesRef${index + 1}`}
            onClick={onTemplateClicked(item.templateText)}
          >
            <span>{item.templateName}</span>
          </ButtonBase>
        ))} */}
        {marketingTemplates.totalCount > 5 && (
          <div className='template-item-wrapper'>
            <ButtonBase className='btns theme-transparent' onClick={otherTemplatesTogglerClicked}>
              <span>{t(`${translationPath}other-templates`)}</span>
            </ButtonBase>
            <CollapseComponent
              isOpen={otherTemplatesToggler}
              classes='w-100'
              component={(
                <OtherTemplatesAutocomplete
                  onSelectedChanged={(selectedValue) => onTemplateClicked(selectedValue)()}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
            />
          </div>
        )}
        <ButtonBase
          className='btns theme-transparent template-item-wrapper'
          onClick={() => setIsOpenTemplateDialog(true)}
        >
          <span>{t(`${translationPath}add-template`)}</span>
        </ButtonBase>
        {isOpenTemplateDialog && (
          <Template
            isOpen={isOpenTemplateDialog}
            onSave={() => {
              setFilter((items) => ({ ...items, pageIndex: 0 }));
              setIsOpenTemplateDialog(false);
            }}
            isOpenChanged={() => setIsOpenTemplateDialog(false)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {isOpenOtherLanguagesDialog && (
          <OtherLanguages
            activeItem={
              state.titleAr ||
              (state.descriptionAr && {
                titleAr: state.titleAr,
                descriptionAr: state.descriptionAr,
              }) ||
              undefined
            }
            isOpen={isOpenOtherLanguagesDialog}
            onSave={(othersState) => {
              if (onStateChanged) {
                onStateChanged({
                  id: 'edit',
                  value: {
                    ...state,
                    ...othersState,
                  },
                });
              }
              setIsOpenOtherLanguagesDialog(false);
            }}
            isOpenChanged={() => setIsOpenOtherLanguagesDialog(false)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
      </div>
    </>
  );
};

TitleDescriptionTemplateControls.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
