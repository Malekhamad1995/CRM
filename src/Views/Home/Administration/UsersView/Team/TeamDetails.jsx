import React, { useState, useEffect } from 'react';
import StarIcon from '@material-ui/icons/Star';
import { useTranslation } from 'react-i18next';

export const TeamDetails = () => {
  const [userTeamsList, setUserTeamsList] = useState([]);
  const parentTranslationPath = 'UsersView';
  const translationPath = 'UsersManagementView.';
  const { t } = useTranslation([parentTranslationPath]);

  useEffect(() => {
    const userTeams = localStorage.getItem('userTeamsList');
    if (userTeams)
      setUserTeamsList(JSON.parse(userTeams));
    else
      setUserTeamsList([]);
  }, []);
  return (
    <div className='teams-part'>
      {userTeamsList && userTeamsList.length > 0 && userTeamsList.map((item) => (
        <div key={`${item.teamUsersId + item.teamsId}`} className='user-management-team'>
          <div className=''>
            <div className='firstPart'>
              <span className='headerName'>
                {t(`${translationPath}business-Group`)}
                <span>
                  {' : '}
                  {' '}
                  &nbsp;
                </span>

              </span>
              <span className='secondPart'>
                &nbsp;
                {item.businessGroupName}
              </span>

            </div>
            <div className='firstPart'>
              <span className='headerName'>
                {t(`${translationPath}teamName`)}
                <span>
                  {' : '}
                  {' '}
                  &nbsp;
                </span>

              </span>
              <span className='secondPart'>
                &nbsp;
                {item.teamName}
              </span>

            </div>
          </div>

          {item.isTeamLead && (
            <div className='startPart'>
              <span>
                <StarIcon className='star-color' />
              </span>

            </div>
          )}

        </div>
      ))}

    </div>

  );
};
