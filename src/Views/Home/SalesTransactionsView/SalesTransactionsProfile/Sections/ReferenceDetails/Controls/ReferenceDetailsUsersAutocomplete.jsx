import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { getErrorByName } from '../../../../../../../Helper';
import { AutocompleteComponent } from '../../../../../../../Components';
import {
  ActiveOrganizationUser,
  OrganizationUserSearch,
} from '../../../../../../../Services/userServices';

export const ReferenceDetailsUsersAutocomplete = ({
  stateValue,
  selectedValue,
  idRef,
  labelValue,
  schema,
  isSubmitted,
  stateKey,
  selectedKey,
  onStateChanged,
  onSelectedChanged,
  parentTranslationPath,
  translationPath,
  isDisabled
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const searchTimer = useRef(null);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const getAllUsers = useCallback(
    async (value, localSelectedValue) => {
      setIsLoading(true);
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
      });
      if (!((res && res.data && res.data.ErrorId) || !res)) {
        setUsers(
          (localSelectedValue &&
            ((res && res.result && [...res.result, localSelectedValue]) || [localSelectedValue])) ||
            (res && res.result) ||
            []
        );
      } else setUsers([]);
      setIsLoading(false);
    },
    [filter]
  );
  const getUserById = useCallback(async (userId) => {
    setIsLoading(true);
    const res = await ActiveOrganizationUser(userId);
    setIsLoading(false);
    if (!((res && res.data && res.data.ErrorId) || !res)) return res;
    return null;
  }, []);
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  const getEditInit = useCallback(async () => {
    if (stateValue && !selectedValue && onSelectedChanged && users.length > 0) {
      const userIndex = users.findIndex((item) => item.id === stateValue);
      if (userIndex !== -1) onSelectedChanged({ id: selectedKey, value: users[userIndex] });
      else {
        const res = await getUserById(stateValue);
        if (res) {
          onSelectedChanged({ id: selectedKey, value: users[userIndex] });

          setUsers((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: stateKey, value: null });
      }
    }
  }, [
    getUserById,
    onSelectedChanged,
    onStateChanged,
    selectedKey,
    selectedValue,
    stateKey,
    stateValue,
    users,
  ]);
  useEffect(() => {
    if (stateValue) getEditInit();
  }, [getEditInit, stateValue]);
  return (
    <AutocompleteComponent
      idRef={idRef}
      labelValue={labelValue}
      selectedValues={selectedValue}
      multiple={false}
      data={users}
      displayLabel={(option) => option.fullName || ''}
      renderOption={(option) =>
        ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) || ''}
      getOptionSelected={(option) => option.id === stateValue}
      withoutSearchButton
      helperText={getErrorByName(schema, stateKey).message}
      error={getErrorByName(schema, stateKey).error}
      isLoading={isLoading}
      onInputKeyUp={(e) => {
        const { value } = e.target;
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
          getAllUsers(value, selectedValue);
        }, 700);
      }}
      isWithError
      isSubmitted={isSubmitted}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChange={(event, newValue) => {
        onSelectedChanged({ id: selectedKey, value: newValue });
        onStateChanged({
          id: stateKey,
          value: (newValue && newValue.id) || null,
        });
      }}
      isDisabled={isDisabled}
    />
  );
};

ReferenceDetailsUsersAutocomplete.propTypes = {
  stateValue: PropTypes.string,
  selectedValue: PropTypes.instanceOf(Object),
  idRef: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  selectedKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ReferenceDetailsUsersAutocomplete.defaultProps = {
  stateValue: null,
  selectedValue: null,
};
