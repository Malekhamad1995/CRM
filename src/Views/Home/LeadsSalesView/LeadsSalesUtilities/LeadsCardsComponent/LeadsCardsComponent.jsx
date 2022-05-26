/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import i18next from 'i18next';
import { ButtonBase, Fab, Tooltip } from '@material-ui/core';
import { Closed } from '../../../../../assets/json/StaticLookupsIds.json';
// import { useSelector } from 'react-redux';
import {
  CheckboxesComponent,
  LoadableImageComponant,
  ProgressComponet,
  Spinner,
  PermissionsComponent
} from '../../../../../Components';
import {
  ActionsEnum,
  ContactTypeEnum,
  LeadsClassTypesEnum,
  LeadsPriorityEnum,
  LeadsStatusEnum,
  LoadableImageEnum,
} from '../../../../../Enums';
import {
  getDownloadableLink, showError, showinfo, showSuccess
} from '../../../../../Helper';
import { CloneLead } from '../../../../../Services';
// import { LeadsPermissions } from '../../../../../Permissions';
import { LeadsCAllCenterPermissions } from '../../../../../Permissions';

export const LeadsCardsComponent = ({
  data,
  activeCard,
  isExpanded,
  onCardClicked,
  onFooterActionsClicked,
  parentTranslationPath,
  translationPath,
  notExpandedMax,
  withCheckbox,
  onCardCheckboxClick,
  selectedDetailsLeadItem,
  onActionClicked,
  isCheckBoxDisabled,
  selectedCards,
  relodedata,
  activeSelectedAction
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const loginResponse = useSelector((state) => state.login.loginResponse);
  const [isLoading, setIsLoading] = useState(false);
  const getDefaultLeadImage = useCallback(
    (leadType) => ContactTypeEnum[leadType] && ContactTypeEnum[leadType].defaultImg,
    []
  );
  const getIsSelectedCard = useCallback(
    (row) => selectedCards && selectedCards.findIndex((item) => item.id === row.id) !== -1,
    [selectedCards]
  );
  // const menuOpenHandler = useCallback((event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // }, []);
  const textArea = useRef(null); const textAreaRefnum = useRef(null);
  const copyTextToClipboard = (id) => {
    const context = textArea.current;
    if (id && context) {
      context.value = id;
      context.select();
      document.execCommand('copy');
      showinfo(`${t('Shared:Copy-id-successfully')}  (${id})`);
    } else
      showinfo(`${t('Shared:Copy-id-successfully')}  (${id})`);
  };

  const cloneHandler = async (leadIds) => {
    setIsLoading(true);
    const result = await CloneLead(leadIds);
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}leads-cloned-successfully`)); relodedata();
      setIsLoading(false);
    } else { showError(t(`${translationPath}leads-clone-failed`)); setIsLoading(false); }
  };
  return (
    <div className='leads-cards-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} />
      {data.result &&
        data.result.map((item, index) => (
          <div
            className={`leads-card-wrapper${isExpanded ? ' is-expanded' : ''}${(((activeCard && activeCard.id === item.id) ||
              (selectedDetailsLeadItem && selectedDetailsLeadItem.id === item.id)) &&
              ' is-open') ||
              ''
              }`}
            key={`leadsCardItemRef${index + 1}`}
          >
            {withCheckbox && (
              <div className='card-checkbox-wrapper'>
                <CheckboxesComponent
                  idRef={`leadsCheckboxItemRef${index + 1}`}
                  singleChecked={getIsSelectedCard(item)}
                  onSelectedCheckboxClicked={(event) => {
                    event.preventDefault();
                    onCardCheckboxClick(index, item);
                  }}
                  isDisabled={
                    activeSelectedAction === 'reassign-leads' &&
                    (item.status.lookupItemName === 'Closed' || item.leadClass === "Landlord" || item.leadClass === "Seller")}
                // isDisabled={
                //   (isCheckBoxDisabled && !getIsSelectedCard(item)) ||
                //   (selectedCards &&
                //     selectedCards[0] &&
                //     selectedCards[0].leadTypeId !== item.leadTypeId) ||
                //   (selectedCards &&
                //     selectedCards[0] &&
                //     selectedCards[0].name === item.name &&
                //     !getIsSelectedCard(item))
                // }
                />
              </div>
            )}
            <a onClick={onCardClicked && onCardClicked(item, index)} className='cards-wrapper'>
              <div className='cards-body-wrapper'>
                <div className='card-body-section'>
                  <LoadableImageComponant
                    classes='cover-image'
                    type={LoadableImageEnum.div.key}
                    alt={t(`${translationPath}lead-image`)}
                    src={
                      (item && item.contact_name && item.contact_name.contact_image && item.contact_name.contact_image.uuid && getDownloadableLink(item.contact_name.contact_image && item.contact_name.contact_image.uuid)) ||
                      getDefaultLeadImage(item.type)
                    }
                  />
                  <div className='actions-wrapper'>
                    {(item && item.contact_name && item.contact_name.email_address && (
                      <ButtonBase
                        className={ActionsEnum.emailSolid.buttonClasses}
                        onClick={onActionClicked(ActionsEnum.emailSolid.key, item)}
                      >
                        <span className={ActionsEnum.emailSolid.icon} />
                      </ButtonBase>
                    )) || ''}
                    {item && item.contact_name && item.contact_name.mobile && (
                      <ButtonBase
                        className={ActionsEnum.whatsappSolid.buttonClasses}
                        onClick={onActionClicked(ActionsEnum.whatsapp.key, item)}
                      >
                        <span className={ActionsEnum.whatsappSolid.icon} />
                      </ButtonBase>
                    )}
                    {item && item.contact_name && item.contact_name.mobile && (
                      <ButtonBase
                        className={ActionsEnum.smsSolid.buttonClasses}
                        onClick={onActionClicked(ActionsEnum.smsSolid.key, item)}
                      >
                        <span className={ActionsEnum.smsSolid.icon} />
                      </ButtonBase>
                    )}
                    {/* <PopoverComponent
                      idRef='actionsMenuRef'
                      popoverClasses='mxw-270px'
                      handleClose={handleClose}
                      attachedWith={actionsAttachedWith}
                      // popoverClasses="mt-3"
                      component={<span className='p-2'>Under Development</span>}
                    /> */}
                  </div>
                  {/* {item.actions
                    .filter((filterItem, filterIndex) => filterIndex < 2)
                    .map((actionItem) => (
                      <div className='action-item' key={`view-actions-buttons${actionItem.enum}`}>
                        <ButtonBase
                          className={getActionValues(actionItem.enum).buttonClasses}
                          onClick={onActionClicked(actionItem.enum, data)}
                          disabled={actionItem.isDisabled}>
                          <span className={getActionValues(actionItem.enum).icon} />
                        </ButtonBase>
                      </div>
                    ))} */}
                </div>
                <div className={`card-body-section${isExpanded ? ' is-expanded' : ''}`}>
                  <div className='body-title-wrapper'>
                    <span className='body-title'>{item.name}</span>
                    <div className='lead-id'>
                      <span className='mb-1'>
                        {t(
                          `${translationPath}${item && item.leadClass && item.leadClass.toLowerCase()
                          }`
                        )}
                      </span>
                      <div className='id'>
                        <span className='details-text'>
                          {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                          {t(`${translationPath}ID`)}
                          :
                          {` ${item.id}`}
                          <textarea readOnly aria-disabled value={item.id} ref={textArea} />
                        </span>
                        <Tooltip title={t(`${translationPath}copy`)}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              copyTextToClipboard(item && item.id);
                            }}
                            className='mdi mdi-content-copy'
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className='details-item-wrapper'>
                      <span className='details-icon mdi mdi-calendar mdi-18px' />
                      <span>
                        <span className='details-text'>
                          {t(`${translationPath}created`)}
                          :
                        </span>
                        <span className='px-1'>
                          {(item.creationDate &&
                            moment(item.creationDate)
                              .locale(i18next.language)
                              .format('DD/MM/YYYY')) ||
                            'N/A'}
                        </span>
                      </span>
                    </div>
                    <div className='body-card-tooltip-wrapper'>
                      <span
                        className={`card-tooltip mx-0${(((item.status &&
                          item.status.lookupItemName &&
                          LeadsStatusEnum[item.status.lookupItemName] &&
                          LeadsStatusEnum[item.status.lookupItemName].value) ||
                          'N/A') === 'closed' &&
                          ' bg-danger c-white') ||
                          ''
                          }`}
                      >
                        <span>
                          {t(
                            `${translationPath}${(item.status &&
                              item.status.lookupItemName &&
                              item.status.lookupItemName) ||
                            'N/A'
                            }`
                          )}
                        </span>
                      </span>
                      {(((item.status &&
                        item.status.lookupItemName === LeadsStatusEnum.Closed.key) && (item && item.leadClass && item.leadClass.toLowerCase() === LeadsClassTypesEnum.buyer.value) && (
                          <PermissionsComponent
                            permissionsList={Object.values(LeadsCAllCenterPermissions)}
                            permissionsId={LeadsCAllCenterPermissions.CloneLead.permissionsId}
                          >
                            <div className='Clone-bbt mx-3'>
                              <Tooltip title={t(`${translationPath}clone`)}>
                                <Fab
                                  size='small'
                                  aria-label='clone'
                                  label='clone'
                                  onClick={() => cloneHandler(item && item.id)}
                                >
                                  <span className='mdi mdi-animation-outline mdi-18px' />
                                </Fab>
                              </Tooltip>
                            </div>
                          </PermissionsComponent>
                        )) ||
                        '')}
                      <div className='d-inline-flex-v-center px-2'>
                        {(item.rating &&
                          item.rating.lookupItemName &&
                          LeadsPriorityEnum[item.rating.lookupItemName] && (
                            <>
                              <span
                                className={LeadsPriorityEnum[item.rating.lookupItemName].icon}
                              />
                              <span className='px-1'>
                                {t(
                                  `${translationPath}${LeadsPriorityEnum[item.rating.lookupItemName].value
                                  }`
                                )}
                              </span>
                            </>
                          )) || <span />}
                      </div>
                    </div>
                    <span className='details-text'>
                      {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                      {t(`${translationPath}stage`)}
                      :
                      {` ${item.lead_stage && item.lead_stage.lookupItemName ?
                        item.lead_stage.lookupItemName :
                        'N/A'
                        }`}
                    </span>
                    <span className='details-text'>
                      {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                      {t(`${translationPath}referred-to`)}
                      :
                      {` ${item.referredto && item.referredto ? item.referredto.name : 'N/A'}`}
                    </span>
                    <Tooltip title={`${t(`${translationPath}property_name`)} : ${item.property_name && item.property_name.name ?
                      item.property_name.name :
                      'N/A'
                      }`}
                    >
                      <span className='details-text property_name'>
                        {/* <span className='details-icon mdi mdi-minus mdi-18px' /> */}
                        {t(`${translationPath}property_name`)}
                        :
                        {` ${item.property_name && item.property_name.name ?
                          item.property_name.name :
                          'N/A'
                          }`}
                      </span>
                    </Tooltip>
                    {item && item.unit_ref_number ? item && item.unit_ref_number && item.unit_ref_number.name && (
                      <span className='details-text mt-1 hide-textarea '>
                        {t(`${translationPath}ref-no`)}
                        :
                        {` ${item && item.unit_ref_number ? item && item.unit_ref_number && item.unit_ref_number.name : 'N/A'} `}
                        <textarea readOnly aria-disabled value={item.id} ref={textAreaRefnum} />
                        <Tooltip title={t(`${translationPath}copy`)}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              copyTextToClipboard(item && item.unit_ref_number && item.unit_ref_number.name);
                            }}
                            className='mdi mdi-content-copy'
                          />
                        </Tooltip>
                      </span>
                    ) : ''}
                    <span className='details-text mt-1  '>
                      {t(`${translationPath}unit-type`)}
                      :
                      {` ${item && item.unitType && item.unitType.map((value) => value || 'N/A')} `}
                    </span>
                  </div>
                  {item.flatContent && item.flatContent.length > 0 && (
                    <div className='flat-contents-wrapper'>
                      {item.flatContent
                        .filter(
                          (filterItem, filterIndex) =>
                            (!isExpanded && filterIndex < notExpandedMax) || isExpanded
                        )
                        .map((subItem, subIndex) => (
                          <div
                            key={`flatContentsItemRef${subIndex + 1}`}
                            className='flat-content-item'
                          >
                            <span className={`flat-content-icon ${subItem.iconClasses} mdi-18px`} />
                            <span className='px-1'>{subItem.value}</span>
                            <span>
                              {subItem.title && (
                                <span className='flat-content-text'>
                                  {t(`${translationPath}${subItem.title}`)}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <div className='cards-progress-wrapper'>
                <ProgressComponet
                  value={item.progress}
                  progressText={`${item.progress}%`}
                  themeClasses='theme-gradient'
                />
              </div>
              <div className='cards-footer-wrapper'>
                <ButtonBase
                  className='btns theme-transparent mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.folder.key, item, index)}
                >
                  <span className='mdi mdi-folder-open-outline' />
                  <span className='px-1'>{t('open-file')}</span>
                </ButtonBase>
                {(item && item.leadClass && item.leadClass.toLowerCase() === LeadsClassTypesEnum.buyer.value && (
                  <ButtonBase
                    disabled={item.matchingUnitsNumber === 0}
                    className='btns theme-transparent mx-0'
                    onClick={onFooterActionsClicked(ActionsEnum.matching.key, item, index)}
                  >
                    <span className={ActionsEnum.matching.icon} />
                    <span className='px-1'>{item.matchingUnitsNumber}</span>
                    <span>{t(ActionsEnum.matching.label)}</span>
                  </ButtonBase>
                )) || (item && item.leadClass && item.leadClass.toLowerCase() === LeadsClassTypesEnum.tenant.value && (
                  <ButtonBase
                    disabled={item.matchingUnitsNumber === 0}
                    className='btns theme-transparent mx-0'
                    onClick={onFooterActionsClicked(ActionsEnum.matching.key, item, index)}
                  >
                    <span className={ActionsEnum.matching.icon} />
                    <span className='px-1'>{item.matchingUnitsNumber}</span>
                    <span>{t(ActionsEnum.matching.label)}</span>
                  </ButtonBase>
                )) || <div />}
                {/* {loginResponse
                  && loginResponse.permissions
                    .map(
                      (permissionItem) =>
                        permissionItem.permissionsId ===
                        LeadsPermissions.UpdateLeads.permissionsId
                    )
                    .includes(true) && ( */}
                <ButtonBase
                  className='btns theme-transparent mx-0'
                  onClick={onFooterActionsClicked(ActionsEnum.reportEdit.key, item, index)}
                  disabled={(item.status &&
                    item.status.lookupItemId === Closed)}

                >
                  <span className='mdi mdi-lead-pencil' />
                  <span className='px-1'>{t('edit')}</span>
                  <Tooltip title={moment(item.updateDate).format('DD/MM/YYYY HH:mm A') || 'N/A'}>
                    <span className='edit-power-icon mdi mdi-clock-time-four-outline c-warning mdi-16px px-2' />
                  </Tooltip>
                </ButtonBase>
                {/* )} */}
              </div>
            </a>
          </div>
        ))}
    </div>
  );
};

LeadsCardsComponent.propTypes = {
  data: PropTypes.shape({ result: PropTypes.instanceOf(Array), totalCount: PropTypes.number })
    .isRequired,
  activeCard: PropTypes.instanceOf(Object),
  selectedDetailsLeadItem: PropTypes.instanceOf(Object),
  isExpanded: PropTypes.bool.isRequired,
  withCheckbox: PropTypes.bool.isRequired,
  onCardClicked: PropTypes.func.isRequired,
  relodedata: PropTypes.func.isRequired,
  onFooterActionsClicked: PropTypes.func.isRequired,
  onActionClicked: PropTypes.func.isRequired,
  onCardCheckboxClick: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  notExpandedMax: PropTypes.number,
  isCheckBoxDisabled: PropTypes.bool,
  selectedCards: PropTypes.instanceOf(Array),
};
LeadsCardsComponent.defaultProps = {
  notExpandedMax: 5,
  selectedDetailsLeadItem: undefined,
  activeCard: undefined,
  isCheckBoxDisabled: false,
  selectedCards: undefined,
};
