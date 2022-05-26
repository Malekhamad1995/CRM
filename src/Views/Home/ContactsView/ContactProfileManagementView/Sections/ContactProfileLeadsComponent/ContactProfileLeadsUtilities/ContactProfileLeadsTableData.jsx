import React from 'react';
import { SwitchComponent } from '../../../../../../../Components';

export const ContactProfileLeadsTableData = (
  onChangeStatusHandler,
  parentTranslationPath,
  translationPath
) => [
    { id: 1, label: 'name', input: 'name' },
    {
      id: 2,
      label: 'matches',
      component: (item) => (
        <span className='c-primary'>{`${item.matchingUnitsNumber} Matches`}</span>
      ),
    },
    {
      id: 3,
      label: 'activities',
      component: (item) => (
        <span className='c-primary'>{`${item.numberOfActivities} Activities`}</span>
      ),
    },
    {
      id: 4,
      label: 'lead-no',
      input: 'id',
    },
    {
      id: 5,
      label: 'lead-type',
      input: 'leadClass',
    },
    {
      id: 6,
      label: 'unit-type',
      component: (item) =>
    ((item.leadClass === 'Seller' || 'Landlord') &&
      (
        <span>
          {item.ownerUnitType ? item.ownerUnitType : (item.unitType && item.unitType.length > 0  &&
          item.unitType.map((el) => (
            <span>{( el && el.lookupItemName) ? el.lookupItemName : (el ||  '')}</span>
          ))
          )}

        </span>
      )) ||
      <span />,
    },
    {
      id: 7,
      label: 'status',
      component: (item, index) => (
        <SwitchComponent
          idRef={`switchRef${index + 1}`}
          isChecked={item.status.lookupItemName.toLowerCase() === 'open'}
          labelClasses='px-0'
          themeClass='theme-line'
          labelValue={(item.status.lookupItemName.toLowerCase() === 'open' && 'open') || 'closed'}
          onChangeHandler={onChangeStatusHandler(item)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      ),
    },

    {
      id: 8,
      label: 'date',
      input: 'creationDate',
    },
    {
      id: 9,
      label: 'assigned-to',
      input: 'referredto.name',
    },
  ];
