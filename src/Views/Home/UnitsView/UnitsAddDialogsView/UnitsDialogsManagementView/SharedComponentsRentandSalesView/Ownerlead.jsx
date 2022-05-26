import React, {
 useCallback, useEffect, useState, useRef
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetContacts } from '../../../../../../Services';
import { AutocompleteComponent } from '../../../../../../Components';

export const Ownerlead = ({
  parentTranslationPath,
  translationPath,
  setvalue,
  helperText,
  error,
  isSubmitted,
  operationType , 
}) => {
  const { t } = useTranslation(parentTranslationPath || '');
  const [res, setres] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const searchTimer = useRef(null);
  const ContactsAPI = useCallback(async (value) => {
    setisLoading(true);
    const results = await GetContacts({ pageIndex: 0, pageSize: 100, search: value , isAdvance:false });
    setres(results.result);
    setisLoading(false);
  }, []);
  useEffect(() => {
    ContactsAPI();
  }, [ContactsAPI]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      ContactsAPI(value);
    }, 700);
  };
  return (
    <div>
      <AutocompleteComponent
        idRef={operationType === 1 ?  'OwnerleadRef' : 'OwnerleaseLeadRef'}
        labelValue={operationType === 1 ? 'leadOwner' :  'leaseLeadOwner' }
        multiple={false}
        data={res || []}
        displayLabel={(option) =>
          (option.contact &&
            (option.contact.first_name || option.contact.last_name) &&
            `${option.contact.first_name} ${option.contact.last_name}`) ||
          option.contact.company_name ||
          ''}
        withoutSearchButton
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        onInputKeyUp={(e) => searchHandler(e)}
        isWithError
        isLoading={isLoading}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue(
            (newValue &&
              newValue && {
                id: +newValue.contactsId,
                name:
                  (newValue.contact &&
                    (newValue.contact.first_name || newValue.contact.last_name) &&
                    `${newValue.contact.first_name} ${newValue.contact.last_name}`) ||
                  newValue.contact.company_name ||
                  '',
                type: newValue.contact.contact_type_id,
              }) ||
              ''
          );
        }}
      />
    </div>
  );
};
Ownerlead.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  operationType : PropTypes.number.isRequired,
};
