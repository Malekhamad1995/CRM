
import React, { useState, useCallback, useEffect } from 'react';
import { Tables, Inputs, Spinner, CheckboxesComponent } from '../../../../../../../Components';
import { ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import '../Styles/AddOwnersDialog.scss';
import { GetParams } from '../../../../../../../Helper';
import '../Styles/AddOwnersDialog.scss'
export const AddOwnersTable = ({
    data,
    onPageIndexChanged,
    onPageSizeChanged,
    translationPath,
    parentTranslationPath,
    t,
    filter,
    getIsEditingIndex,
    getEditValue,
    ownershipChangedHandler,
    saveOwnershipHandler,
    closeOwnershipHandler,
    editOwnershipHandler,
    deleteOwner,
    getTotal,
    setSaveIsDisabled,
    saleChecked,
    leaseChecked,
    setLeaseChecked,
    setSaleChecked
}) => {
    const [loading, setLoading] = useState(false);
    const [isSaleUnit, setIsSaleUnit] = useState(false);
    const [isLeaseUnit, setIsLeaseUnit] = useState(false);

    const selectedSlaeOwner = useCallback(
        (item) => (event) => {
            let lastCheck = saleChecked && saleChecked.findIndex((el) => el.id === item.id);
            if (!saleChecked.length) setSaleChecked([item])
            else if (lastCheck !== -1) setSaleChecked([])
            else {
                setSaleChecked([])
                setSaleChecked([item])
            }
        }, [saleChecked]);

    const selectedLeaseOwner = useCallback(
        (item) => (event) => {
            let lastCheck = leaseChecked && leaseChecked.findIndex((el) => el.id === item.id);
            if (!leaseChecked.length) setLeaseChecked([item])
            else if (lastCheck !== -1) setLeaseChecked([])
            else {
                setLeaseChecked([])
                setLeaseChecked([item])
            }
        }, [leaseChecked]);

    useEffect(() => {
        let unitType = +GetParams('operationType');
        if (unitType === 430) setIsSaleUnit(true);
        else if (unitType === 431) setIsLeaseUnit(true);
        else {
            setIsSaleUnit(true);
            setIsLeaseUnit(true);
        }
    }, []);

    return (
        <>
            <Spinner isActive={loading} />
            <div className='addOwner-view-wrapper'>
                <Tables
                    data={data || []}
                    headerData={
                        [
                            (isSaleUnit && ({
                                id: 1,
                                label: 'sale-owner',
                                component:
                                    (item, index) =>
                                    (isSaleUnit && (
                                        <CheckboxesComponent
                                            idRef='saleOwnerRef'
                                            parentTranslationPath={parentTranslationPath}
                                            translationPath={translationPath}
                                            singleChecked={
                                                saleChecked && saleChecked.findIndex((el) => el.id === item.id) !== -1
                                            }
                                            onSelectedCheckboxClicked={selectedSlaeOwner(item)}
                                        />
                                    ))
                            }) ||
                                isLeaseUnit && ({
                                    id: 1,
                                    label: 'lease-owner',
                                    component:
                                        (item, index) =>
                                        (isLeaseUnit && (
                                            <CheckboxesComponent
                                                idRef='leaseOwnerRef'
                                                parentTranslationPath={parentTranslationPath}
                                                translationPath={translationPath}
                                                singleChecked={
                                                    leaseChecked && leaseChecked.findIndex((el) => el.id === item.id) !== -1
                                                }
                                                onSelectedCheckboxClicked={selectedLeaseOwner(item)}
                                            />
                                        ))
                                })
                            ),
                            (isLeaseUnit && isSaleUnit && ({
                                id: 2,
                                label: 'lease-owner',
                                component:
                                    (item, index) =>
                                    (isLeaseUnit && (
                                        <CheckboxesComponent
                                            idRef='leaseOwnerRef'
                                            parentTranslationPath={parentTranslationPath}
                                            translationPath={translationPath}
                                            singleChecked={
                                                leaseChecked && leaseChecked.findIndex((el) => el.id === item.id) !== -1
                                            }
                                            onSelectedCheckboxClicked={selectedLeaseOwner(item)}
                                        />
                                    ))
                            }) || { label: '' }
                            ),
                            {
                                id: isLeaseUnit && isSaleUnit ? 3 : 2,
                                label: 'owner-id',
                                input: 'id',
                            },
                            {
                                id: isLeaseUnit && isSaleUnit ? 4 : 3,
                                label: 'owner-name',
                                input: 'name',
                            },
                            {
                                id: isLeaseUnit && isSaleUnit ? 5 : 4,
                                label: 'mobile',
                                input: 'mobile',
                            },
                            {
                                id: isLeaseUnit && isSaleUnit ? 6 : 5,
                                label: 'ownership-%',
                                component:
                                    (item, index) =>
                                        (getIsEditingIndex(item) !== -1 && (
                                            <div className='d-flex-v-center'>
                                                <Inputs
                                                    idRef={`ownerShipInputRef${index + 1}`}
                                                    inputPlaceholder='%'
                                                    value={getEditValue(item)}
                                                    type='number'
                                                    wrapperClasses='mb-0'
                                                    min={0}
                                                    max={100}
                                                    onInputChanged={ownershipChangedHandler(item)}
                                                    parentTranslationPath={parentTranslationPath}
                                                    translationPath={translationPath}
                                                />
                                                <ButtonBase
                                                    className='btns-icon theme-transparent mx-3'
                                                    onClick={saveOwnershipHandler(item, index)}
                                                >
                                                    <span className='mdi mdi-content-save-edit-outline c-primary' />
                                                </ButtonBase>
                                                <ButtonBase
                                                    className='btns-icon theme-transparent'
                                                    onClick={closeOwnershipHandler(item)}
                                                >
                                                    <span className='mdi mdi-close c-warning' />
                                                </ButtonBase>
                                            </div>
                                        )) || (
                                            <div className='d-flex-v-center'>
                                                <span>{item.ownershipPercentage + " %"}</span>
                                                <ButtonBase
                                                    className='btns-icon theme-transparent mx-3'
                                                    onClick={editOwnershipHandler(item)}
                                                >
                                                    <span className='mdi mdi-lead-pencil c-primary' />
                                                </ButtonBase>
                                                <ButtonBase
                                                    className='btns-icon theme-transparent'
                                                    onClick={deleteOwner(item, index)}
                                                >
                                                    <span className='mdi mdi-trash-can c-danger' />
                                                </ButtonBase>
                                            </div>
                                        ),
                            },
                        ]
                    }
                    onPageIndexChanged={onPageIndexChanged}
                    onPageSizeChanged={onPageSizeChanged}
                    itemsPerPage={filter.pageSize}
                    activePage={filter.pageIndex}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    totalItems={data.length || 0}
                    actionsOptions={[]}
                    defaultActions={[]}
                    footerData={[
                        {
                            value: t(`${translationPath}total`),
                            colSpan: 5,
                        },
                        {
                            component: () => (
                                <span className={`${(getTotal() !== 100 ? 'c-warning' : 'c-success')}`}>
                                    {getTotal() + " %"}
                                    {getTotal() !== 100 ? t(`${translationPath}OwnershipMustBe100%`) : ''}
                                    {getTotal() === 100 ? setSaveIsDisabled(false) : setSaveIsDisabled(true)}
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    )
}

AddOwnersTable.prototype = {
    data: PropTypes.instanceOf(Array).isRequired,
    t: PropTypes.func.isRequired.isRequired,
    filter: PropTypes.func.isRequired.isRequired,
    getIsEditingIndex: PropTypes.func.isRequired,
    getEditValue: PropTypes.func.isRequired,
    ownershipChangedHandler: PropTypes.func.isRequired,
    saveOwnershipHandler: PropTypes.func.isRequired,
    closeOwnershipHandler: PropTypes.func.isRequired,
    editOwnershipHandler: PropTypes.func.isRequired,
    deleteOwner: PropTypes.func.isRequired,
    getTotal: PropTypes.func.isRequired,
    setSaveIsDisabled: PropTypes.func.isRequired,
};