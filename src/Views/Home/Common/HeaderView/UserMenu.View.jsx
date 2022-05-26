import React, {
  memo, useEffect, useState, useCallback, useRef
} from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { useTranslation } from 'react-i18next';
import {
  getDownloadableLink,
  languageChange,
  showError,
  showSuccess,
  GlobalHistory,
} from '../../../../Helper';
import { CollapseComponent, DialogComponent, Spinner } from '../../../../Components';
import { OrganizationUserSearch, UpdateMyProfileImage, uploadFile } from '../../../../Services';
import { UPDATE } from '../../../../store/login/Actions';
import { ChangePasswordView } from '../../../Account';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { FreshdeskHelper, FreshdeskHelperRemve } from '../../../../Helper/Freshdesk.Helper';

const FirstLettersExp = /\b(\w)/gm;

const translationLocation = 'userMenuView.';
export const UserMenuView = memo(({ logout }) => {
  const { t } = useTranslation('HeaderView');
  const dispatch = useDispatch();
  const [openhelp, setopenhelp] = useState(false);
  const [HardRelodeval, setHardRelodeval] = useState(false);
  const [imageReq, setImageReq] = useState(null);
  const [languageToggler, setLanguageToggler] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [ChangePasswordDialog, setChangePasswordDialog] = useState(false);
  const [isOpenDialogReldo, setisOpenDialogReldo] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const uploaderRef = useRef(null);
  const [languages] = useState([
    {
      key: 'en',
      value: `${translationLocation}english`,
      icon: 'mdi mdi-ab-testing'
    },
    {
      key: 'ar',
      value: `${translationLocation}arabic`,
      icon: 'mdi mdi-abjad-arabic'
    },
  ]);
  useEffect(() => {
    if (loginResponse) setImageReq(loginResponse);
  }, [loginResponse]);
  const languageClicked = useCallback(languageChange);

  const openhelpHandler = () => {
    setopenhelp(!openhelp);
    setHardRelodeval(!HardRelodeval);
    if (openhelp)
      FreshdeskHelperRemve();
    else
      FreshdeskHelper();
  };

  const openhelpHandlerDialogReldo = () => {
    if (HardRelodeval)
      setisOpenDialogReldo(true);
    else
      setisOpenDialogReldo(false);
  };

  const HanrdRelodeFun = () => {
    window.localStorage.clear();
    GlobalHistory.push('/account/login');
    window.location.reload();
  };

  const languageTogglerClicked = () => {
    setLanguageToggler(!languageToggler);
  };
  const ChangePasswordClicked = () => {
    setChangePasswordDialog(true);
  };
  // const displayModeHandler = () => {
  //   setIsDarkMode((item) => {
  //     localStorage.setItem('displayMode', JSON.stringify({ isDarkMode: !item }));
  //     if (item) document.body.classList.remove('is-dark-mode');
  //     else if (!document.body.classList.contains('is-dark-mode'))
  //       document.body.classList.add('is-dark-mode');
  //     return !item;
  //   });
  // };
  const getOrganizationUserSearch = useCallback(async () => {
    setIsLoading(true);
    const response = await OrganizationUserSearch({
      userName: loginResponse.userName,
      pageIndex: 0,
      pageSize: 25,
    });
    if (response && response.result) {
      setIsLoading(false);
      dispatch(ActiveItemActions.activeItemRequest(response.result.find((item) => item.id === loginResponse.userId)));
      localStorage.setItem(
        'activeUserItem',
        JSON.stringify(response.result.find((item) => item.id === loginResponse.userId))
      );
      if (window.location.pathname.includes('home/Users/edit'))
        window.location.href = `/home/Users/edit?id=${loginResponse.userId}`;
      else GlobalHistory.push(`/home/Users/edit?id=${loginResponse.userId}`);
    } else setIsLoading(false);
  }, [dispatch, loginResponse.userId, loginResponse.userName]);
  const editProfileHandler = () => {
    getOrganizationUserSearch();
  };
  const fileChanged = useCallback(
    async (event) => {
      if (!event.target.value) return;
      setIsLoading(true);
      const response = await uploadFile({ file: event.target.files[0] });
      if (response) {
        const profileImageRes = await UpdateMyProfileImage(response.uuid);
        if (profileImageRes) {
          if (JSON.parse(localStorage.getItem('session')).userId === profileImageRes.id) {
            const updatedState = JSON.parse(localStorage.getItem('session'));
            const update = { ...updatedState, profileImg: profileImageRes.profileImg };
            localStorage.setItem('session', JSON.stringify(update));
            dispatch(UPDATE(update));
          }
          if (
            localStorage.getItem('activeUserItem') &&
            JSON.parse(localStorage.getItem('activeUserItem')).id === profileImageRes.id
          ) {
            const updateActiveUser = JSON.parse(localStorage.getItem('activeUserItem'));
            localStorage.setItem(
              'activeUserItem',
              JSON.stringify({ ...updateActiveUser, profileImg: profileImageRes.profileImg })
            );
            if (window.location.pathname.includes('home/Users/edit'))
              window.location.href = `/home/Users/edit?id=${profileImageRes.id}`;
          }
          showSuccess(t(`${translationLocation}image-changed-successfully`));
        } else showError(t(`${translationLocation}save-image-failed`));
        setIsLoading(false);
      } else {
        showError(t(`${translationLocation}upload-image-failed`));
        setIsLoading(false);
      }
    },
    [dispatch, t]
  );
  return (
    <div className='cards'>
      <div className='card-content'>
        <Spinner isActive={isLoading} isAbsolute />
        <div className='d-flex-column-center'>
          <div className='p-relative'>
            {loginResponse && loginResponse.fullName && (!imageReq || !imageReq.profileImg) && (
              <Avatar className='avatars-wrapper mb-3'>
                {loginResponse.fullName.match(FirstLettersExp).join('')}
              </Avatar>
            )}
            {imageReq && imageReq.profileImg && (
              <img
                src={getDownloadableLink(imageReq.profileImg)}
                alt={t('user-image')}
                className='user-img'
              />
            )}
            <input
              type='file'
              className='d-none'
              onChange={fileChanged}
              accept='image/*'
              ref={uploaderRef}
            />
            <ButtonBase className='btns-icon theme-outline-dark btns-small mx-0 user-btn'>
              <span className='mdi mdi-camera' onClick={() => uploaderRef.current.click()} />
            </ButtonBase>
          </div>
          <p className='c-primary'>{loginResponse && loginResponse.fullName}</p>
          <ButtonBase className='btns theme-solid mb-2' onClick={editProfileHandler}>

            {' '}
            <span className=' mdi mdi-account-edit-outline px-1' />
            {' '}
            {t(`${translationLocation}edit-profile`)}

          </ButtonBase>
          <div className='separator-h' />
          <ButtonBase className='btns theme-menu' onClick={openhelpHandler}>
            <span className={(openhelp !== true) ? 'mdi mdi-help-network' : 'mdi mdi-timeline-help-outline'} />
            {' '}
            <span className='mx-3'>
              {(openhelp !== true) ? t(`${translationLocation}open-help-support`) : t(`${translationLocation}colse-help-support`)}
              {' '}
            </span>

          </ButtonBase>
          {HardRelodeval && (
            <ButtonBase className='btns theme-menu' onClick={openhelpHandlerDialogReldo}>
              <span className='mdi mdi-refresh' />
              {' '}
              <span className='mx-3'>{t(`${translationLocation}hard-refresh-and-clear-caches`)}</span>
            </ButtonBase>
          )}
          <div className='separator-h' />

          <div className='separator-h' />
          <ButtonBase className='btns theme-menu'>
            <span className='icons i-activities' />
            {' '}
            <span className='mx-3'>{t(`${translationLocation}my-activities`)}</span>
          </ButtonBase>
          <div className='separator-h' />
          <ButtonBase className='btns theme-menu'>
            <span className='mdi mdi-cog-outline' />
            {' '}
            <span className='mx-3'>{t(`${translationLocation}setting`)}</span>
          </ButtonBase>
          <div className='separator-h' />
          {/* <div className='d-flex-center'>
            <ButtonBase
              className={!isDarkMode ? 'btns theme-menu' : 'btns theme-menu selectd'}
              onClick={displayModeHandler}
            >
              <span className='mdi mdi-moon-waning-crescent mdi-rotate-315' />
            </ButtonBase>
            <ButtonBase
              className={isDarkMode ? 'btns theme-menu' : 'btns theme-menu selectd'}
              onClick={displayModeHandler}
            >
              <span className='mdi mdi-white-balance-sunny' />
            </ButtonBase>
            <ButtonBase className='btns theme-menu'>
              <span className='mdi mdi-television' />
            </ButtonBase>
          </div> */}
          <ButtonBase className='btns theme-menu' onClick={ChangePasswordClicked}>
            <span className='mdi mdi-lock' />
            {' '}
            <span className='mx-3'>{t(`${translationLocation}change-password`)}</span>
          </ButtonBase>
          <div className='separator-h' />
          <ButtonBase className='btns theme-menu' onClick={languageTogglerClicked}>
            <div className='mdi mdi-translate' />
            {' '}
            <div className='mx-3 d-flex-h-between '>
              {t(`${translationLocation}language`)}
              {languageToggler === false ? <span className='mdi mdi-chevron-down' /> :
              <span className='mdi mdi-chevron-up' />}
            </div>
          </ButtonBase>
          <div className='separator-h mb-2' />
          <CollapseComponent
            isOpen={languageToggler}
            classes='w-100 px-3'
            component={(
              <>
                {languages.map((item, index) => (
                  <React.Fragment key={`languages${item.key}`}>
                    <ButtonBase
                      className='btns theme-menu'
                      onClick={() => languageClicked(item.key)}
                    >
                      <span className={`${item.icon} mx-3`} />
                      {t(item.value)}
                    </ButtonBase>
                    <div
                      className={`separator-h${index === languages.length - 1 ? ' mb-2' : ''}`}
                    />
                  </React.Fragment>
                ))}
              </>
            )}
          />
        </div>
      </div>
      <div className='card-footer'>
        <ButtonBase className='btns theme-outline mb-2 logout-footer' onClick={logout}>
          <span>{t(`${translationLocation}logout`)}</span>
        </ButtonBase>
      </div>
      <DialogComponent
        isOpen={ChangePasswordDialog}
        onCloseClicked={() => setChangePasswordDialog(false)}
        titleText={t(`${translationLocation}change-password`)}
        maxWidth='sm'
        dialogContent={(
          <>
            <ChangePasswordView
              onCancelClicked={() => setChangePasswordDialog(false)}
              translationPath={translationLocation}
            />
          </>
        )}
      />
      {isOpenDialogReldo && (
        <DialogComponent
          titleText={`${t(`${translationLocation}confirm-message`)}`}
          saveText={`${t(`${translationLocation}confirm`)}`}
          saveType='button'
          maxWidth='sm'
          dialogContent={(
            <div className='d-flex-column-center'>
              <Spinner isActive={isLoading} isAbsolute />
              <span className='mdi mdi-help-rhombus-outline c-primary mdi-48px' />
              <span className='pt-3' style={{ textAlignVertical: 'center', textAlign: 'center', }}>{`${t(`${translationLocation}Relode-description`)}`}</span>
            </div>
          )}
          saveClasses='btns theme-solid c-info: w-100 mx-2 mb-2'
          isOpen={isOpenDialogReldo}
          onSaveClicked={HanrdRelodeFun}
          onCloseClicked={() => setisOpenDialogReldo(false)}
          onCancelClicked={() => setisOpenDialogReldo(false)}
        />
      )}
    </div>
  );
});
UserMenuView.propTypes = {
  logout: PropTypes.func.isRequired,
};
