import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetAdvanceSearchProperties,} from '../../../../../../../Services';
import { AutocompleteComponent } from '../../../../../../../Components';
export const PropertyComponent = ({
                                       parentTranslationPath,
                                       translationPath,
                                       onStateChanged,
                                       state,
                                   }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [properties, setProperties] = useState([]);
    const [value, setValue] = useState("");
    const [timer, setTimer] = useState("");
    const [filter, setFilter] = useState({
        criteria: {}
    });
    const GetAllProperties = useCallback(async () => {
        const res = await GetAdvanceSearchProperties({ pageIndex: 0, pageSize: 25 },filter);
        if (!(res && res.status && res.status !== 200)) {
            const mapped = [];
            res.result.map((item) => {
                mapped.push({
                    propertyId: item.propertyId,
                    propertyName: item.property && item.property.property_name
                });
            });
            setProperties(mapped || []);
        }
        // else setLookups([]);
    }, []);
    useEffect(() => {
        GetAllProperties();
    }, [filter]);

    return (
        <>
            <div className='dialog-content-item'>
                <AutocompleteComponent
                    idRef='PropertiesIdRef'
                    labelValue={t(`${translationPath}Properties`)}
                    selectedValues={state.rotationSchemeProperties}
                    withLoader={true}
                    data={properties || []}
                    multiple={true}
                    displayLabel={(option) => (option && option.propertyName) || ''}
                    chipsLabel={(option) => (option && option.propertyName) || ''}
                    withoutSearchButton
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onChange={(event, newValue) => {

                        const localNewValue = {
                            id: 'rotationSchemeProperties',
                            value: [
                                ...newValue,
                            ],
                        };
                        onStateChanged(localNewValue);

                    }}
                    filterOptions={(options) => {
                        const isFind = (id) => state.rotationSchemeProperties.findIndex(w => w.propertyId === id) === -1;
                        return options.filter(w => isFind(w.propertyId));
                    }}
                    textValue={value}
                    onInputChange={(e) => {
                        setValue(e.target.value);
                    }}
                    onTextKeyDown={() => {

                        if (timer) {
                            clearTimeout(timer);
                        }
                    }}
                    onTextKeyUp={() => {
                        const t = setTimeout(() => {
                            if (value) {

                                let criterias = filter.criteria;
                                criterias["property_name"] = [];
                                criterias["property_name"].push({ searchType: 2, value: value });
                                setFilter({ ...filter, criteria: criterias });

                            } else {
                                let criterias = filter.criteria;
                                criterias["property_name"] = [];
                                criterias["property_name"].push({ searchType: 2, value: "" });
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
