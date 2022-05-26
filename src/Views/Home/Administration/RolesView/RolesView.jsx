/* eslint-disable no-nested-ternary */
import React, { useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
import { Spinner } from '../../../../Components';
import { GetParams } from '../../../../Helper';
import {
  GetAllModules,
  GetAllModuleComponents,
  GetAllPermissionsByRoleId
} from '../../../../Services/roleServices';

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
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

export const RolesView = () => {
  const { t } = useTranslation(['RolesView']);
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
      const result = await GetAllPermissionsByRoleId(roleId, pageIndex, PageSize);
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
    GetAppService(1, 100);
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
                xs={3}
                key={`role-${i + 1}`}
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
                <FormControlLabel
                  key={`role${i + 1}`}
                  className='form-control-label'
                  control={(
                    <Checkbox
                      key={`role${i + 1}`}
                      className='checkbox-wrapper'
                      checkedIcon={<span className='mdi mdi-check' />}
                      indeterminateIcon={<span className='mdi mdi-minus' />}
                    />
                  )}
                  label={role.permissions.permissionsName}
                  checked={role.accessTypes}
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
                    key={`role${i + 1}`}
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
        <Typography>{t('NoData')}</Typography>
      )}
    </div>
  );

  const collapsePanels = (
    <>
      {appService &&
        appService.result &&
        appService.result.map((panel, i) => (
          <ExpansionPanel
            key={`role${i + 1}`}
            expanded={expanded === panel.moduleId}
            onChange={(e, isExpanded) => {
              setExpanded(isExpanded ? panel.moduleId : false);
            }}
          >
            <ExpansionPanelSummary
              key={`role${i + 1}`}
              onClick={async () => {
                GetRolePermissions(roleId, 1, 100);
                await GetComponents(panel.moduleId, 1, 100);
                setValue(0);
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography key={`role${i + 1}`}>{panel.moduleName}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails key={`role${i + 1}`}>{tabs}</ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </>
  );

  const colorCheckbox = (
    <>
      <FormControlLabel
        className='form-control-label globalCheckBox'
        control={(
          <Checkbox
            className='checkbox-wrapper'
            checkedIcon={<span className='mdi mdi-check' />}
            indeterminateIcon={<span className='mdi mdi-minus' />}
            checked
          />
        )}
        label={t('AddRole.Global')}
      />
      <FormControlLabel
        className='form-control-label localCheckBox'
        control={(
          <Checkbox
            className='checkbox-wrapper'
            checkedIcon={<span className='mdi mdi-check' />}
            indeterminateIcon={<span className='mdi mdi-minus' />}
            checked
          />
        )}
        label={t('AddRole.Local')}
      />
      <FormControlLabel
        className='form-control-label deepCheckBox'
        control={(
          <Checkbox
            className='checkbox-wrapper'
            checkedIcon={<span className='mdi mdi-check' />}
            indeterminateIcon={<span className='mdi mdi-minus' />}
            checked
          />
        )}
        label={t('AddRole.Deep')}
      />
      <FormControlLabel
        className='form-control-label basicCheckBox'
        control={(
          <Checkbox
            className='checkbox-wrapper'
            checkedIcon={<span className='mdi mdi-check' />}
            indeterminateIcon={<span className='mdi mdi-minus' />}
            checked
          />
        )}
        label={t('AddRole.Basic')}
      />
    </>
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
