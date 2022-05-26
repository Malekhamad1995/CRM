/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../Components';
import { EmailItemComponent, PhoneItemComponent, DeleteRepeatedItemValuesDialog } from './Sections';

export const RepeatedItemDialog = (props) => {
  const { t } = useTranslation('Shared');

  const [listItem, setListItem] = useState(
    new Array(
      props.initialState && props.initialState.others && props.initialState.others.length ? props.initialState.others.length : 1
    ).fill(0)
  );

  const [saveIsDisabled, setSaveIsDisabled] = useState(false);
  const reducer = (state, action) => ({ ...state, [action.id]: action.value });
  const [state, setState] = useReducer(reducer, props.initialState);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <DialogComponent
        titleText={props.label}
        saveText={t('save')}
        saveType='button'
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            {listItem.map((value, index) => (
              <div className='w-100 mb-2' key={`phones${index + 1}`}>
                {props.type === 'phone' && (
                  <PhoneItemComponent
                    state={state}
                    setState={setState}
                    props={props}
                    item={props.item}
                    index={index}
                    loopValue={value}
                    setListItem={setListItem}
                    listItem={listItem}
                    setSaveIsDisabled={setSaveIsDisabled}
                  />
                )}
                {props.type === 'email' && (
                  <EmailItemComponent
                    state={state}
                    setState={setState}
                    props={props}
                    item={props.item}
                    index={index}
                    loopValue={value}
                    setListItem={setListItem}
                    listItem={listItem}
                    setSaveIsDisabled={setSaveIsDisabled}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        saveIsDisabled={saveIsDisabled}
        saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
        isOpen={props.open}
        cancelText={t(props.Textcancel)}
        onSaveClicked={(event) => {
          event.preventDefault();
          props.onChange(state);
          props.closeDialog();
        }}
        onCloseClicked={() => {
          // setOpenDeleteDialog(true);
          props.closeDialog();
        }}
        onCancelClicked={() => {
          setOpenDeleteDialog(true);
          // props.closeDialog()
        }}
      />
      <DeleteRepeatedItemValuesDialog
        open={openDeleteDialog}
        close={() => setOpenDeleteDialog(false)}
        onSave={() => {
          setState({ id: 'others', value: [] });
          setListItem([0]);
          setOpenDeleteDialog(false);
          props.closeDialog();
        }}

      />
    </>
  );
};
