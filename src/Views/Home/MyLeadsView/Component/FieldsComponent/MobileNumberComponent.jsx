import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { PhonesComponent } from '../../../../../Components/Controls/PhonesComponent/PhonesComponent';
import { RepeatedItemDialog } from '../../../FormBuilder/Dialogs/RepeatedItemDialog';
import {duplicatePhoneRole} from "../../../../../Rule/EmailRule";

export const MobileNumberComponent = ({
  parentTranslationPath,
  translationPath,
  mobileNumbers,
  setNumber,
  isSubmitted,
  helperText,
  error,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [repeatedItemDialog, setRepeatedItemDialog] = useState(false);
    const [timer  , setTimer] = useState(null)
    const [HelperText ,  setHelperText ] =useState("")
    const [Error ,  setError ] =useState("")
  const mobileItem = {
    data: {
      type: 'string',
      title: 'Mobile *',
      description: 'Main Information',
      lookupItem: 18027,
      defaultCountryCode: '+971',
      CommunicationType: 'Phone',
    },
    field: { id: 'mobile', FieldType: 'communication', Required: 'true' },
  };

  const [state, setStates] = useState({
    phone: '+971',
    typeId: 18027
  });

  useEffect(() => {
   if (mobileNumbers && mobileNumbers.length === 1)
     setStates({ phone: mobileNumbers[0] });
   if (mobileNumbers && mobileNumbers.length > 1) {
          const phones = [...mobileNumbers];
          phones.splice(0, 1);
           setStates({ phone: mobileNumbers[0], others: phones });
          }
  }, []);


  useEffect(() => {
    const list = [];
    list.push(state.phone);
    if (state.others)
    state.others.map((item) => list.push(item));
    setNumber([...list]);
   }, [state]);

  return (
    <div>
      <PhonesComponent
        country='setMobileNumberListae'
        value={state.phone}
        item={mobileItem}
        idRef='phoneNumberRef'
        labelValue={t(`${translationPath}phoneNumber`)}
        inputPlaceholder={t(`${translationPath}phoneNumber`)}
        buttonOptions={{
          className: 'btns-icon theme-solid bg-blue-lighter',
          iconClasses: 'mdi mdi-plus',
          isDisabled: !(state && state.phone && state.phone.length >= 9),
          isRequired: false,
          onActionClicked: () => {
            if (state && state.phone.length >= 9)
              setRepeatedItemDialog(true);
          },
        }}
        onInputChanged={(e) => {
          if (e.length > 14)
            return;
            setStates({ ...state, phone: e });
        }}

        onKeyUp={()=>{
            setTimer(setTimeout(async ()=>{
                const isDuplicate = await duplicatePhoneRole(mobileItem,state.phone);
                if (!isDuplicate) {
                    setHelperText('Duplicate phone Value With Other Contact');
                    setError('Duplicate phone Value With Other Contact');
                }
                else
                {
                    setHelperText('');
                    setError('');
                }
            },800));
        }}
        onKeyDown={()=>{if(timer) clearTimeout(timer)}}
        isSubmitted={isSubmitted}
        helperText={helperText || HelperText}
        error={error || Error}
      />

      {repeatedItemDialog && (
        <RepeatedItemDialog
          open={repeatedItemDialog}
          item={mobileItem}
          type='phone'
          initialState={state}
          label={mobileItem.data.title}
          onChange={(data) => {
             setStates({ ...data });
          }}
          closeDialog={() => {
            setRepeatedItemDialog(false);
          }}
        />
      )}
    </div>
  );
};
MobileNumberComponent.propTypes = {
  mobileNumbers: PropTypes.string.isRequired,
  setNumber: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,

};
