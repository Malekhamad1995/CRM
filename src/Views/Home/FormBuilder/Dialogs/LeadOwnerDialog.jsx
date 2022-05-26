import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
 Spinner, DialogComponent
} from '../../../../Components';

export const LeadOwnerDialog = ({
  open,
  close,
  onSave
}) => {
    const { t } = useTranslation(['FormBuilder', 'Shared']);
    const [isLoading, setIsLoading] = useState(false);

    // const saveHandler = async () => {
    //     setIsLoading(true);
    //     const leadObj = { ...leadData, referredto, lead_type_id: LeadTypeIdEnum.Seeker.leadTypeId };
    //     const leadJson = {
    //         leadJson: {
    //             lead: leadObj
    //         }
    //     };
    //    const res = await leadPost(leadJson);
    //     setIsLoading(false);
    //     if (!(res && res.status && res.status !== 200)) {
    //         setDisplyLead(res);
    //         setIsOpenDisplyLeadDialog(true);
    //        onSave();
    //     } else {
    //         setDisplyLead(null);
    //         setIsOpenDisplyLeadDialog(false);
    //     }
    //   };

    //   useEffect(() => {
    //       if (!isChecked)
    //       setReferredTo(null);
    //   }, [isChecked]);

  return (
    <div>
      <DialogComponent
        titleText='Delete Lead Owner'
        saveText='Confirm'
        saveType='button'
        disableBackdropClick
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />

            <span>{`${t('Are-you-sure-you-want-to-Delete-lead-Owner')}`}</span>
          </div>
              )}
        saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
        isOpen={open}
        onSaveClicked={onSave}
        onCloseClicked={close}
        onCancelClicked={close}
      />
    </div>
  );
};
LeadOwnerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
   onSave: PropTypes.func.isRequired,
};
