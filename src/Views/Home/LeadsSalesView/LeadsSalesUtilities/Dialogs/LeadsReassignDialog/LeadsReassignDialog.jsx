import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  ButtonBase,
} from '@material-ui/core';
import { Spinner, AutocompleteComponent, CheckboxesComponent } from '../../../../../../Components';
import { OrganizationUserSearch } from '../../../../../../Services';



export const LeadsReassignDialog = ({ isOpen,
  onSave,
  translationPath,
  parentTranslationPath,
  onClose,
  leadType,
  isLoadingReassign,

}) => {

  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [ saveDisable,setSaveDisable] = useState(false);
  const searchTimer = useRef(null);
  const [state, setState] = useState({
    referredToId: null,
    isCopyTo: false
  });
  const [agentList, setAgentList] = useState({
    result: [],
    totalCount: 0,
  });


  const getSaleOrLeaseAgents = useCallback(async (value) => {
    setIsLoading(true);
    const res = await OrganizationUserSearch({ pageSize: 20, pageIndex: 0, name: value });
    if (!(res && res.status && res.status !== 200)) {
      res.result.filter((e) => e.userTypes.map((e) => e.rolesId))
      if (leadType === 'Buyer' || leadType === 3) {
        setAgentList({
          result: res.result.filter((e) => e.userTypes.map((e) => e.rolesId).includes("01e1686c-858d-411b-8560-3ce8d3f7e0a2")),
          totalCount: res && res.totalCount,
        });
      } else if (leadType === 'Tenant'|| leadType === 4) {
        setAgentList({
          result: res.result.filter((e) => e.userTypes.map((e) => e.rolesId).includes("0f056fbe-c702-4f1f-927a-65f923d8a258")),
          totalCount: res && res.totalCount,
        }); 
      }

    } else {
      setAgentList({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getSaleOrLeaseAgents();
  }, []);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => {
          onClose();
        }}
        disableBackdropClick
        className='activities-management-dialog-wrapper'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {t(`${translationPath}reassign-leads`)}
        </DialogTitle>
        <DialogContent>
          <div className='dialog-content-wrapper'>
            <Spinner isActive={isLoadingReassign} isAbsolute={true} />
            <div className='dialog-content-item w-100'>
              <AutocompleteComponent
                idRef='referredToIdRef'
                multiple={false}
                labelValue={t(`${translationPath}referredTo`)}
                isLoading={isLoading}
                withoutSearchButton
                data={(agentList && agentList.result) || []}
                chipsLabel={(option) => (option && option.agentName) || ''}
                displayLabel={(option) => (option && option.fullName) || (option.name) || ''}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                inputPlaceholder={t(`${translationPath}referredTo`)}
                onChange={(event, newValue) => {
                  setState((item) => ({ ...item, referredToId: (newValue && newValue.id) }));
                }}
                onInputKeyUp={(e) => {
                  const { value } = e.target;
                  if (searchTimer.current) clearTimeout(searchTimer.current);
                  searchTimer.current = setTimeout(() => {
                    getSaleOrLeaseAgents(value);
                  }, 500);
                }}
              />
            </div>
            <div className='dialog-content-item'>
              <CheckboxesComponent
                idRef='rwithCopyAllActivitesRef'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                label='withCopyAllActivites'
                singleChecked={state.isCopyTo}
                onSelectedCheckboxClicked={() => {
                  setState((items) => ({ ...items, isCopyTo: (!state.isCopyTo) }));
                }}
              />

            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className='form-builder-wrapper'>
            <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
              <div className='MuiGrid-root-right'>
                <ButtonBase
                disabled={saveDisable}
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns theme-solid'
                  onClick={() => {
                    setSaveDisable(true);
                    onSave(state);
                  }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}save`)}
                    </span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>

              </div>
              <div className='MuiGrid-root-right'>
                <ButtonBase
                  className='MuiButtonBase-root MuiButton-root MuiButton-text btns'
                  onClick={() => {
                    onClose();
                  }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}cancel`)}
                    </span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </ButtonBase>

              </div>

            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

LeadsReassignDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
