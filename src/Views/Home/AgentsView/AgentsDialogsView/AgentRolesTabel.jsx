import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Tables } from '../../../../Components';

export const AgentRolesTabel = ({ parentTranslationPath, translationPath, Data }) => {
  const { t } = useTranslation(parentTranslationPath);

  const [filter] = useState({
    pageIndex: 0,
    pageSize: 1000,
  });
  const [response, setresponse] = useState([]);

  useEffect(() => {
    setresponse((Data && Data) || []);
  }, [Data]);
  return (
    <div className='ActivitiesType-View childs-wrapper'>
      <div className='filter-section-item' />
      <div className='w-100 px-2  Tables-AgentsTabelDialogView'>
        <Tables
          data={response}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}agentRoleId`),
              input: 'agentRoleId',
            },
            {
              id: 2,
              label: t(`${translationPath}agentRoleName`),
              input: 'agentRoleName',
            },
          ]}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={(response && response.length) || 0}
          defaultActions={[]}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
        />
      </div>
    </div>
  );
};
AgentRolesTabel.propTypes = {
  Data: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
