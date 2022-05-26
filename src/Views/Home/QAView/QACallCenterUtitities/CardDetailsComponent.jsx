/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { ButtonBase, Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getDownloadableLink } from '../../../../Helper';
import { LoadableImageComponant, Spinner } from '../../../../Components';
import { ActionsEnum } from '../../../../Enums';
import { DefaultImagesEnum } from '../../../../Enums/DefaultImages.Enum';
import { GetActivityById, GetAllActivitiesByLeadId } from '../../../../Services';
import { TableActions } from '../../../../Enums/TableActions.Enum';
import { ReplyActivityDialog } from '../../ActivitiesView/ReplyActivitesView/ReplyActivityDialog';
import '../style/CardDetailsComponent.scss'
import moment from 'moment';

function CardDetailsComponent({
  activeData,
  cardDetailsActionClicked,
  translationPath,
  parentTranslationPath
}) {

  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [hide, sethide] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [qaInfo, setQaInfo] = useState(true);
  const [activityBtn, setActivityBtn] = useState(false);
  const [activities, setActivities] = useState([]);

  const handleActiveItem = useCallback(async (activityId, key) => {
    if (key === TableActions.replyText.key) {
      setOpenReply(true);
      setIsLoading(true);
      const res = await GetActivityById(activityId);
      if (!(res && res.status && res.status !== 200)) {
        setActiveItem(res);
        setIsLoading(false);
      }
    } else {
      setOpen(true);
      setIsEdit(true);
      setIsLoading(true);
      const res = await GetActivityById(activityId);
      if (!(res && res.status && res.status !== 200)) setActiveItem(res);
      setIsLoading(false);
    }
  }, []);

  const getAllActivitiesByLeadId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllActivitiesByLeadId(activeData.relatedLeadNumberId, { pageIndex: 0, pageSize: 25 });
    if (!(result && result.status && result.status !== 200)) setActivities(result.result);
    else setActivities([]);
    setIsLoading(false);
  }, [activeData.relatedLeadNumberId]);

  useEffect(() => {
    getAllActivitiesByLeadId();
  }, [getAllActivitiesByLeadId]);

  useEffect(() => {
    sethide(false);
  }, [activeData.relatedLeadNumberId]);


  return (
    <div class="qa-details-wrapper">
      <div className='leads-card-detaild-wrapper'>
        <Spinner isActive={isLoading} isAbsolute={true} />
        <div className='side-menu-wrapper mb-3'>
          <div className='items-title mb-3 d-flex-center'>
            {t(`${translationPath}QA-detalis`)}
          </div>
          <div className='d-flex-center mb-3'>
            <LoadableImageComponant
              classes='details-img'
              alt={t(`${translationPath}contact-image`)}
              src={
                (activeData.contactImage.fileId) ?
                  getDownloadableLink(activeData.contactImage.fileId) :
                  DefaultImagesEnum.man.defaultImg
              }
            />
          </div>
          <div className='properety-plan d-flex-center mb-3'>
            {activeData.contactName}
          </div>

          <div className='d-flex-center mb-3 '>
            <div className='data-schedule-button'>
              <div className={`data-file-button ${qaInfo ? 'selected' : ''}`}>
                <Button
                  onClick={() => {
                    setActivityBtn(false);
                    setQaInfo(true);
                  }}
                  className={`btns ${qaInfo ? 'theme-outline' : ''}`}
                >
                  {t(`${translationPath}qa-Info`)}
                </Button>
              </div>
              <div className={`schedule-button ${activityBtn ? 'selected' : ''}`}>
                <Button
                  onClick={() => {
                    setActivityBtn(true);
                    setQaInfo(false);
                  }}
                  className={`btns ${activityBtn ? 'theme-outline' : ''}`}
                >
                  {t(`${translationPath}activity-details`)}
                </Button>
              </div>
            </div>
          </div>

          {qaInfo && (
            <div className='px-3 mb-3 slider-data'>
              <div className='qaInfo-wrapper'>

                <div className='mb-3'>
                  <span className='texts gray-primary-bold'>
                    {t(`${translationPath}leadId`)}
                    :
                  </span>
                  <span className='texts s-gray-primary'>{`  ${activeData.relatedLeadNumberId}`}</span>
                </div>

                <div className='d-flex mb-3'>
                  <span className='date mr-1 texts gray-primary-bold'>
                    <span className='mdi mdi-email-outline mr-2 ' />
                  </span>
                  <span className='date texts s-gray-primary'>{activeData.contactEmail}</span>
                </div>

                <div className='mb-3'>
                  <span className='texts gray-primary-bold'>
                    {t(`${translationPath}buyers`)}
                    :
                  </span>
                  <span className='texts s-gray-primary'>{`  ${activeData.buyersCount}`}</span>
                </div>
                <div className='mb-3'>
                  <span className='texts gray-primary-bold'>
                    {t(`${translationPath}landlords`)}
                    :
                  </span>
                  <span className='texts s-gray-primary'>{`  ${activeData.landlordsCount}`}</span>
                </div>
                <div className='mb-3'>
                  <span className='texts gray-primary-bold'>
                    {t(`${translationPath}sellers`)}
                    :
                  </span>
                  <span className='texts s-gray-primary'>{`  ${activeData.sellersCount}`}</span>
                </div>
                <div className='mb-3'>
                  <span className='texts gray-primary-bold'>
                    {t(`${translationPath}tenants`)}
                    :
                  </span>
                  <span className='texts s-gray-primary'>{`  ${activeData.tenantsCount}`}</span>
                </div>
              </div>
            </div>
          )}

          {activityBtn && (
            <div class="px-3 mb-3 slider-data">
              <div className='mb-3'>
                {activities && activities.map((e) =>
                  <div className='cards-wrapper'>
                    <div>{e.isOpen ? <span className='open-status'>{t(`${translationPath}open`)}</span> : <span className='close-status'>{t(`${translationPath}close`)}</span>}</div>
                    <div className='mb-3'>
                      <span className='mr-1 texts gray-primary-bold'>
                        {t(`${translationPath}assigned-to `)}
                        :
                      </span>
                      <span className='texts s-gray-primary'>{`${e.agentName || ''}`}</span>
                    </div>

                    <div className='date mb-3'>
                      <span className='date mr-1 texts gray-primary-bold'>
                        <span className='details-icon mdi mdi-calendar mdi-18px mr-1 ' />
                      </span>
                      <span className='date texts s-gray-primary'>{`${moment(e.activityDate).format("DD/MM/YYYY")}`}</span>
                      <span className='date mr-1 texts gray-primary-bold'>
                        <span className='date mdi mdi-clock-time-four-outline ml-4 mr-1' />
                      </span>
                      <span className='date texts s-gray-primary'>{`${moment(e.activityDate).format('LT')}`}</span>
                    </div>

                    <div className='mb-3'>
                      <span className='mr-1 texts gray-primary-bold'>
                        {t(`${translationPath}created-by`)}
                        :
                      </span>
                      <span className='texts s-gray-primary'>{`${e.agentUsername || ''}`}</span>
                    </div>
                    <div className='mb-3'>
                      <span className='mr-1 texts gray-primary-bold'>
                        {t(`${translationPath}category`)}
                        :
                      </span>
                      <span className='texts s-gray-primary'>{`${e.activityType && e.activityType.categoryName || ''}`}</span>
                    </div>
                    <div className='mb-3'>
                      <span className='mr-1 texts gray-primary-bold'>
                        {t(`${translationPath}activityName`)}
                        :
                      </span>
                      <span className='texts s-gray-primary'>{`${e.activityType && e.activityType.activityTypeName || ''}`}</span>
                    </div>
                    <div className='mb-3'>
                      <span className='mr-1 texts gray-primary-bold'>
                        {t(`${translationPath}comments`)}
                        :
                      </span>
                      <span className='texts s-gray-primary'>{`${e.comments || ''}`}</span>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className='side-menu-actions'>
          <div className='d-flex-center'>
            <ButtonBase
              className='btns theme-solid mx-2 mb-0 w-50'
              onClick={cardDetailsActionClicked(ActionsEnum.reportEdit.key, activeData)}
            >
              <span className='icons i-folder-white' />
              <span className='mx-2'>{t(`${translationPath}open-file`)}</span>
            </ButtonBase>
            <div className='cards-footer-wrapper'>
              <ButtonBase
                className='btns theme-transparent w-50 mx-2'
                disabled={!activeData.isReplyAble}
                onClick={() => {
                  handleActiveItem(activeData.activityId, TableActions.replyText.key);
                }}
              >
                <span className='mdi mdi-reply-outline' />
                <span className='px-1'>{t('reply')}</span>
              </ButtonBase>
            </div>
          </div>
        </div>
      </div>

      {openReply && (
        <ReplyActivityDialog
          isLoading={isLoading}
          open={openReply}
          close={() => {
            setActiveItem(null);
            setOpenReply(false);
          }}
          activeItem={activeItem}
          onSave={() => {
            setOpenReply(false);
            setActiveItem(null);
          }}
          translationPath={translationPath}
          parentTranslationPath='ActivitiesView'
        />
      )}
    </div>

  );
}

CardDetailsComponent.propTypes = {

  activeData: PropTypes.instanceOf(Object),
  relodedata: PropTypes.func,
};
CardDetailsComponent.defaultProps = {
  activeData: null,
  cardDetailsActionClicked: () => { },
};

export { CardDetailsComponent };
