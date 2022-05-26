
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GetParams } from '../../../../../../Helper';
import {
    GetRotationSchemeByIdServices,
} from '../../../../../../Services/RotaionSchemaService/RotationSchemaService';
import {
    Spinner,
    AutocompleteComponent,
    Inputs
} from '../../../../../../Components';
import '../../Styles/RotationSchemaViewDetails.Style.scss'
import { AgentRotationRangeTypeEnum } from '../../../../../../Enums'

export const RotationSchemaViewDetails = () => {
    const parentTranslationPath = 'Agents';
    const { t } = useTranslation(parentTranslationPath);
    const [loading, setLoading] = useState(false);
    const [schemaDetails, setSchemaDetails] = useState();
    const rangesId = [
        AgentRotationRangeTypeEnum.PriceRange.key,
        AgentRotationRangeTypeEnum.Bedroom.key,
        AgentRotationRangeTypeEnum.Size.key,
        AgentRotationRangeTypeEnum.Bathroom.key,
    ];
    const rangesname = [
        AgentRotationRangeTypeEnum.PriceRange.value,
        AgentRotationRangeTypeEnum.Bedroom.value,
        AgentRotationRangeTypeEnum.Size.value,
        AgentRotationRangeTypeEnum.Bathroom.value,
    ];
    const GetRotationSchemeById = useCallback(async () => {
        setLoading(true);
        const responce = await GetRotationSchemeByIdServices(GetParams('id'));
        if (!(responce && responce.status && responce.status !== 200)) {
            setSchemaDetails(responce);
        }
        else
            setSchemaDetails([]);
        setLoading(false);
    }, []);

    useEffect(() => {
        GetRotationSchemeById();
    }, [GetRotationSchemeById]);

    useEffect(() => {
    }, [schemaDetails]);

    return (
        <>
            <div className='rotation-detail-wrapper'>
                <Spinner isActive={loading} />
                <span class="title-text"><h1>{t(`rotation-schema-details`)} : <span className='title-text'>{schemaDetails && schemaDetails.label}</span></h1></span>
                <div className='details-sec'>
                    <div className='col1'>
                        <div>
                            <span className='detail-title'>{t(`languages`)}</span>
                            <AutocompleteComponent
                                idRef={`${schemaDetails && schemaDetails.languages}Ref`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.languages || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`countries`)}</span>
                            <AutocompleteComponent
                                idRef={`countriesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.countries || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`cities`)}</span>
                            <AutocompleteComponent
                                idRef={`citiesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.cities || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`districts`)}</span>
                            <AutocompleteComponent
                                idRef={`districtsRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.districts || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`communities`)}</span>
                            <AutocompleteComponent
                                idRef={`communitiesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.communities || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`subCommunities`)}</span>
                            <AutocompleteComponent
                                idRef={`subCommunitiesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.subCommunities || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`unitTypes`)}</span>
                            <AutocompleteComponent
                                idRef={`unitTypesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.unitTypes || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                    </div>
                    <div className='col2'>
                        <div>
                            <span className='detail-title'>{t(`leadsType`)}</span>
                            <AutocompleteComponent
                                idRef={`leadsTypeRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.leadsType || ''}
                                chipsLabel={(option) => option.leadClass || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`methodOfContacts`)}</span>
                            <AutocompleteComponent
                                idRef={`methodOfContactsRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.methodOfContact || ''}
                                chipsLabel={(option) => option.methodOfContactName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`leadClasses`)}</span>
                            <AutocompleteComponent
                                idRef={`leadClassesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.leadClasses || ''}
                                chipsLabel={(option) => option.lookupItemName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`medias`)}</span>
                            <AutocompleteComponent
                                idRef={`mediasRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.medias || ''}
                                chipsLabel={(option) => option.mediaDetails || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`developers`)}</span>
                            <AutocompleteComponent
                                idRef={`developersRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.developers || ''}
                                chipsLabel={(option) => option.developerName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`properties`)}</span>
                            <AutocompleteComponent
                                idRef={`propertiesRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.properties || ''}
                                chipsLabel={(option) => option.propertyName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                        <div>
                            <span className='detail-title'>{t(`referredBys`)}</span>
                            <AutocompleteComponent
                                idRef={`referredBysRef`}
                                data={[]}
                                isDisabled={true}
                                withoutSearchButton
                                selectedValues={schemaDetails && schemaDetails.referredBys || ''}
                                chipsLabel={(option) => option.fullName || ''}
                                dropdownIcon=''
                                hideDeleteMark={false}
                            />
                        </div>
                    </div>
                    <div className='col3'>
                        {schemaDetails && rangesId.map((id, index) => {
                            let range = schemaDetails && schemaDetails.rotationSchemeRanges.find((item) => item.agentRotationRangeTypeId === id);
                            return (
                                <>
                                    <span className='detail-title'>{t(`${rangesname[index]}`)} </span>
                                    <div>
                                        {range && (<Inputs
                                            idRef={`priceRangeRef`}
                                            fieldClasses='inputs-ranges'
                                            value={`${range && range.startValue || 0} - ${range && range.endValue || 0}`}
                                            isDisabled={true}
                                        />) || <Inputs
                                                idRef={`priceRangeRef`}
                                                fieldClasses='inputs-ranges'
                                                value={''}
                                                isDisabled={true}
                                            />}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
