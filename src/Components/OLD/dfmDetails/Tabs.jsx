import React, { useState } from 'react';
import {
  AppBar,
  Grid,
} from '@material-ui/core';
import TabPanel from './TabPanel';
import switchTabId from '../../utils/switchTabId';
import { ButtonBase } from '@material-ui/core';

const Tabs = ({ uid, type, selectedPage }) => {

const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <>
    <div className={"tabs w-100"} >
      <AppBar position="relative" color="default" className={'tabsAppBar'}>
        <Grid container spacing={3}>
        {selectedPage.map((item, index) => (
            <ButtonBase  className={selectedIndex===index ?index===0? "first tabActive " :  "tabActive " : index===0? "first " : ""} onClick={() => setSelectedIndex(index)} >

            <Grid item className={"d-inline-block w-100 py-5P "} >
              <div className={"float-left mx-5P"}> {item.tabIcon} </div>
              <div className={"float-left position-relative t-2P"}>  {`${item.tabName}`}</div>
            </Grid>


            </ButtonBase>
        ))}
        </Grid>
      </AppBar>
    </div>
      {selectedPage.map((item, index) => (  <TabPanel className={"tabpanael"} value={selectedIndex} index={index}>{switchTabId(item.tabId, type, uid)} </TabPanel> ))}
</>

  );
};
export default Tabs;
