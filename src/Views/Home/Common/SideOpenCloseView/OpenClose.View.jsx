import React, { useState, useEffect } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import {
  getSideMenuComponent,
  setReRenderSideMenuCallback,
  sideMenuComponentCallback,
} from '../../../../Helper';

const OpenCloseView = ({ isOpen, isOpenClicked }) => {
  const [sideMenu, setsideMenu] = useState();
  const [ReRenderSideMenu, setReRenderSideMenu] = useState(true);
  sideMenuComponentCallback(setsideMenu);
  setReRenderSideMenuCallback(setReRenderSideMenu);
  useEffect(() => {
    setsideMenu(getSideMenuComponent());
  }, []);
  return (
    ReRenderSideMenu && (
      <div className={`animated-open-close on-left${isOpen ? ' is-open' : ''}`}>
        <ButtonBase className='btns-icon open-button' disabled={!sideMenu} onClick={isOpenClicked}>
          <span className={`mdi ${isOpen ? 'mdi-chevron-left' : 'mdi-chevron-right'}`} />
        </ButtonBase>
        {isOpen && <div className='open-close-content'>{sideMenu || null}</div>}
      </div>
    )
  );
};
OpenCloseView.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenClicked: PropTypes.func.isRequired,
};
export { OpenCloseView };
