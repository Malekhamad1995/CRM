import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import { NavLink } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { Divider, ClickAwayListener } from '@material-ui/core';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { HomeRoutes, MainMenu } from '../../../../routes';
import { useEventListener, useHashChange } from '../../../../Hooks';
import { GlobalHistory } from '../../../../Helper';
import { PermissionsComponent } from '../../../../Components';

const getActiveGroup = () => {
  const activeSubMenu = HomeRoutes.find((item) =>
    (item.isExact ?
      window.location.pathname.match(item.layout ? item.layout + item.path : item.path) :
      window.location.pathname.includes(item.layout ? item.layout + item.path : item.path)));
  if (!activeSubMenu) {
    const mainMenu = MainMenu.find((item) =>
      (item.routerLink && item.routerLinkActiveOptions.exact ?
        window.location.pathname.match(item.routerLink) :
        window.location.pathname.includes(item.routerLink)));
    return mainMenu ? mainMenu.groupId : -1;
  }
  return activeSubMenu.groupId;
};
const getActiveSubItem = (exact, routerLink) =>
  (exact ?
    window.location.pathname.match(routerLink) :
    window.location.pathname.includes(routerLink));
const getSortedSubMenu = (openGroupId) =>
  HomeRoutes.filter((item) => item.groupId === openGroupId && item.showInMenu).sort(
    (a, b) => a.order - b.order
  );

export const MainMenuView = ({ isHover, setIsHover }) => {
  const { t } = useTranslation('Shared');
  const isUnmounted = useRef(false);
  const [activeGroupId, setActiveGroupId] = useState(getActiveGroup());
  const [openGroupId, setOpenGroupId] = useState(-1);
  const [hoverMenuIndex, setHoverMenuIndex] = useState(-1);
  const [hoverSubmenuIndex, setHoverSubmenuIndex] = useState(-1);
  const subMenuRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupName, setGroupName] = useState('');
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [subMenuLocation, setSubMenuLocation] = useState(0);
  const [menu] = useState(MainMenu);
  useHashChange(() => (!isUnmounted.current && setActiveGroupId(getActiveGroup())) || null);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(
    () => () => {
      setActiveGroupId(getActiveGroup());
    },
    []
  );
  useEffect(() => {
    if (openGroupId === -1) setExpanded(false);
  }, [openGroupId]);
  const menuClicked = useCallback(
    (groupId, routerLink) => {
      localStorage.removeItem('activeItem');
      setOpenGroupId(groupId);
      if (routerLink) {
        setActiveGroupId(groupId);
        GlobalHistory.push(routerLink);
      }
    },
    [setOpenGroupId]
  );
  const subMenuClicked = useCallback((groupId) => {
    setActiveGroupId(groupId);
  }, []);
  const menuPopoverLocationHandler = useCallback(() => {
    if (!anchorEl || !subMenuRef.current) setSubMenuLocation(0);
    else {
      const menuItemLocation =
        anchorEl.getBoundingClientRect().top + document.documentElement.scrollTop - 65;
      if (
        menuItemLocation + subMenuRef.current.clientHeight + 60 >
        window.innerHeight + document.documentElement.scrollTop
      ) {
        setSubMenuLocation(
          menuItemLocation -
            70 -
            (menuItemLocation +
              subMenuRef.current.clientHeight -
              (window.innerHeight + document.documentElement.scrollTop))
        );
      } else setSubMenuLocation(menuItemLocation);
    }
  }, [anchorEl]);
  // useEventListener('onScroll',()=>)
  useEffect(() => {
    menuPopoverLocationHandler();
  }, [anchorEl, menuPopoverLocationHandler]);
  useEffect(
    () => () => {
      isUnmounted.current = true;
    },
    []
  );
  useEventListener('scroll', () =>
    setTimeout(() => {
      menuPopoverLocationHandler();
    }, 50));
  const menuHover = useCallback((index) => setHoverMenuIndex(index), [setHoverMenuIndex]);
  const submenuHover = useCallback((index) => setHoverSubmenuIndex(index), [setHoverSubmenuIndex]);
  return (
    <div className='menu-wrapper'>
      <div className={`animated-open-close${isHover ? ' is-open' : ' is-close'}`}>
        <ButtonBase
          className='open-button'
          onClick={() => {
            if (openGroupId !== -1) {
              setOpenGroupId(-1);
              setIsHover(false);
            } else {
              setOpenGroupId(getActiveGroup() !== -1 ? getActiveGroup() : 1);
              setIsHover(true);
            }
          }}
        >
          <span className={`mdi ${!isHover ? 'mdi-menu' : 'mdi-close'}`} />
        </ButtonBase>
        <div className='main-menu-item-wrapper'>
          {menu
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <PermissionsComponent permissionsList={item.roles} allowEmptyRoles>
                <div
                  onMouseEnter={(event) => {
                    setHoverMenu(true);
                    setAnchorEl(event.currentTarget);
                  }}
                  onTouchStart={(event) => {
                    setHoverMenu(true);
                    setAnchorEl(event.currentTarget);
                  }}
                  key={`menuItemRef${index + 1}`}
                  className={
                    activeGroupId === item.groupId ? 'active-item-name' : 'inactive-item-name'
                  }
                >
                  <Accordion
                    key={`menu${item.groupId}`}
                    className={activeGroupId === item.groupId ? 'menu-item-summary' : ''}
                    expanded={expanded === item.groupId}
                    onChange={handleChange(item.groupId)}
                  >
                    <AccordionSummary
                      onClick={() => {
                        menuClicked(item.groupId, item.routerLink);
                        setIsHover(true);
                      }}
                      onMouseEnter={() => {
                        if (!isHover) {
                          if (item.groupId !== 1) {
                            // setAnchorEl(e.currentTarget);
                            setGroupName(item.name);
                            menuClicked(item.groupId, item.routerLink);
                          } else setOpenGroupId(-1);
                        }
                      }}
                      onTouchStart={() => {
                        if (!isHover) {
                          if (item.groupId !== 1) {
                            // setAnchorEl(e.currentTarget);
                            setGroupName(item.name);
                            menuClicked(item.groupId, item.routerLink);
                          } else setOpenGroupId(-1);
                        }
                      }}
                      expandIcon={
                        !item.routerLink && (
                          <ExpandMoreIcon
                            onClick={() => menuClicked(item.groupId, item.routerLink)}
                          />
                        )
                      }
                    >
                      <div className='side-menu-item-wrapper'>
                        <div
                          disabled={item.isDisabled}
                          className={`btns-menu side-menu-item${
                            activeGroupId === item.groupId ? ' active' : ''
                          }`}
                          onMouseEnter={() => menuHover(index)}
                          onMouseLeave={() => menuHover(-1)}
                        >
                          <span
                            className={
                              activeGroupId === item.groupId ||
                              openGroupId === item.groupId ||
                              hoverMenuIndex === index ?
                                item.iconActive :
                                item.icon
                            }
                          />
                          <div className='menu-item-name'>{t(item.name)}</div>
                        </div>
                      </div>
                    </AccordionSummary>
                    {!item.routerLink && (
                      <AccordionDetails>
                        <div className='menu-item-wrapper'>
                          {getSortedSubMenu(openGroupId).map((subItem, subIndex) => (
                            <PermissionsComponent permissionsList={subItem.roles} allowEmptyRoles>
                              <NavLink
                                key={`submenu${subIndex + 1}`}
                                to={subItem.layout ? subItem.layout + subItem.path : subItem.path}
                                exact={subItem.isExact}
                                activeClassName='active menu-active'
                                className='btns-submenu menu-content-item'
                                onMouseEnter={() => submenuHover(subIndex)}
                                onMouseLeave={() => submenuHover(-1)}
                                onClick={() => subMenuClicked(subItem.groupId)}
                                disabled={subItem.isDisabled}
                              >
                                <span
                                  className={
                                    getActiveSubItem(
                                      subItem.isExact,
                                      subItem.layout ? subItem.layout + subItem.path : subItem.path
                                    ) || hoverSubmenuIndex === index ?
                                      subItem.iconActive :
                                      subItem.icon
                                  }
                                />
                                <div className='sub-menu-item-name'>{t(subItem.name)}</div>
                              </NavLink>
                            </PermissionsComponent>
                          ))}
                        </div>
                      </AccordionDetails>
                    )}
                  </Accordion>
                </div>
              </PermissionsComponent>
            ))}
        </div>
      </div>
      {hoverMenu && getSortedSubMenu(openGroupId).length > 0 && !isHover && (
        <ClickAwayListener onClickAway={() => setHoverMenu(false)}>
          <div
            style={{ top: subMenuLocation }}
            ref={subMenuRef}
            onMouseLeave={() => setHoverMenu(false)}
            className={`side-menu-hover-wrapper ${
              hoverMenu && getSortedSubMenu(openGroupId).length > 0 && !isHover ?
                'is-hover' :
                'not-hover'
            }`}
          >
            {groupName && (
              <>
                <div className='menu-hover-name'>{t(groupName)}</div>
                <Divider />
              </>
            )}
            {getSortedSubMenu(openGroupId).map(
              (item, index) =>
                (item.roles.length === 0 ||
                  item.roles
                    .map(
                      (role) =>
                        loginResponse &&
                        loginResponse.permissions.findIndex(
                          (per) => per.permissionsId === role.permissionsId
                        ) !== -1
                    )
                    .includes(true)) && (
                    <NavLink
                      key={`submenu${index + 1}`}
                      to={item.layout ? item.layout + item.path : item.path}
                      exact={item.isExact}
                      activeClassName='hover-menu-active'
                      className='btns-submenu hover-menu-content-item'
                      onClick={() => subMenuClicked(item.groupId)}
                      disabled={item.isDisabled}
                    >
                      <div className='sub-menu-hover-item-name'>{t(item.name)}</div>
                    </NavLink>
                )
            )}
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
MainMenuView.propTypes = {
  isHover: PropTypes.bool.isRequired,
  setIsHover: PropTypes.func.isRequired,
};
