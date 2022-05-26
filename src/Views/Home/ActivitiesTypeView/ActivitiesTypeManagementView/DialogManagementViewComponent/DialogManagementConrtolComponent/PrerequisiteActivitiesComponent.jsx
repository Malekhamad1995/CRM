
import React, {
  useCallback, useEffect, useState, useRef
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllActivityTypesSearch } from '../../../../../../Services';

export const PrerequisiteActivitiesComponent = ({
  parentTranslationPath,
  translationPath,
  helperText,
  setState,
  Data,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [Roles, setRoles] = useState({});
  const [loadings, setloadings] = useState(false);
  const [selected, setSelected] = useState([]);
  const searchTimer = useRef(null);
  const getAllActivityTypes = useCallback(async (value) => {
    setloadings(true);
    const res = await GetAllActivityTypesSearch(value);
    if (!(res && res.status && res.status !== 200)) setRoles(res);
    else setRoles([]);
    setloadings(false);
  }, []);

  useEffect(() => {
    getAllActivityTypes('');
  }, [getAllActivityTypes]);


  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      getAllActivityTypes(value);
    }, 700);
  };


  useEffect(() => {
    if (Data) {
      setSelected(
        Data &&
        Data &&
        Data.activityTypeActivityTypePrerequisites &&
        Data.activityTypeActivityTypePrerequisites.map((x) => ({
          activityTypeId: x.activityTypePrerequisiteId,
          activityTypeName: x.activityTypePrerequisiteName,
        }))
      );
    }
    setState(
      Data &&
      Data &&
      Data.relatedTo &&
      Data.relatedTo.map((x) => ({
        activityTypePrerequisiteId: x.activityTypePrerequisiteId,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]); return (
    <div>
      <AutocompleteComponent
        idRef='PrerequisiteactivitiesRef'
        labelValue='Prerequisite-activities'
        selectedValues={selected || []}
        multiple
        data={(Roles && Roles) || []}
        chipsLabel={(option) => option.activityTypeName || ''}
        displayLabel={(option) => t(`${option.activityTypeName || ''}`)}
        getOptionSelected={(option) =>
          selected.findIndex((item) => item.activityTypeId === option.activityTypeId) !== -1 || ''}
        withoutSearchButton
        onInputKeyUp={(e) => searchHandler(e)}
        inputPlaceholder={t(`${translationPath}Select-multiple`)}
        isLoading={loadings}
        helperText={helperText}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setState(
            newValue &&
            newValue.map((x) => ({
              activityTypePrerequisiteId: x.activityTypeId,
            }))
          );
          setSelected(
            newValue &&
            newValue.map((x) => ({
              activityTypeId: x.activityTypeId,
              activityTypeName: x.activityTypeName,
            }))
          );
        }}
      />
    </div>
  );
};

PrerequisiteActivitiesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  setState: PropTypes.number.isRequired,
};
