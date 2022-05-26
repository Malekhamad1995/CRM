import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import defaultLogo from '../../../assets/images/defaults/logo-crm.svg';
import {
  showSuccess, showError, GlobalHistory, languageChange
} from '../../../Helper';
import { config } from '../../../config';
// import { ApplicationLogin } from '../../services';
import { LOGIN } from '../../../store/login/Actions';
import { CheckboxesComponent, Inputs, SelectComponet } from '../../../Components';

const translationPath = '';
const parentTranslationPath = 'LoginView';
function LoginView({ loginResponse }) {
  const { t } = useTranslation('LoginView');
  const dispatch = useDispatch(LOGIN);
  // const history = useHistory();
  const [loginDto, setLoginDto] = useState({
    identity: '',
    password: '',
    rememberMe: false,
    organizationId: config.organizationsId,
    applicationId: config.applicationId,
  });
  const [animationStartClasses, setAnimationStartClasses] = useState('');
  const [animationStart, setAnimationStart] = useState(false);
  const [animat, setanimat] = useState('letter');
  const [loaded, setloaded] = useState(false);
  const [animat2, setanimat2] = useState('reg-text');
  const [isclick, setisclick] = useState(false);
  const validationHandler = () => {
    if (!loginDto.password || !loginDto.identity) return false;
    if (!loginDto.password) return false;
    return true;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validationHandler()) { dispatch(LOGIN(loginDto)); setisclick(true); setloaded(true); }
  };
  useEffect(() => {
    if (loginResponse && !animationStart) {
      if (loginResponse.token) {
        setloaded(false);
        // setCookie('session', loginResponse.token, { path: '/' });
        localStorage.setItem('session', JSON.stringify(loginResponse));
        // history.push('/main');
        showSuccess(t(`${translationPath}Login-Succssfuly`));
        setAnimationStartClasses(' in-animate');
        setAnimationStart(true);
        setTimeout(() => {
          GlobalHistory.push('/home');
        }, 300);
        setisclick(false);
      } else {
        // setIsLoading(false);
        showError(t(`${loginResponse.Message}`));
        setisclick(false);
        setloaded(false);
      }
    }
    return () => {
      // login;
    };
  }, [loginResponse, animationStart, t]);
  const controlsHandler = useCallback(
    (input, process) => (event) => {
      setLoginDto({ ...loginDto, [input]: event.target[process] });
    },
    [setLoginDto, loginDto]
  );
  useEffect(() => {
    setTimeout(() => {
      setanimat(' letter  loaded ');
      setanimat2(' reg-text  loaded ');
    }, 1500);
  }, []);

  return (
    <div className='login-wrapper'>
      <div className='login-content-wrapper'>
        <div className='text-section-wrapper'>
          <div className='text-section-content'>
            <span className='texts-header primary-bold'>{t(`${translationPath}welcome-to`)}</span>

            <span className='texts-header primary-bold'>
              {
                ((JSON.parse(localStorage.getItem('localization')).currentLanguage !== 'ar') && (
                  <div className='text-container-s'>
                    <span className={animat2}>PSI</span>
                    <span> &ensp;</span>
                    <span className={animat}> C</span>
                    <span className={animat}> o</span>
                    <span className={animat}> m</span>
                    <span className={animat}> p</span>
                    <span className={animat}> a</span>
                    <span className={animat}> n</span>
                    <span className={animat}> y</span>
                  </div>
                )) || (`${`${t(`${translationPath}company`)}${' '} PSI`}`
                )
              }

            </span>
            <span className='texts c-black-dark fz-30px'>{t(`${translationPath}login-desc`)}</span>
          </div>
        </div>
        <div className='box-section-wrapper'>
          <div className='box-content'>
            <div className='d-flex-v-center-h-between'>
              <div className='logo-wrapper'>
                <img src={defaultLogo} className='logo' alt={t(`${translationPath}company-logo`)} />
              </div>
              <div className='px-2'>
                <SelectComponet
                  data={i18next.languages}
                  value={i18next.language}
                  onSelectChanged={languageChange}
                  themeClass='theme-underline'
                />
              </div>
            </div>
            <form noValidate className='form-wrapper' onSubmit={handleSubmit}>
              <Inputs
                idRef='identityRef'
                wrapperClasses='theme-underline'
                label={t(`${translationPath}identity`)}
                inputPlaceholder={t(`${translationPath}ex-desc`)}
                value={loginDto.identity}
                onInputChanged={controlsHandler('identity', 'value')}
              />
              <Inputs
                idRef='passwordRef'
                wrapperClasses='theme-underline'
                type='password'
                label={t(`${translationPath}password`)}
                value={loginDto.password}
                onInputChanged={controlsHandler('password', 'value')}
              />
              <div className='d-flex-v-center-h-between mb-3'>
                {/* <FormControlLabel
                  className="form-control-label"
                  control={(
                    <Checkbox
                      className="checkbox-wrapper"
                      checkedIcon={<span className="mdi mdi-check" />}
                      indeterminateIcon={<span className="mdi mdi-minus" />}
                      value={loginDto.rememberMe}
                      onChange={controlsHandler('rememberMe', 'checked')}
                    />
                  )}
                  label={t(`${translationPath}remember-me`)}
                /> */}
                <CheckboxesComponent
                  idRef='rememberMeRef'
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  label='remember-me'
                  singleChecked={loginDto.rememberMe}
                  themeClass='theme-secondary'
                  onSelectedCheckboxClicked={() => {
                    setLoginDto((items) => ({ ...items, rememberMe: !items.rememberMe }));
                  }}
                />
                <Link to='/account/IdentityVerificationView' className='links'>
                  {t(`${translationPath}forgot-password`)}
                </Link>
              </div>
              <div className='d-flex-v-center-h-end'>
                <div className={`animated-btn-wrapper${animationStartClasses}`}>
                  <Button className='btns theme-solid' type='submit' disabled={isclick}>
                    {((!loaded) && (<span>{t(`${translationPath}start`)}</span>)) || (<span>{t(`${translationPath}Plase-wait`)}</span>)}
                  </Button>
                  {((!loaded) && (<span className='mdi mdi-chevron-double-right animated-icon' />)) || (
                    <span className='animated-icon'>
                      <CircularProgress
                        variant='indeterminate'
                        disableShrink
                        sx={{
                          color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                          animationDuration: '550ms',
                          position: 'absolute',

                        }}
                        size={10}
                        thickness={4}
                      />
                    </span>
                  )}
                </div>
              </div>
            </form>
            <div className='curve-edge' />
            <div className='curve-edge-reverced' />
          </div>
        </div>
      </div>
      <div className='light-shadow' />
      <div className='city-wrapper'>
        <div className='city' />
        <div className='city-shadow' />
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  const {
    login: { loginResponse },
  } = state;
  return {
    loginResponse,
  };
};
LoginView.propTypes = {
  loginResponse: PropTypes.shape(undefined),
};
LoginView.defaultProps = {
  loginResponse: null,
};
const store = connect(mapStateToProps)(LoginView);

export { store as LoginView };
