import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllRoles } from '../../../../../../Services';

export const AssignedToComponent = ({
  parentTranslationPath,
  translationPath,
  helperText,
  setState,
  Data,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [Roles, setRoles] = useState({});
  const [searchedItem] = useState('');
  const [loadings, setloadings] = useState(false);
  const [selected, setSelected] = useState([]);
  const searchTimer = useRef(null);
  const getRoles = useCallback(async (value) => {
    setloadings(true);
    const response = await GetAllRoles(1, 25, value);
    setRoles({
      result: (response && response.result) || [],
      totalCount: (response && response.totalCount) || 0,
    });
    setloadings(false);
  }, []);

  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      getRoles(value);
    }, 700);
  };

  useEffect(() => {
    getRoles(searchedItem);
  }, [getRoles, searchedItem]);

  useEffect(() => {
    if (Data) {
      setSelected(
        Data &&
          Data &&
          Data.assignedToActivityTypeRoles &&
          Data.assignedToActivityTypeRoles.map((x) => ({
            rolesId: x.rolesId,
            rolesName: x.roleName,
          }))
      );
    }
    setState(
      Data &&
        Data &&
        Data.assignedToActivityTypeRoles &&
        Data.assignedToActivityTypeRoles.map((x) => ({
          relatedToId: x.rolesId,
        }))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  return (
    <div>
      <AutocompleteComponent
        idRef='Assigned-ToRef'
        labelValue='Assigned-To'
        labelClasses='Requierd-Color'
        selectedValues={selected || []}
        multiple
        data={(Roles && Roles.result) || []}
        chipsLabel={(option) => option.rolesName || ''}
        displayLabel={(option) => t(`${option.rolesName || ''}`)}
        getOptionSelected={(option) =>
          selected.findIndex((item) => item.rolesId === option.rolesId) !== -1 || ''}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}Select-multiple`)}
        isLoading={loadings}
        helperText={helperText}
        onInputKeyUp={(e) => searchHandler(e)}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setState(
            newValue &&
              newValue.map((x) => ({
                rolesId: x.rolesId,
              }))
          );
          setSelected(
            newValue &&
              newValue.map((x) => ({
                rolesId: x.rolesId,
                rolesName: x.rolesName,
              }))
          );
        }}
      />
    </div>
  );
};
AssignedToComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  setState: PropTypes.number.isRequired,
};
