import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LoadableImageComponant, PermissionsComponent } from '../../../../../Components';
import { getDownloadableLink } from '../../../../../Helper';
import { ActionsEnum, LoadableImageEnum, TemplatesTypesEnum } from '../../../../../Enums';
import DefaultImage from '../../../../../assets/images/defaults/templates.png';
import { TemplatesPermissions } from '../../../../../Permissions';

export const TemplatesCardsComponent = ({
  data,
  onFooterActionsClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='templates-cards-wrapper childs-wrapper'>
      {data.result &&
        data.result.map((item, index) => (
          <div className='templates-card-wrapper' key={`templatesCardItemRef${index + 1}`}>
            <a className='cards-wrapper'>
              <div className='cards-body-wrapper'>
                <LoadableImageComponant
                  classes='cover-image'
                  type={LoadableImageEnum.div.key}
                  alt={t(`${translationPath}contact-image`)}
                  src={(item.imagePath && getDownloadableLink(item.imagePath)) || DefaultImage}
                />
                <div
                  className={`title-section-wrapper ${TemplatesTypesEnum[item.templateTypeName].backgroundColor
                    }`}
                >
                  <div className='template-icon-wrapper'>
                    <span
                      className={`${TemplatesTypesEnum[item.templateTypeName].icon
                        } template-type-icon`}
                    />
                    <span className='template-icon-text'>
                      {t(
                        `${translationPath}${TemplatesTypesEnum[item.templateTypeName].valueShort}`
                      )}
                    </span>
                  </div>
                  <div className='title-item'>
                    <span className='title-header'>{t(`${translationPath}template-title`)}</span>
                    <span>:</span>
                    <span className='title-text px-1'>{item.templateName}</span>
                  </div>
                  {item.templateText && (
                    <div className='title-item'>
                      <span className='title-header'>{t(`${translationPath}template-text`)}</span>
                      <span>:</span>
                      <span className='title-text px-1'>{item.templateText}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className='cards-footer-wrapper'>
                <ButtonBase
                  className='btns theme-transparent w-50 mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.preview.key, item, index)}
                >
                  <span className='mdi mdi-eye-outline' />
                  <span className='px-1'>{t(`${translationPath}preview`)}</span>
                </ButtonBase>
                <PermissionsComponent
                  permissionsList={Object.values(TemplatesPermissions)}
                  permissionsId={TemplatesPermissions.DeleteTemplate.permissionsId}
                >
                  <ButtonBase
                    className='btns theme-transparent w-50 mx-0'
                    onClick={onFooterActionsClicked(ActionsEnum.delete.key, item, index)}
                  >
                    <span className={ActionsEnum.delete.icon} />
                    <span className='px-1'>{t(`${translationPath}delete`)}</span>
                  </ButtonBase>

                </PermissionsComponent>
                <PermissionsComponent
                  permissionsList={Object.values(TemplatesPermissions)}
                  permissionsId={TemplatesPermissions.EditTemplate.permissionsId}
                >
                  <ButtonBase
                    className='btns theme-transparent w-50 mx-0'
                    onClick={onFooterActionsClicked(ActionsEnum.reportEdit.key, item, index)}
                  >
                    <span className='mdi mdi-pencil-outline' />
                    <span className='px-1'>{t(`${translationPath}edit`)}</span>
                  </ButtonBase>
                </PermissionsComponent>
              </div>
            </a>
          </div>
        ))}
    </div>
  );
};

TemplatesCardsComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
