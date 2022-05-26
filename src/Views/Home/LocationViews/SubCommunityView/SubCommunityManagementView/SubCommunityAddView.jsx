import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useTitle } from '../../../../../Hooks';
import { AddFormSubCommunity } from '../SubCommunityUtilities';
import {
  bottomBoxComponentUpdate, GlobalHistory, showError, showSuccess
} from '../../../../../Helper';
import { lookupItemsPost } from '../../../../../Services';
import { Country } from '../../../../../assets/json/StaticLookupsIds.json';
import { Spinner } from '../../../../../Components';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const SubCommunityAddView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [mainstate, setStatemain] = useState({});
  const [substate, setsubstate] = useState({});
  const [validate, setvalidate] = useState(false);
  const saveHandler = async () => {
    setIsLoading(true);
    const res = await lookupItemsPost(
      {
        lookupItemName: (mainstate && mainstate.LocationName),
        lookupItemCode: ((mainstate && mainstate.LocationName).substring(0, 2)).toUpperCase(),
        description: null,
        parentLookupItemId: null,
        lookupTypeId: Country,
        order: null,
        createLocationDetailsDto: { ...mainstate, ...substate }
      }
    );
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}Create-successfully`);
      GlobalHistory.push('/home/Communitie/view');
    } else showError(t`${translationPath}Create-failed`);
  };

  useTitle(t(`${translationPath}Addnew`));
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap '>
        <ButtonBase className='btns theme-transparent mb-2' onClick={() => { GlobalHistory.push('/home/Communitie/view'); }}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' disabled={validate} onClick={() => { saveHandler(); }}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  });
  return (
    <div className='d-flex-column-center'>
      <Spinner isActive={isLoading} />
      <AddFormSubCommunity
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        obejectDTO={(e) => setStatemain(e)}
        substate={(e) => { setsubstate(e); }}
        validatestate={(e) => setvalidate(e)}
      />
    </div>
  );
};
