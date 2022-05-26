/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { ViewCheckBox } from '../ViewCheckBox/ViewCheckBox';

const TabPanel = (props) => {
  const {
 children, value, index, ...other
} = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const UserPages = (props) => {
  const [availableFiled, setAvailableFiled] = React.useState([]);
  const [rerender, setRerender] = React.useState(true);

  useEffect(() => {
    if (props.selectedTemplate) {
      props.checkedList[props.selectedTemplate.pageId] = JSON.parse(
        props.selectedTemplate.viewFields
      );
      props.superList[props.selectedTemplate.pageId] = JSON.parse(
        props.selectedTemplate.viewFields
      );
    } else if (props.pageView.pageViews) {
      const fieldList = [];
      props.pageView.pageViews.map((el) => (fieldList[el.pageId] = JSON.parse(el.viewFields)));
      props.setCheckedList(fieldList);
    }
    setRerender(false);
    setTimeout(() => {
      setRerender(true);
    }, 300);
  }, [props, props.pageView.pageViews, props.selectedTemplate]);

  const checkAvailableField = (id) => {
    try {
      setAvailableFiled(JSON.parse(id));
      return true;
    } catch (e) {
      setAvailableFiled([]);
      return false;
    }
  };

  useEffect(() => {
    if (Array.isArray(props.checkedList)) {
      if (
        props.pagesResponse &&
        props.pagesResponse.result &&
        props.pagesResponse.result[0] &&
        props.pagesResponse.result[0].availableFiled
      ) {
        checkAvailableField(props.pagesResponse.result[0].availableFiled);
        props.setCurrentPageId(props.pagesResponse.result[0].pageId);
      } else setAvailableFiled([]);
      if (props.isSaved) props.setCheckedList();
    }
  }, [props, props.pagesResponse]);

  const rerenderCallBack = useCallback(
    (i, page) => {
      props.setTemplateSave('');
      props.setTemCheck(false);
      props.setCurrentPageId(page.pageId);
      checkAvailableField(page.availableFiled);
      setRerender(false);
      setTimeout(() => {
        setRerender(true);
      }, 300);
    },
    [props]
  );

  return (
    <div className='UserPages'>
      <AppBar position='static'>
        <Tabs
          variant='scrollable'
          scrollButtons='auto'
          value={props.value}
          onChange={(e, v) => props.setValue(v)}
          indicatorColor='primary'
        >
          {props.pagesResponse &&
            props.pagesResponse.result &&
            props.pagesResponse.result.map((page, i) => (
              <Tab
                key={`${i + 2}-field1`}
                onClick={() => rerenderCallBack(i, page)}
                label={page.pageName}
                {...a11yProps(i)}
              />
            ))}
        </Tabs>
      </AppBar>
      <Paper>
        <TabPanel value={props.value} index={props.value}>
          <Grid container>
            {availableFiled.map((el, i) => (
              <Grid key={`${i + 1}-field`} item xs={2}>
                {rerender && (
                  <ViewCheckBox
                    isEdit={props.isEdit}
                    pageView={props.pageView}
                    formsName={props.formsName}
                    superList={props.superList}
                    checkedList={props.checkedList}
                    currentPageId={props.currentPageId}
                    lable={el}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>
    </div>
  );
};

export { UserPages };
