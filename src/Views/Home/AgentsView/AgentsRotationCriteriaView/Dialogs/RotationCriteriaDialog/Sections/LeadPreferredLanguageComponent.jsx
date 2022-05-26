import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../Services';
import { LanguageEnum } from '../../../../../../../Enums';
import {AutocompleteComponent, SelectComponet} from '../../../../../../../Components';
import {getErrorByName} from "../../../../../../../Helper";

export const LeadPreferredLanguageComponent = ({
    state,
  parentTranslationPath,
  translationPath,
  onStateChanged,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [lookups, setLookups] = useState([]);
  const getAllLookups = useCallback(async () => {
    const res = await lookupItemsGetId({
      lookupTypeId: LanguageEnum.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) {
      const mapped =[];
      res.map((item)=>{
        mapped.push({languageName:item.lookupItemName,languageId:item.lookupItemId})
      })

      setLookups(mapped || []);
    }
    else setLookups([]);
  }, []);
  useEffect(() => {
    getAllLookups();
  }, [getAllLookups]);

  return (
    <div className='dialog-content-item'>
      <AutocompleteComponent
          idRef='leadTypeRef'
          labelValue={t(`${translationPath}lead-preferred-language`)}
          selectedValues={state.rotationPreferredLanguages}
          data={lookups || []}
          multiple
          displayLabel={(option) => (option && option.languageName) || ''}
          chipsLabel={(option) => (option && option.languageName) || ''}
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          filterOptions={(options)=>{
            const isFind = (id)=> state.rotationPreferredLanguages.findIndex(w=>w.languageId ===id)===-1;
            return options.filter(w=>isFind(w.languageId));
          }}
          onChange={(event, newValue) => {
     
            onStateChanged(newValue || null);
          }}
      />
    </div>
  );
};
LeadPreferredLanguageComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
};
