import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Transition from 'react-transition-group/Transition';
import DfmDetailsDrawer from '.';
import switchTabId from '../../../utils/switchTabId';
import { LEAD_LEAD_TAB, PROPERTY_PROPERTY_TAB, UNIT_UNIT_TAB } from '../../../config/dfmDetails';

const DfmAddEditAndDeleteDialog = ({
  open, setOpen, data, title,
}) => (
  <div className="DfmDetails">
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted={false}
      onClose={() => {
      setOpen(false);
    }}
      maxWidth="lg"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>

        {data && data.lead_id && data.lead && switchTabId(LEAD_LEAD_TAB, data.lead.lead_type_id, data.lead_id)}
        {data && data.unit_id && data.unit && switchTabId(UNIT_UNIT_TAB, data.unit.unit_type_id, data.unit_id)}
        {data && data.type && data.type === 'property' && switchTabId(PROPERTY_PROPERTY_TAB, data.data.property_type_id, data.id)}
        {data && data.type && data.type === 'unit' && switchTabId(UNIT_UNIT_TAB, data.data.unit_type_id, data.id)}


      </DialogContent>
    </Dialog>
  </div>
);
export default DfmAddEditAndDeleteDialog;
