import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, DialogTitle, DialogContent, DialogActions, Dialog, Grid
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  OrganizationUserSearch,
  UnitRemark,
  UpdateUnitRemark,
} from '../../../../../../../Services';
import { GetParams, showError, showSuccess } from '../../../../../../../Helper';
import { Inputs, RadiosGroupComponent, SelectComponet } from '../../../../../../../Components';

export const UnitAddEditRemarkDialog = ({
  open,
  close,
  translationPath,
  parentTranslationPath,
  IsEdit,
  reloadData,
  UnitId,
  RemarksID,
}) => {
  const defaultState = {
    unitId: UnitId,
    usersNotifysId: '',
    title: '',
    remark: '',
    isAgent: true,
  };

  const [agentsFilterType, setAgentsFilterType] = useState(1);
  const onAgentsFilterTypeChangedHandler = (event, newValue) => {
    if (+newValue === 1)
      setState({ ...state, isAgent: true });
    else
      setState({ ...state, isAgent: false });

    setAgentsFilterType(+newValue);
  };

  useEffect(() => {
    const UnitId = GetParams('id');
    if (UnitId !== null) setState({ ...state, unitId: +UnitId });
  }, []);

  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState(defaultState);
  const [value, setValue] = React.useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (IsEdit === true) {
      await UpdateUnitRemark(RemarksID.unitRemarkId, state);
      reloadData();
      close(false);
      showSuccess(t(`${translationPath}edit-successfully`));
    } else {
      const result = await UnitRemark(state);
      if (!(result && result.status && result.status !== 200)) {
        reloadData();
        close(false);
        setState(defaultState);
        showSuccess(t(`${translationPath}add-Remark`));
      } else showError(t(`${translationPath}company-finance-updated-failed`));
    }
  }, [close, defaultState, reloadData, state, t, translationPath]);

  const OrganizationUser = async (name) => {
    const SearchResult = await OrganizationUserSearch({ name });

    setValue(
      SearchResult && SearchResult.result.map((item) => ({ id: item.id, city: item.fullName }))
    );
  };

  useEffect(() => {
    OrganizationUser('');
    if (IsEdit === true) {
      setState({
        ...state,
        title: RemarksID.title,
        remark: RemarksID.remark,
        usersNotifysId: RemarksID.usersNotifysId,
        unitId: RemarksID.unitId,
        isAgent: RemarksID.isAgent,
      });
      setAgentsFilterType(RemarksID.isAgent === true ? 1 : 2);
    } else {
    }
  }, []);
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => {
        close(false);
        setIsSubmitted(true);
        setState(defaultState);
      }}
      className='UnitAddEditRemarkDialog'
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          close(false);
        }}
      >
        <DialogTitle>
          {IsEdit !== true ?
            t(`${translationPath}AddnewRemark`) :
            t(`${translationPath}editoldRemark`)}
        </DialogTitle>
        <DialogContent>
          <Inputs
            isRequired
            isWithError
            isSubmitted={isSubmitted}
            value={state.title}
            idRef='activitiesSearchRef'
            labelValue={t(`${translationPath}Title`)}
            labelClasses='Requierd-Color'
            onInputChanged={(e) => setState({ ...state, title: e.target.value })}
          />
          {' '}
          <Inputs
            value={state.remark}
            rows={4}
            rowsMax={10}
            multiline
            idRef='activitiesSearchRef'
            labelValue={t(`${translationPath}Remark`)}
            labelClasses='Requierd-Color'
            onInputChanged={(e) => setState({ ...state, remark: e.target.value })}
          />
          <div className='mb-3'>
            <SelectComponet
              idRef='userStatusRef'
              data={value}
              wrapperClasses='mb-2 px-2'
              themeClass='theme-underline'
              emptyItem={{
                value: 0,
                text: t(`${translationPath}select-status`),
              }}
              value={state.usersNotifysId}
              labelValue={t(`${translationPath}Notify-Someone`)}
              labelClasses='Requierd-Color'
              valueInput='id'
              textInput='city'
              onSelectChanged={(value) => setState({ ...state, usersNotifysId: value })}
            />
          </div>
          <Grid container justify='center' spacing={1}>
            <RadiosGroupComponent
              idRef='remarkForRef'
              data={[
                {
                  key: 1,
                  value: 'listing-agents',
                },
                {
                  key: 2,
                  value: 'all-agents',
                },
              ]}
              value={agentsFilterType}
              labelInput='value'
              valueInput='key'
              themeClass='theme-line'
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              translationPathForData={translationPath}
              onSelectedRadioChanged={onAgentsFilterTypeChangedHandler}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button className='btns theme-solid bg-cancel' onClick={() => close(false)}>
            {t(`${translationPath}Cancel`)}
          </Button>
          <Button onClick={saveHandler} className='btns theme-solid' variant='contained'>
            {IsEdit === true ? t(`${translationPath}edit`) : t(`${translationPath}Add`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
