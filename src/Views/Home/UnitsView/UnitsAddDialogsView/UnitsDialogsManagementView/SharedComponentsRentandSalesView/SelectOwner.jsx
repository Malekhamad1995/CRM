import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GetContacts } from '../../../../../../Services';
import { AutocompleteComponent } from '../../../../../../Components';

export const SelectOwner = ({
  parentTranslationPath,
  translationPath,
  setvalue,
  helperText,
  error,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath || '');
  const [res, setres] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const searchTimer = useRef(null);
  const ContactsAPI = useCallback(async (value) => {
    setisLoading(true);
    const results = await GetContacts({ pageIndex: 0, pageSize: 100, search: value });
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
        idRef='SelectOwnerRef'
        labelValue='SelectOwner'
        data={res}
        isLoading={isLoading}
        chipsLabel={(option) =>
          (option.contact &&
            (option.contact.first_name || option.contact.last_name) &&
            `${option.contact.first_name} ${option.contact.last_name}`) ||
          option.contact.company_name ||
          ''}
        displayLabel={(option) =>
          (option.contact &&
            (option.contact.first_name || option.contact.last_name) &&
            `${option.contact.first_name} ${option.contact.last_name}`) ||
          option.contact.company_name ||
          ''}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}SelectOwner`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        onInputKeyUp={(e) => searchHandler(e)}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setvalue(
            newValue &&
              newValue.map((option) => ({
                name:
                  (option.contact &&
                    (option.contact.first_name || option.contact.last_name) &&
                    `${option.contact.first_name} ${option.contact.last_name}`) ||
                  option.contact.company_name ||
                  '',
                id: option.contactsId,
                type: option.contact.contact_type_id,
              }))
          );
        }}
      />
    </div>
  );
};

SelectOwner.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};
