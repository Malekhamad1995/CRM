import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Transition from '../../../common/Transition';
import {
  CONTACTS, LEADS, PROPERTIES, UNITS
} from '../../../config/pagesName';
import Add from './Add';

const DfmAddEditAndDeleteDialog = ({ open, setOpen }) => {
  const current = JSON.parse(localStorage.getItem('current'));
  const pageName = current.itemId.toLowerCase() === 'contact' ? CONTACTS :
    current.itemId.toLowerCase() === 'property' ? PROPERTIES :
      current.itemId.toLowerCase() === 'unit' ? UNITS :
        current.itemId.toLowerCase() === 'unit' ? LEADS : '';
  const data = { params: { pageName, type: current.type, id: current.id } };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        setOpen(false);
      }}
      maxWidth='lg'
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle id='alert-dialog-slide-title'>{current && current.itemId}</DialogTitle>
      <DialogContent>
        <Add
          match={data}
          closeDialog={() => setOpen(false)}
          isDialog
        />

      </DialogContent>
    </Dialog>
  );
};
export { DfmAddEditAndDeleteDialog };
