import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PhonesComponent } from '../../../../../Components';
import { duplicatePhoneRole, PhoneValidationRole } from '../../../../../Rule/PhoneRule';

export const PhoneItemComponent = ({
 props, item, index, loopValue, state, setState, listItem, setListItem, setSaveIsDisabled
}) => {
    // const translationPath = '';
    // const { t } = useTranslation('FormBuilder');
    const [helperText, setHelperText] = useState('');
    const [currentvalue, setcurrentvalue] = useState('');

    useEffect(() => {
        const itemRegex = new RegExp(item.data.regExp);
        if (!itemRegex.test(currentvalue)) setHelperText(item.data.errorMsg);
        else if (isPhoneItemDuplicating()) {
            setHelperText('Duplicate phone number');
            setSaveIsDisabled(true);
        } else {
            setHelperText('');
            setSaveIsDisabled(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentvalue]);

    const isPhoneItemDuplicating = () => {
        if (!props.initialState || !props.initialState.phone) return false;
        let isDublocate = false;
        let list = [];
        if (state && state.others)
            list = [...state.others, props.initialState.phone];
         else
            list = [props.initialState.phone];

        list.map((item) => {
            if (list.filter((w) => w === currentvalue).length > 1)
                isDublocate = true;
        });
        return isDublocate;
    };

    return (
      <PhonesComponent
        idRef={`phonesRef${index + 1}`}
        isValid={() =>
                !duplicatePhoneRole(props.type, item, props.itemList, props.selectedValues) ||
                PhoneValidationRole(
                    state && state.others && state.others[index] ? state.others[index] : ''
                )}
        labelValue={`${index + 2}- ${props.label}`}
        isDisabled={item.data.isReadonly}
        value={
                state === null || state === undefined || !state.others || !state.others[index] ?
                    item.data.defaultCountryCode :
                    state.others[index]
            }
        helperText={helperText}
        error={helperText !== ''}
        onInputChanged={(value) => {
                if (value.length > 14) return;
                setcurrentvalue(value);
                if (state && state.others && state.others[index]) {
                    state.others[index] = value;
                    setState({ id: 'others', value: [...state.others] });
                } else if (state && state.others && state.others.length !== 0)
                    setState({ id: 'others', value: [...state.others, value] });
                else setState({ id: 'others', value: [value] });
            }}
        buttonOptions={
                (!item.data.isReadonly && {
                    className: `btns-icon theme-solid ${index === listItem.length - 1 ? 'bg-blue-lighter' : 'bg-danger'
                        }`,
                    iconClasses: index === listItem.length - 1 ? 'mdi mdi-plus' : 'mdi mdi-minus',
                    isDisabled: !(
                        state &&
                        state.others &&
                        state.others[index] &&
                        state.others[index].length >= 9 && !isPhoneItemDuplicating()
                    ),
                    isRequired: false,
                    onActionClicked:
                        index === listItem.length - 1 ?
                            () => {
                                if (
                                    state &&
                                    state.others &&
                                    state.others[index] &&
                                    state.others[index].length >= 9
                                )
                                    setListItem([...listItem, listItem[listItem.length - 1] + 1]);
                            } :
                            () => {
                                const listItemIndex = listItem.findIndex((f) => f === loopValue);
                                listItem.splice(listItemIndex, 1);
                                state.others.splice(listItemIndex, 1);
                                setState({ id: 'others', value: [...state.others] });
                                const newlist = [];
                                listItem.map((v, loopIndex) => newlist.push(loopIndex + 2));
                                setListItem([...newlist]);
                            },
                }) ||
                undefined
            }
      />
);
};

PhoneItemComponent.propTypes = {
    props: PropTypes.instanceOf(Object).isRequired,
    state: PropTypes.instanceOf(Object).isRequired,
    item: PropTypes.instanceOf(Object).isRequired,
    index: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
    listItem: PropTypes.array.isRequired,
    setListItem: PropTypes.func.isRequired,
    setSaveIsDisabled: PropTypes.func.isRequired,
};
