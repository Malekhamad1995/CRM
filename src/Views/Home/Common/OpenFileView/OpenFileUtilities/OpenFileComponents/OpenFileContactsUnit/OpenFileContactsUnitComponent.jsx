import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Tables, Spinner } from '../../../../../../../Components';
import { contactOwnerUnitsOrPropertiesGet } from '../../../../../../../Services';

export const OpenFileContactsUnitComponent = ({ activeItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detailsUnitsList, setDetailsUnitsList] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const activePageChanged = useCallback((event, newPage) => {
    setActivePageIndex(newPage);
  }, []);
  const itemsPerPageChanged = useCallback((event, newItemsPerPage) => {
    setItemsPerPage(+newItemsPerPage.key);
    setActivePageIndex(0);
  }, []);
  const getContactsUnit = useCallback(async () => {
    setIsLoading(true);
    const response = await contactOwnerUnitsOrPropertiesGet({ contactId: activeItem.id });
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
      setDetailsUnitsList(displayData);
    } else setDetailsUnitsList([]);
    setIsLoading(false);
  }, [activeItem.id]);
  useEffect(() => {
    if (activeItem && activeItem.id) getContactsUnit();
  }, [activeItem, getContactsUnit]);
  return (
    <div className="open-file-contacts-unit view-wrapper pt-3">
      <Spinner isActive={isLoading} isAbsolute />
      <div className="w-100 px-3">
        <Tables
          data={detailsUnitsList}
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
          totalItems={detailsUnitsList.length}
        />
      </div>
    </div>
  );
};

OpenFileContactsUnitComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
