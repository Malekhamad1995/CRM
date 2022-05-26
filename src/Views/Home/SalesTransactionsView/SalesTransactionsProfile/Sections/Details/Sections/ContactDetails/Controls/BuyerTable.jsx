import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tables } from '../../../../../../../../../Components';

export const BuyerTable = ({
 buyers, filter, parentTranslationPath, translationPath
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='buyer-table-wrapper presentational-wrapper mb-3'>
      <div className='title-section mb-2'>
        <span>{t(`${translationPath}contact-list-buyer`)}</span>
      </div>
      <Tables
        bodyRowId='bodyRowBuyer'
        data={buyers}
        headerData={[
          {
            id: 1,
            isSortable: true,
            label: 'contact-id',
            input: 'contactId',
          },
          {
            id: 2,
            isSortable: true,
            label: 'contact-name',
            input: 'contactName',
          },
          // {
          //   id: 3,
          //   isSortable: true,
          //   label: 'email',
          //   input: 'email',
          // },
          // {
          //   id: 4,
          //   isSortable: true,
          //   label: 'phone',
          //   input: 'phone',
          // },
          {
            id: 5,
            isSortable: true,
            label: 'lead-id',
            input: 'leadId',
          },
          {
            id: 6,
            isSortable: true,
            label: 'media-name',
            input: 'contactMedia',
          },
        ]}
        defaultActions={[]}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        totalItems={buyers.length}
      />
    </div>
  );
};

BuyerTable.propTypes = {
  buyers: PropTypes.instanceOf(Array).isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
