import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../Components';
import { MediaEnum } from '../../../../../../../Enums';
import { lookupItemsGetId } from '../../../../../../../Services';
import { getErrorByName } from '../../../../../../../Helper';

export const MediaSectionNameComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  state,
  schema,
  isSubmitted,
  setIsLoading,
  values
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [lookups, setLookups] = useState([]);
  const [pageResult, setpageResult] = useState([]);

  const getAllLookups = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: MediaEnum.MediaTypeId.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) {
      const mapped = [];
      res.map((item) => {
        mapped.push({ mediaName: item.lookupItemName, mediaNameId: item.lookupItemId });
      });
      setLookups(mapped || []);
      setpageResult(mapped.slice(0, 100));
    } else setLookups([]);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    getAllLookups();
  }, [getAllLookups]);

  return (
    <>
      <div className='dialog-content-item'>
        <AutocompleteComponent
          idRef='mediaNameRef'
          value={state.rotationSchemeMedias}
          selectedValues={values}
          labelValue={t(`${translationPath}mediaName`)}
          data={pageResult || []}
          onInputChange={(e) => {
            if (e.target.value) {
              const list = lookups.filter((w) => w.mediaName.toLowerCase().includes(e.target.value.toLowerCase())).slice(0, 100);
              setpageResult(list);
            }
          }}
          multiple
          displayLabel={(option) => (option && option.mediaName) || ''}
          chipsLabel={(option) => (option && option.mediaName) || ''}
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onStateChanged(newValue || null);
          }}
          filterOptions={(options) => {
            const isFind = (id) => state.rotationSchemeMedias.findIndex((w) => w.mediaNameId === id) === -1;
            return options.filter((w) => isFind(w.mediaNameId));
          }}
          isWithError
          isSubmitted={isSubmitted}
          helperText={getErrorByName(schema, 'rotationSchemeMedias').message}
          error={getErrorByName(schema, 'rotationSchemeMedias').error}
        />
      </div>
    </>
  );
};
const convertJsonValueShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
]);
MediaSectionNameComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};
