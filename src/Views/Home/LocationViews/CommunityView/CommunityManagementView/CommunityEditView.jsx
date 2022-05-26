import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useTitle } from '../../../../../Hooks';
import {
  bottomBoxComponentUpdate, GetParams, GlobalHistory, showError, showSuccess
} from '../../../../../Helper';
import {
  CreateOrUpdateLocationDetails, GetLocationDetailsByLookupItem
} from '../../../../../Services';
import { AddFormCommunity, EditFormCommunity } from '../CommunityUtilities';
import {
  PermissionsComponent
} from '../../../../../Components';
import {
  LocationsPermissions
} from '../../../../../Permissions';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const CommunityEditView = () => {
  const { t } = useTranslation(parentTranslationPath);
    // eslint-disable-next-line no-unused-vars
    const [isLoading,
    setIsLoading] = useState(false);
  const [mainstate, setStatemain] = useState({});
  const [validate, setvalidate] = useState(false);
  const [details, setdetails] = useState();
  const saveHandler = async () => {
    setIsLoading(true);
    const res = await CreateOrUpdateLocationDetails(mainstate);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}Create-successfully`);
      GlobalHistory.push('/home/Communitie/view');
    } else showError(t`${translationPath}Create-failed`);
  };

  useTitle(t(`${translationPath}Addnew`));

  const getAlldetails = useCallback(async (id) => {
    setIsLoading(true);
    const res = await GetLocationDetailsByLookupItem(id);
    if (!(res && res.status && res.status !== 200))
      setdetails(res && res);
    else
      setdetails(false);

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAlldetails(+GetParams('id'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [+GetParams('id')]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap '>
        <ButtonBase className='btns theme-transparent mb-2' onClick={() => { GlobalHistory.push('/home/Community/view'); }}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(LocationsPermissions)}
          permissionsId={LocationsPermissions.EditLocationDetails.permissionsId}
        >
          <ButtonBase className='btns theme-solid mb-2' disabled={validate} onClick={() => { saveHandler(); }}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    );
  });

  return (
    <div className='Location-Sharing-wraper'>
      <AddFormCommunity
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        obejectDTO={(e) => setStatemain(e)}
        validatestate={(e) => setvalidate(e)}
        details={details && details}
      />
      <EditFormCommunity
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        obejectDTO={(e) => setStatemain(e)}
        validatestate={(e) => setvalidate(e)}
      />
    </div>
  );
};
