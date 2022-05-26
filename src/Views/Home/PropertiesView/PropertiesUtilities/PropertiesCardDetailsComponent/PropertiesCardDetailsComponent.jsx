import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressComponet } from '../../../../../Components';

const translationPath = '';

export const PropertiesCardDetailsComponent = ({ item, index }) => {
  const { t } = useTranslation('UsersView');
  return (
    <div className='slideruser'>
      <div className='users-card-component-wrapper'>
        <div className='users-card-wrapper' key={`userCardRef${index + 1}`}>
          <div className='cards-wrapper'>
            <div className='Image-conteaner'>
              <img
                src='https://cdn.britannica.com/08/187508-050-D6FB5173/Shanghai-Tower-Gensler-San-Francisco-world-Oriental-2015.jpg' // {getDownloadableLink() || ""}
                alt={t(`${translationPath}image`)}
                className='Image'
              />
              <img
                src='https://cdn.cnn.com/cnnnext/dam/assets/200310023921-dubai-buildings-skyline-super-tease.jpg' // {getDownloadableLink() || ""}
                alt={t(`${translationPath}image`)}
                className='Image'
              />
              <img
                src='https://www.irishtimes.com/polopoly_fs/1.2801461.1474533161!/image/image.jpg_gen/derivatives/box_620_330/image.jpg' // {getDownloadableLink() || ""}
                alt={t(`${translationPath}image`)}
                className='Image'
              />
            </div>
            <div className='cards-header'>
              <div className='d-flex-column'>
                <div className='statues'>Ready</div>
                <div className='Ref'>
                  Ref no:
                  {' '}
                  <span className='no-num'>98907</span>
                  <span className='mdi mdi-text-box-multiple-outline' />
                </div>
                <div className='item-wrapper'>
                  <span className='item-header'>
                    <span className='mdi mdi-calendar-blank icon' />
                    <span className='textcard'>
                      {' '}
                      {t(`${translationPath}Created`)}
                      :
                      {' '}
                      <span className='textcard-vlaue'>12/4/2020</span>
                      {' '}
                    </span>
                  </span>
                </div>
                <div className='item-wrapper'>
                  <span className='item-header'>
                    <span className='textcard'>
                      - Developer:
                      {' '}
                      <span className='textcard-vlaue'>EMMAR </span>
                      {' '}
                    </span>
                  </span>
                </div>
                <div className='item-wrapper'>
                  <span className='item-header'>
                    <span className='textcard text-Glopel'>
                      - Location:
                      {' '}
                      <span className='textcard-vlaue'>
                        Dubai, abudhabi, 78348 street near Beach
                      </span>
                    </span>
                  </span>
                </div>

                <div className='item-wrapper'>
                  <span className='item-header'>
                    <span className='textcard'>
                      - Price:
                      {' '}
                      <span className='textcard-vlaue'>10.000.000 AED </span>
                      {' '}
                    </span>
                  </span>
                </div>
                <div className='w-100 pb-130px mb-3'>
                  <div className='cards-progress-wrapper'>
                    <ProgressComponet
                      value={65}
                      progressText={`${65}%`}
                      themeClasses='theme-gradient'
                    />
                  </div>
                </div>
                <div className='time-left'>
                  <span className='mdi mdi-clock' />
                  Last update 15 min ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
