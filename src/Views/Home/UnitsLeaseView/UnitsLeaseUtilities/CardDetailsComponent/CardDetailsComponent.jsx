/* eslint-disable no-nested-ternary */
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import Button from '@material-ui/core/Button';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import i18next from 'i18next';
import { Tooltip } from '@material-ui/core';
import {
  ActionsEnum,
  ContactTypeEnum,
  LoadableImageEnum,
  UnitsOperationTypeEnum,
  UnitsStatusEnum,
} from '../../../../../Enums';
import {
  getDownloadableLink,
  GlobalHistory,
  showError,
  showinfo,
  showSuccess,
  sideMenuIsOpenUpdate,
  returnPropsByPermissions
} from '../../../../../Helper';
import {
  DialogComponent,
  FacebookGalleryComponent,
  LoadableImageComponant,
  PermissionsComponent,
  SelectComponet,
  Spinner,
} from '../../../../../Components';
import {
  archiveUnitsPut,
  CanSetUnitAsReservedOrLeasedOrSale,
  GetUnitAvailableStatus,
  SetUnitAsAvailableOrDraft,
} from '../../../../../Services';
import { UnitStatusDraftDialog } from './Dialogs';
import { UnitPermissions } from '../../../../../Permissions';
import { UnitStatusAvailableDialog } from './Dialogs/UnitStatusAvailableDialog/UnitStatusAvailableDialog';
import { ArchiveState } from '../../../../../assets/json/StaticValue.json';

function CardDetailsComponent({
  activeData,
  cardDetailsActionClicked,
  reloadData,
  parentTranslationPath,
  translationPath,
  from,
}) {
  const textArea = useRef(null);
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const [isLoading, setIsLoading] = useState(false);
  const [unitAvailableStatuses, setUnitAvailableStatuses] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isOpenDraftDialog, setIsOpenDraftDialog] = useState(false);
  const [isOpenAvailableDialog, setIsOpenAvailableDialog] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const { t } = useTranslation(parentTranslationPath);
  // const imageHandler = useCallback(
  //   (imageIndex) => () => {
  //     setActiveImageIndex(imageIndex);
  //   },
  //   []
  // );
  const archiveUnits = useCallback(async () => {
    await archiveUnitsPut(activeData.id);
    showSuccess(t(`${translationPath}Successarchive`));
    sideMenuIsOpenUpdate(false);
    setOpen(false);
    reloadData();
  }, [activeData.id, reloadData, t, translationPath]);
  const getIsAlloweGetUnitAvailableStatusus = () => returnPropsByPermissions(UnitPermissions.MakeTransactionOnUnitToBeAvailable.permissionsId);
  const getIsAlloweGetUnitReservedOrLeased = () => returnPropsByPermissions(UnitPermissions.ChekIfCanSetUnitAsReservedOrLeased.permissionsId);

  const onSelectChanged = async (newStatus) => {
    if (newStatus === UnitsStatusEnum.Draft.key) setIsOpenDraftDialog(true);
    else if (newStatus === UnitsStatusEnum.Available.key) {
      setIsLoading(true);
      if (!isPropertyManagementView) {
        await SetUnitAsAvailableOrDraft({
          unitId: activeData.id,
          status: UnitsStatusEnum.Available.key,
          note: null,
          availableReasonId: null,
          rowVersion: activeData.rowVersion,
          OperationType: UnitsOperationTypeEnum.rent.key
        });
      } else if (isPropertyManagementView && getIsAlloweGetUnitAvailableStatusus()) {
        await SetUnitAsAvailableOrDraft({
          unitId: activeData.id,
          status: UnitsStatusEnum.Available.key,
          note: null,
          availableReasonId: null,
          OperationType: UnitsOperationTypeEnum.rent.key,
          rowVersion: activeData.rowVersion,
        });
      } else {
        setIsLoading(false);
        showError(t(`${translationPath}Dont-have-permissions-in-this-role`));
        return;
      }

      setIsLoading(false);
      if (reloadData) reloadData();
      // setIsOpenAvailableDialog(true);
    } else
      if (!isPropertyManagementView) {
        const res = await CanSetUnitAsReservedOrLeasedOrSale(activeData.id, newStatus);
        if (res) {
          GlobalHistory.push(
            `/home/units-lease/unit-status-management?status=${newStatus}&id=${activeData.id}&from=${from}&rowVersion=${activeData.rowVersion}`
          );
        } else showError(t(`${translationPath}There-is-no-lease-lead-owner-for-this-unit`));
      } else if (isPropertyManagementView && getIsAlloweGetUnitReservedOrLeased()) {
        const res = await CanSetUnitAsReservedOrLeasedOrSale(activeData.id, newStatus);
        if (res) {
          GlobalHistory.push(
            `/home/units-lease/unit-status-management?status=${newStatus}&id=${activeData.id}&from=${from}&rowVersion=${activeData.rowVersion}`
          );
        } else showError(t(`${translationPath}There-is-no-lease-lead-owner-for-this-unit`));
      } else
        showError(t(`${translationPath}Dont-have-permissions-in-this-role`));
  };
  const getUnitAvailableStatus = useCallback(async () => {
    setIsLoading(true);
    const res = await GetUnitAvailableStatus(activeData.id, UnitsOperationTypeEnum.rent.key);
    if (!(res && res.status && res.status !== 200)) setUnitAvailableStatuses(res);
    else setUnitAvailableStatuses([]);
    setIsLoading(false);
  }, [activeData.id]);

  // useEffect(() => {
  //   if (
  //     activeData.unitStatus.key === UnitsStatusEnum.Sale.key &&
  //     activeData.unitStatus.key !== UnitsOperationTypeEnum.rentAndSale.key
  //   )
  //     UnitsStatusEnum.Sale.value = 'sale';
  //   else if (activeData.unitStatus.key === UnitsStatusEnum.Leased.key)
  //     UnitsStatusEnum.Leased.value = 'leased';
  // }, [activeData]);

  useEffect(() => {
    if (activeData && activeData.id) getUnitAvailableStatus();
  }, [activeData, getUnitAvailableStatus]);
  useEffect(() => {
    if (activeData.unitActiveStatus) setActiveStatus(activeData.unitActiveStatus);
  }, [activeData.unitActiveStatus]);
  const copyTextToClipboard = (itemId) => {
    const context = textArea.current;
    if (itemId && context) {
      context.value = itemId;
      context.select();
      document.execCommand('copy');
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
    } else
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
  };
  const getDefaultUnitImage = useCallback(
    (unitType) => ContactTypeEnum[unitType] && ContactTypeEnum[unitType].defaultImg,
    []
  );

  useEffect(() => {
    if (pathName === 'units-property-management')
      setIsPropertyManagementView(true);
    else
      setIsPropertyManagementView(false);
  }, [pathName]);

  return (
    <div className='units-card-detaild-wrapper p-relative'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='w-100 px-3 mb-3'>
        <SelectComponet
          idRef='unitStatusRef'
          data={Object.values(UnitsStatusEnum).filter(
            (item) =>
              item.showInSelect &&
              (!item.effectedOperationType ||
                activeData.operationType === item.effectedOperationType ||
                activeData.operationType === UnitsOperationTypeEnum.rentAndSale.key) &&
              unitAvailableStatuses.findIndex((element) => element === item.key) !== -1
          )}
          emptyItem={{ value: null, text: 'make-transaction', isHiddenOnOpen: true }}
          value={activeStatus}
          translationPathForData={translationPath}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onSelectChanged={onSelectChanged}
          valueInput='key'
          textInput='value'
        />
      </div>
      <div className='status-wrapper'>
        <div
          className={`body-status ${(activeData.lease_status && activeData.lease_status) === 'Available' && 'c-success-light'
            }`}
        >
          <div className='body-status-type'>{t(`${translationPath}status`)}</div>
          {' : '}
          <span className={`body-status ${(activeData.lease_status && activeData.lease_status) === 'ReservedLeased' && 'status-wrapper-text'}`}>
            {(activeData.lease_status &&
            activeData.lease_status &&
            t(
              `${translationPath}${activeData.lease_status === 'Resale' ?
                'sale' :
                activeData.lease_status === 'New Lease' ?
                  'leased' :
                  activeData.lease_status
              }`
            )) ||
            'N/A'}
          </span>
        </div>
      </div>
      <div className='archive-bbt'>
        <Button
          onClick={() => setOpen(true)}
          disabled={ArchiveState}
          className='MuiButtonBase-root MuiButton-root MuiButton-text btns-icon theme-solid mx-2'
          title={t(`${translationPath}ArchiveUnit`)}
        >
          <span className='MuiButton-label'>
            <span className='mdi mdi-inbox-multiple' />
          </span>
          <span className='MuiTouchRipple-root' />
        </Button>
      </div>
      {activeData && (
        <div className='side-menu-wrapper'>
          <div>
            <div className='cards-header-wrapper'>
              <LoadableImageComponant
                classes='details-img'
                type={LoadableImageEnum.div.key}
                alt={t(`${translationPath}unit-image`)}
                src={
                  (activeData.allunitImages && getDownloadableLink(activeData.allunitImages.fileId)) ||
                  getDefaultUnitImage(activeData.type)
                }
              />
            </div>
            <div className='properety-plan d-flex-center my-2'>{activeData.name}</div>
            <div className='price-wrapper'>
              <div className={`for-lable ${activeData.unitOperationType}`}>
                {t(`${translationPath}for`)}
              </div>
              <div className={activeData.unitOperationType}>
                {`  ${activeData.unitOperationType}`}
                :
              </div>
              <div className='unit-price'>
                {`   ${activeData.price ? activeData.price : 'N/A'} AED`}
              </div>
            </div>
            <div className='flat-contents-wrapper'>
              {activeData.flatContent.map((subItem, subIndex) => (
                <div
                  key={`detailsFlatContentsItemRef${subIndex + 1}`}
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
            <div className='id-date-wrapper pl-2 pr-2'>
              <div className='created-on'>
                <span className='details-icon mdi mdi-calendar mdi-16px' />
                <span>
                  <span className='details-text fw-simi-bold'>
                    {t(`${translationPath}created`)}
                    :
                  </span>
                  <span className='px-1'>
                    {(activeData.creationDate &&
                      moment(activeData.creationDate)
                        .locale(i18next.language)
                        .format('DD/MM/YYYY')) ||
                      'N/A'}
                  </span>
                </span>
              </div>
              <div className='contact-id-wrapper'>
                {t(`${translationPath}id`)}
                :
                <div className='contact-id'>
                  {activeData.id}
                  <textarea readOnly aria-disabled value={activeData.id} ref={textArea} />
                </div>
                <Tooltip title={t(`${translationPath}copy`)}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      copyTextToClipboard(activeData.id);
                    }}
                    className='mdi mdi-content-copy'
                  />
                </Tooltip>
              </div>
            </div>
            <div className='px-3 mb-3 slider-data'>
              {activeData.details &&
                activeData.details.map((item, index) => (
                  <React.Fragment key={`detailsRef${index + 1}}`}>
                    {item.value && (
                      <div className='px-3 mb-2'>
                        <span className='texts gray-primary-bold'>
                          {`${t(item.title)}`}
                          :
                        </span>
                        <span className='texts s-gray-primary'>{`  ${item.value}`}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
          <div className='side-menu-actions'>
            <div className='d-flex-center'>
              <Button
                className='btns theme-solid mx-2 mb-2'
                onClick={cardDetailsActionClicked(ActionsEnum.folder.key, activeData)}
              >
                <span className='icons i-folder-white' />
                <span className='mx-2'>{t(`${translationPath}open-file`)}</span>
              </Button>
              <Button
                onClick={() => {
                  GlobalHistory.push(
                    `/home/units-sales/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
                  );
                }}
                className='btns mx-2 mb-2'
              >
                <span className='mdi mdi-pencil-outline' />
                <span className='mx-2'>{t(`${translationPath}edit`)}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      <FacebookGalleryComponent
        data={(activeData && activeData.unitImages) || []}
        isOpen={(activeImageIndex !== null && activeData && true) || false}
        activeImageIndex={activeImageIndex}
        titleText='unit-images'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onOpenChanged={() => {
          setActiveImageIndex(null);
        }}
      />

      {isPropertyManagementView && (
        <PermissionsComponent
          permissionsList={Object.values(UnitPermissions)}
          permissionsId={UnitPermissions.MakeTransactionOnUnitToBeDraft.permissionsId}
        >
          {isOpenDraftDialog && (
            <UnitStatusDraftDialog
              activeItem={activeData}
              isOpen={isOpenDraftDialog}
              reloadData={() => {
                setIsOpenDraftDialog(false);
                if (reloadData) reloadData();
              }}
              isOpenChanged={() => {
                setIsOpenDraftDialog(false);
              }}
            />
          )}
        </PermissionsComponent>
      )}
      {!isPropertyManagementView && (

        isOpenDraftDialog && (
          <UnitStatusDraftDialog
            activeItem={activeData}
            isOpen={isOpenDraftDialog}
            reloadData={() => {
              setIsOpenDraftDialog(false);
              if (reloadData) reloadData();
            }}
            isOpenChanged={() => {
              setIsOpenDraftDialog(false);
            }}
          />
        )

      )}
      <UnitStatusAvailableDialog
        activeItem={activeData}
        isOpen={isOpenAvailableDialog}
        reloadData={() => {
          setIsOpenAvailableDialog(false);
          if (reloadData) reloadData();
        }}
        isOpenChanged={() => {
          setIsOpenAvailableDialog(false);
        }}
      />
      <DialogComponent
        isOpen={open}
        onCancelClicked={() => setOpen(false)}
        onCloseClicked={() => setOpen(false)}
        translationPath={translationPath}
        parentTranslationPath='UnitsView'
        titleText='ArchiveUnit'
        onSubmit={(e) => {
          e.preventDefault();
          archiveUnits();
        }}
        maxWidth='sm'
        dialogContent={<span>{t(`${translationPath}MassageArchiveUnits`)}</span>}
      />
    </div>
  );
}

CardDetailsComponent.propTypes = {
  activeData: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  from: PropTypes.number,
  cardDetailsActionClicked: PropTypes.func,
};
CardDetailsComponent.defaultProps = {
  translationPath: 'utilities.cardDetailsComponent.',
  activeData: null,
  from: 1,
  cardDetailsActionClicked: () => { },
};
export { CardDetailsComponent };
