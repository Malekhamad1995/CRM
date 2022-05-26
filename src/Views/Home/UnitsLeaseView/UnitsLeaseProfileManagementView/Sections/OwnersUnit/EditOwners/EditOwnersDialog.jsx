import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DialogComponent, AutocompleteComponent, Spinner, CheckboxesComponent } from '../../../../../../../Components';
import { GetContacts, UpdateUnitOwner } from '../../../../../../../Services';
import { showError, showSuccess, GetParams } from '../../../../../../../Helper';
import PropTypes from 'prop-types';
import { UnitsOperationTypeEnum } from '../../../../../../../Enums'
import './EditOwnersDialog.scss';

export const EditOwnersDialog = ({
    openEditDialog,
    filter,
    t,
    translationPath,
    parentTranslationPath,
    setOpenEditDialog,
    setFilter,
    activeItem,
    // updateresult,
    setUpdateresult
}) => {
    const searchTimer = useRef(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null);
    const [newSeletedOwner, setNewSeletedOwner] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState(null);
    const [saleCheckBox, setSaleCheckBox] = useState(false);
    const [leasCheckBox, setLeasCheckBox] = useState(false);
    const [isSaleOwner, setIsSaleOwner] = useState(false);
    const [isLeaseOwner, setIsLeaseOwner] = useState(false);

    const searchHandler = (e) => {
        const { value } = e.target;
        if (searchTimer.current)
            clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setFilter((f) => ({ ...f, search: value }))
        }, 700);
    };

    const getOwners = useCallback(async () => {
        setLoading(true);
        const res = await GetContacts({ ...filter, search: filter.search });
        if (!(res && res.status && res.status !== 200)) setOwnerOptions(res);
        else setOwnerOptions({});
        setLoading(false);
    }, [filter, search]);

    const updateUnitOwner = useCallback(async () => {
        let query = {
            unitId: +GetParams('id'),
            oldOwnerId: activeItem.ownerId,
            newOwnerId: newSeletedOwner.contactsId,
            isLeadOwner: isSaleOwner ? isSaleOwner : false,
            isLeaseLeadOwner: isLeaseOwner ? isLeaseOwner : false,
        };
        setLoading(true);
        const responce = await UpdateUnitOwner(query);
        if (!(responce && responce.status && responce.status !== 200)) {
            setUpdateresult(responce);
            showSuccess(t(`${translationPath}update-owner-successfully`));
            setOpenEditDialog(false);
        }
        else {
            setUpdateresult(null);
            showError(t(`${translationPath}owner-update-failed`));
            setOpenEditDialog(false);
        }
        setLoading(false);
    }, [newSeletedOwner, isSaleOwner, isLeaseOwner]);

    useEffect(() => {
        getOwners();
    }, [getOwners]);

    useEffect(() => {
        if (+GetParams('operationType') === UnitsOperationTypeEnum.rent.key) {
            setLeasCheckBox(true);
        } else if (+GetParams('operationType') === UnitsOperationTypeEnum.sale.key) {
            setSaleCheckBox(true);
        } else {
            setSaleCheckBox(true);
            setLeasCheckBox(true);
        }
    }, []);

    return (
        <>
            <Spinner isActive={loading} />
            <DialogComponent
                isOpen={openEditDialog}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                titleText='edit-owner'
                maxWidth='sm'
                saveText='edit-owner'
                onCancelClicked={() => setOpenEditDialog(false)}
                disableBackdropClick
                onSaveClicked={(e) => {
                    e.preventDefault()
                    updateUnitOwner()
                }}
                dialogContent={(
                    <>
                        <div className='editOwnersDialog-view'>
                            <AutocompleteComponent
                                translationPath={translationPath}
                                parentTranslationPath={parentTranslationPath}
                                idRef='editOwnerRef'
                                labelValue='select-new-owner'
                                labelClasses='test'
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
                                isLoading={loading}
                                onInputKeyUp={searchHandler}
                                onChange={(event, newInput) => {
                                    setNewSeletedOwner(newInput)
                                }}
                            />
                        </div>
                        <div className='boxes'>
                            {saleCheckBox && (<CheckboxesComponent
                                label="sale-lead-owner"
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                                onSelectedCheckboxClicked={(e) => {
                                    setIsSaleOwner(e.target.checked);
                                }}
                            />)}
                            {leasCheckBox && (<CheckboxesComponent
                                style={{ padding: '30px', backgroundColor: 'red' }}
                                label="lease-lead-owner"
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                                onSelectedCheckboxClicked={(e) => {
                                    setIsLeaseOwner(e.target.checked);
                                }}
                            />)}
                        </div>
                    </>
                )}
            />
        </>
    )
}

EditOwnersDialog.prototype = {
    setOpenEditDialog: PropTypes.func.isRequired,
    parentTranslationPath: PropTypes.string.isRequired,
    translationPath: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    filter: PropTypes.instanceOf(Object).isRequired,
    openEditDialog: PropTypes.bool.isRequired,
    onPageIndexChanged: PropTypes.func.isRequired,
    onPageSizeChanged: PropTypes.func.isRequired,
}
