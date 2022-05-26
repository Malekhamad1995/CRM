/* eslint-disable no-unused-vars */
import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { OrganizationUserSearch } from '../../../../../../Services';
import { AgentRoleEnum } from '../../../../../../Enums';

export const ListingAgent = ({
  parentTranslationPath,
  translationPath,
  setvalue,
  helperText,
  error,
  isSubmitted,
  operationType
}) => {
  const { t } = useTranslation(parentTranslationPath || '');
  const searchTimer = useRef(null);
  const [Users, setUsers] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [agentType, setAgentType] = useState(null);
  const [filter, setfilter] = useState({
    pageSize: 100,
    pageIndex: 1,
    name: '',
    userName: null,
    phoneNumber: null,
    email: null,
    userTypeId: ((operationType === 1) ? AgentRoleEnum.SaleListingAgent.value : AgentRoleEnum.LeaseListingAgent.value)
  });
  const getUsersAPI = useCallback(async () => {
    setisLoading(true);
    const res = await OrganizationUserSearch({ ...filter });
    if (res && res.totalCount === 0) {
      setUsers({
        result: [],
        totalCount: 0,
      });
    } else {
      setUsers({
        result: res.result,
        totalCount: res.totalCount,
      });
    }
    setisLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    getUsersAPI();
  }, [getUsersAPI]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setfilter((item) => ({ ...item, name: value }));
    }, 700);
  };

  return (
    <div>
      <AutocompleteComponent
        idRef= {operationType === 1 ? 'ListingAgentRef' : 'RentListingAgentRef'  }
        labelValue={operationType === 1 ?  'ListingAgent' : 'rentListingAgent' } 
        multiple={false}
        data={Users.result || []}
        displayLabel={(option) => option.fullName || ''}
        withoutSearchButton
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        onInputKeyUp={(e) => searchHandler(e)}
        isWithError
        isLoading={isLoading}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue(
            newValue && {
              email: newValue.email || '',
              id: newValue.id,
              name: newValue.fullName,
              phone: newValue.phoneNumber || '',
              userName: newValue.userName,
            }
          );
        }}
      />
    </div>
  );
};
ListingAgent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  operationType: PropTypes.number.isRequired,
};
