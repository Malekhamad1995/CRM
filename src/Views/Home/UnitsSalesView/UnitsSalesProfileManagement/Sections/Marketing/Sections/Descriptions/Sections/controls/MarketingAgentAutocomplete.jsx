import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../../../../Components';
import { getErrorByName } from '../../../../../../../../../../Helper';
import {
  ActiveOrganizationUser,
  OrganizationUserSearch,
} from '../../../../../../../../../../Services';

export const MarketingAgentAutocomplete = ({
  state,
  schema,
  onStateChanged,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const searchTimer = useRef(null);
  const [marketingAgent, setMarketingAgent] = useState([]);
  const [marketingAgents, setMarketingAgents] = useState([]);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const getAllMarketingAgent = useCallback(
    async (value) => {
      setIsLoading(true);
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
      });
      if (!(res && res.status && res.status !== 200)) setMarketingAgents((res && res.result) || []);
      else setMarketingAgents([]);
      setIsLoading(false);
    },
    [filter]
  );
  const onAutocompleteChanged = (event, newValue) => {
    setMarketingAgent(newValue);
    onStateChanged({
      id: 'agentsId',
      value: (newValue && newValue.id) || null,
    });
  };
  const getUserById = useCallback(async (userId) => {
    setIsLoading(true);
    const res = await ActiveOrganizationUser(userId);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  useEffect(() => {
    getAllMarketingAgent();
  }, [getAllMarketingAgent]);
  useEffect(() => {
    if (state.agentsId && !marketingAgent && marketingAgents.length > 0) {
      setMarketingAgent(async (items) => {
        const marketingAgentIndex = marketingAgents.findIndex((item) => item.id === state.agentsId);
        if (marketingAgentIndex && marketingAgentIndex !== -1)
          items[marketingAgentIndex] = marketingAgents[marketingAgentIndex];
        else {
          const res = await getUserById(state.agentsId);
          if (res) items[marketingAgentIndex] = res;
          else if (onStateChanged) onStateChanged({ id: 'agentsId', value: null });
        }
        return [...items];
      });
    }
  }, [state.agentsId, marketingAgents, getUserById, onStateChanged, marketingAgent]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='form-item'>
      <AutocompleteComponent
        idRef='agentsIdRef'
        labelValue='marketing-agent'
        selectedValues={marketingAgent}
        multiple={false}
        data={marketingAgents}
        displayLabel={(option) => option.fullName || ''}
        renderOption={(option) =>
          ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) || ''}
        getOptionSelected={(option) => option.id === state.agentsId}
        withoutSearchButton
        onInputKeyUp={(e) => {
          const { value } = e.target;
          if (searchTimer.current) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            getAllMarketingAgent(value);
          }, 700);
        }}
        helperText={getErrorByName(schema, 'agentsId').message}
        error={getErrorByName(schema, 'agentsId').error}
        isWithError
        isLoading={isLoading}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={onAutocompleteChanged}
      />
    </div>
  );
};

MarketingAgentAutocomplete.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
