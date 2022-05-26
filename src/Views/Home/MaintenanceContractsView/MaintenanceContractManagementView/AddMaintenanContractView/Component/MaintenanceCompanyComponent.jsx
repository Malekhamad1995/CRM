import React, { useCallback, useEffect, useState } from 'react'; // useRef, useEffect, useCallback   useState,
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAdvanceSearchContacts } from '../../../../../../Services';
import Lookups from '../../../../../../assets/json/StaticLookupsIds.json';
import { TableFilterOperatorsEnum } from '../../../../../../Enums';

export const MaintenanceCompanyComponent = ({
  parentTranslationPath,
  translationPath,
  contactId,
  setcontactId,
  selected,
  setSelected,
  helperText,
  isSubmitted,
  error,
}) => {
  const [MaintenanceCompanyData, setMaintenanceCompany] = useState([]);
  const [loadings, setLoadings] = useState(false);
  const [filter] = useState({
    pageSize: 55,
    pageIndex: 0,
    search: '',
  });
  const getAllWorkAssignTo = useCallback(async () => {
    setLoadings(true);
    const res = await GetAdvanceSearchContacts(filter, {
      criteria: {
        'contact_classifications.lookupItemId': [
          { searchType: TableFilterOperatorsEnum.equal.key, value: Lookups.MaintenanceCompany },
        ],
      },
    });
    if (!(res && res.status && res.status !== 200)) {
      setMaintenanceCompany(
        res.result.map((item) => ({
          id: item.contactsId,
          company_name: item.contact.company_name,
          first_name: item.contact.first_name,
          last_name: item.contact.last_name,
        }))
      );
    } else setMaintenanceCompany([]);
    setLoadings(false);
  }, [filter]);
  useEffect(() => {
    getAllWorkAssignTo('');
  }, [getAllWorkAssignTo]);
  useEffect(() => {
    if (contactId && !selected.MaintenanceCompany && MaintenanceCompanyData.length > 0) {
      const maintenanceCompanyIndex = MaintenanceCompanyData.findIndex(
        (item) => item.id === contactId
      );
      if (maintenanceCompanyIndex !== -1)
        setSelected(MaintenanceCompanyData[maintenanceCompanyIndex]);
      else setcontactId(null);
    }
  }, [MaintenanceCompanyData, contactId, selected.MaintenanceCompany, setSelected, setcontactId]);

  return (
    <div>
      <AutocompleteComponent
        idRef='MaintenanceCompanyRef'
        labelValue='MaintenanceCompany'
        selectedValues={selected.MaintenanceCompany}
        multiple={false}
        data={MaintenanceCompanyData}
        displayLabel={(option) =>
          option.contactName ||
          option.company_name ||
          `${option.first_name} ${option.last_name}` ||
          ''}
        getOptionSelected={(option) => option.id === selected.MaintenanceCompany.contactId}
        withoutSearchButton
        helperText={helperText}
        isSubmitted={isSubmitted}
        error={error}
        isWithError
        isLoading={loadings}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setSelected(newValue && newValue);
          setcontactId((newValue && +newValue.id) || '');
        }}
      />
    </div>
  );
};
MaintenanceCompanyComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setcontactId: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.string.isRequired,
};
MaintenanceCompanyComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  contactId: PropTypes.number,
  setcontactId: PropTypes.string.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  setSelected: PropTypes.string.isRequired,
};
MaintenanceCompanyComponent.defaultProps = {
  contactId: null,
};
