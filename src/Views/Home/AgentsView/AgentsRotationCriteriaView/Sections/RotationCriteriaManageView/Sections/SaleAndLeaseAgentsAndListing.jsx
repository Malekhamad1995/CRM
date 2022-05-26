import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SelectedAgentsView } from '../../../Dialogs/AssignAgentToRotationCriteriaDialog/Sections/SelectedAgentsView';
import { AssignNewAgent } from '../../../AgentsRotationCriteriaUtilities/AssignAgentsView/AssignNewAgentView';
import { Spinner } from '../../../../../../../Components';
import { showError, showSuccess } from '../../../../../../../Helper';

import {
    GetAllListingAgentsServices,
    GetAllLeaseOrSaleAgentsServices

} from '../../../../../../../Services/AgentsServices';
import {
    AssignAgentToRotationScheme,
    AssignListingAgentToRotationScheme,
    GetAllAgentByRotationSchemeServices,
    GetAllListingAgentByRotationSchemeServices,
    RemoveAgentToRotationSchemeServices,
    RemoveListingAgentToRotationScheme
} from '../../../../../../../Services/RotaionSchemaService/RotationSchemaService';

export const SaleAndLeaseAgentsAndListing = ({
    parentTranslationPath,
    translationPath,
    rotationCriteriaId, type,
}) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [isLoading, setIsLoading] = useState(false);
    const [agants, setAgents] = useState([]);
    const [notActiveAgants, setnotActiveAgantss] = useState([]);
    const [sortName, setSortName] = useState(false);
    const [sortNum, setSortNum] = useState(false);
    const [sortNameSelectedAgents, setSortNameSelectedAgents] = useState(false);
    const [sortNumSelectedAgents, setSortNumSelectedAgents] = useState(false);
    const [selectedagants, Setselectedagants] = useState([]);
    const [active, SetActive] = useState(null);
    const [dropBox, setDropBox] = useState(false);
    const [drag, setDrag] = useState(false);
    const [searchAgent, setSearchAgent] = useState('');

    const GetAllAgent = useCallback(async () => {
        setIsLoading(true);
        const res = (type === 0) ? await GetAllLeaseOrSaleAgentsServices({ pageSize: 0, pageIndex: 0, search: searchAgent }) :
            await GetAllListingAgentsServices({ pageSize: 0, pageIndex: 0, search: searchAgent });
        setIsLoading(false);
        setAgents((res && res.result) || []);
    }, [searchAgent, type]);

    const selectedAgent = useCallback(async () => {
        setIsLoading(true);
        const res = (type === 0) ? await GetAllAgentByRotationSchemeServices({
            id: rotationCriteriaId,
            pageSize: 0,
            pageIndex: 0,
        }) : await GetAllListingAgentByRotationSchemeServices({
            id: rotationCriteriaId,
            pageSize: 0,
            pageIndex: 0
        });
        setIsLoading(false);
        Setselectedagants((res && res.result) || []);
    }, [rotationCriteriaId, type]);

    useEffect(() => {
        if (agants && selectedagants) {
            const list = [];
            agants.map((item) =>
                (selectedagants.findIndex((w) => w.agentId === item.agentId) === -1 ? list.push(item) : true));
            setnotActiveAgantss(list);
        }
    }, [agants, selectedagants]);

    const AssignAgentToRotaionSchema = useCallback(async (item) => {
        setIsLoading(true);
        const body = { agents: [...selectedagants, item] };
        const res = (type === 0) ? await AssignAgentToRotationScheme(rotationCriteriaId, body) :
            await AssignListingAgentToRotationScheme(rotationCriteriaId, body);
        if (!(res && res.status && res.status !== 200)) {
            if (type === 0)
                showSuccess(t(`${translationPath}add-agent-successfully`));
            else showSuccess(t(`${translationPath}add-listing-agent-successfully`));
        } else if (type === 0)
            showError(t(`${translationPath}add-agent-failure`));

        else showError(t(`${translationPath}agent-listing-failed`));
        setIsLoading(false);
        selectedAgent();
    }, [rotationCriteriaId, selectedAgent, selectedagants, t, translationPath, type]);

    useEffect(() => {
        if (rotationCriteriaId === null || rotationCriteriaId === undefined) return;
        selectedAgent();
    }, [rotationCriteriaId, selectedAgent]);

    useEffect(() => {
        GetAllAgent();
    }, [GetAllAgent, searchAgent]);

    const ondrag = (item) => {
        AssignAgentToRotaionSchema(item);
        setDrag(false);
    };
    const orderByName = (list, isAscending) => {
        if (isAscending) {
            const ascendingSort = list.sort((a, b) => {
                const nameA = a.agentName.toLowerCase(); const
                    nameB = b.agentName.toLowerCase();
                if (nameA < nameB)
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0; // no sorting
            });
            return ascendingSort;
        }

        const descendingSort = list.sort((a, b) => {
            const nameA = a.agentName.toLowerCase();
            const nameB = b.agentName.toLowerCase();
            if (nameB < nameA)
                return -1;
            if (nameB > nameA)
                return 1;
            return 0; // no sorting
        });
        return descendingSort;
    };

    const orderByAgentId = (list, isAscending) => {
        if (isAscending) {
            const ascendingSort = list.sort((n1, n2) => {
                const num1 = n1.agentId; const
                    num2 = n2.agentId;
                if (num1 < num2)
                    return -1;
                if (num1 > num2)
                    return 1;
                return 0; // no sorting
            });
            return ascendingSort;
        }

        const descendingSort = list.sort((n1, n2) => {
            const num1 = n1.agentId;
            const num2 = n2.agentId;
            if (num2 < num1)
                return -1;
            if (num2 > num1)
                return 1;
            return 0; // no sorting
        });
        return descendingSort;
    };

    useEffect(() => {
        const orderList = orderByName(notActiveAgants, sortName);
        setnotActiveAgantss([...orderList]);
    }, [sortName]);

    useEffect(() => {
        const orderList = orderByAgentId(notActiveAgants, sortNum);
        setnotActiveAgantss([...orderList]);
    }, [sortNum]);

    useEffect(() => {
        const orderList = orderByName(selectedagants, sortNameSelectedAgents);
        Setselectedagants([...orderList]);
    }, [sortNameSelectedAgents]);

    useEffect(() => {
        const orderList = orderByAgentId(selectedagants, sortNumSelectedAgents);
        Setselectedagants([...orderList]);
    }, [sortNumSelectedAgents]);

    const removeAgent = useCallback(async (item) => {
        setIsLoading(true);
        const deleteAgent = (type === 0) ?
            await RemoveAgentToRotationSchemeServices(rotationCriteriaId, item.agentId) :
            await RemoveListingAgentToRotationScheme(rotationCriteriaId, item.agentId);
        if (!(deleteAgent && deleteAgent.status && deleteAgent.status !== 200)) {
            if (type === 0)
                showSuccess(t`${translationPath}agent-delete-successfully`);
            else
                showSuccess(t`${translationPath}listing-agent-delete-successfully`);
        } else if (type === 0)
            showError(t`${translationPath}agent-delete-failed`);
        else
            showError(t`${translationPath}listing-agent-delete-failed`);
        setIsLoading(false);
        selectedAgent();
    }, [rotationCriteriaId, t, type]);
    return (
      <>
        <Spinner isActive={isLoading} isAbsolute />
        <div className='agent-section-wrapper'>
          {agants && (
            <AssignNewAgent
              type={type}
              setSortName={setSortName}
              sortName={sortName}
              sortNum={sortNum}
              setSortNum={setSortNum}
              search={searchAgent}
              setSearch={setSearchAgent}
              setDropBox={setDropBox}
              SetActive={SetActive}
              agants={notActiveAgants}
              onClick={async (item) => {
                            await AssignAgentToRotaionSchema(item);
                        }}
            />
                )}
        </div>
        <span className='section-seperator mdi mdi-arrow-collapse-right c-gray arrow' />
        <div className='agent-section-wrapper'>
          <SelectedAgentsView
            type={type}
            active={active}
            agants={selectedagants}
            sortNameSelectedAgents={sortNameSelectedAgents}
            sortNumSelectedAgents={sortNumSelectedAgents}
            setSortNumSelectedAgents={setSortNumSelectedAgents}
            setSortNameSelectedAgents={setSortNameSelectedAgents}
            ondrag={ondrag}
            setDropBox={setDropBox}
            dropBox={dropBox}
            rotationCriteriaId={rotationCriteriaId}
            removeAgent={removeAgent}
          />

        </div>
      </>

    );
};
SaleAndLeaseAgentsAndListing.propTypes = {
    parentTranslationPath: PropTypes.string.isRequired,
    translationPath: PropTypes.string.isRequired,
    rotationCriteriaId: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
};
