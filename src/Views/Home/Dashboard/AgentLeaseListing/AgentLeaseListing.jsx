import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import './AgentLeaseListing.scss';
import { Button } from '@material-ui/core';
import {
  TokenReport,
  RefreshTokenPbi,
} from '../../../../Services/DashboardService';
import { PowerBiEnum } from '../../../../Enums';
import { showError } from '../../../../Helper';

export const AgentLeaseListing = () => {
  const [report, setReport] = useState();
  const [userid, setUserid] = useState(null);
  const [render, setRender] = useState(false);

  const Filter = {
    $schema: 'http://powerbi.com/product/schema#basic',
    target: {
      table: 'Users',
      column: 'UsersId',
    },
    operator: 'In',
    values: [userid],
    filterType: models.FilterType.BasicFilter,
    requireSingleSelection: true,
  };

  const GenerateTokenReport = async (groupid, reportid) => {
    const result = await TokenReport(groupid, reportid);
    setReport(result);
    setRender(true);
  };
  const RefreshToken = async () => {
    const result = await RefreshTokenPbi({
      reports: PowerBiEnum.leaselistingmanager.reportid,
      groups: PowerBiEnum.leaselistingmanager.groupid,
    });
    setReport(result);
  };
  useEffect(() => {
    GenerateTokenReport(
      PowerBiEnum.leaselistingmanager.reportid,
      PowerBiEnum.leaselistingmanager.groupid
    );
    setUserid(JSON.parse(localStorage.getItem('session')).userId || null);
  }, []);
  return (
    <div className='dashboardMain-PowerBIEmbed'>

      {render && (
      <div className='dashboardMain'>
        <PowerBIEmbed

          embedConfig={{
            type: 'report',
            id:  PowerBiEnum.leaselistingmanager.reportid,
            embedUrl:
            PowerBiEnum.leaselistingmanager.url,
            accessToken: report,
            pageView: 'fitToWidth',
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
                          PowerBiEnum.leaselistingmanager.reportid,
                          PowerBiEnum.leaselistingmanager.groupid
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
)}
    </div>
  );
};
