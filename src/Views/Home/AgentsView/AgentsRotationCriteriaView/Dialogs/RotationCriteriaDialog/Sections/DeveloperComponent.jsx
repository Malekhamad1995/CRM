import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { GetAdvanceSearchContacts } from '../../../../../../../Services';
import { AutocompleteComponent } from '../../../../../../../Components';
import { ContactClassificationsEnum } from '../../../../../../../Enums/ContactClassifications.Enum';

export const DeveloperComponent = ({
    parentTranslationPath,
    translationPath,
    onStateChanged,
    state,
}) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [contacts, setContacts] = useState([]);
    const [value, setValue] = useState('');
    const [timer, setTimer] = useState('');
    const [filter, setFilter] = useState({
        criteria: {
            'contact_classifications.lookupItemId': [{ searchType: 1, value: ContactClassificationsEnum.Developer.key }]
        },
    });

    const GetAllContact = useCallback(async () => {
        const res = await GetAdvanceSearchContacts({ pageIndex: 0, pageSize: 25 }, filter);
        if (!(res && res.status && res.status !== 200)) {
            const mapped = [];
            res.result.map((item) => {
                mapped.push({
                    developerId: item.contactsId,
                    developerName: item.contact && item.contact.company_name ? item.contact.company_name : `${item.contact.first_name} ${item.contact.last_name}`
                });
            });
            setContacts(mapped || []);
        }
        // else setLookups([]);
    }, []);
    useEffect(() => {
        GetAllContact();
    }, [filter]);

    return (
      <>
        <div className='dialog-content-item'>
          <AutocompleteComponent
            idRef='developerIdRef'
            labelValue={t(`${translationPath}developer`)}
            selectedValues={state.rotationSchemaDeveloperIds}
            withLoader
            data={contacts || []}
            multiple
            displayLabel={(option) => (option && option.developerName) || ''}
            chipsLabel={(option) => (option && option.developerName) || ''}
            withoutSearchButton
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
                        const localNewValue = {
                            id: 'rotationSchemaDeveloperIds',
                            value: [
                                ...newValue,
                            ],
                        };
                        onStateChanged(localNewValue);
                    }}
            filterOptions={(options) => {
                        const isFind = (id) => state.rotationSchemaDeveloperIds.findIndex((w) => w.developerId === id) === -1;
                        return options.filter((w) => isFind(w.developerId));
                    }}
            textValue={value}
            onInputChange={(e) => {
                        setValue(e.target.value);
                    }}
            onTextKeyDown={() => {
                        if (timer)
                            clearTimeout(timer);
                    }}
            onTextKeyUp={() => {
                        const t = setTimeout(() => {
                            if (value) {
                                const criterias = filter.criteria;
                                criterias.company_name = [];
                                criterias.company_name.push({ searchType: 2, value });
                                setFilter({ ...filter, criteria: criterias });
                            } else {
                                const criterias = filter.criteria;
                                criterias.company_name = [];
                                criterias.company_name.push({ searchType: 2, value: '' });
                                setFilter({ ...filter, criteria: criterias });
                            }
                        }, 1000);
                        setTimer(t);
                    }}
          />
        </div>
      </>
    );
};
const convertJsonValueShape = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.number,
    PropTypes.array,
    PropTypes.array,
    PropTypes.array,
]);
DeveloperComponent.propTypes = {
    parentTranslationPath: PropTypes.string.isRequired,
    state: PropTypes.objectOf(convertJsonValueShape).isRequired,
    translationPath: PropTypes.string.isRequired,
    onStateChanged: PropTypes.func.isRequired,
};
