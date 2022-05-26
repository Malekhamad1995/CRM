import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tables, Spinner } from '../../../../../../../Components';
import { unitPropertiesGet } from '../../../../../../../Services';

export const OpenFilePropertiesUnitsComponent = ({ activeItem }) => {
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
  const getPropertiesUnits = useCallback(async () => {
    setIsLoading(true);
    const response = await unitPropertiesGet({ propertyId: activeItem.id });
    if (response && response.length > 0) {
      const displayData = response.map((item) => {
        const dataParse = JSON.parse(item.unit);
        return {
          name: dataParse.property_name ? dataParse.property_name.name : '',
          type: dataParse.unit_type ? dataParse.unit_type.lookupItemName : '',
          owner: dataParse.owner ? dataParse.owner.name : '',
          saleType: dataParse.sale_type ? dataParse.sale_type.lookupItemName : '',
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
    if (activeItem && activeItem.id) getPropertiesUnits();
  }, [activeItem, getPropertiesUnits]);
  return (
    <div className="open-file-properties-units view-wrapper pt-3">
      <Spinner isActive={isLoading} isAbsolute />
      <div className="w-100 px-3">
        <Tables
          data={detailsLeadsList}
          headerData={[
            { id: 1, label: 'name', input: 'name' },
            { id: 2, label: 'type', input: 'type' },
            { id: 3, label: 'sale-type', input: 'saleType' },
            { id: 4, label: 'owner', input: 'owner' },
            {
              id: 5,
              label: 'creation',
              input: 'creationDate',
              isDate: true,
            },
            { id: 6, label: 'progress', input: 'progress' },
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

OpenFilePropertiesUnitsComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
