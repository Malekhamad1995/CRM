import React, { useEffect, useState } from 'react';
import Alert from '../../dfmAddEditAndDelete/Alert';
import DfmAddEditAndDeleteDialog from '../DfmDetailsDrawer/DfmDetailsDrawerDialog';
import {
 CONTACTS, LEADS, PROPERTIES, UNITS
} from '../../../config/pagesName';
import { LeadDetailsList } from './List/LeadList';
import { UnitOrPropertyDetailsList } from './List/UnitOrPropertyDetailsList';
import { UnitDetailsList } from './List/UnitDetailsList';

const Index = ({ action, tabId }) => {
  const [list, setList] = useState([]);
  const [emptyMsg, setEmptyMsg] = useState(null);
  const [dialogData, setDialogData] = useState({
    open: false,
    formAction: null,
    data: null,
    title: null,
  });
  const fetchData = async () => {
    try {
      let results = await action();
      results = results.map((item) => {
        if (item.lead) item.lead = JSON.parse(item.lead);
        else if (item.data) item.data = JSON.parse(item.data);
        else if (item.unit) item.unit = JSON.parse(item.unit);
        return item;
      });
      setList(results);
    } catch (e) {
      setEmptyMsg(`${e.message ? e.message : e}`);
    }
  };
  useEffect(() => {
    fetchData();
  }, [action]);
  const getFormName = (itemTab, type) => {
    switch (itemTab || tabId) {
      case CONTACTS:
        return type.toString() === '1' ? 'contacts' : 'company';
      case PROPERTIES:
        return 'property';
      case UNITS:
      case 'unit':
        return type.toString() === '1' ? 'Sale Unit' : 'Rent Unit';
      case LEADS:
        return type.toString() === '1' ? 'Owner Lead' : 'Seeker Lead';
      default:
        return itemTab;
    }
  };

  const extractType = (item) => {
    if (item && item.lead && item.lead.contact_name && item.lead.contact_name.type)
      return item.lead.contact_name.type;

    if (item && item.data && item.data.property_owner && item.data.property_owner.type)
      return item.data.property_owner.type;

    if (item && item.unit && item.unit.owner && item.unit.owner.type) return item.unit.owner.type;

    if (item && item.unit && item.unit.property_name) return '2';

    return '';
  };

  const extractName = (item) => {
    if (item && item.lead && item.lead.contact_name && item.lead.contact_name.name)
      return item.lead.contact_name.name;

    if (item && item.data && item.data.property_owner && item.data.property_owner.name)
      return item.data.property_owner.name;

    if (item && item.unit && item.unit.owner && item.unit.owner.name) return item.unit.owner.name;

    if (item && item.unit && item.unit.property_name && item.unit.property_name.name)
      return item.unit.property_name.name;

    return '';
  };

  const extracactUnitOrPropartyName = (item) => {
    if (item && item.type && item.type === 'property') return item.data.property_name;

    if (item && item.type && item.type === 'unit') return `Unit Number : ${item.data.unit_number}`;

    return '';
  };

  const extractUnitNumbertName = (item) => {
    if (item && item.unit && item.unit.unit_number) return `Unit Number : ${item.unit.unit_number}`;

    return '';
  };

  return (
    <div className="h-80vh bg-white">
      <DfmAddEditAndDeleteDialog
        open={dialogData.open}
        setOpen={(state) => setDialogData({ ...dialogData, open: state })}
        data={dialogData.data}
        title={dialogData.title}
        tabId={tabId}
      />

      {list && Array.isArray(list) && list[0] && list[0].lead_id && list[0].lead && (
        <LeadDetailsList
          response={list}
          onActionClick={(item) => {
            setDialogData({
              ...dialogData,
              open: true,
              data: item,
              title: extractName(item),
            });
          }}
        />
      )}

      {list && Array.isArray(list) && list[0] && list[0].unit_id && list[0].unit && (
        <UnitDetailsList
          response={list}
          onActionClick={(item) => {
            setDialogData({
              ...dialogData,
              open: true,
              data: item,
              title: extractUnitNumbertName(item),
            });
          }}
        />
      )}

      {list
        && Array.isArray(list)
        && list[0]
        && (list[0].type === 'property' || list[0].type === 'unit') && (
          <UnitOrPropertyDetailsList
            response={list}
            onActionClick={(item) => {
              setDialogData({
                ...dialogData,
                open: true,
                data: item,
                title: extracactUnitOrPropartyName(item),
              });
            }}
          />
        )}

      {(emptyMsg !== '' || list.length > 0) && <Alert msg={emptyMsg} />}
    </div>
  );
};
export default Index;
