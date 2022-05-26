import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';
import { SavePageViewAsTemplate } from '../../../../../../Services/UsersDataViewingServices';
import { showSuccess } from '../../../../../../Helper';

const TemplateCheckbox = (props) => {
  const { t } = useTranslation('UserDataView');
  const handleSaveTemplate = async () => {
    await SavePageViewAsTemplate({
      pageViewTemplateName: props.templateSave,
      pageViewId: props.pageView.pageViews.find(
        (el) => el.pageId === props.currentPageId
      ).pageViewId,
    });
    props.setTemCheck(false);
    props.setTemplateSave('');
    showSuccess(
      t('CollapseView.SuccessNotification')
    );
  };

  return (
    <Grid container className="templateSave" spacing={2}>
      <Grid item xs={3}>
        <FormControlLabel
          label={t(
            'SaveItAsTemplate'
          )}
          control={(
            <Checkbox
              checked={props.temCheck}
              onChange={(e) => props.setTemCheck(e.target.checked)}
            />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={props.templateSave}
          onChange={(e) => props.setTemplateSave(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          disabled={props.templateSave === '' || props.temCheck === false}
          className={
            props.templateSave === '' || !props.temCheck
              ? 'disableSaveTemplate'
              : 'saveTemplate'
          }
          onClick={handleSaveTemplate}
        >
          {t('Save')}
        </Button>
      </Grid>
    </Grid>
  );
};

export { TemplateCheckbox };
