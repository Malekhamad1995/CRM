import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, Button
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import GenricStpeper from '../../../../Components/OLD/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';
import { PROPERTIES, UNITS } from '../../../../config/pagesName';
import { SelectComponet } from '../../../../Components';

const translationPath = 'dialogs.contactsDialog.';
export const ContactsDialog = ({
  open, onSave, closeDialog, isViewContact
}) => {
  const { t } = useTranslation('FormBuilder');
  const [activeFormType, setActiveFormType] = useState(null);
  const [id, setId] = useState(null);
  const [pageName, setPageName] = useState(null);

  useEffect(() => {
    if (open) {
      const obj = JSON.parse(localStorage.getItem('current'));
      setActiveFormType(obj.type || 1);

      setId(obj.id);
      setPageName(obj.itemId.toLowerCase());
    }
  }, [open]);

  const onFormTypeSelectChanged = (activeValue) => {
    setActiveFormType(null);
    setTimeout(() => {
      setActiveFormType(activeValue);
    });
  };

  return (
    <Dialog className='dialog' open={open} maxWidth='lg'>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
          closeDialog();
        }}
      >
        <DialogTitle>
          <>
            <Button
              className='btns-icon theme-solid dialog-btn-close'
              onClick={() => {
                setActiveFormType(null);
                closeDialog();
              }}
            >
              <span className='mdi mdi-close' />
            </Button>
            {!isViewContact ? t(`${translationPath}add-new-${pageName}`) : t(`${translationPath}view-${pageName}`)}

          </>
        </DialogTitle>
        <DialogContent>
          {!id && pageName !== PROPERTIES && pageName !== UNITS && (
            <SelectComponet
              data={[
                { id: '1', name: `${pageName}-option1` },
                { id: '2', name: `${pageName}-option2` },
              ]}
              defaultValue={-1}
              emptyItem={{ value: -1, text: `select-${pageName}-type`, isHiddenOnOpen: true }}
              valueInput='id'
              parentTranslationPath='FormBuilder'
              translationPath={translationPath}
              onSelectChanged={onFormTypeSelectChanged}
              wrapperClasses='bg-secondary c-white mx-2'
              themeClass='theme-action-buttons'
              idRef='contactsActionsRef'
              keyValue='actionsbuttons'
              keyLoopBy='id'
              translationPathForData={translationPath}
              textInput='name'
            />
          )}
          {activeFormType && pageName && (
            <div className='view-wrapper pt-3'>
              <div className='d-flex-column'>
                <GenricStpeper
                  pageName={pageName}
                  id={(id && +id) || undefined}
                  type={activeFormType.toString()}
                  closeDialog={closeDialog}
                  withTotal
                  isDialog
                  setActiveFormType={setActiveFormType}
                />
              </div>
            </div>
          )}
        </DialogContent>

        {/* <DialogActions>
          <Button
            className="btns theme-solid bg-cancel"
            onClick={() => {
              closeDialog();
            }}
          >
            {t('shared.cancel')}
          </Button>
          <Button className="btns theme-solid" type="submit">
            {t('shared.save')}
          </Button>
        </DialogActions> */}
      </form>
    </Dialog>
  );
};

ContactsDialog.propTypes = {
  open: PropTypes.bool,
  onSave: PropTypes.func,
  closeDialog: PropTypes.func,
  isViewContact: PropTypes.bool,
};
ContactsDialog.defaultProps = {
  open: false,
  onSave: () => { },
  closeDialog: () => { },
  isViewContact: false
};
