
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityReport } from './ActivityReportDialogContantSections/ActivityReport';

const parentTranslationPath = 'Reports';
const translationPath = '';
export const ActivityReportDialogContant = () => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='dialog-content-wrapper'>
      <div className="'d-flex px-2">
        <span className='px-2 d-flex'>
          <div className='px-2 filter-title'>
            {t(`${translationPath}type`)}
          </div>
        </span>
      </div>
      <div className='d-flex px-2'>
        <ActivityReport
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};
