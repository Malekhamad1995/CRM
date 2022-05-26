import React from 'react';
import { useTranslation } from 'react-i18next';
import { getDownloadableLink } from '../../../../../../Helper';
import { LoadableImageComponant } from '../../../../../../Components';
import { ContactTypeEnum, LoadableImageEnum, BranchCard } from '../../../../../../Enums';



const BranchSlider = ({ item,
   index,
   translationPath,
   parentTranslationPath
   }) => {
    const { t } = useTranslation(parentTranslationPath);

    return (
      <div className='branch-slider'>
        <div className='users-card-component-wrapper'>
          <div className='users-card-wrapper' key={`userCardRef${index + 1}`}>
            <div className='cards-wrapper'>
            <div className='cards-header'>
              <div>
                <LoadableImageComponant
                  type={LoadableImageEnum.div.key}
                  classes='user-cover-image'
                  alt={t(`${translationPath}branch-image`)}
                  src={
                    (item.branchLogoId && getDownloadableLink(item.branchLogoId)) ||
                    ContactTypeEnum.corporate.defaultImg
                  }
                />
              </div>
              <div className='d-flex-column'>

                <div className='item-wrapper px-2'>

                  <span className='item-header'>{item.branchName || 'N/A'}</span>

                </div>
              </div>

            </div>
            <div className='cards-body'>
              <div className='item-wrapper'>
                <span className='item-header'>
                <span className={BranchCard.Number.icon} />
                  <span>
                    {t(`${translationPath}branch-number`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.branchNumber || 'N/A'}</span>
              </div>

              <div className='item-wrapper'>
                <span className='item-header'>
                <span className={BranchCard.Country.icon} />
                  <span>
                    {t(`${translationPath}country`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.branchCountryName || 'N/A'}</span>
              </div>
              <div className='item-wrapper'>
                <span className='item-header'>
                  <span className={BranchCard.City.icon} />
                  <span>
                     {t(`${translationPath}city`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.branchCityName || 'N/A'}</span>
              </div>
              <div className='item-wrapper'>
              <span className='item-header header-wrap'>
                  <span className={BranchCard.Users.icon} />
                  <span>
                    {t(`${translationPath}maximum-number-of-users`)}
                    {' '}
                    :
                  </span>
                </span>
                <span className='item-body'>{item.maximumNumberOfUsers || 'N/A'}</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default BranchSlider;
