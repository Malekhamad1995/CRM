/* eslint-disable no-nested-ternary */
import React, { useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { useTranslation } from 'react-i18next';
import { CheckboxesComponent, Spinner } from '../../../../../../Components';
import { GetParams } from '../../../../../../Helper';
import {
  GetAllModules,
  GetAllModuleComponents,
  // GetAllComponentsByAppServiceId,
  GetAllPermissionsByModuleId,
  // GetAllPermissionsByRoleId
} from '../../../../../../Services/roleServices';

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
  index: PropTypes.instanceOf(PropTypes.any).isRequired,
  value: PropTypes.instanceOf(PropTypes.any).isRequired,
};
TabPanel.defaultProps = {
  children: undefined,
};
const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

export const RolesView = () => {
  const { t } = useTranslation('RolesView');
  const [value, setValue] = React.useState(0);
  const [roleId, setRoleId] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [appService, setAppService] = React.useState({});
  const [components, setComponents] = React.useState({});
  const [componentId, setComponentId] = React.useState('');
  const [rolePermissions, setRolePermissions] = React.useState({});

  useEffect(() => {
    setRoleId(GetParams('id'));
  }, []);

  const GetRolePermissions = useCallback(
    async (pageIndex, PageSize) => {
      const result = await GetAllPermissionsByModuleId(roleId, pageIndex, PageSize);
      if (result) setRolePermissions(result);
    },
    [roleId]
  );

  const GetAppService = useCallback(async (pageIndex, PageSize) => {
    const result = await GetAllModules(pageIndex, PageSize);
    if (result) setAppService(result);
  }, []);

  const GetComponents = useCallback(async (appId, pageIndex, PageSize) => {
    setLoading(true);
    const res = await GetAllModuleComponents(appId, pageIndex, PageSize);
    setComponents(res);
    if (res && res.result && res.result[0]) setComponentId(res.result[0].componentsId);
    setLoading(false);
  }, []);

  useEffect(() => {
    GetAppService(1, 50);
  }, [GetAppService]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const permissions = (comId) => (
    <Grid container>
      {rolePermissions &&
        rolePermissions.result &&
        rolePermissions.result.map((role, i) => {
          if (role.permissions.componentsId === comId) {
            return (
              <Grid
                item
                xs={4}
                key={`${i + 1}-permission`}
                className={
                  role.accessTypes.accessTypesId === 1 ?
                    'globalCheckBox' :
                    role.accessTypes.accessTypesId === 2 ?
                      'localCheckBox' :
                      role.accessTypes.accessTypesId === 3 ?
                        'deepCheckBox' :
                        role.accessTypes.accessTypesId === 4 ?
                          'basicCheckBox' :
                          ''
                }
              >
                <CheckboxesComponent
                  key={`${i + 3}-permission`}
                  labelValue={role.permissions.permissionsName}
                  singleChecked={role.accessTypes}
                  themeClass='theme-secondary'
                />
              </Grid>
            );
          }
          return null;
        })}
    </Grid>
  );

  const tabs = (
    <div className='roleTabs'>
      {components && components.result && components.result[0] ? (
        <>
          <Spinner isActive={Loading} />
          <AppBar position='static' color='default'>
            <Tabs
              variant='scrollable'
              scrollButtons='auto'
              value={value}
              onChange={handleTabChange}
              indicatorColor='primary'
            >
              {components &&
                components.result &&
                components.result.map((com, i) => (
                  <Tab
                    key={`${i + 1}-tab`}
                    label={com.componentsName}
                    {...a11yProps(i)}
                    onClick={() => setComponentId(com.componentsId)}
                  />
                ))}
            </Tabs>
          </AppBar>
          <Paper>
            <TabPanel value={value} index={value}>
              {permissions(componentId)}
            </TabPanel>
          </Paper>
        </>
      ) : (
        t('NoData')
      )}
    </div>
  );

  const collapsePanels = (
    <>
      {appService &&
        appService.result &&
        appService.result.map((panel, i) => (
          <ExpansionPanel
            key={`${i + 1}-panel`}
            expanded={expanded === panel.moduleId}
            onChange={(e, isExpanded) => {
              setExpanded(isExpanded ? panel.moduleId : false);
            }}
          >
            <ExpansionPanelSummary
              key={`${i + 2}-panel`}
              onClick={async () => {
                GetRolePermissions(1, 50);
                await GetComponents(panel.moduleId, 1, 50);
                setValue(0);
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography key={`${i + 3}-panel`}>{panel.moduleName}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails key={`${i + 4}-panel`}>{tabs}</ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </>
  );
  const colorCheckbox = (
    <div className='role-checkboxes-wrapper'>
      <CheckboxesComponent
        labelValue={t('AddRole.Global')}
        singleChecked
        themeClass='theme-secondary globalCheckBox title'
      />
      <CheckboxesComponent
        labelValue={t('AddRole.Local')}
        singleChecked
        themeClass='theme-secondary localCheckBox title'
      />
      <CheckboxesComponent
        labelValue={t('AddRole.Deep')}
        singleChecked
        themeClass='theme-secondary deepCheckBox title'
      />
      <CheckboxesComponent
        labelValue={t('AddRole.Basic')}
        singleChecked
        themeClass='theme-secondary basicCheckBox title'
      />
    </div>
  );
  return (
    <div className='RoleView'>
      <div className='paperWraper'>
        <Grid container item xs={12} justify='center' alignItems='center'>
          <Grid item lg={7} sm={12} xl={7} xs={12}>
            <Grid>{colorCheckbox}</Grid>
            <Grid>{collapsePanels}</Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
