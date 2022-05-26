import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../Components';

export const EmailItemComponent = ({
    props, item, index, loopValue, state, setState, listItem, setListItem, setSaveIsDisabled
}) => {
    const [helperText, setHelperText] = useState('');
    const [currentvalue, setcurrentvalue] = useState('');

    const isEmailItemDuplicating = () => {
        if (!props.initialState || !props.initialState.email) return false;
        let isDublocate = false;
        let list = [];
        if (state && state.others)
            list = [...state.others, props.initialState.email];
        else
            list = [props.initialState.email];


        list.map((item) => {
            if (list.filter((w) => w === currentvalue).length > 1)
                isDublocate = true;
        });
        return isDublocate;
    };

    useEffect(() => {
        const itemRegex = new RegExp(item.data.regExp);
        if (!itemRegex.test(currentvalue)) setHelperText(item.data.errorMsg);
        else if (isEmailItemDuplicating()) {
            setHelperText('Duplicate Email Value');
            setSaveIsDisabled(true);
        } else {
            setHelperText('');
            setSaveIsDisabled(false);
        }
    }, [currentvalue]);


    return (
      <Inputs
        idRef={item.data.id || `emailRef${index + 1}`}
        isDisabled={item.data.isReadonly}
        labelValue={`${index + 2}- ${props.label}`}
            // value={currentvalue}
        value={state && state.others && state.others[index] ? state.others[index] : ''}
        isWithError
        helperText={helperText}
        error={helperText !== ''}
        onInputChanged={(e) => {
                setcurrentvalue(e.target.value);
                if (state && state.others && state.others[index]) {
                    state.others[index] = e.target.value;
                    setState({ id: 'others', value: [...state.others] });
                } else if (state && state.others && state.others.length !== 0)
                    setState({ id: 'others', value: [...state.others, e.target.value] });
                else setState({ id: 'others', value: [e.target.value] });
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
                        state.others[index].length >= 9 && !isEmailItemDuplicating()


                    ),
                    isRequired: false,
                    onActionClicked:
                        index === listItem.length - 1 ?
                            () => {
                                const itemRegex = new RegExp(props.item.data.regExp);
                                if (
                                    state &&
                                    state.others &&
                                    state.others[index] &&
                                    itemRegex.test(state.others[index])
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

EmailItemComponent.propTypes = {
    props: PropTypes.instanceOf(Object).isRequired,
    state: PropTypes.instanceOf(Object).isRequired,
    item: PropTypes.instanceOf(Object).isRequired,
    index: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
    listItem: PropTypes.array.isRequired,
    setListItem: PropTypes.func.isRequired,
    setSaveIsDisabled: PropTypes.func.isRequired,
};
