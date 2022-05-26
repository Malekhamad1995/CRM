import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Tables, Spinner } from '../../../../../../../Components';
import { leadContactsGet } from '../../../../../../../Services';

export const OpenFileLeadsUnitsComponent = ({ activeItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detailsLeadsList, setDetailsLeadsList] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const activePageChanged = useCallback((event, newPage) => {
    setActivePageIndex(newPage);
  }, []);
  const itemsPerPageChanged = useCallback((event, newItemsPerPage) => {
    setItemsPerPage(+newItemsPerPage.key);
    setActivePageIndex(0);
  }, []);
  const getLeadsUnits = useCallback(async () => {
    setIsLoading(true);
    const response = await leadContactsGet({ contactId: activeItem.id });
    if (response && response.length > 0) {
      const displayData = response.map((item) => {
        const dataParse = JSON.parse(item.lead);
        return {
          name: dataParse.property_name ? dataParse.property_name.name : '',
          type: dataParse.lead_type ? dataParse.lead_type.lookupItemName : '',
          status: dataParse.status ? dataParse.status.lookupItemName : '',
          creationDate: dataParse.creationDate,
          progress:
            (typeof dataParse.data_completed === 'number' && `${dataParse.data_completed}%`)
            || dataParse.data_completed,
        };
      });
      setDetailsLeadsList(displayData);
    } else setDetailsLeadsList([]);
    setIsLoading(false);
  }, [activeItem.id]);
  useEffect(() => {
    if (activeItem && activeItem.id) getLeadsUnits();
  }, [activeItem, getLeadsUnits]);
  return (
    <div className="open-file-leads-units view-wrapper pt-3">
      <Spinner isActive={isLoading} isAbsolute />
      <div className="w-100 px-3">
        <Tables
          data={detailsLeadsList}
          headerData={[
            { id: 1, label: 'name', input: 'name' },
            { id: 2, label: 'type', input: 'type' },
            { id: 3, label: 'status', input: 'status' },
            {
              id: 4,
              label: 'creation',
              input: 'creationDate',
              isDate: true,
            },
            { id: 5, label: 'progress', input: 'progress' },
          ]}
          activePageChanged={activePageChanged}
          itemsPerPageChanged={itemsPerPageChanged}
          itemsPerPage={itemsPerPage}
          activePage={activePageIndex}
          totalItems={detailsLeadsList.length}
        />
      </div>
    </div>
  );
};

OpenFileLeadsUnitsComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
