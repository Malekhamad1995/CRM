import React, { useState } from 'react';
import { Breadcrumb } from '../../Components';
import {
 BottomBoxView, Header, MainMenuView, OpenCloseView
} from '../../Views/Home';
import { SwitchRoute } from '../../Components/Route/SwitchRoute';
import { HomeRoutes } from '../../routes/HomeRoutes/HomeRoutes';
import {
  setLoading,
  setSideMenuIsOpenCallback,
  sideMenuIsOpenUpdate,
} from '../../Helper/Middleware.Helper';

const HomeLayout = () => {
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  setSideMenuIsOpenCallback(setSideMenuIsOpen);
  const [, setShowLoading] = React.useState(false);
  const [headerHeight, setHeaderHeight] = useState(70);
  const changeShowLoading = (flag) => {
    setShowLoading(flag);
  };
  setLoading(changeShowLoading);

  return (
    <>
      <Header headerHeightChanged={(hh) => setHeaderHeight(hh)} />
      <div className='container' style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}>
        <MainMenuView isHover={isHover} setIsHover={setIsHover} />
        <div
          className={`content-wrapper${isHover ? ' is-open' : ''}${
            (sideMenuIsOpen && ' is-open-side-menu') || ''
          }`}
        >
          <div className='open-close-main-layout'>
            <Breadcrumb />
            <SwitchRoute routes={HomeRoutes} />
          </div>
          <BottomBoxView />
        </div>
        <OpenCloseView isOpen={sideMenuIsOpen} isOpenClicked={() => sideMenuIsOpenUpdate()} />
      </div>
    </>
  );
};

export { HomeLayout };
