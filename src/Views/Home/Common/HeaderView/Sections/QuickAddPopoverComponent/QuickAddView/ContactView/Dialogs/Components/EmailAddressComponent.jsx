import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../../../../Components';
import { RepeatedItemDialog } from '../../../../../../../../FormBuilder/Dialogs/RepeatedItemDialog';
import { duplicateEmailRole } from '../../../../../../../../../../Rule/EmailRule';

export const EmailAddressComponent = ({
  parentTranslationPath,
  translationPath,
  setEmail,
  isSubmitted,
  helperText,
  error,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [repeatedItemDialog, setRepeatedItemDialog] = useState(false);
  const [emailsList, setEmailsList] = useState([]);
  const [timer, setTimer] = useState(null);
  const [HelperText, setHelperText] = useState('');
  const [Error, setError] = useState('');

  const emailItem = {
    data: {
      type: 'string',
      title: 'Email Address',
      description: 'Main Information',
      lookupItem: 18037,
      CommunicationType: 'Email',
    },
    field: {
      id: 'email_address',
      FieldType: 'communication',
      Required: 'true',
    },
  };

  const [state, setState] = useState({
    email: '',
    typeId: 18037,
  });

  useEffect(() => {
    setEmail(emailsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailsList]);

  return (
    <div>
      <Inputs
        idRef='emailAddressRef'
        labelValue='Email Address'
        isWithError
        value={state.emailAddress}
        buttonOptions={{
          className: 'btns-icon theme-solid bg-blue-lighter',
          iconClasses: 'mdi mdi-plus',
          isRequired: false,
          isDisabled: !(
            state.email &&
            new RegExp(state.email.regExp).test(state.email)

          ),
          onActionClicked: () => {
            if (
              state.email &&
              new RegExp(state.email.regExp).test(state.email) &&
              state.email &&
              state.email.length > 10
            )
              setRepeatedItemDialog(true);
          },
        }}
        inputPlaceholder={t(`${translationPath}emailAddress-placeholder`)}
        onInputChanged={(e) => {
          if (e.length > 14)
            return;
          if (e.target.value === '') {
            setState({
              ...state,
              email: '',
            });
            setEmailsList([]);
          } else {
            setState({
              ...state,
              email: e.target.value.toLowerCase() || '',
            });
            emailsList[0] = e.target.value.toLowerCase();
            setEmailsList([...emailsList]);
          }
        }}
        onKeyUp={() => {
          if (state.email !== '') {
            setTimer(setTimeout(async () => {
              const isDuplicate = await duplicateEmailRole(emailItem, state.email);
              if (!isDuplicate) {
                setHelperText('Duplicate Email Value With Other Contact');
                setError('Duplicate Email Value With Other Contact');
              } else {
                setHelperText('');
                setError('');
              }
            }, 800));
          } else {
            setHelperText('');
            setError('');
          }
        }}
        onKeyDown={() => { if (timer) clearTimeout(timer); }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isSubmitted={isSubmitted}
        helperText={helperText || HelperText}
        error={error || Error}
      />
      {repeatedItemDialog && (
        <RepeatedItemDialog
          open={repeatedItemDialog}
          item={emailItem}
          type='email'
          initialState={state}
          label={emailItem.data.title}
          onChange={(data) => {
            setState({ ...data });
            const emails = data.others.map((e) => e !== '' && e.toLowerCase());
            setEmailsList([data.email, ...emails]);
            // setEmailsList([data.email, ...data.others]);
          }}
          closeDialog={() => {
            setRepeatedItemDialog(false);
          }}
        />
      )}
    </div>
  );
};
