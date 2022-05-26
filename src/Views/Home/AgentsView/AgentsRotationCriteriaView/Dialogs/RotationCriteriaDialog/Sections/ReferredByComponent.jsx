import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../../Components';
import { OrganizationUserSearch } from '../../../../../../../Services/userServices';
import { getErrorByName } from '../../../../../../../Helper/Middleware.Helper';

export const RefferdByComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  state,
  schema,
  schemaKey,
  isSubmitted,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState('');
  const [filter, setFilter] = useState({ pageIndex: 0, pageSize: 25 });

  const GetAllUsers = useCallback(async (f) => {
    const res = await OrganizationUserSearch(f);
    if (!(res && res.status && res.status !== 200)) {
      const mapped = [];
      res.result.map((item) => {
        mapped.push({
          userId: item.id,
          fullName: item.fullName,
        });
      });
      setUsers(mapped || []);
    }
  }, []);
  useEffect(() => {
    GetAllUsers(filter);
  }, [filter]);

  return (
    <>
      <div className='dialog-content-item'>
        <AutocompleteComponent
          idRef='RefferdByIdRef'
          labelClasses='Requierd-Color'
          labelValue={t(`${translationPath}RefferdBy`)}
          selectedValues={state.rotationSchemaReferredBys}
          withLoader
          data={users || []}
          multiple
          texth
          isSubmitted={isSubmitted}
          schemaKey={schemaKey}
          displayLabel={(option) => (option && option.fullName) || ''}
          chipsLabel={(option) => (option && option.fullName) || ''}
          helperText={getErrorByName(schema, 'rotationSchemaReferredBys').message}
          error={getErrorByName(schema, 'rotationSchemaReferredBys').error}
          isWithError
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            const localNewValue = {
              id: 'rotationSchemaReferredBys',
              value: [...newValue],
            };
            onStateChanged(localNewValue);
          }}
          filterOptions={(options) => {
            const isFind = (id) =>
              state.rotationSchemaReferredBys.findIndex((w) => w.userId === id) === -1;
            return options.filter((w) => isFind(w.userId));
          }}
          textValue={value}
          onInputChange={(e) => {
            setValue(e.target.value);
          }}
          onTextKeyDown={() => {
            if (timer) clearTimeout(timer);
          }}
          onTextKeyUp={() => {
            const t = setTimeout(() => {
              const newvalue = { ...filter, name: value };
              setFilter((f) => newvalue);
            }, 1000);
            setTimer(t);
          }}
        />
      </div>
    </>
  );
};
