import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../Components';
import { getErrorByName } from '../../../../../../Helper';

export const RolesNameComponent = ({
  rolesId,
  state,
  schema,
  onStateChanged,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='role-name-wrapper'>
      <div className='roles-title'>
        <span className='title-text'>
          {t(`${translationPath}${(rolesId && 'edit-role-name') || 'add-role-name'}`)}
        </span>
      </div>
      <Inputs
        idRef='roleNameRef'
        inputPlaceholder='role-name-description'
        value={state.roleName || ''}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        helperText={getErrorByName(schema, 'roleName').message}
        error={getErrorByName(schema, 'roleName').error}
        isWithError
        isSubmitted={isSubmitted}
        onInputChanged={(event) => {
          if (onStateChanged) onStateChanged({ id: 'roleName', value: event.target.value });
        }}
      />
    </div>
  );
};
RolesNameComponent.propTypes = {
  rolesId: PropTypes.string,
  schema: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
RolesNameComponent.defaultProps = {
  rolesId: null,
};
