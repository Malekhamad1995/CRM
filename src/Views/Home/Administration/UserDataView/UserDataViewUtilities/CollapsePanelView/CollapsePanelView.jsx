import React, { useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../../../../Components';
import { GetForms } from '../../../../../../Services/formbuilder/getForms';
import {
  GetUserPages,
  PostUserViews,
  GetViewsByViewId,
  EditViewsByViewId,
} from '../../../../../../Services/UsersDataViewingServices';
// eslint-disable-next-line import/no-cycle
import { TemplateCheckbox, TemplateValue, UserPages } from '..';

import { showSuccess, GetParams } from '../../../../../../Helper';

const CollapsePanelsView = (props) => {
  const { t } = useTranslation('UserDataView');
  const [expanded, setExpanded] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  const [superList, setSuperList] = React.useState([]);
  const [formsName, setFormsName] = React.useState('');
  const [formsResponse, setFormsResponse] = React.useState({});
  const [pagesResponse, setPagesResponse] = React.useState({});
  const [value, setValue] = React.useState(0);
  const [pageView, setPageView] = React.useState({});
  const [isEdit, setIsEdit] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [currentPageId, setCurrentPageId] = React.useState(1);
  const [temCheck, setTemCheck] = React.useState(false);
  const [templateSave, setTemplateSave] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState('');
  const [checkedList, setCheckedList] = React.useState([]);
  const [viewName, setViewName] = React.useState('');

  const handleSelectedTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const GetPageViews = async (viewId) => {
    setLoading(true);
    const res = await GetViewsByViewId(viewId);
    setViewName(res.viewName);
    setPageView(res);
    setLoading(false);
  };

  useEffect(() => {
    if (GetParams('id')) {
      const path = window.location.pathname.split('/').slice().pop();
      GetPageViews(GetParams('id'));
      if (path.toUpperCase() === 'EDIT') setIsEdit(true);
      else setIsView(true);
    }
  }, []);

  const GetMyForms = async (pageIndex, PageSize) => {
    setLoading(true);
    const res = await GetForms(pageIndex, PageSize);
    setFormsResponse(res);
    setLoading(false);
  };
  useEffect(() => {
    GetMyForms(1, 20);
  }, [setFormsResponse]);

  const GetMyPages = async (formsId, pageIndex, PageSize) => {
    setLoading(true);
    const res = await GetUserPages(formsId, pageIndex, PageSize);
    setPagesResponse(res);
    setLoading(false);
  };

  const handleCollapseClick = (panel) => {
    setTemCheck(false);
    setTemplateSave('');
    setPagesResponse({});
    setFormsName(panel.formsName);
    setValue(0);
    if (expanded !== panel.formsId) GetMyPages(panel.formsId, 1, 10);
  };

  const handleSaveView = async () => {
    const key = Object.keys(superList);
    const sendValue = key.map((el) => ({
      pageId: +el,
      viewFields: JSON.stringify(superList[el]),
    }));
    if (!isEdit) {
      await PostUserViews({ viewName, pageView: sendValue });
      setViewName('');
      setSuperList([]);
      setIsSaved(true);
      setExpanded(false);
      setSelectedTemplate('');
    } else {
      await EditViewsByViewId(props.match.params.viewId, {
        viewName,
        pageView: sendValue,
      });
    }
    showSuccess(t('CollapseView.SuccessNotification'));
  };

  const collapsePanels = (
    <div className="panel">
      <Spinner isActive={Loading} />
      {formsResponse
        && formsResponse.result
        && formsResponse.result.map((panel, i) => (
          <ExpansionPanel
            key={i}
            expanded={expanded === panel.formsId}
            onChange={(e, isExpanded) => setExpanded(isExpanded ? panel.formsId : false)}
          >
            <ExpansionPanelSummary
              key={i}
              expandIcon={<ExpandMoreIcon />}
              onClick={() => handleCollapseClick(panel)}
            >
              <Grid container>
                <Grid item xs>
                  <Typography>{panel.formsName}</Typography>
                </Grid>
                {!isView && pagesResponse && pagesResponse.result && pagesResponse.result[0] && (
                  <Grid item xs={4}>
                    <TemplateValue
                      handleSelectedTemplate={handleSelectedTemplate}
                      pageId={currentPageId}
                      formsId={panel.formsId}
                      expanded={expanded}
                    />
                  </Grid>
                )}
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails key={i}>
              {pagesResponse && pagesResponse.result && pagesResponse.result[0] ? (
                <Grid container spacing={2} justify="flex-end">
                  <Grid item xs={12}>
                    <UserPages
                      checkedList={checkedList}
                      setCheckedList={setCheckedList}
                      selectedTemplate={selectedTemplate}
                      setTemCheck={setTemCheck}
                      setTemplateSave={setTemplateSave}
                      isEdit={isEdit}
                      pageView={pageView}
                      isView={isView}
                      isTrue={isSaved}
                      formsName={formsName}
                      superList={superList}
                      pagesResponse={pagesResponse}
                      value={value}
                      setValue={(x) => setValue(x)}
                      currentPageId={currentPageId}
                      setCurrentPageId={setCurrentPageId}
                    />
                  </Grid>
                  {isEdit && expanded && (
                    <Grid item xs={12}>
                      <TemplateCheckbox
                        temCheck={temCheck}
                        setTemCheck={setTemCheck}
                        setTemplateSave={setTemplateSave}
                        templateSave={templateSave}
                        pageView={pageView}
                        currentPageId={currentPageId}
                      />
                    </Grid>
                  )}
                </Grid>
              ) : (
                t('RolesView:Roles.NoData')
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </div>
  );

  return (
    <div className="CollapsePanel">
      <Grid container spacing={2} justify="center" alignItems="center" className="CollapseWraper">
        {!isView && (
          <Grid item lg={8} sm={12} xl={8} xs={12}>
            <TextField
              className="inputs theme-solid"
              label={t('ViewName')}
              variant="outlined"
              size="small"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </Grid>
        )}
        <Grid item lg={8} sm={12} xl={8} xs={12}>
          {collapsePanels}
        </Grid>
        {!isView && (
          <Grid item lg={8} sm={12} xl={8} xs={12}>
            <Button
              onClick={handleSaveView}
              disabled={viewName === ''}
              className="btns theme-solid"
            >
              {isEdit
                ? t('Edit')
                : t('Save')}
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export { CollapsePanelsView };
