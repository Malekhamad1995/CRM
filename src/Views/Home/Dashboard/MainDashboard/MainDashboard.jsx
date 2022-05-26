import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import './MainDashboard.scss';
import { showError } from '../../../../Helper';
import { RefreshTokenPbi, TokenReport } from '../../../../Services';

export const MainDashboard = ({
    dynamicComponentProps
}) => {
console.log(dynamicComponentProps);

  const [report, setReport] = useState();
  const [render, setRender] = useState(false);
  const GenerateTokenReport = async (groupid, reportid) => {
    const result = await TokenReport(groupid, reportid);
    setReport(result);
    setRender(true);
  };

  const RefreshToken = async () => {
    const result = await RefreshTokenPbi({
      reports: dynamicComponentProps.config.reportId,
      groups: dynamicComponentProps.config.groupId,
    });
    setReport(result);
  };

  useEffect(() => {
    GenerateTokenReport(
      dynamicComponentProps.config.reportId,
      dynamicComponentProps.config.groupId
    );
  }, []);

//   const d = document.getElementById('pbiLoadingPlaceholder');
//   if (d !== null) {
//   const dested = document.getElementById('pbiLoadingPlaceholder');
//   if (dested !== null) {
//   const throwawayNode = d.removeChild(dested);
//   console.log('throwawayNode: ', throwawayNode);
//   }
// }

// console.log('x: ', x);
// x.getElementsByTagName('iframe')[0].parentNode.removeChild(x);

const d = document.querySelector('#pbi-svg-loading > div');
console.log('sssssssssssssd: ', d);

  return (
    <div className='dashboardMain-PowerBIEmbed' id='dashboardMain-PowerBIEmbed'>
      {render && (
      <div className='dashboardMain'>
        <PowerBIEmbed
          embedConfig={{
            type: 'report',
            id: dynamicComponentProps.config.reportId,
            embedUrl: dynamicComponentProps.config.Url,
            accessToken: report,
            tokenType: models.TokenType.Embed,
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
                  const xas = document.getElementById('ddashboardMain-PowerBIEmbed');
                  console.log('x:xas ', xas);
                },
              ],
              [
                'rendered',
                () => {
                  console.log('Report rendered');
                  const x = document.getElementsByClassName('dashboardMain-PowerBIEmbed');
                  console.log('x: ', x);
                },
              ],
              [
                'error',
                (event) => {
                  const error = event.detail;

                  if (error.message === 'TokenExpired') {
                       RefreshToken();
                       setRender(false);

                       setTimeout(() => {
                        GenerateTokenReport(
                            dynamicComponentProps.config.reportId,
                            dynamicComponentProps.config.groupId
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
