import React from 'react';

import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import {
 DialogComponent
} from '../../../../../../Components';

const parentTranslationPath = 'UnitsStatusManagementView';
const translationPath = '';

export const DisplyLeadIdDialog = ({
  open,
  close,
  leadData

}) => {
    const { t } = useTranslation(parentTranslationPath);
  return (
    <div>
      <DialogComponent
        titleText={t(`${translationPath}DisplyLeadId`)}
        maxWidth='sm'
        saveType='button'
        dialogContent={(
          <div className=''>
            <div>
              <div className='sale-Lease-assigned-lead'>
                <div className='center'>
                  {t(`${translationPath}leadCreatedSuccessfully-leadId`)}
                  :

                  {' '}
                  {leadData && leadData.leadId}
                </div>

              </div>
            </div>
          </div>

            )}
        isOpen={open}
        onCloseClicked={close}
        onCancelClicked={close}
        onSaveClicked={close}
      />
    </div>
  );
};
DisplyLeadIdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
   leadData: (PropTypes.instanceOf(Object)).isRequired,
};
