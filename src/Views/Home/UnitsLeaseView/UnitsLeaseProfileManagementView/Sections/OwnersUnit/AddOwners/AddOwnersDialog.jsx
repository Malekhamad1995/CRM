
import React, { useState, useCallback, useEffect, useRef } from 'react';
import '../Styles/AddOwnersDialog.scss';
import PropTypes from 'prop-types';
import { DialogComponent, AutocompleteComponent, Spinner } from '../../../../../../../Components';
import { ButtonBase } from '@material-ui/core';
import { GetContacts, UnitOwner } from '../../../../../../../Services';
import { floatHandler, showError, showSuccess, GetParams } from '../../../../../../../Helper';
import { AddOwnersTable } from './AddOwnersTable';

export const AddOwnersDialog = ({
    openAddDialog,
    filter,
    t,
    translationPath,
    parentTranslationPath,
    onPageSizeChanged,
    setFilter,
    setOpenAddDialog,
    onPageIndexChanged,
    setResult
}) => {
    const searchTimer = useRef(null);
    const [loading, setLoading] = useState(false);
    const [addedOwnersList, setAddedOwnersList] = useState([]);
    const [seletedOwner, setSeletedOwner] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState(null);
    const [search, setSearch] = useState(null);
    const [saveIsDisabled, setSaveIsDisabled] = useState(true);
    const [editingOwnershipFields, setEditingOwnershipFields] = useState([]);
    const [isTotalGreaterThanOneHundred, setIsTotalGreaterThanOneHundred] = useState(false);
    const [saleChecked, setSaleChecked] = useState([]);
    const [leaseChecked, setLeaseChecked] = useState([]);

    const getTotal = () => {
        const getTotalTableContacts = addedOwnersList.reduce((total, contact) => total + contact.ownershipPercentage, 0);
        if (getTotalTableContacts !== 100)
            setIsTotalGreaterThanOneHundred(true);
        else
            setIsTotalGreaterThanOneHundred(false);
        if (getTotalTableContacts >= 99 && getTotalTableContacts < 100 && (addedOwnersList.length % 3) === 0)
            return getTotalTableContacts + (100 - getTotalTableContacts)
        return getTotalTableContacts;
    };
    const addHandler = useCallback(async (e) => {
        e.preventDefault();
        let owners = [];
        let unitId = +GetParams('id');
        if (addedOwnersList.length && unitId) {
            addedOwnersList.map((owner) => {
                if (saleChecked[0] && saleChecked[0].id === owner.id) owner.isLeadOwner = true;
                if (leaseChecked[0] && leaseChecked[0].id === owner.id) owner.isLeaseLeadOwner = true;
                owners.push({
                    ownerId: owner.id,
                    ownershipPercentage: owner.ownershipPercentage,
                    isLeadOwner: owner.isLeadOwner,
                    isLeaseLeadOwner: owner.isLeaseLeadOwner
                })
            })
            setLoading(true);
            const res = await UnitOwner({ unitId, owners });
            if (!(res && res.status && res.status !== 200)) {
                setResult(res);
                showSuccess(t(`${translationPath}OwnersAddedSuccessfully`));
                setOpenAddDialog(false);
            } else {
                setResult({});
                showError(t(`${translationPath}failed-to-add-new -owners`));
            }
        }
        setLoading(false);
    }, [addedOwnersList, saleChecked, leaseChecked]);

    const addOwnerToList = () => {
        let list = [...addedOwnersList, {
            id: `${seletedOwner.contactsId}`,
            name: `${seletedOwner.contact && seletedOwner.contact.title && seletedOwner.contact.title.lookupItemName || ''} 
            ${seletedOwner.contact && seletedOwner.contact.first_name || seletedOwner.contact.company_name || ''} ${seletedOwner.contact && seletedOwner.contact.last_name || ''}`,
            mobile: `${seletedOwner.contact && seletedOwner.contact.mobile && seletedOwner.contact.mobile.phone || seletedOwner.contact.landline_number && seletedOwner.contact.landline_number.phone || ''}`,
            ownershipPercentage: 0,
            isLeadOwner: false,
            isLeaseLeadOwner: false
        }]
        if (list.length === 1) {
            const persantage = (1 / list.length) * 100;
            list && list.map((value) => {
                value.ownershipPercentage = persantage;
                return value;
            });
        }
        if (!addedOwnersList.map(e => e.id).includes(seletedOwner && seletedOwner.contactsId.toString())) setAddedOwnersList([...list]);
        else showError(t(`${translationPath}cannot-duplicate-owner`));
    }
    const searchHandler = (e) => {
        const { value } = e.target;
        if (searchTimer.current)
            clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setFilter((f) => ({ ...f, search: value }))
        }, 700);
    }
    const getOwners = useCallback(async (value) => {
        const res = await GetContacts({ ...filter, search: filter.search });
        if (!(res && res.status && res.status !== 200)) setOwnerOptions(res);
        else setOwnerOptions({});
    }, [filter, search]);
    const getIsEditingIndex = (item) =>
        editingOwnershipFields.findIndex(
            (items) => items.id === item.id
        );
    const getEditValue = (item) => {
        const value = editingOwnershipFields.find(
            (items) => items.id === item.id
        );
        return value && value.ownershipPercentage;
    };
    const editOwnershipHandler = (item) => () => {
        setEditingOwnershipFields((items) => {
            items.push({ ...item });
            return [...items];
        });
    };

    const saveOwnershipHandler = (item, index) => () => {
        const fieldIndex = getIsEditingIndex(item);
        const localTableOwners = [...addedOwnersList];
        if (localTableOwners[index]) {
            localTableOwners[index].ownershipPercentage =
                editingOwnershipFields[fieldIndex].ownershipPercentage;
        }
        const tableOwners = [...addedOwnersList];
        const ownerIndex = tableOwners.findIndex(
            (element) => element.id === item.id
        );
        if (
            ownerIndex !== -1 &&
            fieldIndex !== -1 &&
            editingOwnershipFields[fieldIndex] &&
            tableOwners[ownerIndex]
        ) {
            tableOwners[ownerIndex].ownershipPercentage =
                editingOwnershipFields[fieldIndex].ownershipPercentage;
        }
        setEditingOwnershipFields((items) => {
            items.splice(fieldIndex, 1);
            return [...items];
        });
    };
    const closeOwnershipHandler = (item) => () => {
        const fieldIndex = getIsEditingIndex(item);
        setEditingOwnershipFields((items) => {
            items.splice(fieldIndex, 1);
            return [...items];
        });
    };
    const deleteOwner = (item, index) => () => {
        const fieldIndex = getIsEditingIndex(item);
        if (fieldIndex !== -1) closeOwnershipHandler(item);
        const localTableOwners = [...addedOwnersList];
        const deletedIndex = localTableOwners.findIndex(
            (element) => item.id === element.id
        );
        if (deletedIndex !== -1) {
            localTableOwners.splice(deletedIndex, 1);
        }
        addedOwnersList.splice(index, 1);
    };

    const ownershipChangedHandler = useCallback(
        (item) => (event) => {
            let value = +floatHandler(+event.target.value, 3);
            if (value > 100) value = 100;
            else if (value < 0) value = 0;
            setEditingOwnershipFields((items) => {
                const findIndex = items.findIndex(
                    (elements) => elements.id === item.id
                );
                items[findIndex].ownershipPercentage = +value;
                return [...items];
            });
        },
        []
    );
    useEffect(() => {
        getOwners();
    }, [getOwners]);

    useEffect(() => {
        if (isTotalGreaterThanOneHundred && addedOwnersList.length) showError(t(`${translationPath}OwnershipMustBe100 % `));
    }, [isTotalGreaterThanOneHundred]);

    return (
        <>
            <Spinner isActive={loading} />
            <div className='add-view-wrapper'>
                <DialogComponent
                    isOpen={openAddDialog}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    titleText='add-owner'
                    maxWidth='lg'
                    onSaveClicked={addHandler}
                    saveText='add-owner'
                    onCancelClicked={() => setOpenAddDialog(false)}
                    disableBackdropClick
                    saveIsDisabled={saveIsDisabled}
                    dialogContent={(
                        <>
                            <div className='add-content'>
                                <div className='auto-wrapper'>
                                    <AutocompleteComponent
                                        idRef='addOwnerRef'
                                        labelValue='owner'
                                        multiple={false}
                                        data={ownerOptions && ownerOptions.result || []}
                                        withoutSearchButton
                                        chipsLabel={(option) =>
                                            option.contact &&
                                            option.contact.contact_type_id &&
                                            (option.contact.contact_type_id === 2 ?
                                                `${option.contact.company_name}` :
                                                `${option.contact.first_name} ${option.contact.last_name}` || '')
                                        }
                                        displayLabel={(option) =>
                                            option.contact &&
                                            option.contact.contact_type_id &&
                                            (option.contact.contact_type_id === 2 ?
                                                `${option.contact.company_name}` :
                                                `${option.contact.first_name} ${option.contact.last_name}` || '')
                                        }
                                        onInputKeyUp={searchHandler}
                                        onChange={(event, newInput) => {
                                            setSeletedOwner(newInput)
                                        }}
                                        translationPath={translationPath}
                                        parentTranslationPath={parentTranslationPath}
                                    />
                                </div>
                                <div className='ml-3'>
                                    <ButtonBase className='btns theme-solid px-2'
                                        onClick={addOwnerToList}
                                    >
                                        <span className='mdi mdi-plus' />
                                        <span className='px-1'>{t(`add`)}</span>
                                    </ButtonBase>
                                </div>
                            </div>
                            <AddOwnersTable
                                data={addedOwnersList || []}
                                onPageIndexChanged={onPageIndexChanged}
                                onPageSizeChanged={onPageSizeChanged}
                                translationPath={translationPath}
                                parentTranslationPath={parentTranslationPath}
                                t={t}
                                filter={filter}
                                setFilter={setFilter}
                                getIsEditingIndex={getIsEditingIndex}
                                getEditValue={getEditValue}
                                ownershipChangedHandler={ownershipChangedHandler}
                                saveOwnershipHandler={saveOwnershipHandler}
                                closeOwnershipHandler={closeOwnershipHandler}
                                editOwnershipHandler={editOwnershipHandler}
                                deleteOwner={deleteOwner}
                                setSaveIsDisabled={setSaveIsDisabled}
                                getTotal={getTotal}
                                saleChecked={saleChecked}
                                leaseChecked={leaseChecked}
                                setLeaseChecked={setLeaseChecked}
                                setSaleChecked={setSaleChecked}
                            />
                        </>
                    )}
                />
            </div>
        </>
    )
}
AddOwnersDialog.prototype = {
    parentTranslationPath: PropTypes.string.isRequired,
    translationPath: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    filter: PropTypes.instanceOf(Object).isRequired,
    setOpenAddDialog: PropTypes.func.isRequired,
    openAddDialog: PropTypes.bool.isRequired,
    onPageIndexChanged: PropTypes.func.isRequired,
    onPageSizeChanged: PropTypes.func.isRequired,
};
