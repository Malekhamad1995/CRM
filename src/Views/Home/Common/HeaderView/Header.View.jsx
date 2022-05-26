import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Badge from '@material-ui/core/Badge';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { useTranslation } from 'react-i18next';
import SmsIcon from '@material-ui/icons/Sms';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EventIcon from '@material-ui/icons/Event';
import { getDownloadableLink, GlobalHistory, setLogoutAction } from '../../../../Helper';
import { UserMenuView } from './UserMenu.View';
import { useOnClickOutside } from '../../../../Hubs';
import { NotificationsView } from './Notifications.View';
import { LOGOUt } from '../../../../store/login/Actions';
import { EventsView } from './Events.View';
import { CollapseComponent, PopoverComponent, PermissionsComponent } from '../../../../Components';
import { HeaderSearchComponent, QuickAddPopoverComponent } from './Sections';
import { ActivitiesManagementDialog } from '../../ActivitiesView/ActivitiesViewUtilities';
import {
  LeadQuickAddDialog,
  PropertQuickAddDialog,
} from './Sections/QuickAddPopoverComponent/Dialogs';
import { UnitsAddDialogsView } from '../../UnitsView/UnitsAddDialogsView/UnitsAddDialogsView';
import { AddContactDialog } from './Sections/QuickAddPopoverComponent/QuickAddView/ContactView/Dialogs/AddContactDialog';
import { QuickAddPermissions } from '../../../../Permissions';

const FirstLettersExp = /\b(\w)/gm;
const parentTranslationPath = 'HeaderView';
const translationPath = '';
export const Header = ({ headerHeightChanged }) => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [quickAddAttachedWith, setQuickAddAttachedWith] = useState(null);
  const userProfileRef = useRef(null);
  const notificationsRef = useRef(null);
  const eventsRef = useRef(null);
  const [imageReq, setImageReq] = useState(null);
  const [notificationsNumber, setNotificationsNumber] = useState(0);
  const [EventnotificationsNumber, setEventNotificationsNumber] = useState(0);
  const [isOpenMenu, setIsOpenMenu] = useState({
    userProfile: false,
    notifications: false,
    events: false,
  });
  const [DialogSelect, setDialogSelect] = useState('');
  const [isOpenDialog, setisOpenDialog] = useState({
    ActivitiesDialog: '',
    ContactDialog: '',
    PropertyDialog: '',
    UnitDialog: '',
    LeadDialog: '',
  });
  const userProfileClicked = () => {
    setIsOpenMenu({ ...isOpenMenu, userProfile: !isOpenMenu.userProfile });
  };
  const notificationsClicked = () => {
    setIsOpenMenu({ ...isOpenMenu, notifications: !isOpenMenu.notifications });
  };
  const eventsClicked = () => {
    setIsOpenMenu({ ...isOpenMenu, events: !isOpenMenu.events });
  };
  const logoutClicked = () => {
    localStorage.removeItem('session');
    dispatch(LOGOUt());
    setTimeout(() => {
      GlobalHistory.push('/account/login');
    }, 100);
  };
  setLogoutAction(logoutClicked);
  useOnClickOutside(userProfileRef, () =>
    setIsOpenMenu((item) =>
    (item.userProfile ?
      {
        ...item,
        userProfile: false,
      } :
      item)));
  useOnClickOutside(notificationsRef, () =>
    setIsOpenMenu((item) =>
    (item.notifications ?
      {
        ...item,
        notifications: false,
      } :
      item)));
  useOnClickOutside(eventsRef, () =>
    setIsOpenMenu((item) =>
    (item.events ?
      {
        ...item,
        events: false,
      } :
      item)));
  const handleClose = useCallback(() => {
    setQuickAddAttachedWith(null);
  }, []);
  const openQuickAddHandler = useCallback((event) => {
    setQuickAddAttachedWith(event.currentTarget);
  }, []);
  useEffect(() => {
    headerHeightChanged(headerRef.current.clientHeight);
  }, [headerHeightChanged]);
  useEffect(() => {
    if (loginResponse) setImageReq(loginResponse);
  }, [loginResponse]);
  useEffect(() => {
    if (DialogSelect === 5) {
      setQuickAddAttachedWith(null);
      setisOpenDialog((item) => ({ ...item, ActivitiesDialog: true }));
    } else if (DialogSelect === 4) {
      setQuickAddAttachedWith(null);
      setisOpenDialog((item) => ({ ...item, LeadDialog: true }));
    } else if (DialogSelect === 3) {
      setQuickAddAttachedWith(null);
      setisOpenDialog((item) => ({ ...item, UnitDialog: true }));
    } else if (DialogSelect === 2) {
      setQuickAddAttachedWith(null);
      setisOpenDialog((item) => ({ ...item, PropertyDialog: true }));
    } else if (DialogSelect === 1) {
      setQuickAddAttachedWith(null);
      setisOpenDialog((item) => ({ ...item, ContactDialog: true }));
    }
  }, [DialogSelect]);
  return (
    <div className='header-wrapper' ref={headerRef}>
      <div className='section w-100'>
        <span role='img' aria-label={t('PIS-logo')} className='img-logo' />
        <HeaderSearchComponent
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='section'>
        <PermissionsComponent
          permissionsList={Object.values(QuickAddPermissions)}
          permissionsId={[QuickAddPermissions.QuickAddContact.permissionsId,
                                 QuickAddPermissions.QuickAddProperty.permissionsId,
                                 QuickAddPermissions.QuickAddUnit.permissionsId,
                                 QuickAddPermissions.QuickAddLead.permissionsId,
                                 QuickAddPermissions.QuickAddActivity.permissionsId]}
        >
          <ButtonBase className='btns theme-transparent mx-0' onClick={openQuickAddHandler}>
            <span className='fw-medium'>{t('quick-add')}</span>
            <span className='mdi mdi-plus mx-1' />
          </ButtonBase>
          <PopoverComponent
            idRef='quickAddPopRef'
            handleClose={handleClose}
            attachedWith={quickAddAttachedWith}
            popoverClasses='popover-quick-add'
            component={(
              <QuickAddPopoverComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                setDialogSelect={(value) => setDialogSelect(value)}
              />
          )}
          />
        </PermissionsComponent>
        <div className='p-relative' ref={eventsRef}>
          <ButtonBase className='btns-icon section-conteaner' onClick={eventsClicked}>
            <Badge badgeContent={EventnotificationsNumber} className='badges' max={99}>
              <EventIcon className='privet-icon ' />
            </Badge>
          </ButtonBase>
          <EventsView
            isOpen={isOpenMenu.events}
            top={headerRef.current ? headerRef.current.clientHeight - 10 : 50}
            getCurrentNotificationNumber={(value) => setEventNotificationsNumber(value)}
          />
        </div>
        <div className='p-relative' ref={notificationsRef}>
          <ButtonBase className='btns-icon section-conteaner' onClick={notificationsClicked}>
            <Badge badgeContent={notificationsNumber} className='badges' max={99}>
              <NotificationsIcon className='privet-icon ' />
            </Badge>
          </ButtonBase>
          <NotificationsView
            isOpen={isOpenMenu.notifications}
            top={headerRef.current ? headerRef.current.clientHeight : 60}
            getCurrentNotificationNumber={(value) => setNotificationsNumber(value)}
          />
        </div>
        <ButtonBase className='btns-icon section-conteaner'>
          <SmsIcon className='privet-icon ' />
        </ButtonBase>
        <div className='p-relative' ref={userProfileRef}>
          <ButtonBase
            className='btns theme-transparent user-button-wrapper'
            onClick={userProfileClicked}
          >
            {loginResponse && loginResponse.fullName && (!imageReq || !imageReq.profileImg) && (
              <Avatar className='avatars-wrapper theme-small'>
                {loginResponse.fullName.match(FirstLettersExp).join('')}
              </Avatar>
            )}
            {imageReq && imageReq.profileImg && (
              <img
                src={getDownloadableLink(imageReq.profileImg)}
                alt={t('user-image')}
                className='user-image'
              />
            )}
            {imageReq && imageReq.fullName && (
              <div className='user-name-wrapper'>
                <span className='user-name-text'>{imageReq.fullName}</span>
                {isOpenMenu.userProfile === false ? <span className='mdi mdi-chevron-down mx-2' /> :
                <span className='mdi mdi-chevron-up mx-2' />}
              </div>
            )}
          </ButtonBase>
          <CollapseComponent
            isOpen={isOpenMenu.userProfile}
            top={headerRef.current ? headerRef.current.clientHeight : 60}
            component={<UserMenuView logout={logoutClicked} />}
          />
        </div>
      </div>
      {isOpenDialog.ActivitiesDialog && (
        <ActivitiesManagementDialog
          activeItem={null}
          open={isOpenDialog.ActivitiesDialog}
          isEdit={false}
          onSave={() => {
            setisOpenDialog((item) => ({ ...item, ActivitiesDialog: false }));
            setDialogSelect('');
          }}
          close={() => {
            setisOpenDialog((item) => ({ ...item, ActivitiesDialog: false }));
            setDialogSelect('');
          }}
          translationPath={translationPath}
          parentTranslationPath='ActivitiesView'
        />
      )}
      {isOpenDialog.PropertyDialog && (
        <PropertQuickAddDialog
          open={isOpenDialog.PropertyDialog}
          onClose={() => {
            setisOpenDialog((item) => ({ ...item, PropertyDialog: false }));
            setDialogSelect('');
          }}
        />
      )}
      {isOpenDialog.ContactDialog && (
        <AddContactDialog
          open={isOpenDialog.ContactDialog}
          close={() => {
            setisOpenDialog((item) => ({ ...item, ContactDialog: false }));
            setDialogSelect('');
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenDialog.UnitDialog && (
        <UnitsAddDialogsView
          open={isOpenDialog.UnitDialog}
          close={() => {
            setisOpenDialog((item) => ({ ...item, UnitDialog: false }));
            setDialogSelect('');
          }}
        />
      )}
      {isOpenDialog.LeadDialog && (
        <LeadQuickAddDialog
          isOpen={isOpenDialog.LeadDialog}
          close={() => {
            setisOpenDialog((item) => ({ ...item, LeadDialog: false }));
            setDialogSelect('');
          }}
        />
      )}
    </div>
  );
};
Header.propTypes = {
  headerHeightChanged: PropTypes.func.isRequired,
};
