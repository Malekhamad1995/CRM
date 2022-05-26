import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../Components';
import { LeadsActionSMSDialogsComponent } from './LeadsActionDialogs/LeadsActionSMSDialogsComponent';
import { LeadsActionEmailDialogsComponent } from './LeadsActionDialogs/LeadsActionEmailDialogsComponent';

export const LeadsActionDialogsComponent = ({
  isOpen,
  isOpenChanged,
  unitTemplateFile,
  actionEnum,
  item,
  translationPath,
  parentTranslationPath,
  unitItem,
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
            <LeadsActionSMSDialogsComponent
              item={item}
              isOpenChanged={isOpenChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              unitItem={unitItem}
            />
          )) ||
          (actionEnum === 'emailSolid' && (
            <LeadsActionEmailDialogsComponent
              item={item}
              unitTemplateFile={unitTemplateFile}
              isOpenChanged={isOpenChanged}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              unitItem={unitItem}
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
LeadsActionDialogsComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  item: PropTypes.instanceOf(Object),
  unitTemplateFile: PropTypes.instanceOf(Object),
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  actionEnum: PropTypes.string.isRequired,
  unitItem: PropTypes.instanceOf(Object)
};
LeadsActionDialogsComponent.defaultProps = {
  unitTemplateFile: undefined,
  item: undefined,
  unitItem: undefined
};
