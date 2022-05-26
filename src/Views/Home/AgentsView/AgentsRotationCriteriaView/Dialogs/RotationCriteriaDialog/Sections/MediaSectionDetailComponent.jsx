import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../Components';
import { MediaEnum } from '../../../../../../../Enums';
import { lookupItemsGetId } from '../../../../../../../Services';
import { getErrorByName } from '../../../../../../../Helper';

export const MediaSectionDetailComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  state,
  schema,
  isSubmitted,
  values,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [lookups, setLookups] = useState([]);
  const [pageResult, setpageResult] = useState([]);

  const getAllLookups = useCallback(async () => {
    const res = await lookupItemsGetId({
      lookupTypeId: MediaEnum.MediaDetailsId.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) {
      const mapped = [];
      res.map((item) => {
        mapped.push({ mediaDetailsName: item.lookupItemName, mediaDetailsId: item.lookupItemId });
      });
      setLookups(mapped || []);
      setpageResult(mapped.slice(0, 100));
    } else setLookups([]);
  }, []);

  useEffect(() => {
    getAllLookups();
  }, [getAllLookups]);

  return (
    <>
      <div className='dialog-content-item'>
        <AutocompleteComponent
          idRef='mediaDetailRef'
          labelValue={t(`${translationPath}mediaDetail`)}
          value={state.rotationSchemeMedias}
          selectedValues={values}
          data={pageResult || []}
          onInputChange={(e) => {
            if (e.target.value) {
              const list = lookups.filter((w) => w.mediaDetailsName.toLowerCase().includes(e.target.value.toLowerCase())).slice(0, 100);
              setpageResult(list);
            }
          }}
          multiple
          displayLabel={(option) =>
            (option && option.mediaDetailsName) || ''}
          chipsLabel={(option) => (option && option.mediaDetailsName) || ''}
          filterOptions={(options) => {
            const isFind = (id) => state.rotationSchemeMedias.findIndex((w) => w.mediaDetailsId === id) === -1;
            return options.filter((w) => isFind(w.mediaDetailsId));
          }}
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onStateChanged(newValue || null);
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
MediaSectionDetailComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
};
