import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { ActionsButtonsEnum } from '../../../Enums';
import { SelectComponet } from '../SelectComponent/SelectComponent';
import { PermissionsComponent } from '../..';
import { CheckboxesComponent } from '../../../Components';

const translationPath = 'Shared:actions-buttons.';
const ActionsButtonsComponent = ({
  onActionButtonChanged,
  onActionsButtonClicked,
  onFormTypeSelectChanged,
  withType,
  typeData,
  isDisabled,
  wrapperClasses,
  enableMerge,
  enableBulk,
  enableImport,
  permissionsList,
  addPermissionsId,
  selectPermissionsId,
  checkDisable,
  withText,
  enableCloseLeads,
  closeAction,
  withCheckbox,
  onSelectAllClicked,
  enablereassignLeads
}) => {
  const { t } = useTranslation('Shared');
  const [activeAction, setActiveAction] = useState(() => ActionsButtonsEnum[1]);
  const [actionData, setActionData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const onSelectChanged = useCallback(
    (selectedValue) => {
      setActiveAction(selectedValue);
      if (onActionButtonChanged) onActionButtonChanged(selectedValue.id);
    },
    [onActionButtonChanged, setActiveAction]
  );
  const getActionData = useCallback(() => {
    const actions = [ActionsButtonsEnum[1]];
    if (enableMerge) actions.push(ActionsButtonsEnum[2]);
    if (enableImport) actions.push(ActionsButtonsEnum[3]);
    if (enableBulk) actions.push(ActionsButtonsEnum[4]);
    if (enableCloseLeads) actions.push(ActionsButtonsEnum[5]);
    if (enablereassignLeads) actions.push(ActionsButtonsEnum[6]);
    setActionData(actions);
  }, [enableBulk, enableImport, enableMerge, enableCloseLeads, enablereassignLeads]);
  useEffect(() => {
    getActionData();
  }, [getActionData]);


  useEffect(() => {
    if (closeAction) {
      setActiveAction(ActionsButtonsEnum[1]);
      onActionButtonChanged(ActionsButtonsEnum[1]);
    }
  }, [closeAction]);

  return (
    <div className={`actions-buttons-wrapper ${wrapperClasses}`}>
      <div className='d-inline-flex'>
        {(!withType || activeAction !== ActionsButtonsEnum[1]) && (
          <PermissionsComponent
            permissionsList={permissionsList}
            permissionsId={addPermissionsId}
            allowEmptyRoles
          >
            <Button
              disabled={isDisabled || (checkDisable && checkDisable(activeAction.id))}
              type='button'
              onClick={() => onActionsButtonClicked(activeAction.id)}
              className={`btns theme-solid ${activeAction.classes}`}
            >
              <span>{t(translationPath + activeAction.buttonLabel)}</span>
            </Button>
          </PermissionsComponent>
        )}
        {withType && activeAction === ActionsButtonsEnum[1] && (
          <PermissionsComponent
            permissionsList={permissionsList}
            permissionsId={addPermissionsId}
            allowEmptyRoles
          >
            <SelectComponet
              data={typeData}
              defaultValue={-1}
              emptyItem={{ value: -1, text: withText || 'add', isHiddenOnOpen: true }}
              valueInput='id'
              translationPath={translationPath}
              onSelectChanged={onFormTypeSelectChanged}
              wrapperClasses='bg-secondary c-white mx-2'
              themeClass='theme-action-buttons'
              idRef='contactsActionsRef'
              keyValue='actionsbuttons'
              keyLoopBy='id'
              translationPathForData={translationPath}
              textInput='name'
            />
          </PermissionsComponent>
        )}
      </div>
      {onActionButtonChanged && (
        <div className='d-inline-flex'>
          <PermissionsComponent
            permissionsList={permissionsList}
            permissionsId={selectPermissionsId}
            allowEmptyRoles
          >
            {(enableImport || enableMerge || enableBulk || enableCloseLeads || enablereassignLeads) && (
              <SelectComponet
                data={actionData}
                defaultValue={ActionsButtonsEnum[1]}
                onSelectChanged={onSelectChanged}
                themeClass='theme-action-buttons'
                idRef='contactsActionsRef'
                keyValue='actionsbuttons'
                keyLoopBy='id'
                translationPathForData={translationPath}
                textInput='label'
              />
            )}
          </PermissionsComponent>
        </div>

      )}
      {withCheckbox && (
        <div className='d-inline-flex'>
          <PermissionsComponent
            permissionsList={permissionsList}
            permissionsId={selectPermissionsId}
            allowEmptyRoles
          >
            <CheckboxesComponent
              idRef="reSSef"
              translationPathForData={translationPath}
              translationPath={translationPath}
              label="select-all"
              singleChecked={isChecked}
              onSelectedCheckboxClicked={(e) => {
                onSelectAllClicked();
                setIsChecked(!isChecked);

              }}
            />

          </PermissionsComponent>
        </div>

      )}
    </div>
  );
};
ActionsButtonsComponent.propTypes = {
  onActionButtonChanged: PropTypes.func,
  onFormTypeSelectChanged: PropTypes.func,
  onActionsButtonClicked: PropTypes.func,
  wrapperClasses: PropTypes.string,
  withType: PropTypes.bool,
  typeData: PropTypes.instanceOf(Array),
  isDisabled: PropTypes.bool,
  enableMerge: PropTypes.bool,
  enableBulk: PropTypes.bool,
  enableImport: PropTypes.bool,
  permissionsList: PropTypes.instanceOf(Array),
  addPermissionsId: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
  selectPermissionsId: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
  checkDisable: PropTypes.func,
  withText: PropTypes.string,
  enableCloseLeads: PropTypes.bool,
  withCheckbox: PropTypes.bool,
  onSelectAllClicked: PropTypes.func,
  isSelectAllFromTable: PropTypes.bool,
  enablereassignLeads: PropTypes.bool,

};

ActionsButtonsComponent.defaultProps = {
  onActionButtonChanged: undefined,
  onFormTypeSelectChanged: undefined,
  onActionsButtonClicked: undefined,
  permissionsList: undefined,
  addPermissionsId: undefined,
  selectPermissionsId: undefined,
  withType: false,
  wrapperClasses: '',
  typeData: [],
  isDisabled: false,
  enableMerge: false,
  enableBulk: false,
  enableImport: false,
  checkDisable: undefined,
  withText: '',
  enableCloseLeads: false,
  closeAction: false,
  withCheckbox: false,
  onSelectAllClicked: undefined,
  isSelectAllFromTable: false,
  enablereassignLeads: false
};

export { ActionsButtonsComponent };
