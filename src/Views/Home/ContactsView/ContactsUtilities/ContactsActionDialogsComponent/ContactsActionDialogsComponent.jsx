import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../Components';
import { ContactsActionSMSDialogsComponent } from './ContactsActionDialogs/ContactsActionSMSDialogsComponent';
import { ContactsActionEmailDialogsComponent } from './ContactsActionDialogs/ContactsActionEmailDialogsComponent';

export const ContactsActionDialogsComponent = ({
  isOpen,
  isOpenChanged,
  unitTemplateFile,
  actionEnum,
  item,
  translationPath,
  parentTranslationPath,
  unitItem,
  showlink
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='Contacts-Action-Dialogs-wrapper w-100 px-3'>
      <DialogComponent
        titleText={
          (actionEnum === 'smsSolid' && t(`${translationPath}Send-SMS`)) ||
          (actionEnum === 'emailSolid' && t(`${translationPath}Send-Email`)) ||
          ''
        }
        maxWidth={(actionEnum === 'smsSolid' && 'sm') || 'md'}
        wrapperClasses={(actionEnum === 'emailSolid' && 'med') || ''}
        dialogContent={
          (actionEnum === 'smsSolid' && (
            <ContactsActionSMSDialogsComponent
              item={item}
              isOpenChanged={isOpenChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              unitItem={unitItem}
              showlink={showlink}
            />
          )) ||
          (actionEnum === 'emailSolid' && (
            <ContactsActionEmailDialogsComponent
              item={item}
              unitTemplateFile={unitTemplateFile}
              isOpenChanged={isOpenChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              unitItem={unitItem}
              showlink={showlink}
            />
          )) ||
          ''
        }
        isOpen={
          (actionEnum === 'smsSolid' && isOpen) || (actionEnum === 'emailSolid' && isOpen) || false
        }
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onCloseClicked={isOpenChanged}
      />
    </div>
  );
};
ContactsActionDialogsComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  item: PropTypes.instanceOf(Object),
  unitTemplateFile: PropTypes.instanceOf(Object),
  translationPath: PropTypes.string,
  showlink: PropTypes.bool,
  parentTranslationPath: PropTypes.string,
  actionEnum: PropTypes.string.isRequired,
  unitItem: PropTypes.instanceOf(Object)
};
ContactsActionDialogsComponent.defaultProps = {
  unitTemplateFile: undefined,
  item: undefined,
  unitItem: undefined,
  translationPath: '',
  parentTranslationPath: 'ContactsView',
  showlink: false
};
