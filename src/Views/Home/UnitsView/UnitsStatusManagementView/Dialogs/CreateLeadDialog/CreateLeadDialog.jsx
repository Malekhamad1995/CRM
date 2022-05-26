import React, { useEffect, useState, useCallback } from 'react';
import {
   ButtonBase
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import {
 Spinner, AutocompleteComponent, CheckboxesComponent, DialogComponent
} from '../../../../../../Components';
import { AgentRoleEnum, LeadTypeIdEnum } from '../../../../../../Enums';
import { OrganizationUserSearch, leadPost } from '../../../../../../Services';
import { DisplyLeadIdDialog } from './DisplyLeadIdDialog';

const parentTranslationPath = 'UnitsStatusManagementView';
const translationPath = '';

export const CreateLeadDialog = ({
  open,
  close,
  leadData,
  onSave

}) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isChecked, setIsChecked] = useState(false);
    const [isOpenDisplyLeadDialog, setIsOpenDisplyLeadDialog] = useState(false);
    const [displyLead, setDisplyLead] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refferdToList, setRefferdToList] = useState({ result: [], totalCount: 0 });
    const [referredto, setReferredTo] = useState(null);
    const [userTypeId, setUserTypeId] = useState(null);

    const saveHandler = async () => {
        setIsLoading(true);
        const leadObj = { ...leadData, referredto, lead_type_id: LeadTypeIdEnum.Seeker.leadTypeId };
        const leadJson = {
            leadJson: {
                lead: leadObj
            }
        };
       const res = await leadPost(leadJson);
        setIsLoading(false);
        if (!(res && res.status && res.status !== 200)) {
            setDisplyLead(res);
            setIsOpenDisplyLeadDialog(true);
           onSave();
        } else {
            setDisplyLead(null);
            setIsOpenDisplyLeadDialog(false);
        }
      };

    const getSaleOrLeaseAgentsRoles = useCallback(async (searchValue) => {
        setIsLoading(true);
        const filter = {
          pageSize: 25,
          name: searchValue,
          pageIndex: 1,
          userStatusId: 2,
          userTypeId
        };
        const rs = await OrganizationUserSearch({ ...filter });
        if (!(rs && rs.status && rs.status !== 200))
          setRefferdToList({ result: rs.result, totalCount: rs.totalCount });
        else setRefferdToList({ result: [], totalCount: 0 });

        setIsLoading(false);
      });

      useEffect(() => {
          if (leadData && leadData.leadJson && leadData.leadJson.lead && leadData.leadJson.lead.operation_type && leadData.leadJson.lead.operation_type.lookupItemName === 'Buy')
            setUserTypeId(AgentRoleEnum.SaleAgent.value);
           else
           setUserTypeId(AgentRoleEnum.LeaseAgent.value);
      }, []);

      useEffect(() => {
          if (userTypeId)
          getSaleOrLeaseAgentsRoles('');
    }, [userTypeId]);

      useEffect(() => {
          if (!isChecked)
          setReferredTo(null);
      }, [isChecked]);

  return (
    <div>
      <DialogComponent
        titleText={t(`${translationPath}CreateNewLead`)}
        saveText={t('confirm')}
        saveType='button'
        maxWidth='sm'
        dialogContent={(
          <div className=''>
            <Spinner isActive={isLoading} />
            <div>
              <div className='sale-Lease-assigned-lead'>
                <CheckboxesComponent
                  idRef='RotationRef'
                  themeClass='theme-secondary'
                  singleChecked={isChecked}
                  onSelectedCheckboxClicked={() =>
                        setIsChecked(!isChecked)}
                />
                <div className='center'>
                  {t(`${translationPath}select-agent-refferd-to`)}
                </div>

              </div>

              {isChecked && (
              <div>

                <AutocompleteComponent
                  idRef='roleAgentRef'
                  data={(refferdToList && refferdToList.result) || []}
                  onInputChange={(e) => {
                          if (e && e.target && e.target.value) {
                            const searchValue = e.target.value;
                            setTimeout(() => {
                              getSaleOrLeaseAgentsRoles(searchValue);
                            }, 300);
                          }
                        }}
                  multiple={false}
                  displayLabel={(option) =>
                          (option && option.fullName) || ''}
                  chipsLabel={(option) => (option && option.fullName) || ''}
                  withoutSearchButton
                  parentTranslationPath={translationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setReferredTo(newValue || null);
                        }}
                />

              </div>

                  )}
            </div>
          </div>

            )}
        saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
        isOpen={open}
        onSaveClicked={saveHandler}
        onCloseClicked={close}
        onCancelClicked={close}
        translationPath={translationPath.confirm}
      />
      {
        isOpenDisplyLeadDialog && (
          <DisplyLeadIdDialog
            open={isOpenDisplyLeadDialog}
            leadData={displyLead}
            close={() => {
            setIsOpenDisplyLeadDialog(false);
            close();
        }}
          />

        )
      }
    </div>
  );
};
CreateLeadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
   leadData: (PropTypes.instanceOf(Object)).isRequired,
   onSave: PropTypes.func.isRequired,
};
