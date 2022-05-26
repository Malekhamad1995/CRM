import React, { useCallback, useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import './LeasingTeamLead.scss';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  TokenReport,
  RefreshTokenPbi,
} from '../../../../Services/DashboardService';
import { PowerBiEnum } from '../../../../Enums';
import { GetUserTeamsInfo } from '../../../../Services/userServices';
import { DialogComponent } from '../../../../Components';
import { showError } from '../../../../Helper';

const translationPath = 'DialogComponent.';

export const LeasingTeamLead = () => {
  const [reporttoken, setReporttoken] = useState();
  const [teamid, setTeamid] = useState(null);
  const [userTeamList, setUserTeamList] = useState([]);
  const [isOpenclosed, setIsOpenclosed] = useState(false);
  const [userTeamListlength, setuserTeamListlength] = useState(0);
  const [render, setRender] = useState(false);

  const { t } = useTranslation('Dashboard');

  const userid = JSON.parse(localStorage.getItem('session')).userId;

  const GenerateTokenReport = async (groupid, reportid) => {
    const result = await TokenReport(groupid, reportid);
    setReporttoken(result);
    setRender(true);
  };

  const RefreshToken = async () => {
    const result = await RefreshTokenPbi({
      reports: PowerBiEnum.leasingToken.reportid,
      groups: PowerBiEnum.leasingToken.groupid,
    });
    setReporttoken(result);
  };
  const getUserTemasById = useCallback(async () => {
    const res = await GetUserTeamsInfo(userid);
    if (!(res && res.status && res.status !== 200)) {
      localStorage.setItem('userTeamsList', JSON.stringify(res));
      setUserTeamList(res || null);
      setuserTeamListlength(res.length);
    } else setUserTeamList([]);
  }, [userid]);

  const Filter = {
    $schema: 'http://powerbi.com/product/schema#basic',
    target: {
      table: 'Team User Group',
      column: 'TeamsId',
    },
    operator: 'In',
    values: [teamid],
    filterType: models.FilterType.BasicFilter,
    requireSingleSelection: true,
  };

  useEffect(() => {
    getUserTemasById(userid);
    if (userTeamListlength > 1)
      setIsOpenclosed(true);
     else
      setTeamid((userTeamList[0] && userTeamList[0].teamsId) || null);

    GenerateTokenReport(
      PowerBiEnum.leasingToken.reportid,
      PowerBiEnum.leasingToken.groupid
    );
  }, [userTeamListlength, teamid]);

  useEffect(() => {
    if (teamid !== null);

    setIsOpenclosed(false);
  }, [teamid]);

  return (
    <div>
      <DialogComponent
        maxWidth='sm'
        titleText={t(`${translationPath}choose`)}
        dialogContent={(
          <div>
            {userTeamList &&
              userTeamList.map((List) => (
                <div>
                  <div className='item-dashboard'>
                    <div>
                      <Button
                        className='MuiButtonBase-root btns theme-solid mb-2 muiButton '
                        type='button'
                        disabled={List.teamsId === teamid}
                        onClick={() => {
                          setTeamid(List.teamsId);
                        }}
                      >
                        <span className='MuiButton-label'>
                          <span className='mx-2'>
                            {' '}
                            {List.teamName}
                          </span>
                        </span>
                        <span className='MuiTouchRipple-root' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        onCloseClicked={() => setIsOpenclosed(false)}
        isOpen={isOpenclosed}
      />
      {userTeamListlength > 1 ? (
        <div className='btnnChoose'>
          <Button
            className='MuiButtonBase-root btns theme-solid mb-2 muiButton '
            type='button'
            onClick={() => setIsOpenclosed(true)}
          >
            <span className='MuiButton-label'>
              <span className='mx-2'>{t(`${translationPath}choose`)}</span>

              <span className='MuiTouchRipple-root' />
            </span>
            <span className='MuiTouchRipple-root' />
          </Button>
        </div>
      ) : null}
      {/* <div className="bttnrefresh">
        <Button
          onClick={() =>
            GenerateTokenReport(
              PowerBiEnum.teamleadToken.reportid,
              PowerBiEnum.teamleadToken.groupid
            )
          }
        >
          <span className=" mdi mdi-refresh mdi-24px "></span>
        </Button>
      </div> */}
      <div className='dashboardMain-PowerBIEmbed'>
        {render && (
        <div className='dashboardMain'>
          <PowerBIEmbed
            embedConfig={{
            type: 'report',
            id: PowerBiEnum.leasingToken.reportid,
            embedUrl:
            PowerBiEnum.leasingToken.url,
            accessToken: reporttoken,
            tokenType: models.TokenType.Embed,
            filters: [Filter],
            settings: {
              customLayout: {
                displayOption: models.DisplayOption.FitToWidth,
              },
              filterPaneEnabled: false,
              navContentPaneEnabled: false,
              panes: {
                filters: {
                  expanded: false,
                  visible: false,
                },
              },
              background: models.BackgroundType.Transparent,
            },
          }}
            eventHandlers={
            new Map([
              [
                'loaded',
                () => {
                  console.log('Report loaded');
                },
              ],
              [
                'rendered',
                () => {
                  console.log('Report rendered');
                },
              ],
              [
                'error',
                (event, embed) => {
                  const error = event.detail;

                  if (error.message === 'TokenExpired') {
                       RefreshToken();
                       setRender(false);
                       setTimeout(() => {
                        GenerateTokenReport(
                          PowerBiEnum.leasingToken.reportid,
                          PowerBiEnum.leasingToken.groupid
                        );
                       }, 1000);
                  } else

                      showError(error.detailedMessage);
                },
              ],
            ])
          }
            cssClassName='report-style-class'
            getEmbeddedComponent={(embeddedReport) => {
            window.report = embeddedReport;
          }}
          />
        </div>
) }
      </div>
    </div>
  );
};
