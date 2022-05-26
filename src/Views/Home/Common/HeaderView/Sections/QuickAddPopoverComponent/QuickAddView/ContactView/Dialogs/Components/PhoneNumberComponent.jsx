import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RepeatedItemDialog } from '../../../../../../../../FormBuilder/Dialogs/RepeatedItemDialog';
import { PhonesComponent } from '../../../../../../../../../../Components';
import { duplicatePhoneRole } from '../../../../../../../../../../Rule/EmailRule';

export const PhoneNumberComponent = ({
  parentTranslationPath,
  translationPath,
  setPhone,
  isSubmitted,
  helperText,
  error,
  labelClasses
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [repeatedItemDialog, setRepeatedItemDialog] = useState(false);
  const [phonesList, setPhonesList] = useState([]);
  const [timer, setTimer] = useState(null);
  const [HelperText, setHelperText] = useState('');
  const [Error, setError] = useState('');
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

  const [state, setState] = useState({
    phone: '',
    typeId: 18027,
  });

  useEffect(() => {
    setPhone(phonesList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phonesList]);

  return (
    <div>
      <PhonesComponent
        labelClasses={labelClasses}
        country='ae'
        value={state.phone}
        idRef='phoneNumberRef'
        labelValue={t(`${translationPath}phoneNumber`)}
        inputPlaceholder={t(`${translationPath}phoneNumber`)}
        buttonOptions={{
          className: 'btns-icon theme-solid bg-blue-lighter',
          iconClasses: 'mdi mdi-plus',
          isDisabled: !(state && state.phone.length >= 9),
          isRequired: false,
          onActionClicked: () => {
            if (state && state.phone.length >= 9)
              setRepeatedItemDialog(true);
          },
        }}
        onInputChanged={(e) => {
          if (e.length > 14)
            return;

          setState({ ...state, phone: e });
          phonesList[0] = e;
          setPhonesList([...phonesList]);
        }}

        onKeyUp={() => {
          setTimer(setTimeout(async () => {
            const isDuplicate = await duplicatePhoneRole(mobileItem, state.phone);
            if (!isDuplicate) {
              setHelperText('Duplicate phone Value With Other Contact');
              setError('Duplicate phone Value With Other Contact');
            } else {
              setHelperText('');
              setError('');
            }
          }, 800));
        }}
        onKeyDown={() => { if (timer) clearTimeout(timer); }}

        isSubmitted={isSubmitted}
        helperText={helperText || HelperText}
        error={error || Error}
      />

      {repeatedItemDialog && (
        <RepeatedItemDialog
          open={repeatedItemDialog}
          item={mobileItem}
          type='phone'
          setPhonesList={setPhonesList}
          initialState={state}
          label={mobileItem.data.title}
          onChange={(data) => {
            setState({ ...data });
            setPhonesList([data.phone, ...data.others]);
          }}
          closeDialog={() => {
            setRepeatedItemDialog(false);
          }}
        />
      )}
    </div>
  );
};
