import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { Inputs } from '../../../../../Components/Controls/Inputs/Inputs';
import { RepeatedItemDialog } from '../../../FormBuilder/Dialogs/RepeatedItemDialog';
import { duplicateEmailRole } from '../../../../../Rule/EmailRule';

export const EmailComponent = ({
  parentTranslationPath,
  translationPath,
  emailAddresses,
  setEmail,
  isSubmitted,
  helperText,
  error,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [repeatedItemDialogEmail, setRepeatedItemDialogEmail] = useState(false);
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

  const [state, setStates] = useState({
    email: '',
    typeId: 18037,
  });

  useEffect(() => {
    if (emailAddresses && emailAddresses.length === 1)
      setStates({ email: emailAddresses[0] });
      if (emailAddresses && emailAddresses.length > 1) {
        const emails = [...emailAddresses];
        emails.splice(0, 1);
        setStates({ email: emailAddresses[0], others: emails });
    }
   }, []);

   useEffect(() => {
    const list = [];
    if (state.email !== '')
    list.push(state.email);
    if (state.others)
    state.others.map((item) => list.push(item));
    setEmail([...list]);
   }, [state]);

  return (
    <div>
      <Inputs
        idRef='emailAddressRef'
        labelValue='Email Address'
        isWithError
        value={state.email}
        buttonOptions={{
          className: 'btns-icon theme-solid bg-blue-lighter',
          iconClasses: 'mdi mdi-plus',
          isRequired: false,
          isDisabled: !(
            state.email &&
            new RegExp(state.email.regExp).test(state.email) &&
            state.email &&
            state.email.length > 10
          ),
          onActionClicked: () => {
            if (
              state.email &&
              new RegExp(state.email.regExp).test(state.email)
            )
              setRepeatedItemDialogEmail(true);
          },
        }}
        inputPlaceholder={t(`${translationPath}emailAddress-placeholder`)}
        onInputChanged={(e) => {
          if (e.length > 14)
            return;
          setStates({
            ...state,
            email: e.target.value,
          });
        }}
        onKeyUp={() => {
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
        }}
        onKeyDown={() => { if (timer) clearTimeout(timer); }}

        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isSubmitted={isSubmitted}
        helperText={helperText || HelperText}
        error={error || Error}
      />
      {repeatedItemDialogEmail && (
        <RepeatedItemDialog
          open={repeatedItemDialogEmail}
          item={emailItem}
          type='email'
          initialState={state}
          label={emailItem.data.title}
          onChange={(data) => {
            setStates({ ...data });
          }}
          closeDialog={() => {
            setRepeatedItemDialogEmail(false);
          }}
        />
      )}
    </div>
  );
};
EmailComponent.propTypes = {
  emailAddresses: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
