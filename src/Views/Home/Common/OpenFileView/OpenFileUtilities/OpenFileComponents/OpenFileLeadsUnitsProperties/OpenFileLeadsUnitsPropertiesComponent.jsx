import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Spinner, Tables } from '../../../../../../../Components';
import { leadUnitOrPropertyGet } from '../../../../../../../Services';

export const OpenFileLeadsUnitsPropertiesComponent = ({ activeItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detailsLeadsUnitsPropertiesList, setDetailsLeadsUnitsPropertiesList] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const activePageChanged = useCallback((event, newPage) => {
    setActivePageIndex(newPage);
  }, []);
  const itemsPerPageChanged = useCallback((event, newItemsPerPage) => {
    setItemsPerPage(+newItemsPerPage.key);
    setActivePageIndex(0);
  }, []);
  const getLeadsUnitsAndProperties = useCallback(async () => {
    setIsLoading(true);
    const response = await leadUnitOrPropertyGet({ leadId: activeItem.id });
    if (response && response.length > 0) {
      const displayData = response.map((item) => {
        const dataParse = JSON.parse(item.data);
        if (dataParse.unit_type_id) {
          return {
            name: dataParse.property_name ? dataParse.property_name.name : '',
            type: dataParse.unit_type ? dataParse.unit_type.lookupItemName : '',
            creationDate: dataParse.creationDate,
            progress:
              (typeof dataParse.data_completed === 'number' && `${dataParse.data_completed}%`)
              || dataParse.data_completed,
          };
        }
        return {
          name: dataParse.property_name,
          type: dataParse.property_type ? dataParse.property_type.lookupItemName : '',
          creationDate: dataParse.creationDate,
          progress:
            (typeof dataParse.data_completed === 'number' && `${dataParse.data_completed}%`)
            || dataParse.data_completed,
        };
      });
      setDetailsLeadsUnitsPropertiesList(displayData);
    } else setDetailsLeadsUnitsPropertiesList([]);
    setIsLoading(false);
  }, [activeItem.id]);
  useEffect(() => {
    if (activeItem && activeItem.id) getLeadsUnitsAndProperties();
  }, [activeItem, getLeadsUnitsAndProperties]);
  return (
    <div className="open-file-leads-units-properties view-wrapper pt-3">
      <Spinner isActive={isLoading} isAbsolute />
      <div className="w-100 px-3">
        <Tables
          data={detailsLeadsUnitsPropertiesList}
          headerData={[
            { id: 1, label: 'name', input: 'name' },
            { id: 2, label: 'type', input: 'type' },
            {
              id: 3,
              label: 'creation',
              input: 'creationDate',
              isDate: true,
            },
            { id: 4, label: 'progress', input: 'progress' },
          ]}
          activePageChanged={activePageChanged}
          itemsPerPageChanged={itemsPerPageChanged}
          itemsPerPage={itemsPerPage}
          activePage={activePageIndex}
          totalItems={detailsLeadsUnitsPropertiesList.length}
        />
      </div>
    </div>
  );
};

OpenFileLeadsUnitsPropertiesComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
