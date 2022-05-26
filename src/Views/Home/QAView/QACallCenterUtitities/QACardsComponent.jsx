import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  ButtonBase,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import { LoadableImageComponant, Spinner } from '../../../../Components';
import { LoadableImageEnum } from '../../../../Enums';
import { getDownloadableLink } from '../../../../Helper';
import { DefaultImagesEnum } from '../../../../Enums/DefaultImages.Enum';
import { GetActivityById, GetAllRelatedActivitiesByActivityId } from '../../../../Services';
import { ActivitiesManagementDialog } from '../../ActivitiesView/ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import { ActionsEnum } from '../../../../Enums/Actions.Enum';
import { TableActions } from '../../../../Enums/TableActions.Enum';
import { ReplyActivityDialog } from '../../ActivitiesView/ReplyActivitesView/ReplyActivityDialog';
import { isEmptyObject } from '../../../../Helper/isEmptyObject.Helper';
import { ActivityHistory } from '../../ActivitiesView/ActivityHistory/ActivityHistory';

export const QACardsComponent = ({
  onFooterActionsClicked,
  data,
  isExpanded,
  onCardClicked,
  parentTranslationPath,
  translationPath,
}) => {
  let listflattenObject = [];
  const nonImage = '00000000-0000-0000-0000-000000000000';
  const { t } = useTranslation([parentTranslationPath]);
  const [collapseView, setCollapseView] = useState(false);
  const [activeItem, setActiveItem] = useState();
  const [open, setOpen] = useState(false);
  const [edit, setisEdit] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);
  const handleChange = (panel) => (index, collapse) => {
    setCollapseView(collapse ? panel : false);
  };

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
      setisEdit(true);
      setIsLoading(true);
      const res = await GetActivityById(activityId);
      if (!(res && res.status && res.status !== 200)) setActiveItem(res);
      setIsLoading(false);
    }
  }, []);
  const flattenObject = (obj) => {
    // eslint-disable-next-line prefer-const
    const flattened = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null && key === 'relatedActivityTo') {
        if (obj[key]) {
          if (!isEmptyObject(obj[key])) listflattenObject.push({ ...obj[key] });
          Object.assign(flattened, flattenObject(obj[key]));
        }
      } else flattened[key] = obj[key];
    });
  };
  const GetRelatedActivitiesByActivityId = useCallback(
    async (activityId) => {
      setOpenHistory(true);
      setIsLoading(true);
      const res = await GetAllRelatedActivitiesByActivityId(activityId);
      if (!(res && res.status && res.status !== 200)) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        listflattenObject = [];
        flattenObject(res);
        setActivityHistory(listflattenObject.filter((item) => item.activityId));
      } else setActivityHistory([]);
      setIsLoading(false);
    },
    [activeItem]
  );

  return (
    <div className='qa-cards-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} />
      {data && data.map((item, index) => (
        <div key={`contactsCardItemRef${index + 1}`} className='qa-sub-card-wrapper'>   
          <a onClick={onCardClicked && onCardClicked(item, index)} className='cards-wrapper'>
            <div className='cards-body-wrapper'>
              <div className='card-body-section'>
                <div className='merge-wrapper'>
                  <LoadableImageComponant
                    classes='cover-image'
                    type={LoadableImageEnum.div.key}
                    alt={t(`${translationPath}contact-image`)}
                    src={
                      (item.contactImage.fileId) ?
                        getDownloadableLink(item.contactImage.fileId) :
                        DefaultImagesEnum.man.defaultImg
                    }
                  />
                </div>
              </div>
              <div className={`card-body-section${isExpanded ? ' is-expanded' : ''}`}>
                <div className='body-title-wrapper'>
                <span className='body-title'>
                      {" "}
                      {item.contactName}
                    </span>
                  <span>
                    {' '}
                    {item.contactEmail}
                  </span>
                </div>
              </div>
              <div className='contact-Id'>
                <div className='contact'>{t('Lead-id')}</div>
                <div className='id'>
                  {item.relatedLeadNumberId}
                  {' '}
                </div>
              </div>
            </div>

            <div className='card-user-info'>
              <div className='side'>
                <span className='body-side'>{item.buyersCount}</span>
                <span>
                  {' '}
                  {t('buyers')}
                </span>
              </div>
              <div className='info-1'>
                <span className='body-info'>{item.landlordsCount}</span>
                <span>
                  {' '}
                  {t('landlords')}
                </span>
              </div>
              <div className='info'>
                <span className='body-info'>{item.sellersCount}</span>
                <span>
                  {' '}
                  {t('sellers')}
                </span>
              </div>
              <div className='side'>
                <span className='body-side'>{item.tenantsCount}</span>
                <span>
                  {' '}
                  {t('tenants')}
                </span>
              </div>
            </div>
            <div className='container'>
              <Accordion expanded={collapseView === index} onChange={handleChange(index)}>
                <AccordionSummary
                  className='collapes'
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1bh-content'
                  id='panel1bh-header'
                >
                  <Typography className='Accordion-collapes'>
                    {collapseView === index ? t('hide-details') : t('view-all-details')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className='AccordionDetails'>
                  <Typography className='Typography'>
                    <div className='view-all-data'>
                      <div>
                        <div className='title'>{t('total-transaction')}</div>
                        <div className='data'>
                          <span className='mdi mdi-circle-medium '>
                            {`${item.leaseTransactionsCount} ${t('leas')}`}
                          </span>
                          <span className='mdi mdi-circle-medium '>
                            {`${item.saleTransactionsCount} ${t('sale')}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='view-all-data'>
                      <div>
                        <div className='history'>
                          <div className='title'>{t('last-activity')}</div>
                          {
                            item.relatedActivityToId && (
                              <div className='history-click'>
                                <ButtonBase
                                  className=' btns theme-solid mdi mdi-undo-variant '
                                  onClick={() => {
                                    GetRelatedActivitiesByActivityId(item.activityId);
                                  }}
                                >
                                  {t('history')}
                                </ButtonBase>
                              </div>
                            )

                          }

                        </div>
                        <div
                          className='last-activity'
                          onClick={() => handleActiveItem(item.activityId)}
                        >
                          <div>
                            <div className='last-activity-div'>
                              <div className='first-call-1'>
                                <span>
                                  {' '}
                                  {item.subject}
                                </span>
                              </div>
                              <div className='first-call-2'>
                                <span>
                                  {' '}
                                  {`${t('Id')}: ${item.activityId}`}
                                </span>
                              </div>
                            </div>
                            <div className='last-activity-description'>
                              <div className='last-activity-name'>
                                <span className='agent-name'>{t('agent-name')}</span>
                                <span className='agent-name-value'>{item.agentName}</span>
                              </div>
                              <div className='last-activity-type'>
                                <span className='date'>{t('date')}</span>
                                <span className='date-value'>
                                  {moment(item.activityDate).format('DD, MMM YYYY')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className='cards-footer-wrapper'>
              <ButtonBase
                className='btns theme-transparent w-50 mx-0'
                disabled={!item.isReplyAble}
                onClick={() => {
                  handleActiveItem(item.activityId, TableActions.replyText.key);
                }}
              >
                <span className='mdi mdi-reply-outline' />
                <span className='px-1'>{t('reply')}</span>
              </ButtonBase>
              <ButtonBase
                className='btns theme-transparent w-50 mx-0'
                onClick={onFooterActionsClicked(ActionsEnum.reportEdit.key, item, index)}
              >
                <span className='mdi mdi-pencil-outline' />
                <span className='px-1'>{t('open-file')}</span>
              </ButtonBase>
              <ButtonBase
                className='btns theme-transparent w-50 mx-0 pl-3 pr-3'
                onClick={onFooterActionsClicked(ActionsEnum.reassignAgent.key, item, index)}
                disabled={!item.reassignIsAble}
              >
                <span className='mdi mdi-account-switch' />
                <span className='px-1'>{t('reassign-agent')}</span>
              </ButtonBase>
            </div>
          </a>
        </div>
      ))}
      {open && (
        <ActivitiesManagementDialog
          open={open}
          activeItem={activeItem}
          isLoading={isLoading}
          isEdit={edit}
          onSave={() => {
            setOpen(false);
            setActiveItem(null);
            setisEdit(false);
          }}
          close={() => {
            setActiveItem(null);
            setOpen(false);
            setisEdit(false);
          }}
          translationPath={translationPath}
          parentTranslationPath='ActivitiesView'
        />
      )}
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

      {openHistory && (
        <ActivityHistory
          isLoading={isLoading}
          open={openHistory}
          close={() => {
            listflattenObject = [];
            setActivityHistory([]);
            setOpenHistory(false);
          }}
          data={activityHistory.reverse()}
          translationPath={translationPath}
          parentTranslationPath='ActivitiesView'
        />
      )}
    </div>
  );
};

QACardsComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onCardClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
