import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../Services';
import { PropertyPlanEnum } from '../../../../../../../Enums';
import { AutocompleteComponent } from '../../../../../../../Components';

export const PopertyStatusComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  state,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [lookups, setLookups] = useState([]);
  const getAllLookups = useCallback(async () => {
    const res = await lookupItemsGetId({
      lookupTypeId: PropertyPlanEnum.lookupTypeId,
    });
    if (!(res && res.status && res.status !== 200)) setLookups(res || []);
    else setLookups([]);
  }, []);
  useEffect(() => {
    getAllLookups();
  }, [getAllLookups]);

  return (
    <>
      <div className='dialog-content-item'>
        <AutocompleteComponent
          idRef='popertyStatusRef'
          labelValue={t(`${translationPath}propertyStatus`)}
          data={lookups || []}
          value={state.leadClassId}
          multiple={false}
          displayLabel={(option) => (option && option.lookupItemName) || ''}
          withoutSearchButton
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onStateChanged((newValue && newValue.lookupItemId) || null);
          }}
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
  PropTypes.array,
  PropTypes.array,
  PropTypes.array,
]);
PopertyStatusComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
};
