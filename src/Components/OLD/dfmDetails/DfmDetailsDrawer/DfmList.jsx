import React, { useState } from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon, Divider
} from '@material-ui/core';
import  "./DFMList.scss"
import { Folder } from '@material-ui/icons';
import IconButton from "@material-ui/core/IconButton";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ButtonBase from "@material-ui/core/ButtonBase";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const DfmList = ({ tabsNames, selected, setSelectedTab ,changeView}) => {
  const [isOpen, setOpen] = useState(true);

  const openOrCloseMenu = () => {
      setOpen(!isOpen);
      changeView(!isOpen);
  };

  return (
    <>
        <div className={'menu_button'}>
      <IconButton
        size="small"
        className={"toggle_menu_btn menu_button "}
        onClick={()=>{ openOrCloseMenu()}}
      >
          {isOpen && <ArrowLeftIcon fontSize="inherit" /> }
          {!isOpen && <ArrowRightIcon fontSize="inherit" /> }

      </IconButton>

        </div>
      <div className={'mainBody'}>
        {Array.isArray(tabsNames) && tabsNames.map((text, index) => (
          <ButtonBase className={ selected === index ? 'sub_menu_btn position-absolute transition mh-60P w-100 border-radius-0 selected':
              'sub_menu_btn position-absolute transition mh-60P w-100 border-radius-0'  }
             onClick={() => setSelectedTab(index)}
             key = {index}
          >
              <ListItem>
              <ListItemIcon  className={ "list_menu_icon"}><Folder /></ListItemIcon>
              <ListItemText  className={"labelHover"} primary={text} />
              </ListItem>
          </ButtonBase>
        ))}
      </div>
    </>
  );
};
export default DfmList;
