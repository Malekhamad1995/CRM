import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetAgentsForContactLeads } from '../../../../../../Services';
import { LoadableImageComponant, Spinner } from '../../../../../../Components';
import { getDownloadableLink, GetParams } from '../../../../../../Helper';
import { ContactTypeEnum } from '../../../../../../Enums';

export const ContactProfileUserAccessComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    setContactId(+GetParams('id'));
  }, []);

  const getAllAccessUser = useCallback(async () => {
    setLoading(true);
    if (contactId) {
      const result = await GetAgentsForContactLeads(contactId);
      if (!(result && result.status && result.status !== 200)) setResponse(result.result);
      else setResponse({});
    }
    setLoading(false);
  }, [contactId]);

  useEffect(() => {
    getAllAccessUser();
  }, [getAllAccessUser]);

  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={loading} />
      <div className='title-section'>
        <span>{t(`${translationPath}who-can-access-this-file`)}</span>
      </div>
      <div className='user-access-wrapper w-100 px-2'>
        {response &&
          response.map((item) => (
            <div className='user-access-item'>
              <div className='user-access-image-wrapper'>
                <LoadableImageComponant
                  classes='user-access-image'
                  alt={`${(item && item.agentUsername) || ''}`}
                  src={
                    (item.profileImg && getDownloadableLink(item.profileImg)) ||
                    ContactTypeEnum.man.defaultImg
                  }
                />
              </div>
              <div className='user-access-info'>
                <div className='user-access-name'>
                {`${(item && item.agentName) || ''}`}
                </div>
                <div className='user-access-type'>
                  {`${(item && item.agentUsername) || ''}`}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

ContactProfileUserAccessComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
