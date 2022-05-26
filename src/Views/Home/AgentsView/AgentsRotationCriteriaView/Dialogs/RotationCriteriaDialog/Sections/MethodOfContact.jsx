import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AutocompleteComponent, Spinner } from '../../../../../../../Components'
import { GetlookupTypeItems } from '../../../../../../../Services';
export const MethodOfContact = ({
    parentTranslationPath,
    translationPath,
    onStateChanged,
    state,
    isSubmitted,
    values,
    rotationEdit
}) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [methodsData, setMethodsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const getlookupTypeItems = useCallback(async () => {
        setLoading(true);
        setSelected(values);
        let res = await GetlookupTypeItems({ pageIndex: 0, pageSize: 25, lookupTypeId: 35 });
        if (!(res && res.status && res.status !== 200)) setMethodsData(res.result);
        else setMethodsData([]);
        setLoading(false);
    }, []);

    useEffect(() => {
        getlookupTypeItems();
    }, [getlookupTypeItems]);

    useEffect(() => {
        if (rotationEdit !== null && values && methodsData) {
                values.map((value) => {
                    let findItem = methodsData.find((el) => el.lookupItemId === value.methodOfContactId)
                    setSelected((item) => [...item, findItem]);
                })
            };
    }, [methodsData]);

    return (
        <div className='dialog-content-item'>
            <AutocompleteComponent
                idRef='methodOfContactsRef'
                labelValue={t(`${translationPath}methodOfContacts`)}
                value={state.rotationSchemaMethodOfContacts || []}
                data={methodsData || []}
                multiple
                displayLabel={(option) => (option && option.lookupItemName) || ''}
                chipsLabel={(option) => (option && option.lookupItemName) || ''}
                selectedValues={selected}
                withoutSearchButton
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                    const localNewValue = {
                        id: 'rotationSchemaMethodOfContacts',
                        value: [
                            ...newValue.map((el) => ({ ...el, methodOfContactId: el.lookupItemId })),
                        ],
                    };
                    onStateChanged(localNewValue);
                    setSelected(newValue)
                }}
                isSubmitted={isSubmitted}
                isLoading={loading}
            />
        </div>
    );
};

MethodOfContact.propTypes = {
    parentTranslationPath: PropTypes.string.isRequired,
    translationPath: PropTypes.string.isRequired,
    onStateChanged: PropTypes.func.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
    state: PropTypes.func.isRequired,
};
